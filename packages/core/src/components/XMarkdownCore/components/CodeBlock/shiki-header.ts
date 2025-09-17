import type { Component, Ref, VNode } from 'vue';
import type { MermaidExposeProps } from '../Mermaid/types';
import type {
  ElxRunCodeCloseBtnExposeProps,
  ElxRunCodeContentExposeProps,
  ElxRunCodeExposeProps
} from '../RunCode/type';
import type { RawProps } from './types';
import { useMarkdownContext } from '@components/XMarkdownCore/components/MarkdownProvider';
import { ArrowDownBold, Moon, Sunny } from '@element-plus/icons-vue';
import { ElButton, ElMessage, ElSpace } from 'element-plus';
import { h, ref } from 'vue';
import CopyCodeButton from './copy-code-button.vue';
import RunCodeButton from './run-code-button.vue';

export interface CodeBlockExpose {
  /**
   * 代码块传入的代码原始数据属性
   */
  raw: RawProps;
  /**
   * 渲染的行
   */
  renderLines: Array<string>;
  /**
   * 当前主题色是否是暗色
   */
  isDark: Ref<boolean>;
  /**
   * 当前代码块是否展开
   */
  isExpand: Ref<boolean>;
  /**
   * 是否显示预览代码按钮
   */
  nowViewBtnShow: boolean;
  /**
   * 切换展开折叠
   * @param ev MouseEvent
   * @returns
   */
  toggleExpand: (ev: MouseEvent) => { isExpand: boolean };
  /**
   * 切换主题
   * @returns
   */
  toggleTheme: () => boolean;
  /**
   * 复制代码
   * @param value
   */
  copyCode: (value: string | Array<string>) => void;
  /**
   * 查看代码
   * @param value
   */
  viewCode: (value: Array<string>) => void;
}

export type ComponentRenderer<T> = Component<T>;

export type ComponentFunctionRenderer<T> = (props: T) => VNode;

/**
 * @description 代码块头部渲染器
 */
export type CodeBlockHeaderRenderer = ComponentRenderer<CodeBlockExpose>;
export type CodeBlockHeaderFunctionRenderer =
  ComponentFunctionRenderer<CodeBlockExpose>;
/**
 * @description 查看代码头部渲染器
 */
export type ViewCodeHeadRender = ComponentRenderer<ElxRunCodeExposeProps>;
export type ViewCodeHeadFunctionRender =
  ComponentFunctionRenderer<ElxRunCodeExposeProps>;
/**
 * @description 查看代码头部关闭按钮渲染器
 */
export type ViewCodeCloseBtnRender =
  ComponentRenderer<ElxRunCodeCloseBtnExposeProps>;
export type ViewCodeCloseBtnFunctionRender =
  ComponentFunctionRenderer<ElxRunCodeCloseBtnExposeProps>;
/**
 * @description 查看代码内容渲染器
 */
export type ViewCodeContentRender =
  ComponentRenderer<ElxRunCodeContentExposeProps>;
export type ViewCodeContentFunctionRender =
  ComponentFunctionRenderer<ElxRunCodeContentExposeProps>;
/**
 * @description Mermaid头部插槽渲染器
 */
export type MermaidHeaderControlRender = ComponentRenderer<MermaidExposeProps>;
export type MermaidHeaderControlFunctionRender =
  ComponentFunctionRenderer<MermaidExposeProps>;

export interface CodeBlockHeaderExpose {
  /**
   * 代码块自定义头部（包括语言和复制按钮等）
   * 当有此属性时，将不会显示默认的代码头部 和 codeHeaderLanguage codeHeaderControl 插槽里面的内容
   */
  codeHeader?: CodeBlockHeaderRenderer;
  /**
   * 代码块语言插槽
   */
  codeHeaderLanguage?: CodeBlockHeaderRenderer;
  /**
   * 代码块右侧插槽
   */
  codeHeaderControl?: CodeBlockHeaderRenderer;
  /**
   * 代码块查看代码弹窗的头部插槽
   */
  viewCodeHeader?: ViewCodeHeadRender;
  /**
   * 代码块查看代码弹窗的关闭按钮插槽
   */
  viewCodeCloseBtn?: ViewCodeCloseBtnRender;
  /**
   * 代码块查看代码弹窗的代码内容插槽
   */
  viewCodeContent?: ViewCodeContentRender;
  /**
   * 代码块mermaid头部插槽
   */
  codeMermaidHeaderControl?: MermaidHeaderControlRender;
}

