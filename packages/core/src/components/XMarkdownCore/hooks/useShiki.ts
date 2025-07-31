import type { BundledLanguage, ThemeRegistrationResolved } from 'shiki';
import type { InitShikiOptions } from '../shared';
import { computed, ref, shallowRef, watch } from 'vue';
import { shikiThemeDefault } from '../shared';
import { useDarkModeWatcher } from './useThemeMode';

interface UseShikiOptions {
  themes?: InitShikiOptions['themes'];
}

async function loadShiki() {
  if (typeof window === 'undefined') return null;

  const shikiModule = await import('shiki');
  return shikiModule.codeToHtml;
}

const shikiThemeColor = ref<ThemeRegistrationResolved>();
const hasCreated = ref(false);

export function useShiki(options?: UseShikiOptions) {
  const { isDark } = useDarkModeWatcher();

  const themeArr = computed(() => {
    if (options?.themes) {
      return Object.keys(options.themes).map(key => options.themes![key]);
    }
    return [shikiThemeDefault.light, shikiThemeDefault.dark];
  });

  const currentTheme = computed(() => {
    const themes = themeArr.value;
    if (!themes || themes.length === 0) {
      return isDark.value ? 'dark-plus' : 'light-plus';
    }
    return isDark.value ? themes[1] || themes[0] : themes[0] || themes[1];
  });
  const highlight = async (
    code: string,
    language?: string,
    theme?: string
  ): Promise<string> => {
    if (!code.trim()) return '';

    try {
      const codeToHtml = await loadShiki();
      if (!codeToHtml) {
        return `<pre><code>${escapeHtml(code)}</code></pre>`;
      }

      const html = await codeToHtml(code, {
        lang: (language as BundledLanguage) || 'text',
        theme: theme || (currentTheme.value as string)
      });

      return html;
    } catch (error) {
      console.warn('代码高亮失败:', error);
      return `<pre><code>${escapeHtml(code)}</code></pre>`;
    }
  };

  const updateThemeColor = () => {
    const themeName = currentTheme.value;
    shikiThemeColor.value = {
      name: themeName,
      type: isDark.value ? 'dark' : 'light'
    } as ThemeRegistrationResolved;
  };

  const init = async () => {
    if (hasCreated.value) {
      updateThemeColor();
      return;
    }

    hasCreated.value = true;
    updateThemeColor();
  };

  watch(isDark, updateThemeColor, { immediate: true });

  const destroy = () => {
    hasCreated.value = false;
  };
  const highlighter = shallowRef({
    codeToHtml: highlight
  });

  return {
    highlighter,
    shikiThemeColor,
    isDark,
    init,
    destroy,
    highlight,
    currentTheme
  };
}
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
