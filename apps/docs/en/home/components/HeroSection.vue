<script setup lang="ts">
import { gsap } from 'gsap';
import { ref } from 'vue';

let SplitText: any;
let ScrollTrigger: any;

// 复制状态和安装命令
const copied = ref(false);
const installCommand = 'pnpm install vue-element-plus-x';

// 文本内容
const titleLine1 = 'Element Plus X';
const titleLine2 = 'Vue 3 Generative AI Component Library';
const subtitle =
  '💖 An out-of-the-box, enterprise-ready AI interaction component library—build AIGC interfaces as easily as stacking blocks.';
const getStartedText = 'Get Started';
const previewText = 'Preview';
const githubText = 'GitHub';

onMounted(async () => {
  if (typeof window === 'undefined') return;
  if (!SplitText) {
    const mod = await import('gsap/SplitText');
    SplitText = mod.SplitText;
  }
  if (!ScrollTrigger) {
    const mod = await import('gsap/ScrollTrigger');
    ScrollTrigger = mod.default ?? mod.ScrollTrigger;
  }
  if (SplitText) gsap.registerPlugin(SplitText);
  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  await document.fonts?.ready;
  textAnimation();
  scrollTriggerAnimation();
});

// 字体随机动画
function textAnimation() {
  gsap.set('.title-line-split', { opacity: 1 });
  gsap.set('.title-line-split-2', { opacity: 1 });
  gsap.set('.title-line-split-3', { opacity: 1 });
  const titleLine1Split = SplitText.create('.title-line-split', {
    type: 'chars',
    charsClass: 'title-line'
  });
  const titleLine2Split = SplitText.create('.title-line-split-2', {
    type: 'chars',
    charsClass: 'title-line2++'
  });
  const titleLine3Split = SplitText.create('.title-line-split-3', {
    type: 'chars',
    charsClass: 'text-media'
  });
  const options: gsap.TweenVars = {
    y: 100,
    opacity: 0,
    delay: 0.6,
    duration: 1.3,
    yPercent: 'random([-150, 150])',
    xPercent: 'random([-150, 150])',
    stagger: {
      from: 'random',
      amount: 0.6
    },
    ease: 'power3.out'
  };
  gsap.from(titleLine1Split.chars, options);
  gsap.from(titleLine2Split.chars, options);
  gsap.from(titleLine3Split.chars, options);
}

// 滚动触发动画
function scrollTriggerAnimation() {
  ScrollTrigger.create({
    trigger: '.hero-section',
    start: '-=220',
    end: '+=900',
    scrub: true,
    markers: false,
    pin: true,
    animation: gsap
      .timeline()
      .to('.left-container', { x: 100, y: -100 }, 0)
      .to('.right-container', { x: -100, y: -100 }, 0)
  });
}

