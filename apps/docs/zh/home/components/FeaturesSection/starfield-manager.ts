import type {
  Meteor,
  MeteorAnimationConfig,
  Star,
  StarAnimationConfig
} from './starfield-types';

// 动画配置常量
export const METEOR_CONFIG: MeteorAnimationConfig = {
  fixedAngle: 60,
  minSpeed: 100,
  maxSpeed: 300,
  minInterval: 1500,
  maxInterval: 4000,
  minDistance: 200,
  maxDistance: 600
};

export const STAR_CONFIG: StarAnimationConfig = {
  minBlinkSpeed: 1,
  maxBlinkSpeed: 3.5,
  minBlinkRange: 0.3,
  maxBlinkRange: 0.8
};

export const RAINBOW_COLORS = [
  'rgba(255, 0, 0, ',
  'rgba(255, 165, 0, ',
  'rgba(255, 255, 0, ',
  'rgba(0, 128, 0, ',
  'rgba(0, 0, 255, ',
  'rgba(75, 0, 130, ',
  'rgba(128, 0, 128, '
];

export class StarfieldManager {
  private canvas: HTMLCanvasElement;
  private worker?: Worker;
  private animationFrameId?: number;
  private resizeObserver?: ResizeObserver;
  private starCount: number;
  private onUpdate?: (stars: Star[], meteors: Meteor[]) => void;

  constructor(
    canvas: HTMLCanvasElement,
    onUpdate?: (stars: Star[], meteors: Meteor[]) => void
  ) {
    this.canvas = canvas;
    this.starCount = 30 + Math.floor(Math.random() * 31);
    this.onUpdate = onUpdate;
  }

  /** 初始化画布和动画 */
  init() {
    this.setupCanvas();
    this.createWorker();
    this.startAnimation();
  }

  /** 配置画布尺寸和响应式 */
  private setupCanvas() {
    const innerWrap = this.canvas.parentElement;
    if (!innerWrap) return;

    const resizeCanvas = () => {
      const { width, height } = innerWrap.getBoundingClientRect();
      const dpr =
        typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;

      const ctx = this.canvas.getContext('2d');
      ctx?.scale(dpr, dpr);
    };

    resizeCanvas();
    this.resizeObserver = new ResizeObserver(resizeCanvas);
    this.resizeObserver.observe(innerWrap);
  }

  /** 创建Web Worker处理动画计算 */
  private createWorker() {
    const workerCode = this.getWorkerCode();
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    this.worker = new Worker(url);

    // 初始化Worker
    this.worker.postMessage({
      type: 'init',
      width: this.canvas.clientWidth,
      height: this.canvas.clientHeight,
      starCount: this.starCount,
      time: Date.now()
    });

    // 处理Worker返回的动画数据
    this.worker.onmessage = e => {
      const { stars, meteors } = e.data;
      this.onUpdate?.(stars as Star[], meteors as Meteor[]);
    };
  }

