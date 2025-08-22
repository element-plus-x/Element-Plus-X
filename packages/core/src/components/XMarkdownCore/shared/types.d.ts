import type { TVueMarkdownProps } from '@components/XMarkdownCore';
import type { CodeBlockHeaderExpose } from '@components/XMarkdownCore/components/CodeBlock/shiki-header';
import type { ElxRunCodeOptions } from '../components/RunCode/type';
import type { InitShikiOptions } from './shikiHighlighter';

export type MarkdownProps = {
  allowHtml?: boolean;
  enableCodeLineNumber?: boolean;
  enableLatex?: boolean;
  enableAnimate?: boolean;
  enableBreaks?: boolean;
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