// 复制命令方法
async function copyInstallCommand() {
  try {
    await navigator.clipboard.writeText(installCommand);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch (err) {
    console.error('Copy failed:', err);
  }
}

// 页面跳转
function handleClick() {
  location.href = '/en/components/xsender/';
}

// 在线预览
function handlePreview() {
  // 在线预览链接
  window.open('https://v.element-plus-x.com', '_blank');
}

// GitHub链接
function handleGithub() {
  // GitHub仓库链接
  window.open('https://github.com/element-plus-x/Element-Plus-X', '_blank');
}
</script>

<template>
  <!-- 首屏英雄区 -->
  <section
    class="relative items-center z-10 max-w-[1200px] mx-auto mt-30 mb-30 flex justify-between hero-section"
  >
    <div class="left-container">
      <!-- 标题区域 - 突出主标题 -->
      <div class="mt-8 mb-4">
        <h1 class="text-align-left! p-0!">
          <div
            class="title-line-split text-5xl md:text-6xl lg:text-7xl font-bold mb-2 tracking-tight"
          >
            {{ titleLine1 }}
          </div>
          <div
            class="title-line-split-2 text-2xl md:text-2xl lg:text-4xl font-medium mt-4 mb-0"
          >
            {{ titleLine2 }}
          </div>
        </h1>

        <p
          class="title-line-split-3 md:py-5 text-lg md:text-xl lg:text-2xl text-white/80 leading-relaxed max-w-2xl"
        >
          {{ subtitle }}
        </p>
      </div>

      <!-- 按钮区域 - 增加两个按钮 -->
      <div class="pt-4 md:pt-0 flex flex-wrap gap-4 btn-container">
        <button
          class="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-[1.15rem] font-semibold rounded-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20"
          @click="handleClick"
        >
          <span class="text-xl">✨</span>
          <span>{{ getStartedText }}</span>
        </button>

        <button
          class="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-[1.15rem] font-semibold rounded-full cursor-pointer transition-all duration-300 border border-white/20"
          @click="handlePreview"
        >
          <span class="text-xl">🐳</span>
          <span>{{ previewText }}</span>
        </button>

        <button
          class="inline-flex items-center gap-2 px-8 py-4 bg-black/50 hover:bg-black/70 text-white text-[1.15rem] font-semibold rounded-full cursor-pointer transition-all duration-300 border border-white/10"
          @click="handleGithub"
        >
          <img
            src="https://github.githubassets.com/assets/apple-touch-icon-144x144-b882e354c005.png"
            class="w-6 h-6 rounded-full"
            alt=""
          />
          <span>{{ githubText }}</span>
        </button>
      </div>

      <!-- 安装命令区域 - 移至底部 -->
      <div
        class="flex items-center mt-0 md:mt-10 bg-black/30 border border-white/20 rounded-2xl p-3 backdrop-blur-[15px] shadow-2xl max-w-md install-container"
      >
        <span
          class="text-indigo-400 font-mono font-semibold px-2 text-sm md:text-base select-none"
          >$</span
        >
        <span
          class="flex-1 text-white/90 font-mono md:text-base text-left px-2"
          >{{ installCommand }}</span
        >
        <button
          class="bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 hover:border-indigo-500/50 rounded-xl p-3 text-white/80 hover:text-white transition-all duration-300 hover:scale-105 mr-auto"
          @click="copyInstallCommand"
        >
          <svg
            v-if="!copied"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <svg
            v-else
            class="text-green-500"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M19.633 6.226a1 1 0 0 1 .141 1.407l-9 11a1 1 0 0 1-1.481.074l-5-5a1 1 0 1 1 1.414-1.414l4.219 4.219l8.3-10.145a1 1 0 0 1 1.407-.141"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="right-container">
      <div class="glow-container">
        <img src="/logo.png" class="w-[256px] h-[256px] relative z-10" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
:deep(.title-line) {
  will-change: transform;
  background: linear-gradient(
    135deg,
    #98ff53 0%,
    #ff1381 25%,
    #f65c5c 50%,
    #ff1381 75%,
    #f5ff69 100%
  );
  background-size: 300% 300%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: titleGradient 4s ease-in-out infinite;
  display: inline-block;

  & * {
    will-change: transform;
  }
}

:deep(.title-line2) {
  will-change: transform;
  background-size: 300% 300%;
  background: linear-gradient(135deg, #ff4d88 0%, #ff0077 55%, #ff5e86 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  & * {
    will-change: transform;
  }
}

.title-line-split-3 {
  text-align: left;
}

:deep(.title-line21),
:deep(.title-line22),
:deep(.title-line23),
:deep(.title-line24) {
  background: linear-gradient(135deg, #4fffadb6 0%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  // 字体阴影光晕
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

:deep(.title-line28) {
  margin-left: 0.625rem;
  margin-right: 0.25rem;
}

:deep(.title-line29) {
  margin-right: 0.625rem;
}

:deep(.title-line28),
:deep(.title-line29) {
  position: relative;
  /* 为伪元素提供定位基准 */
  background: linear-gradient(135deg, #4fffadb6 0%, #4fffa0 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  /* 光晕闪烁动画：随机变化光晕大小和透明度 */
  animation: pulse-glow 0.8s infinite ease-in-out;
}

:deep(.title-line28)::before,
:deep(.title-line28)::after,
:deep(.title-line29)::before,
:deep(.title-line29)::after {
  content: 'A';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: inherit;
  /* 继承渐变背景 */
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0;
  /* 默认隐藏，通过动画显示 */
}

:deep(.title-line29)::before,
:deep(.title-line29)::after {
  content: 'I';
}

/* 左侧故障副本：红色偏移 */
:deep(.title-line28)::before,
:deep(.title-line29)::before {
  left: -2px;
  text-shadow: 2px 0 rgba(255, 0, 0, 0.4);
  /* 红色错位阴影 */
  animation: glitch-left 1.3s infinite alternate-reverse;
}

/* 右侧故障副本：蓝色偏移 */
:deep(.title-line28)::after,
:deep(.title-line29)::after {
  left: 2px;
  text-shadow: -2px 0 rgba(0, 0, 255, 0.4);
  /* 蓝色错位阴影 */
  animation: glitch-right 1.3s infinite alternate-reverse;
}

/* 位置微调保持原有布局 */
:deep(.title-line28) {
  margin-left: 0.625rem;
}

:deep(.title-line29) {
  margin-right: 0.625rem;
}

/* 光晕闪烁动画 */
@keyframes pulse-glow {
  0%,
  100% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }

  20% {
    text-shadow: 0 0 18px rgba(255, 255, 255, 0.8);
  }

  40% {
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
  }

  60% {
    text-shadow: 0 0 22px rgba(255, 255, 255, 0.9);
  }

  80% {
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
  }
}

/* 左侧故障动画 */
@keyframes glitch-left {
  0%,
  80%,
  100% {
    opacity: 0;
    transform: translate(0);
  }

  20% {
    opacity: 0.6;
    transform: translate(-1px, 1px);
  }

  40% {
    opacity: 0.4;
    transform: translate(-2px, -1px);
  }

  60% {
    opacity: 0.5;
    transform: translate(-1px, -2px);
  }
}

/* 右侧故障动画 */
@keyframes glitch-right {
  0%,
  70%,
  100% {
    opacity: 0;
    transform: translate(0);
  }

  10% {
    opacity: 0.5;
    transform: translate(1px, 1px);
  }

  30% {
    opacity: 0.3;
    transform: translate(2px, 1px);
  }

  50% {
    opacity: 0.6;
    transform: translate(1px, -1px);
  }

  70% {
    opacity: 0.4;
    transform: translate(2px, -2px);
  }
}

@keyframes titleGradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

/* 发光流动效果 */
.right-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.glow-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.glow-container::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(99, 102, 241, 0.5) 0%,
    rgba(139, 92, 246, 0) 70%
  );
  z-index: 0;
  animation: glowPulse 3s ease-in-out infinite;
}

.glow-container::after {
  content: '';
  position: absolute;
  width: 120%;
  height: 120%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(139, 92, 246, 0.6) 0%,
    rgba(99, 102, 241, 0) 70%
  );
  z-index: -1;
  animation: glowFlow 4s ease-in-out infinite;
}

