import type {
  MermaidZoomControls,
  UseMermaidZoomOptions
} from '../components/Mermaid/types';
import { onUnmounted, ref, watch } from 'vue';

export function useMermaidZoom(
  options: UseMermaidZoomOptions
): MermaidZoomControls {
  const { container } = options;

  const scale = ref(1);
  const posX = ref(0);
  const posY = ref(0);
  const isDragging = ref(false);

  let removeEvents: (() => void) | null = null;

  // 获取SVG元素
  const getSvg = () =>
    container.value?.querySelector('.mermaid-content svg') as HTMLElement;

  // 更新变换
  const updateTransform = (svg: HTMLElement) => {
    svg.style.transformOrigin = 'center center';
    svg.style.transform = `translate(${posX.value}px, ${posY.value}px) scale(${scale.value})`;
  };

  // 重置状态
  const resetState = () => {
    scale.value = 1;
    posX.value = 0;
    posY.value = 0;
    isDragging.value = false;
  };

  // 检查是否为移动设备
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  // 添加拖拽事件
  const addDragEvents = (content: HTMLElement) => {
    let startX = 0;
    let startY = 0;
    const isMobile = isMobileDevice();

    const onStart = (clientX: number, clientY: number) => {
      isDragging.value = true;
      startX = clientX - posX.value;
      startY = clientY - posY.value;
      document.body.style.userSelect = 'none';
    };

    const onMove = (clientX: number, clientY: number) => {
      if (isDragging.value) {
        posX.value = clientX - startX;
        posY.value = clientY - startY;
        updateTransform(content);
      }
    };

    const onEnd = () => {
      isDragging.value = false;
      document.body.style.userSelect = '';
    };

    // 鼠标事件
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // ⭐️ 只响应鼠标左键
      e.preventDefault();
      onStart(e.clientX, e.clientY);
    };
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);

    // 触摸事件
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        onStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        // 在移动设备上，单指触摸时允许滚动
        if (isMobile && !isDragging.value) {
          return; // 不阻止默认行为，允许滚动
        }
        e.preventDefault();
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    // 绑定事件
    content.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onEnd);
    content.addEventListener('touchstart', onTouchStart, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onEnd);

    return () => {
      content.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onEnd);
      content.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onEnd);
      document.body.style.userSelect = '';
    };
  };

  // 缩放功能
  const zoomIn = () => {
    const svg = getSvg();
    if (svg) {
      scale.value = Math.min(scale.value + 0.2, 10);
      updateTransform(svg);
    }
  };

  const zoomOut = () => {
    const svg = getSvg();
    if (svg) {
      scale.value = Math.max(scale.value - 0.2, 0.1);
      updateTransform(svg);
    }
  };

  const reset = () => {
    const svg = getSvg();
    if (svg) {
      resetState();
      updateTransform(svg);
    }
  };

  const fullscreen = () => {
    if (!container.value) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.value.requestFullscreen?.();
    }
  };

  const initialize = () => {
    if (!container.value) return;

    resetState();

    const svg = getSvg();
    if (svg) {
      removeEvents = addDragEvents(svg);
      updateTransform(svg);
    }
  };

  const destroy = () => {
    removeEvents?.();
    removeEvents = null;
    resetState();
  };

  // 监听容器变化
  watch(
    () => container.value,
    () => {
      destroy();
      resetState();
    }
  );

  // 组件卸载时清理
  onUnmounted(destroy);

  return {
    zoomIn,
    zoomOut,
    reset,
    fullscreen,
    destroy,
    initialize
  };
}
