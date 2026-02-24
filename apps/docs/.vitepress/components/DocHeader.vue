<script lang="ts" setup>
import { Edit, ElementPlus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useData } from 'vitepress';
import { computed } from 'vue';

const zhMap = {
  Welcome: 'Welcome 欢迎',
  Attachments: 'Attachments 附件上传组件',
  Bubble: 'Bubble 对话气泡',
  BubbleList: 'BubbleList 气泡列表',
  Conversations: 'Conversations 会话管理组件',
  EditorSender: 'EditorSender 编辑输入框',
  FilesCard: 'FilesCard 文件卡片',
  Prompts: 'Prompts 提示集组件',
  Thinking: 'Thinking 思考中',
  ThoughtChain: 'ThoughtChain 思维链',
  Typewriter: 'Typewriter 打字器',
  useRecord: 'useRecord',
  useSend: 'useSend & XRequest',
  useXStream: 'useXStream',
  XMarkdown: 'XMarkdown 渲染组件',
  XSender: 'XSender 输入框'
};

const enMap = {
  Welcome: 'Welcome Component',
  Attachments: 'Attachments File Upload Component',
  Bubble: 'Bubble Component',
  BubbleList: 'BubbleList Component',
  Conversations: 'Conversations Component',
  EditorSender: 'EditorSender Input Box',
  FilesCard: 'FilesCard Component',
  Prompts: 'Prompts Component',
  Thinking: 'Thinking Component',
  ThoughtChain: 'ThoughtChain Component',
  Typewriter: 'Typewriter Component',
  useRecord: 'useRecord',
  useSend: 'useSend & XRequest',
  useXStream: 'useXStream',
  XMarkdown: 'XMarkdown Rendering Component',
  XSender: 'XSender Input Box'
};

const { frontmatter, lang, page, isDark } = useData();
const name = computed(() => {
  return frontmatter.value.title;
});

const title = computed(() => {
  return lang.value === 'zh-CN'
    ? zhMap[name.value as keyof typeof zhMap]
    : enMap[name.value as keyof typeof enMap];
});

const isComponentPage = computed(() => {
  return page.value.filePath.includes('components');
});

const sourceLink = computed(() => {
  if (isComponentPage.value) {
    const isHook = name.value?.includes('use');
    return `https://github.com/HeJiaYue520/Element-Plus-X/blob/main/packages/core/src/${isHook ? 'hooks' : 'components'}/${name.value}${isHook ? '.ts' : ''}`;
  } else {
    return '';
  }
});

const docEditLink = computed(() => {
  if (isComponentPage.value) {
    return `https://github.com/HeJiaYue520/Element-Plus-X/edit/main/apps/docs/${page.value.filePath}`;
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
        <span
          class="common code"
          @click="
            copyWithFeedback(`import  { ${name} }  from 'vue-element-plus-x'`)
          "
          >import { {{ name }} } from 'vue-element-plus-x'</span
        >
      </div>
      <div class="component-source-site">
        <span class="title">源码</span>
        <a :href="sourceLink" target="_blank" class="source-link common">
          <el-icon><ElementPlus /></el-icon>
          <span>components/{{ name }}</span>
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