export interface CodeBlockHeaderFunctionExpose {
  /**
   * 代码块自定义头部（包括语言和复制按钮等）
   * 当有此属性时，将不会显示默认的代码头部 和 codeHeaderLanguage codeHeaderControl 插槽里面的内容
   */
  codeHeader?: CodeBlockHeaderFunctionRenderer;
  /**
   * 代码块语言插槽
   */
  codeHeaderLanguage?: CodeBlockHeaderFunctionRenderer;
  /**
   * 代码块右侧插槽
   */
  codeHeaderControl?: CodeBlockHeaderFunctionRenderer;
  /**
   * 代码块查看代码弹窗的头部插槽
   */
  viewCodeHeader?: ViewCodeHeadFunctionRender;
  /**
   * 代码块查看代码弹窗的关闭按钮插槽
   */
  viewCodeCloseBtn?: ViewCodeCloseBtnFunctionRender;
  /**
   * 代码块查看代码弹窗的代码内容插槽
   */
  viewCodeContent?: ViewCodeContentFunctionRender;
  /**
   * 代码块mermaid头部插槽
   */
  codeMermaidHeaderControl?: MermaidHeaderControlFunctionRender;
}

let copyCodeTimer: ReturnType<typeof setTimeout> | null = null;

// 记录当前是否暗色模式
export const isDark = ref(document.body.classList.contains('dark'));

/* ----------------------------------- 按钮组 ---------------------------------- */

/**
 * @description 描述 language标签
 * @date 2025-06-25 17:48:15
 * @author tingfeng
 *
 * @export
 * @param language
 */
export function languageEle(language: string) {
  return h(
    ElSpace,
    {
      class: `markdown-elxLanguage-header-space markdown-elxLanguage-header-space-start markdown-elxLanguage-header-span`,
      direction: 'horizontal',
      onClick: (ev: MouseEvent) => {
        toggleExpand(ev);
      }
    },
    {
      default: () => [
        h(
          'span',
          {
            class: 'markdown-elxLanguage-header-span is-always-shadow'
          },
          language || ''
        ),
        h(
          ElButton,
          {
            class: 'shiki-header-button shiki-header-button-expand'
          },
          {
            default: () => [
              h(ArrowDownBold, {
                class:
                  'markdown-elxLanguage-header-toggle markdown-elxLanguage-header-toggle-expand '
              })
            ]
          }
        )
      ]
    }
  );
}

/**
 * @description 描述 语言头部操作按钮
 * @date 2025-06-25 17:49:04
 * @author tingfeng
 *
 * @export
 * @param {() => void} copy
 */
export function controlEle(copy: () => void) {
  return h(
    ElSpace,
    {
      class: `markdown-elxLanguage-header-space`,
      direction: 'horizontal'
    },
    {
      default: () => [
        toggleThemeEle(),
        h(CopyCodeButton, { onCopy: copy }) // ✅ 改为组件形式
      ]
    }
  );
}

/**
 * @description 描述 语言头部操作按钮(带预览代码按钮)
 * @date 2025-07-09 11:15:27
 * @author tingfeng
 * @param copy
 * @param view
 */
export function controlHasRunCodeEle(copy: () => void, view: () => void) {
  const context = useMarkdownContext();
  const { codeXProps } = toValue(context) || {};
  return h(
    ElSpace,
    {
      class: `markdown-elxLanguage-header-space`,
      direction: 'horizontal'
    },
    {
      default: () => [
        codeXProps?.enableCodePreview
          ? h(RunCodeButton, { onView: view })
          : null,
        codeXProps?.enableThemeToggle ? toggleThemeEle() : null,
        codeXProps?.enableCodeCopy ? h(CopyCodeButton, { onCopy: copy }) : null // ✅ 改为组件形式
      ]
    }
  );
}

/**
 * @description 描述 主题按钮
 * @date 2025-06-25 17:49:53
 * @author tingfeng
 *
 * @export
 */
export function toggleThemeEle() {
  return h(
    ElButton,
    {
      class: 'shiki-header-button markdown-elxLanguage-header-toggle',
      onClick: () => {
        toggleTheme();
      }
    },
    {
      default: () =>
        h(!isDark.value ? Moon : Sunny, {
          class: 'markdown-elxLanguage-header-toggle'
        })
    }
  );
}