:deep(.text-media) {
  line-height: 0.625rem;
}

@keyframes glowPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.7;
  }

  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

@keyframes glowFlow {
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 0.5;
  }

  50% {
    transform: scale(1.2) rotate(180deg);
    opacity: 0.8;
  }

  100% {
    transform: scale(1) rotate(360deg);
    opacity: 0.5;
  }
}

/* 增加响应式调整 */
@media (max-width: 1200px) {
  .left-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 1;
    justify-content: center;
    align-items: center;

    h1 {
      text-align: center !important;
      margin-bottom: 30px;
    }

    p {
      margin-bottom: 1.875rem;
    }
  }

  .right-container {
    display: none;
  }

  /* 居中展示 */
  :deep(.text-media) {
    line-height: 0.625rem;
  }

  .title-line-split-3 {
    text-align: center;
  }

  .btn-container {
    justify-content: center;
  }

  .install-container {
    justify-content: center;
    width: calc(100% - 48px);
    margin: 20px 24px 0;
    font-size: 0.75rem;
  }
}

@media (max-width: 840px) {
  .title-line {
    font-size: 4rem;
  }

  .title-line2 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .title-line {
    font-size: 3rem;
  }

  .title-line2 {
    font-size: 1.5rem;
  }

  .button-group {
    flex-direction: column;
  }
}
</style>
