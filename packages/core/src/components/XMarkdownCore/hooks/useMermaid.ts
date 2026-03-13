import type { Ref } from 'vue';
import { throttle } from 'lodash-es';
import { computed, ref, watch } from 'vue';

interface UseMermaidOptions {
  id?: string;
  theme?: 'default' | 'dark' | 'forest' | 'neutral' | string;
  config?: any;
}

async function loadMermaid() {
  if (import.meta.env.SSR) return null;
  if (typeof window === 'undefined') return null;
  if (typeof document === 'undefined') return null;
  const mermaidModule = await import('mermaid');
  return mermaidModule.default;
}

let mermaidContainer: HTMLElement | null = null;

function getMermaidContainer(): HTMLElement {
  if (!mermaidContainer) {
    mermaidContainer = document.querySelector(
      '.elx-markdown-mermaid-container'
    ) as HTMLElement;
    if (!mermaidContainer) {
      mermaidContainer = document.createElement('div') as HTMLElement;
      mermaidContainer.ariaHidden = 'true';
      mermaidContainer.style.maxHeight = '0';
      mermaidContainer.style.opacity = '0';
      mermaidContainer.style.overflow = 'hidden';
      mermaidContainer.classList.add('elx-markdown-mermaid-container');
      document.body.append(mermaidContainer);
    }
  }
  return mermaidContainer;
}

export function useMermaid(
  content: string | Ref<string>,
  options: UseMermaidOptions = {}
) {
  const { id = 'mermaid', theme = 'default', config = {} } = options;
  const mermaidConfig = computed(() => ({
    suppressErrorRendering: true,
    startOnLoad: false,
    securityLevel: 'loose',
    theme,
    ...config
  }));
  const data = ref('');
  const error = ref<unknown>(null);
  const throttledRender = throttle(
    async () => {
      const contentValue =
        typeof content === 'string' ? content : content.value;
      if (!contentValue?.trim()) {
        data.value = '';
        error.value = null;
        return;
      }
      try {
        // 动态加载 mermaid 库
        const mermaidInstance = await loadMermaid();
        if (!mermaidInstance) {
          data.value = contentValue;
          error.value = null;
          return;
        }
        // 语法校验
        const isValid = await mermaidInstance.parse(contentValue.trim());
        if (!isValid) {
          console.log('Mermaid parse error: Invalid syntax');
          data.value = '';
          error.value = new Error('Mermaid parse error: Invalid syntax');
          return;
        }
        // 初始化 mermaid 配置
        mermaidInstance.initialize(mermaidConfig.value);
        const renderId = `${id}-${Math.random().toString(36).substr(2, 9)}`;
        const container = getMermaidContainer();
        const { svg } = await mermaidInstance.render(
          renderId,
          contentValue,
          container
        );
        data.value = svg;
        error.value = null;
      } catch (err) {
        console.log('Mermaid render error:', err);
        data.value = '';
        error.value = err;
      }
    },
    300,
    { trailing: true, leading: true }
  );

  // 监听内容变化，自动触发渲染
  watch(
    () => (typeof content === 'string' ? content : content.value),
    () => {
      throttledRender();
    },
    { immediate: true }
  );

  return {
    data,
    error
  };
}
