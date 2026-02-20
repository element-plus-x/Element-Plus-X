<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { defineClientComponent } from 'vitepress';
import { markRaw, nextTick, onMounted, onUnmounted, ref } from 'vue';
import {
  calculateCardRotation,
  createRotationTween,
  resetRotationTween
} from './animation-utils';
import Card from './card.vue';
import {
  METEOR_CONFIG,
  RAINBOW_COLORS,
  StarfieldManager
} from './starfield-manager';
import { TechCircleManager } from './tech-circle-manager';

// 注册GSAP插件
gsap.registerPlugin(ScrollTrigger);

// DOM引用
const cardWrapRef = ref<HTMLElement | null>(null);
const canvases = ref<(HTMLCanvasElement | null)[]>([]);
const backgroundContainerRef = ref<HTMLElement | null>(null);

// vitepress ssr 兼容
const Attachments = defineClientComponent(() => {
  return import('./components/Attachments.vue');
});
const BubbleList = defineClientComponent(() => {
  return import('./components/BubbleList.vue');
});
const Prompts = defineClientComponent(() => {
  return import('./components/Prompts.vue');
});
const Sender = defineClientComponent(() => {
  return import('./components/Sender.vue');
});
const Welcome = defineClientComponent(() => {
  return import('./components/Welcome.vue');
});

// 状态管理（保留原始数据）
const items = ref([
  {
    title: '欢迎组件',
    desc: '明确产品定位，快速拉进用户体验交互距离。',
    component: markRaw(Welcome)
  },
  {
    title: '提示集',
    desc: '推荐更多功能，降底学习产品成本，方便用户上手。',
    component: markRaw(Prompts)
  },
  {
    title: '输入框',
    desc: '快捷指令操作、提示词格式标准化，便捷用户操作。',
    component: markRaw(Sender)
  },
  {
    title: '气泡列表',
    desc: '多轮对话，自动滚动。生成式AI、智能客服等对话场景适用。',
    component: markRaw(BubbleList)
  },
  {
    title: '附件上传',
    desc: '展示文件列表，内置多套文件类型图标。',
    component: markRaw(Attachments)
  }
]);

// 定义5个方位的起始位置（基于容器中心的偏移量）
const startPositions = [
  { x: -800, y: -400, rotation: -30, opacity: 0, scale: 0.7 }, // 左上
  { x: 0, y: -600, rotation: 15, opacity: 0, scale: 0.7 }, // 正上
  { x: 800, y: -400, rotation: 30, opacity: 0, scale: 0.7 }, // 右上
  { x: -800, y: 400, rotation: -15, opacity: 0, scale: 0.7 }, // 左下
  { x: 800, y: 400, rotation: -30, opacity: 0, scale: 0.7 } // 右下
];

// 动画实例管理
const starfieldManagers = ref<StarfieldManager[]>([]);
const cardTweens = ref<(gsap.core.Tween | null)[]>([]);
const scrollTriggers = ref<(gsap.plugins.ScrollTriggerInstance | null)[]>([]);
const circleManager = ref<TechCircleManager | null>(null);

/** 处理鼠标移动事件 */
function handleMouseMove(e: MouseEvent, index: number) {
  const card = (e.currentTarget as HTMLElement).closest('.component-card');
  if (!(card instanceof HTMLElement)) return;

  const rect = card.getBoundingClientRect();
  const { xRotation, yRotation } = calculateCardRotation(
    rect,
    e.clientX - rect.left,
    e.clientY - rect.top
  );

  cardTweens.value[index]?.kill();
  cardTweens.value[index] = createRotationTween(card, xRotation, yRotation);
}

/** 处理鼠标离开事件 */
function handleMouseLeave(index: number) {
  const targetElement = cardWrapRef.value?.children[index] as HTMLElement;
  if (!targetElement) return;
  cardTweens.value[index]?.kill();
  cardTweens.value[index] = resetRotationTween(targetElement);
}

