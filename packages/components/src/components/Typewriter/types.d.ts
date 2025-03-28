// types.ts
import type { ComputedRef, Ref } from 'vue'

/** 打字效果配置 */
export interface TypingConfig {
  /** 每次打字字符数 */
  step?: number
  /** 打字间隔（毫秒） */
  interval?: number
  /** 打字光标后缀 */
  suffix?: string
}

/** 组件 Props 类型 */
export interface TypewriterProps {
  /** 要显示的内容 */
  content: string
  /** 是否解析为 Markdown */
  isMarkdown?: boolean
  /** Markdown 代码的渲染引擎 */
  codeHighLightOptions?: CodeHighLightEngine
  /** 打字效果配置（布尔值启用默认配置） */
  typing?: boolean | TypingConfig
}

/** 组件实例类型 */
export interface TypewriterInstance {
  /** 中断打字过程 */
  interrupt: () => void
  /** 继续未完成的打字 */
  continue: () => void
  /** 重新开始打字 */
  restart: () => void
  /** 销毁组件（清理资源） */
  destroy: () => void
  /** 当前渲染的内容（响应式） */
  renderedContent: ComputedRef<string>
  /** 是否正在打字（响应式） */
  isTyping: Ref<boolean>
  /** 当前进度百分比（0-100）（响应式） */
  progress: ComputedRef<number>
}

/**
 * @description  代码高亮引擎
 * @export
 * @interface
 */
export interface CodeHighLightEngine {
  /**
   * 代码高亮类型
   */
  type: 'Prism' | 'Shiki'
}

/**
 * @description  Markdown Shiki 渲染引擎
 */
export type MarkdownShikiRendererFun = ({ content: string }) => string
