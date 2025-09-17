import type { TVueMarkdownProps } from '@components/XMarkdownCore';
import type { CodeBlockHeaderExpose } from '@components/XMarkdownCore/components/CodeBlock/shiki-header';
import type { ElxRunCodeOptions } from '../components/RunCode/type';
import type { InitShikiOptions } from './shikiHighlighter';

export type MarkdownProps = {
  allowHtml?: boolean;
  enableLatex?: boolean;
  enableAnimate?: boolean;
  enableBreaks?: boolean;
  codeXProps?: CodeXProps;
  codeXRender?: Record<string, any>;
  codeXSlot?: CodeBlockHeaderExpose & Record<string, any>;
  codeHighlightTheme?: BuiltinTheme | null;
  remarkPluginsAhead?: PluggableList;
  rehypePluginsAhead?: PluggableList;
  defaultThemeMode?: 'light' | 'dark';
  needViewCodeBtn?: boolean;
  secureViewCode?: boolean;
  viewCodeModalOptions?: ElxRunCodeOptions;
  mermaidConfig?: Partial<MermaidToolbarConfig>;
} & Partial<Pick<InitShikiOptions, 'langs' | 'themes' | 'colorReplacements'>> &
  Pick<
    TVueMarkdownProps,
    | 'markdown'
    | 'customAttrs'
    | 'remarkPlugins'
    | 'rehypePlugins'
    | 'sanitize'
    | 'sanitizeOptions'
    | 'rehypeOptions'
  >;

export type MarkdownProviderProps = Omit<MarkdownProps, 'markdown'> &
  Partial<Pick<MarkdownProps, 'markdown'>>;

export interface CodeXProps {
  enableCodePreview?: boolean; // 启动代码预览功能
  enableCodeCopy?: boolean; // 启动代码复制功能
  enableThemeToggle?: boolean; // 启动主题切换
  enableCodeLineNumber?: boolean; // 开启行号
}
