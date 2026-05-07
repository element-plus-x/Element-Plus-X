---
title: XMarkdown
---

## Introduction

`x-markdown-vue` is a standalone Markdown rendering library extracted from `vue-element-plus-x`, purpose-built for rich text display and streaming output in AI chat scenarios.

### ✨ Features

- 🚀 **Streaming Rendering** — Real-time output animation for AI chat, with per-token fade-in effects
- 📝 **GitHub Flavored Markdown** — Full GFM support (tables, task lists, strikethrough, etc.)
- 🎨 **Syntax Highlighting** — Powered by Shiki with 100+ languages and multiple themes
- 🧮 **LaTeX Math** — Inline `$...$` and block `$$...$$` math formulas
- 📊 **Mermaid Diagrams** — Flowcharts, sequence diagrams, Gantt charts, class diagrams, and more
- 🌗 **Dark Mode** — Built-in light/dark theme support
- 🔌 **Highly Customizable** — Custom render slots, custom attributes, custom code block renderers
- 🎭 **Plugin System** — remark and rehype plugin extensions
- 🔒 **Secure** — Optional HTML sanitization to prevent XSS attacks

Starting from `v2.0.0`, `vue-element-plus-x` no longer bundles `Typewriter` / `XMarkdown` / `XMarkdownAsync`. Install `x-markdown-vue` separately.

