<script setup lang="ts">
import _contributors from 'element-plus-x-metadata/dist/component-contributors.json';
import { useData } from 'vitepress';
import { computed, onMounted, ref } from 'vue';

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
}

const targetElement = ref();
const { page, lang } = useData();
const contributorTitle = computed(() => {
  return lang.value === 'zh-CN' ? '贡献者' : 'Contributors';
});

const isComponentPage = computed(() => {
  return page.value.filePath.includes('components');
});

const contributors = computed<Contributor[]>(() => {
  const filePath = page.value.filePath;
  if (!filePath) return [];
  const paths = filePath.split('/');
  const componentName = paths[paths.length - 2]?.toLowerCase();
  if (!componentName) return [];
  return (
    (_contributors as Record<string, Contributor[] | undefined>)[
      componentName
    ] ?? []
  );
});

// 处理图片加载错误
function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = `https://ui-avatars.com/api/?name=${img.alt}&background=6366f1&color=fff&size=64`;
}

onMounted(() => {
  targetElement.value = '.page-contributors';
});
</script>

<template>
  <div
    v-show="isComponentPage && contributors.length"
    class="page-contributors"
  >
    <div class="page-contributors-title">
      {{ contributorTitle }}
    </div>
    <div class="page-contributors-list">
      <a
        v-for="contributor in contributors"
        :key="contributor.login"
        class="page-contributors-item"
        :href="contributor.html_url"
        target="_blank"
      >
        <el-tooltip
          :key="contributor.login"
          :content="contributor.login"
          placement="top-start"
          :append-to="targetElement"
        >
          <el-avatar
            :size="24"
            :src="contributor.avatar_url"
            :alt="contributor.login"
            @error="handleImageError"
          />
        </el-tooltip>
      </a>
    </div>
  </div>
</template>

<style scoped>
.page-contributors-title {
  font-size: 12px;
  opacity: 0.5;
  margin-bottom: 8px;
}

.page-contributors-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 8px;
}

.page-contributors-item {
  cursor: pointer;
}
</style>
