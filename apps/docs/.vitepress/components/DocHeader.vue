<script lang="ts" setup>
import { Edit, ElementPlus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useData } from 'vitepress';
import { computed } from 'vue';
import { componentImports, componentTitles } from '../config/component-config';

const { frontmatter, lang, page, isDark } = useData();
const name = computed(() => {
  return frontmatter.value.title;
});

const title = computed(() => {
  const config = componentTitles[name.value as keyof typeof componentTitles];
  if (!config) return name.value;
  return lang.value === 'zh-CN' ? config.zh : config.en;
});

const importStatement = computed(() => {
  const specialConfig =
    componentImports[name.value as keyof typeof componentImports];
  if (specialConfig) {
    return specialConfig.styleStatement
      ? `${specialConfig.importStatement}\n${specialConfig.styleStatement}`
      : specialConfig.importStatement;
  }
  return `import { ${name.value} } from 'vue-element-plus-x'`;
});

const specialConfig = computed(() => {
  return componentImports[name.value as keyof typeof componentImports];
});

const isComponentPage = computed(() => {
  return page.value.filePath.includes('components');
});

declare const __VITE_GITHUB_BRANCH__: string;

const GITHUB_REPO = 'element-plus-x/Element-Plus-X';
const GITHUB_BRANCH = __VITE_GITHUB_BRANCH__ || 'main';

const sourceLink = computed(() => {
  if (specialConfig.value?.externalSourceLink) {
    return specialConfig.value.externalSourceLink;
  }
  if (isComponentPage.value) {
    const isHook = name.value?.includes('use');
    return `https://github.com/${GITHUB_REPO}/blob/${GITHUB_BRANCH}/packages/core/src/${isHook ? 'hooks' : 'components'}/${name.value}${isHook ? '.ts' : ''}`;
  } else {
    return '';
  }
});

const docEditLink = computed(() => {
  if (isComponentPage.value) {
    return `https://github.com/${GITHUB_REPO}/blob/${GITHUB_BRANCH}/apps/docs/${page.value.filePath}`;
  } else {
    return '';
  }
});

// 复制到剪贴板的方法
async function copyToClipboard(text: string) {
  try {
    // 优先使用现代的 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 降级方案：使用传统的 document.execCommand
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('复制失败:', err);
    return false;
  }
}

// 带提示的复制方法
async function copyWithFeedback(text: string) {
  const success = await copyToClipboard(text);

  if (success) {
    if (lang.value === 'zh-CN') {
      ElMessage.success('复制成功');
    } else {
      ElMessage.success('Copy Success');
    }
  } else {
    if (lang.value === 'zh-CN') {
      ElMessage.error('复制失败');
    } else {
      ElMessage.error('Copy Failed');
    }
  }

  return success;
}
</script>

<template>
  <div
    v-if="isComponentPage"
    class="doc-header"
    :style="{
      '--text-color': isDark
        ? 'rgba(255, 255, 255, 0.45)'
        : 'rgba(0, 0, 0, 0.45)',
      '--hover-background-color': isDark
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.04)'
    }"
  >
    <h1 class="component-name">
      {{ title }}
    </h1>
    <el-space class="description" direction="vertical" alignment="start">
      <div class="component-use">
        <span class="title">使用</span>
        <span class="common code" @click="copyWithFeedback(importStatement)">{{
          importStatement
        }}</span>
      </div>
      <div class="component-source-site">
        <span class="title">源码</span>
        <a :href="sourceLink" target="_blank" class="source-link common">
          <el-icon><ElementPlus /></el-icon>
          <span v-if="specialConfig?.externalSourceLink">{{
            specialConfig.externalSourceLink.replace('https://github.com/', '')
          }}</span>
          <span v-else>components/{{ name }}</span>
        </a>
      </div>
      <div v-if="specialConfig?.npmLink" class="component-npm-site">
        <span class="title">NPM</span>
        <a
          :href="specialConfig.npmLink"
          target="_blank"
          class="npm-link common"
        >
          <span>{{
            specialConfig.npmLink.replace('https://www.npmjs.com/package/', '')
          }}</span>
        </a>
      </div>
      <div class="component-doc-site">
        <span class="title">文档</span>
        <a :href="docEditLink" target="_blank" class="edit-link common">
          <el-icon>
            <Edit />
          </el-icon>
          <span>{{ lang === 'zh-CN' ? '编辑此页' : 'Edit this page' }}</span>
        </a>
      </div>
    </el-space>
  </div>
</template>

<style lang="less" scoped>
.title {
  color: var(--text-color);
}
.common {
  cursor: pointer;
  padding: 0 4px;
  border-radius: 4px;
  transition: all 0.3s ease-in-out;
  white-space: pre-wrap;
  font-family:
    'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
}
.common:hover {
  background-color: var(--hover-background-color);
  border-radius: 4px;
  padding: 0 4px;
}
.component-name {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
  line-height: 40px;
}
.description {
  margin-top: 16px;
}
.component-use {
  font-size: 14px;
  display: flex;
  gap: 24px;
}
.component-source-site {
  font-size: 14px;
  display: flex;
  gap: 24px;
  .source-link {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .source-link:hover {
    text-decoration: underline;
  }
}
.component-npm-site {
  font-size: 14px;
  display: flex;
  gap: 24px;
  .npm-link {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .npm-link:hover {
    text-decoration: underline;
  }
}
.component-doc-site {
  font-size: 14px;
  display: flex;
  gap: 24px;
  .edit-link {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .edit-link:hover {
    text-decoration: underline;
  }
}
</style>