- NPM: [x-markdown-vue](https://www.npmjs.com/package/x-markdown-vue)
- GitHub: [element-plus-x/x-markdown](https://github.com/element-plus-x/x-markdown)
- Live Demo: [x-markdown.netlify.app](https://x-markdown.netlify.app/)

## Installation

```bash
# pnpm (recommended)
pnpm add x-markdown-vue

# npm
npm install x-markdown-vue

# yarn
yarn add x-markdown-vue
```

### Optional Dependencies

`x-markdown-vue` uses optional peer dependencies for extra features:

```bash
# Syntax highlighting (Shiki)
pnpm add shiki shiki-stream

# Mermaid diagrams
pnpm add mermaid

# LaTeX math formulas (also requires importing the CSS)
pnpm add katex
```

::: tip
If `shiki` / `shiki-stream` are not installed, code blocks will fall back to plain text rendering.
:::

## Code Examples

### Basic Usage

<demo src="./demos/basic.vue"></demo>

### Streaming Animation

<demo src="./demos/streaming.vue"></demo>

### Dark Mode

<demo src="./demos/dark-mode.vue"></demo>

### Code Block Configuration

<demo src="./demos/code-block-config.vue"></demo>

### Sticky Code Header with BubbleList

Place `MarkdownRenderer` inside BubbleList's `#content` slot so BubbleList becomes the scroll container. When the list is scrolled, the code block header sticks to the **top of the list's visible area** — never occluded by the page navbar.

<demo src="./demos/bubble-list-sticky.vue"></demo>

### LaTeX Math Formulas

Install `katex` and import its CSS:

```ts
import 'katex/dist/katex.min.css';
```

<demo src="./demos/latex.vue"></demo>

### Mermaid Diagrams

Install `mermaid` first: `pnpm add mermaid`

<demo src="./demos/mermaid.vue"></demo>

### Custom Code Block Actions

Pass a `code-block-actions` array to add custom buttons to code block headers. Use the `show` callback to conditionally display buttons per language.

`onClick` receives a `CodeBlockSlotProps` object:

| Property         | Type                     | Description       |
| ---------------- | ------------------------ | ----------------- |
| `language`       | `string`                 | Code language     |
| `code`           | `string`                 | Code content      |
| `copy`           | `(text: string) => void` | Copy function     |
| `copied`         | `boolean`                | Whether copied    |
| `collapsed`      | `boolean`                | Whether collapsed |
| `toggleCollapse` | `() => void`             | Toggle collapse   |

<demo src="./demos/code-block-actions.vue"></demo>

### Custom Mermaid Actions

Pass a `mermaid-actions` array to add custom buttons to the Mermaid diagram toolbar.

`onClick` receives a `MermaidSlotProps` object:

| Property         | Type                  | Description                      |
| ---------------- | --------------------- | -------------------------------- |
| `showSourceCode` | `boolean`             | Whether showing source code view |
| `svg`            | `string`              | Rendered SVG string              |
| `rawContent`     | `string`              | Raw Mermaid source code          |
| `isLoading`      | `boolean`             | Whether currently rendering      |
| `zoomIn`         | `() => void`          | Zoom in                          |
| `zoomOut`        | `() => void`          | Zoom out                         |
| `reset`          | `() => void`          | Reset zoom                       |
| `fullscreen`     | `() => void`          | Fullscreen                       |
| `toggleCode`     | `() => void`          | Toggle source/diagram view       |
| `copyCode`       | `() => Promise<void>` | Copy source code                 |
| `download`       | `() => void`          | Download SVG                     |

<demo src="./demos/mermaid-actions.vue"></demo>

### Custom Code Block Renderer

<demo src="./demos/code-x-render.vue"></demo>

### Custom Attributes

<demo src="./demos/custom-attrs.vue"></demo>

### Custom Slots

Supported slot names:

| Slot                                             | Description     |
| ------------------------------------------------ | --------------- |
| `heading` / `h1` ~ `h6`                          | Headings        |
| `code` / `inline-code` / `block-code`            | Code            |
| `blockquote`                                     | Blockquote      |
| `list` / `ul` / `ol` / `li` / `list-item`        | Lists           |
| `table` / `thead` / `tbody` / `tr` / `td` / `th` | Tables          |
| `a`                                              | Links           |
| `img`                                            | Images          |
| `p` / `strong` / `em`                            | Inline elements |
| Any standard HTML tag name                       | —               |

<demo src="./demos/custom-slots.vue"></demo>

### Custom Table with el-table

Use the `#table` slot to replace all GFM tables in Markdown with `el-table`. The hast `node` passed to the slot contains the full table structure — a helper extracts columns and rows, then feeds them to `el-table`.

<demo src="./demos/custom-table.vue"></demo>

### Custom Code Block Components (el-table & my-echarts)

Define your own "language" tags via `code-x-render`. Write JSON inside a fenced code block, set the language to `el-table` or `my-echarts`, and the renderer maps each block to a real Vue component.

- **`el-table`** — parses JSON `{ columns, rows }` and renders as an Element Plus table
- **`my-echarts`** — parses an ECharts `option` JSON and renders as an interactive chart

<demo src="./demos/custom-code-components.vue"></demo>

### Plugin System

Extend the parsing pipeline with remark/rehype plugins:

```ts
import remarkEmoji from 'remark-emoji';
import rehypeSlug from 'rehype-slug';

const remarkPlugins = [remarkEmoji];
const rehypePlugins = [rehypeSlug];
```

```vue
<MarkdownRenderer
  :markdown="content"
  :remark-plugins="remarkPlugins"
  :rehype-plugins="rehypePlugins"
/>
```

### Security

Enable `sanitize` to strip unsafe HTML before rendering, preventing XSS:

```vue
<MarkdownRenderer
  :markdown="content"
  :sanitize="true"
  :sanitize-options="{ allowedTags: ['b', 'i', 'em', 'strong', 'a'] }"
/>
```

### Streaming Custom Code Blocks (with Skeleton Placeholder)

A real-world AI streaming scenario: while the JSON is being assembled, show an `el-skeleton` placeholder; once the data becomes parseable, swap to the real `el-table` / `el-form` / `my-echarts` component.

<demo src="./demos/custom-streaming-blocks.vue"></demo>

## API

### Props

| Prop                       | Type                           | Default                             | Description                               |
| -------------------------- | ------------------------------ | ----------------------------------- | ----------------------------------------- |
| `markdown`                 | `string`                       | `''`                                | Markdown text content                     |
| `allow-html`               | `boolean`                      | `false`                             | Allow raw HTML in content                 |
| `enable-latex`             | `boolean`                      | `true`                              | Enable LaTeX math rendering               |
| `enable-animate`           | `boolean`                      | `false`                             | Enable streaming animation                |
| `enable-breaks`            | `boolean`                      | `true`                              | Convert single newlines to `<br>`         |
| `enable-gfm`               | `boolean`                      | `true`                              | Enable GitHub Flavored Markdown           |
| `enable-shiki`             | `boolean`                      | `true`                              | Enable Shiki syntax highlighting          |
| `enable-mermaid`           | `boolean`                      | `true`                              | Enable Mermaid diagram rendering          |
| `is-dark`                  | `boolean`                      | `false`                             | Dark mode                                 |
| `shiki-theme`              | `[BuiltinTheme, BuiltinTheme]` | `['vitesse-light', 'vitesse-dark']` | Shiki light/dark themes                   |
| `show-code-block-header`   | `boolean`                      | `true`                              | Show code block header bar                |
| `sticky-code-block-header` | `boolean`                      | `false`                             | Sticky code block header                  |
| `code-max-height`          | `string`                       | `undefined`                         | Max height of code blocks, e.g. `'300px'` |
| `code-block-actions`       | `CodeBlockAction[]`            | `[]`                                | Custom code block action buttons          |
| `mermaid-actions`          | `MermaidAction[]`              | `[]`                                | Custom Mermaid action buttons             |
| `mermaid-config`           | `object`                       | `{}`                                | Mermaid initialization config             |
| `code-x-render`            | `object`                       | `{}`                                | Custom code block render functions        |
| `custom-attrs`             | `CustomAttrs`                  | `{}`                                | Custom element attributes                 |
| `remark-plugins`           | `PluggableList`                | `[]`                                | remark plugins (run after built-ins)      |
| `remark-plugins-ahead`     | `PluggableList`                | `[]`                                | remark plugins (run before built-ins)     |
| `rehype-plugins`           | `PluggableList`                | `[]`                                | rehype plugins (run after built-ins)      |
| `rehype-plugins-ahead`     | `PluggableList`                | `[]`                                | rehype plugins (run before built-ins)     |
| `rehype-options`           | `object`                       | `{}`                                | rehype processor options                  |
| `sanitize`                 | `boolean`                      | `false`                             | Enable HTML sanitization (XSS prevention) |
| `sanitize-options`         | `SanitizeOptions`              | `{}`                                | Sanitization options                      |

### CodeBlockAction Type

```ts
interface CodeBlockAction {
  key: string;
  icon?: Component | FunctionalComponent | string;
  title?: string;
  onClick?: (props: CodeBlockSlotProps) => void;
  disabled?: boolean;
  class?: string;
  style?: Record<string, string>;
  show?: (props: CodeBlockSlotProps) => boolean;
}
```

### MermaidAction Type

```ts
interface MermaidAction {
  key: string;
  icon?: Component | FunctionalComponent | string;
  title?: string;
  onClick?: (props: MermaidSlotProps) => void;
  disabled?: boolean;
  class?: string;
  style?: Record<string, string>;
  show?: (props: MermaidSlotProps) => boolean;
}
```