/** 初始化星空动画 */
async function initStarfields() {
  await nextTick();
  canvases.value.forEach((canvas, index) => {
    if (!canvas) return;

    const manager = new StarfieldManager(canvas, (stars, meteors) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      // 绘制星星
      stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 绘制流星
      meteors.forEach(meteor => {
        ctx.save();
        ctx.translate(
          meteor.startX + meteor.currentX,
          meteor.startY + meteor.currentY
        );
        ctx.rotate(((METEOR_CONFIG.fixedAngle + 270) * Math.PI) / 180);

        const gradient = ctx.createLinearGradient(0, 0, 0, meteor.length);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(1, `${RAINBOW_COLORS[meteor.colorIndex]}0.9)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(
          0,
          meteor.length / 2,
          meteor.widthVal / 2,
          meteor.length / 2,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
      });
    });

    manager.init();
    starfieldManagers.value[index] = manager;
  });
}

/** 初始化卡片动画 - 与滚动条关联的六方向汇聚 */
async function initCardAnimations() {
  await nextTick();
  if (!cardWrapRef.value) return;

  // 使用gsap.utils.toArray处理卡片元素
  const cards = gsap.utils.toArray<HTMLElement>(
    '.component-card',
    cardWrapRef.value
  );

  // 确保布局先计算完成
  await nextTick();

  // 为每个卡片设置起始位置和创建滚动触发动画
  cards.forEach((card, index) => {
    const {
      x: startX,
      y: startY,
      rotation: startRotation,
      opacity: startOpacity,
      scale: startScale
    } = startPositions[index];

    // 设置初始状态
    gsap.set(card, {
      x: startX,
      y: startY,
      rotation: startRotation,
      opacity: startOpacity,
      scale: startScale,
      filter: 'blur(8px)'
    });

    // 使用ScrollTrigger.create创建与滚动关联的动画
    scrollTriggers.value[index] = ScrollTrigger.create({
      trigger: cardWrapRef.value,
      start: 'top 90%', // 当容器顶部到达视口80%位置时开始
      end: 'top 40%', // 当容器顶部到达视口20%位置时结束
      scrub: true, // 与滚动条同步
      markers: false, // 生产环境关闭标记点
      onUpdate: self => {
        // 根据滚动进度计算动画值
        const progress = self.progress;

        // 计算当前应该的位置和样式（从起始状态过渡到目标状态）
        const currentX = startX * (1 - progress);
        const currentY = startY * (1 - progress);
        const currentRotation = startRotation * (1 - progress);
        const currentOpacity = startOpacity + (1 - startOpacity) * progress;
        const currentScale = startScale + (1 - startScale) * progress;
        const currentBlur = 8 * (1 - progress);

        // 应用计算后的样式
        gsap.set(card, {
          x: currentX,
          y: currentY,
          rotation: currentRotation,
          opacity: currentOpacity,
          scale: currentScale,
          filter: `blur(${currentBlur}px)`,
          boxShadow: `0 0 ${20 * progress}px rgba(0, 255, 255, ${0.5 * progress})`
        });
      }
    });
  });
}

/** 初始化背景色圈 */
function initBackgroundCircles() {
  nextTick(() => {
    if (backgroundContainerRef.value) {
      circleManager.value = new TechCircleManager('tech-background');
      circleManager.value.createCircles(8);
    }
  });
}

// 生命周期
onMounted(() => {
  initBackgroundCircles();
  setTimeout(() => {
    initCardAnimations();
  }, 100);

  nextTick(async () => {
    setTimeout(async () => {
      await initStarfields();
    }, 5000);
  });
});

onUnmounted(() => {
  circleManager.value?.clear();
  starfieldManagers.value.forEach(manager => manager.destroy());
  cardTweens.value.forEach(tween => tween?.kill());
  scrollTriggers.value.forEach(trigger => trigger?.kill());
});
</script>

<template>
  <!-- 背景色圈容器 -->
  <div
    id="tech-background"
    ref="backgroundContainerRef"
    class="tech-background-container"
  />

  <div class="flex flex-col gap-0px">
    <h2 class="reviews-title max-w-[1200px] mx-auto z-10000">组件展示</h2>

    <div ref="cardWrapRef" class="component-card-wrap">
      <Card
        v-for="(item, index) in items"
        :key="index"
        class="component-card"
        :data-index="index"
      >
        <div
          class="inner-wrap"
          @mousemove="handleMouseMove($event, index)"
          @mouseleave="handleMouseLeave(index)"
        >
          <div class="card-content">
            <component :is="item.component" class="card-content-component" />
          </div>
          <canvas
            :ref="el => el && (canvases[index] = el as HTMLCanvasElement)"
            class="starfield-canvas"
          />
        </div>
      </Card>
    </div>
  </div>
</template>

<style scoped lang="less">
/* 保留原始布局样式 */
.component-card-wrap {
  max-width: 1380px;
  margin: 30px auto 150px; /* 增加顶部距离以便滚动触发 */
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  z-index: 10;
  position: relative;

  .component-card {
    user-select: none;
    width: 100%;
    height: 310px;
    position: relative;
    border-radius: 30px;
    overflow: hidden;
    transform-style: preserve-3d;
    transition: transform 0.1s ease-out;
    box-shadow:
      0 4px 8px rgba(0, 255, 255, 0.3),
      0 0 20px rgba(0, 255, 255, 0.15);

    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 2;
      background: radial-gradient(
        circle,
        rgba(255, 94, 94, 0.8) 0%,
        rgba(255, 179, 71, 0.7) 15%,
        rgba(255, 240, 106, 0.7) 30%,
        rgba(129, 255, 112, 0.6) 45%,
        rgba(112, 193, 255, 0.6) 60%,
        rgba(162, 112, 255, 0.5) 75%,
        transparent 100%
      );
      border-radius: inherit;
      left: var(--border-x, -1000px);
      top: var(--border-y, -1000px);
      transform: translate(-50%, -50%);
    }

    .inner-wrap {
      position: relative;
      height: calc(100% - 2px);
      width: calc(100% - 2px);
      border-radius: inherit;
      color: white;
      inset: 1px;
      z-index: 3;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: linear-gradient(135deg, #031025, #161f33, #1f273a);

      .card-content {
        display: flex;
        flex-direction: column;
        font-family:
          Outfit,
          Noto Sans JP,
          Noto Sans,
          Vazirmatn,
          sans-serif;
      }

      .starfield-canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        pointer-events: none;
        z-index: 5;
      }
    }
  }
}

/* 标题渐变动画 */
.reviews-title {
  background: linear-gradient(
    135deg,
    #ffffff 0%,
    #e2e8f0 25%,
    #6366f1 50%,
    #8b5cf6 75%,
    #ffffff 100%
  );
  background-size: 200% 200%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: titleGradient 4s ease-in-out infinite;
}

.tech-background-container {
  position: fixed;
  top: 0;
  left: 0;
  inset: 0;
  overflow: hidden;
  z-index: 0;
  background-color: #050a1a;
  margin: 0;
  padding: 0;
}

.tech-background-circle {
  transform: translate(-50%, -50%) scale(1);
  will-change: width, height;
}

@keyframes titleGradient {
  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

/* 保留原始响应式布局 */
@media (min-width: 840px) {
  .component-card-wrap {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .component-card-wrap {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
