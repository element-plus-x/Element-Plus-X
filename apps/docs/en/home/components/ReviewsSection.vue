<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { reviews, shuffleReviews } from './reviews';

const WaterfallItem = ref();

async function calcSpan() {
  const items = WaterfallItem.value;
  if (!items) return;
  const list = Array.isArray(items) ? items : [items];

  for (const el of list) {
    await nextTick();
    const rows = Math.floor(el.clientHeight / 2) + 18;
    el.style.gridRowEnd = `span ${rows}`;
  }
}

function handleResize() {
  void calcSpan();
}

onMounted(async () => {
  await calcSpan();
  if (typeof window === 'undefined') return;
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (typeof window === 'undefined') return;
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <!-- 社区评价区域 -->
  <section class="reviews-section py-24 relative">
    <div class="reviews-container max-w-6xl mx-auto px-8">
      <div class="reviews-header text-center mb-16">
        <h2 class="reviews-title text-5xl font-black m-0 mb-4">社区评价</h2>
        <!-- <p class="reviews-subtitle text-lg text-white/70 m-0">
          来自全球开发者的真实反馈
        </p> -->
      </div>

      <!-- 瀑布流布局 -->
      <div id="reviewsMasonry" class="waterfall">
        <div
          v-for="review in shuffleReviews(reviews)"
          :key="review.id"
          ref="WaterfallItem"
          class="waterfall-item review-card backdrop-blur-5 border border-white/10 rounded-2 rounded-bl-12 p-6 transition-all duration-300 cursor-pointer"
        >
          <div class="review-content mb-4">
            <p class="review-text text-sm leading-relaxed text-white/80 m-0">
              {{ review.content }}
            </p>
          </div>

          <div class="review-header">
            <div class="reviewer-info flex items-center gap-4">
              <a
                :href="review.userInfoUrl || 'javascript:void(0);'"
                :target="review.userInfoUrl ? '_blank' : '_self'"
                class="background-scale"
              >
                <el-avatar
                  class="reviewer-avatar w-12.5 h-12.5 rounded-full flex-center text-2xl border-2 border-white/10"
                  :size="40"
                  :src="review.avatar"
                />
              </a>
              <div class="reviewer-details flex-1">
                <h4
                  class="reviewer-name text-sm font-semibold text-white m-0 mb-1"
                >
                  {{ review.name }}
                </h4>
                <p class="reviewer-role text-sm text-white/60 m-0">
                  {{ review.role }}
                  {{ review.company ? `@${review.company}` : '' }}
                </p>
              </div>
            </div>
          </div>

          <!-- <div
            class="review-footer flex items-center justify-between pt-4 border-t border-white/10"
          >
            <span class="review-date text-sm text-white/50">{{
              review.date
              }}</span>
            <div class="review-actions flex gap-2">
              <button
                class="like-btn flex items-center gap-1 bg-white/10 border border-white/20 rounded-5 px-3 py-1 text-white/70 text-sm cursor-pointer transition-all duration-300"
              >
                <span class="like-icon text-sm">👍</span>
                <span class="like-count font-medium">{{ review.likes }}</span>
              </button>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 社区评价区域 */
.reviews-section {
  padding: 6rem 0;
  position: relative;
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

.waterfall {
  display: grid;
  grid-auto-rows: 2px;
  grid-template-columns: repeat(3, calc((100% - 72px) / 3));
  align-items: start;
  justify-content: space-between;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

.waterfall-item {
  user-select: none;
  position: relative;
  overflow: hidden;
}

.waterfall-item::before {
  --size: 10px;
  content: '';
  position: absolute;
  z-index: -1;
  left: 0;
  bottom: 0;
  width: var(--size);
  height: var(--size);
  background: radial-gradient(
    circle closest-side,
    rgba(100, 100, 100, 0.6),
    transparent
  );
  transform: translate(-50%, 50%);
  transition:
    width 0.8s ease,
    height 0.8s ease;
}

.waterfall-item:hover::before {
  --size: 500px;
}

.waterfall-item:hover {
  animation: shake 0.8s cubic-bezier(0.06, 0.17, 0.29, 0.67) both !important;
}

.background-scale:hover {
  transform: scale(1.02);
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

/* 卡片样式 */
.review-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  /* animation: cardFadeIn 0.6s ease-out; */
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.review-card:hover {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.08) 100%
  );
  border-color: rgba(99, 102, 241, 0.3);
  /* transform: translateY(-5px); */
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.2),
    0 10px 20px rgba(99, 102, 241, 0.1);
}

/* 头像渐变背景 */
.reviewer-avatar {
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.2),
    rgba(139, 92, 246, 0.2)
  );
}

/* 点赞按钮悬停效果 */
.like-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(99, 102, 241, 0.3);
  color: white;
  /* transform: scale(1.05); */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .waterfall {
    grid-template-columns: repeat(2, calc(50% - 18px));
  }

  .reviews-section {
    @apply py-16;
  }

  .reviews-container {
    @apply px-4;
  }

  .reviews-title {
    @apply text-3xl;
  }

  .reviews-masonry {
    @apply grid-cols-1 gap-6;
  }

  .review-card {
    @apply p-5;
  }

  .reviewer-avatar {
    @apply w-10 h-10 text-xl;
  }

  .reviewer-name {
    @apply text-base;
  }

  .reviewer-role {
    @apply text-xs;
  }

  .review-text {
    @apply text-sm;
  }
}

@media (max-width: 480px) {
  .waterfall {
    grid-template-columns: repeat(1, 100%);
  }

  .reviews-section {
    @apply py-12;
  }

  .reviews-title {
    @apply text-2xl;
  }

  .reviews-subtitle {
    @apply text-base;
  }

  .review-card {
    @apply p-4;
  }

  .reviewer-info {
    @apply gap-3;
  }

  .reviewer-avatar {
    @apply w-8.75 h-8.75 text-base;
  }

  .reviewer-name {
    @apply text-sm;
  }

  .reviewer-role {
    @apply text-xs;
  }

  .review-text {
    @apply text-sm;
  }

  .review-date {
    @apply text-xs;
  }

  .like-btn {
    @apply px-2 py-0.5 text-xs;
  }
}
</style>
