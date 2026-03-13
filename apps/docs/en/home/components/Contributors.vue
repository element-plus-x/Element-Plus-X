<script setup lang="ts">
import _repo_contributors from 'element-plus-x-metadata/dist/component-contributors.json';
// import { Loading, Warning } from '@element-plus/icons-vue';
import { ref } from 'vue';

interface RepoContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

const repo = 'Element-Plus-X';

const targetElement = ref();

const contributors: RepoContributor[] =
  (_repo_contributors as Record<string, RepoContributor[]>)[repo] ?? [];
// const loading = ref(false);
// const error = ref('');

// 处理图片加载错误
function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = `https://ui-avatars.com/api/?name=${img.alt}&background=6366f1&color=fff&size=64`;
}

onMounted(() => {
  targetElement.value = '.contributor-item-wrap';
});
</script>

<template>
  <!-- bg-gradient-to-br -->
  <section
    class="relative py-16 px-6 overflow-hidden from-[#0f0f23] via-[#1a1a2e] to-[#16213e] text-white"
  >
    <!-- 背景装饰 -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="contributors-bg-orb orb-1" />
      <div class="contributors-bg-orb orb-2" />
      <div class="contributors-grid-pattern" />
    </div>

    <div class="relative z-10 max-w-6xl mx-auto">
      <!-- Loading State -->
      <!-- <div
        v-if="loading"
        class="flex flex-col items-center justify-center py-16 gap-4"
      >
        <div class="relative">
          <el-icon class="text-4xl text-indigo-500 animate-spin">
            <Loading />
          </el-icon>
        </div>
        <p class="text-lg text-white/70 m-0">
          正在加载贡献者信息...
        </p>
      </div> -->

      <!-- Error State -->
      <!-- <div
        v-else-if="error"
        class="flex flex-col items-center justify-center py-16 gap-6"
      >
        <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-full">
          <el-icon class="text-4xl text-red-500">
            <Warning />
          </el-icon>
        </div>
        <div class="text-center flex flex-col gap-4">
          <p class="text-white/80 text-lg m-0">
            {{ error }}
          </p>
          <button
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 border-none rounded-xl text-white font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/30"
            @click="retry"
          >
            <span class="text-base">🔄</span>
            重试
          </button>
        </div>
      </div> -->

      <!-- Contributors Content -->
      <div>
        <!-- 标题区域 -->
        <div class="text-center mb-12">
          <div
            class="title-badge inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-sm font-semibold mb-6 animate-pulse"
          >
            <span class="text-xl">👥</span>
            <span class="text-white/90">开源社区</span>
          </div>

          <p
            class="text-xl text-white/70 my-4 max-w-2xl mx-auto leading-relaxed"
          >
            感谢所有为 Element Plus X 做出贡献的开发者们
          </p>

          <div
            v-show="contributors.length > 0"
            class="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm"
          >
            <span
              class="text-2xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
              >{{ contributors.length }}</span
            >
            <span class="text-white/80 font-medium">位贡献者</span>
          </div>
        </div>

        <!-- 贡献者网格 -->
        <div
          v-show="contributors.length > 0"
          class="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-6 mb-16 max-w-4xl mx-auto contributor-item-wrap"
        >
          <div
            v-for="(contributor, index) in contributors"
            :key="contributor.login"
            class="contributor-item opacity-0 animate-fade-in-up"
            :style="{ animationDelay: `${index * 0.05}s` }"
          >
            <el-tooltip
              :key="contributor.login"
              :content="`${contributor.login} - ${contributor.contributions} 次贡献`"
              placement="top"
              effect="dark"
              :show-after="300"
              :append-to="targetElement"
            >
              <a
                :href="contributor.html_url"
                target="_blank"
                rel="noopener noreferrer"
                class="block no-underline text-inherit transition-all duration-300 hover:-translate-y-2"
              >
                <div class="relative mb-3">
                  <img
                    :src="contributor.avatar_url"
                    :alt="contributor.login"
                    class="w-20 h-20 rounded-full border-3 border-white/10 transition-all duration-300 filter grayscale-30 block mx-auto hover:border-indigo-500 hover:grayscale-0 hover:shadow-lg hover:shadow-indigo-500/30"
                    loading="lazy"
                    @error="handleImageError"
                  />
                  <div
                    class="avatar-overlay absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl px-2 py-1 text-xs font-semibold opacity-0 transition-all duration-300 border-2 border-white/20 hover:opacity-100 hover:-translate-y-1"
                  >
                    <span class="whitespace-nowrap">
                      {{ contributor.contributions }}
                    </span>
                  </div>
                </div>
              </a>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 背景装饰动画 - 无法用 UnoCSS 实现的自定义效果 */
.contributors-bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: contributorsOrbFloat 10s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    rgba(99, 102, 241, 0.3) 0%,
    transparent 70%
  );
  top: 10%;
  left: 5%;
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle,
    rgba(139, 92, 246, 0.25) 0%,
    transparent 70%
  );
  bottom: 15%;
  right: 10%;
  animation-delay: -5s;
}

@keyframes contributorsOrbFloat {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(30px, -30px) scale(1.1);
  }
}

.contributors-grid-pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: contributorsGridMove 25s linear infinite;
}

@keyframes contributorsGridMove {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(60px, 60px);
  }
}

/* 自定义动画 */
@keyframes animate-fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: animate-fade-in-up 0.6s ease-out forwards;
}

@keyframes animate-gradient-x {
  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient-x {
  background-size: 200% 200%;
  animation: animate-gradient-x 4s ease-in-out infinite;
}

/* 悬停效果增强 */
.contributor-item:hover .avatar-overlay {
  opacity: 1 !important;
  transform: translateX(-50%) translateY(-5px) !important;
}

.contribute-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.contribute-button:hover::before {
  left: 100%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .grid-cols-\[repeat\(auto-fill\,minmax\(120px\,1fr\)\)\] {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  .w-20 {
    width: 3.75rem;
  }

  .h-20 {
    height: 3.75rem;
  }
}

@media (max-width: 480px) {
  .grid-cols-\[repeat\(auto-fill\,minmax\(120px\,1fr\)\)\] {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }

  .w-20 {
    width: 3rem;
  }

  .h-20 {
    height: 3rem;
  }
}
</style>
