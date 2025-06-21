# Markdown 渲染器 ✨️

::: info
`beta 版本` 持续优化中  
🧩 更新时间：`2025-06-09`
:::

## 介绍

`MarkdownRenderer` 是一个基于 [`@crazydos/vue-markdown`](https://www.npmjs.com/package/@crazydos/vue-markdown) 封装的 Markdown 渲染组件，支持增量更新，支持 自定义渲染扩展特性。它提供了强大的代码块自定义渲染能力，能够灵活插入图表、富文本等内容，适用于文档、聊天、对话气泡等多种场景。基于 [`unified`](https://unifiedjs.com/) 实现语法解析、转换和渲染流程，兼容标准 Markdown 规范。

## 代码演示

### 基本使用

<demo src="./demos/basic.vue"></demo>

### 自定义渲染

<demo src="./demos/code-renderer.vue"></demo>

## 属性

| 属性名             | 类型                   | 默认值     | 说明                                                                 |
| ------------------ | ---------------------- | ---------- | -------------------------------------------------------------------- |
| `markdown`         | `string`               | -（必填）  | 要渲染的 Markdown 字符串内容                                        |
| `codeBlockRenderers` | `Record<string, Component \| Function>` | `{}`        | 自定义代码块渲染器，key 为语言标识，值为组件或函数                  |
| `allowHTML`        | `boolean`              | `true`     | 是否允许解析原始 HTML 标签                                          |
| `enableLatex`      | `boolean`              | `true`     | 是否启用 KaTeX 渲染，支持 `$$` 数学公式                             |

### 继承属性

该组件还支持继承 [`VueMarkdown`](https://www.npmjs.com/package/@crazydos/vue-markdown) 的所有属性，如 `remarkPlugins`、`rehypePlugins`、`customAttrs` 等，详细参考其官方文档。

## 插槽
> 若使用'pre'插槽，则自定义渲染失效，用户需要自行处理代码块渲染。

| 插槽名   | 参数               | 说明                                     |
| -------- | ------------------ | ---------------------------------------- |
| `#code`  | `codeData`         | 自定义代码块渲染逻辑，内部已自动使用该插槽进行处理 |
| 其余插槽 | 同 `VueMarkdown` 插槽 | 原封支持原生 Markdown 插槽如 `#heading`、`#link`、`#text` 等 |

## 功能特性

1. **Markdown 渲染** - 支持标准 CommonMark 和 GitHub 风格 Markdown
2. **KaTeX 渲染** - 内置 `rehype-katex`，默认启用 LaTeX 支持
3. **HTML 支持** - 默认启用 `rehype-raw`，支持原始 HTML 渲染
4. **Mermaid 图表** - 默认对 `mermaid` 语言代码块启用图表渲染
5. **自定义渲染器** - 支持按语言注册自定义代码块渲染组件或渲染函数
6. **插槽传递** - 保留 `VueMarkdown` 插槽能力，灵活插入各类结构内容
