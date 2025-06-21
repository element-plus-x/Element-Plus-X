import type { Component, VNodeChild } from 'vue'

export type CodeBlockRenderer = ((params: { language?: string; content: string }) => VNodeChild) | Component

export interface MarkdownRendererProps {
  markdown: string
  codeBlockRenderers?: Record<string, CodeBlockRenderer>
}

export interface MermaidProps{
    codeKey?: string
    lang?: string
    content?: string
    codeData?: Record<string, any>
    mermaidConfig?: any
}