/* ----------------------------------- 方法 ----------------------------------- */

/**
 * @description 描述 展开代码
 * @date 2025-07-01 11:33:32
 * @author tingfeng
 *
 * @export
 * @param elem
 */
export function expand(elem: HTMLElement) {
  elem.classList.add('is-expanded');
}

/**
 * @description 描述 折叠代码
 * @date 2025-07-01 11:33:49
 * @author tingfeng
 *
 * @export
 * @param elem
 */
export function collapse(elem: HTMLElement) {
  elem.classList.remove('is-expanded');
}

/**
 * @description 复制代码内容到剪贴板
 * @date 2025-03-28 14:03:22
 * @author tingfeng
 *
 * @async
 * @param v
 * @returns void
 */
async function copy(v: string) {
  try {
    // 现代浏览器 Clipboard API
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(v);
      ElMessage({
        message: '复制成功',
        type: 'success'
      });
      return; // 复制成功直接返回
    }

    // 兼容旧浏览器的 execCommand 方案
    const textarea = document.createElement('textarea');
    textarea.value = v.trim();
    textarea.style.position = 'fixed'; // 避免滚动到文本框位置
    document.body.appendChild(textarea);
    textarea.select();

    // 执行复制命令
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    if (success) {
      ElMessage({
        message: '复制成功',
        type: 'success'
      });
      return; // 复制成功直接返回
    }
    if (!success) {
      throw new Error('复制失败，请检查浏览器权限');
    }
  } catch (err) {
    throw new Error(
      `复制失败: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

/**
 * @description 描述 将源代码行数转换可复制的string
 * @date 2025-06-25 17:50:42
 * @author tingfeng
 *
 * @export
 * @param lines
 */
export function extractCodeFromHtmlLines(lines: string[]): string {
  const container = document.createElement('div');
  const output: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    container.innerHTML = lines[i];
    const text = container.textContent?.trimEnd();
    output.push(text ?? '');
  }

  container.remove();
  container.innerHTML = ''; // 清空引用内容
  container.textContent = null;

  return output.join('\n');
}

let isToggling = false;

/**
 * @description 描述 切换展开状态
 * @date 2025-06-26 21:29:50
 * @author tingfeng
 *
 * @export
 * @param ev
 */
export function toggleExpand(ev: MouseEvent): { isExpand: boolean } {
  if (isToggling) return { isExpand: false }; // 防抖保护
  isToggling = true;

  const ele = ev.currentTarget as HTMLElement;
  const preMd = ele.closest('.pre-md') as HTMLElement | null;

  if (preMd) {
    setTimeout(() => {
      isToggling = false;
    }, 250);

    if (preMd.classList.contains('is-expanded')) {
      collapse(preMd);
      return { isExpand: false };
    } else {
      expand(preMd);
      return { isExpand: true };
    }
  }

  isToggling = false;
  return { isExpand: false };
}

/**
 * @description 描述 切换主题
 * @date 2025-06-26 21:58:56
 * @author tingfeng
 *
 * @export
 */
export function toggleTheme() {
  const theme = document.body.classList.contains('dark') ? 'light' : 'dark';
  isDark.value = theme === 'dark';
  if (isDark.value) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
  return isDark.value;
}

/**
 * @description 描述 初始化主题模式
 * @date 2025-07-08 13:43:19
 * @author tingfeng
 *
 * @export
 * @param defaultThemeMode
 */
export function initThemeMode(defaultThemeMode: 'light' | 'dark') {
  const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
  if (theme !== defaultThemeMode) {
    isDark.value = defaultThemeMode === 'dark';
    if (defaultThemeMode === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
}

/**
 * @description 描述 复制代码
 * @date 2025-06-26 22:02:57
 * @author tingfeng
 *
 * @export
 * @param codeText
 */
export function copyCode(codeText: string | string[]) {
  try {
    if (copyCodeTimer) return false; // 阻止重复点击

    if (Array.isArray(codeText)) {
      const code = extractCodeFromHtmlLines(codeText);
      copy(code);
    } else {
      copy(codeText);
    }

    copyCodeTimer = setTimeout(() => {
      copyCodeTimer = null;
    }, 800);

    return true;
  } catch (error) {
    console.log('🚀 ~ copyCode ~ error:', error);
    return false;
  }
}
