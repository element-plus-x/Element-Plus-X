<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue';

const columnCount = 4;
const columnVerticalOffset = 60;

const responsive = reactive({ isMobile: false });

function checkScreenSize() {
  if (typeof window === 'undefined') return;
  responsive.isMobile = window.innerWidth < 1000;
}

onMounted(() => {
  checkScreenSize();
  if (typeof window === 'undefined') return;
  window.addEventListener('resize', checkScreenSize);
});

onUnmounted(() => {
  if (typeof window === 'undefined') return;
  window.removeEventListener('resize', checkScreenSize);
});

// 为每张张张图片设置独特的阴影参数
const chatImgs = ref([
  {
    id: 1,
    src: 'https://cdn.element-plus-x.com/chat/img/1.png',
    shade: 30,
    speed: 3.5,
    color: 'rgba(54, 144, 255, 0.3)'
  }, // 蓝色
  {
    id: 2,
    src: 'https://cdn.element-plus-x.com/chat/img/2.png',
    shade: 50,
    speed: 4.2,
    color: 'rgba(114, 46, 209, 0.3)'
  }, // 紫色
  {
    id: 3,
    src: 'https://cdn.element-plus-x.com/chat/img/3.png',
    shade: 40,
    speed: 3.8,
    color: 'rgba(255, 125, 0, 0.3)'
  }, // 橙色
  {
    id: 4,
    src: 'https://cdn.element-plus-x.com/chat/img/4.png',
    shade: 60,
    speed: 4.5,
    color: 'rgba(245, 34, 45, 0.3)'
  }, // 红色
  {
    id: 5,
    src: 'https://cdn.element-plus-x.com/chat/img/5.png',
    shade: 35,
    speed: 3.7,
    color: 'rgba(0, 180, 42, 0.3)'
  }, // 绿色
  {
    id: 6,
    src: 'https://cdn.element-plus-x.com/chat/img/6.png',
    shade: 55,
    speed: 4.0,
    color: 'rgba(134, 144, 156, 0.3)'
  }, // 灰色
  {
    id: 7,
    src: 'https://cdn.element-plus-x.com/chat/img/7.png',
    shade: 45,
    speed: 3.6,
    color: 'rgba(24, 144, 255, 0.3)'
  }, // 亮蓝
  {
    id: 8,
    src: 'https://cdn.element-plus-x.com/chat/img/8.png',
    shade: 58,
    speed: 4.3,
    color: 'rgba(235, 47, 150, 0.3)'
  } // 粉色
]);
</script>

<template>
  <div class="outer-container flex flex-col gap-y-120px">
    <h2 class="reviews-title max-w-[1200px] mx-auto">产品展示</h2>

    <div
      class="rotation-container"
      :class="{ 'mobile-view': responsive.isMobile }"
    >
      <div
        class="product-display-area"
        :class="{ 'mobile-layout': responsive.isMobile }"
      >
        <div
          v-for="img in chatImgs"
          :key="img.id"
          class="chat-item"
          :style="{
            gridColumn: responsive.isMobile
              ? 'span 12'
              : `span ${12 / columnCount}`,
            '--self-shadow-offset':
              !responsive.isMobile && [1, 3].includes(img.id % columnCount)
                ? `-${columnVerticalOffset}px`
                : '0px',
            '--self-shadow-shade': img.shade,
            '--self-shadow-speed': img.speed,
            '--self-shadow-delay': `${img.id * 0.15}s`,
            '--self-shadow-color': img.color
          }"
        >
          <div class="img-wrapper">
            <img
              :src="img.src"
              class="chat-project-img"
              :alt="`聊天图片 ${img.id}`"
            />
            <div class="glow-shadow" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.outer-container {
  padding: 120px 0;
  position: relative;
  width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;
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

.rotation-container {
  transform: rotateY(40deg) rotateX(25deg);
  transition: transform 0.5s ease;
  position: relative;
  transform-origin: center;
}

.rotation-container.mobile-view {
  transform: none;
}

.product-display-area {
  width: 2500px;
  left: calc(50% - 2500px / 2);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 40px;
  position: relative;
  box-sizing: border-box;
  padding: 0 20px;
  transform: perspective(10000px);
  transition: all 0.5s ease;
}

.product-display-area.mobile-layout {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  left: 0;
  padding: 0 20px;
  gap: 30px;
  transform: none;
}

.chat-item {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease;
  padding: 0 10px;
  transform: translateY(var(--self-shadow-offset, 0));
}

.img-wrapper {
  position: relative;
  width: 100%;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.img-wrapper:hover {
  transform: translateY(-8px) scale(1.02);
}

.chat-project-img {
  width: 100%;
  object-fit: cover;
  border-radius: 30px;
  position: relative;
  z-index: 2;
  border: 1px solid
    rgba(94, 184, 255, calc(var(--self-shadow-shade) / 100 * 0.2));
  box-shadow: 0 5px 20px rgba(0, 30, 60, 0.3);
}

.product-display-area.mobile-layout .chat-project-img {
  width: calc(100% - 20px);
  margin: 0 auto;
}

/* 单色但每张图片阴影不同 */
.glow-shadow {
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(60% + var(--self-shadow-shade) * 0.5%);
  height: calc(35px + var(--self-shadow-shade) * 0.1px);
  background-color: var(--self-shadow-color);
  filter: blur(calc(20px + var(--self-shadow-shade) * 0.05px));
  z-index: 1;
  border-radius: 50%;
  animation: breathe var(--self-shadow-speed) infinite ease-in-out;
  animation-delay: var(--self-shadow-delay);
}

.product-display-area.mobile-layout .glow-shadow {
  width: calc(70% + var(--self-shadow-shade) * 0.3%);
  height: calc(30px + var(--self-shadow-shade) * 0.08px);
  bottom: -12px;
}

@keyframes breathe {
  0%,
  100% {
    transform: translateX(-50%) scale(1);
    opacity: calc(0.5 + var(--self-shadow-shade) / 100 * 0.5);
  }
  50% {
    transform: translateX(-50%)
      scale(calc(1.1 + var(--self-shadow-shade) / 100 * 0.2));
    opacity: calc(0.8 + var(--self-shadow-shade) / 100 * 0.2);
  }
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
</style>