  /** 生成Worker执行代码 */
  private getWorkerCode(): string {
    return `
      const starAnimationConfig = ${JSON.stringify(STAR_CONFIG)};
      const meteorAnimationConfig = ${JSON.stringify(METEOR_CONFIG)};
      const rainbowColors = ${JSON.stringify(RAINBOW_COLORS)};
      const angleRadian = meteorAnimationConfig.fixedAngle * Math.PI / 180;
      let stars = [];
      let meteors = [];
      let lastTime = 0;
      let canvasWidth = 0;
      let canvasHeight = 0;

      // 生成星星
      function generateStars(count, width, height) {
        const seed = Math.random() * 1000;
        return Array.from({ length: count }, (_, i) => {
          const randomX = (Math.sin(i * 12.9898 + seed) * 43758.5453) % 1;
          const randomY = (Math.sin(i * 78.233 + seed) * 43758.5453) % 1;
          
          return {
            x: randomX * width,
            y: randomY * height,
            size: 0.5 + Math.random() * 2,
            baseOpacity: 0.5 + Math.random() * 0.5,
            blinkSpeed: starAnimationConfig.minBlinkSpeed + Math.random() * (starAnimationConfig.maxBlinkSpeed - starAnimationConfig.minBlinkSpeed),
            blinkRange: starAnimationConfig.minBlinkRange + Math.random() * (starAnimationConfig.maxBlinkRange - starAnimationConfig.minBlinkRange),
            phase: Math.random() * Math.PI * 2
          };
        });
      }

      // 更新星星状态
      function updateStars(deltaTime) {
        return stars.map(star => {
          const opacity = star.baseOpacity + Math.sin(Date.now() / 1000 * 2 * Math.PI / star.blinkSpeed + star.phase) * star.blinkRange / 2;
          return { ...star, opacity };
        });
      }

      // 创建流星
      function createMeteor(width, height) {
        const startX = -50 + Math.random() * (width * 0.3);
        const startY = -50 + Math.random() * (height * 0.2);
        
        return {
          startX,
          startY,
          currentX: 0,
          currentY: 0,
          length: 60 + Math.random() * 40,
          widthVal: 1.2 + Math.random() * 0.8,
          colorIndex: Math.floor(Math.random() * rainbowColors.length),
          ...(function() {
            const speed = meteorAnimationConfig.minSpeed + Math.random() * (meteorAnimationConfig.maxSpeed - meteorAnimationConfig.minSpeed);
            const distance = meteorAnimationConfig.minDistance + Math.random() * (meteorAnimationConfig.maxDistance - meteorAnimationConfig.minDistance);
            return {
              totalX: distance * Math.cos(angleRadian),
              totalY: distance * Math.sin(angleRadian),
              duration: distance / speed,
              elapsed: 0
            };
          })()
        };
      }

      // 更新流星状态 - 添加边界检测修复流星停留问题
      function updateMeteors(deltaTime) {
        meteors = meteors.filter(meteor => {
          // 检查流星是否超出画布底部
          const isBeyondBottom = meteor.startY + meteor.currentY > canvasHeight + 50;
          // 检查流星是否超出画布右侧
          const isBeyondRight = meteor.startX + meteor.currentX > canvasWidth + 50;
          // 保留未超出边界且未结束生命周期的流星
          return !(isBeyondBottom || isBeyondRight) && meteor.elapsed < meteor.duration;
        });
        
        meteors.forEach(meteor => {
          meteor.elapsed += deltaTime / 1000;
          const progress = Math.min(1, meteor.elapsed / meteor.duration);
          meteor.currentX = meteor.totalX * progress;
          meteor.currentY = meteor.totalY * progress;
        });
        return meteors;
      }

      // 主更新函数
      function update(deltaTime, width, height) {
        // 保存当前画布尺寸用于边界检测
        canvasWidth = width;
        canvasHeight = height;
        
        // 随机生成新流星
        if (Math.random() < 0.01) meteors.push(createMeteor(width, height));
        
        return {
          stars: updateStars(deltaTime),
          meteors: updateMeteors(deltaTime)
        };
      }

      // 接收主线程消息
      self.onmessage = e => {
        const { type, width, height, starCount, time } = e.data;
        if (type === 'init') {
          canvasWidth = width;
          canvasHeight = height;
          stars = generateStars(starCount, width, height);
          lastTime = time;
        } else if (type === 'update') {
          self.postMessage(update(time - lastTime, width, height));
          lastTime = time;
        }
      };
    `;
  }

  /** 启动动画循环 */
  private startAnimation() {
    const render = (time: number) => {
      this.worker?.postMessage({
        type: 'update',
        width: this.canvas.clientWidth,
        height: this.canvas.clientHeight,
        time
      });
      this.animationFrameId = requestAnimationFrame(render);
    };
    this.animationFrameId = requestAnimationFrame(render);
  }

  /** 销毁资源 */
  destroy() {
    this.worker?.terminate();
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.resizeObserver?.disconnect();
    // 修复URL revoke逻辑
    if (this.worker) {
      const urlMatch = this.worker.toString().match(/blob:[^"]+/);
      if (urlMatch && urlMatch[0]) {
        URL.revokeObjectURL(urlMatch[0]);
      }
    }
  }
}
