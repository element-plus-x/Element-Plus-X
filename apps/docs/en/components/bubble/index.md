---
title: Bubble
---

::: warning
`Version 1.1.6` inherits the typewriter's fog effect. Please update to try it out.

🐵 Last updated: `2025-04-13`
:::

## Introduction

`Bubble` is a chat bubble component, commonly used in chat scenarios. It can display conversation content, supports custom avatars, headers, content, footers, and has typing effects and loading state display. The component has built-in `Typewriter` component that can achieve text typing animation effects.

## Code Examples

### Basic Usage

<demo src="./demos/content.vue"></demo>

### Avatar and Placement

<demo src="./demos/avatar-and-placement.vue"></demo>

### Header and Footer

<demo src="./demos/header-and-footer.vue"></demo>

### Loading State

<demo src="./demos/loading.vue"></demo>

### Typewriter Configuration

<demo src="./demos/typing.vue"></demo>

### Enable Markdown Rendering

<demo src="./demos/is-markdown.vue"></demo>

### Inherit Typewriter Charts and MD Styles

<demo src="./demos/cssAndMermaid.vue"></demo>

### Fog Effect

<demo src="./demos/is-fog.vue"></demo>

### Custom Content

<demo src="./demos/content-customize.vue"></demo>

### Variants and Shapes

<demo src="./demos/variant-and-shape.vue"></demo>

### Control Typing

<demo src="./demos/customized.vue"></demo>

## Properties

| <div style="width: 130px">Property Name</div> |       Type        | Default  | Description                                                                                                                                                                                 |
| :-------------------------------------------- | :---------------: | :------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `content`                                     |      String       |    ''    | Text content to display inside the bubble                                                                                                                                                   |
| `placement`                                   |      String       | 'start'  | Bubble position, options are `'start'` or `'end'`, representing left and right sides respectively.                                                                                          |
| `avatar`                                      |      String       |    ''    | Image URL for the bubble avatar                                                                                                                                                             |
| `loading`                                     |      Boolean      |  false   | Whether to show loading state. When `true`, loading state will be displayed inside the bubble.                                                                                              |
| `shape`                                       |      String       |   null   | Bubble shape, options are `'round'` (rounded corners) or `'corner'` (angular).                                                                                                              |
| `variant`                                     |      String       | 'filled' | Bubble style variant, options are `'filled'` (filled), `'borderless'` (no border), `'outlined'` (outline), `'shadow'` (shadow).                                                             |
| `noStyle`                                     |      Boolean      |  false   | Whether to remove styles, when `true`, removes built-in `padding` and `background color` from the bubble                                                                                    |
| `isMarkdown`                                  |      Boolean      |  false   | Whether to process `content` as Markdown format.                                                                                                                                            |
| `typing`                                      | Boolean \| Object |  false   | Whether to enable typing effect. If object, can set `step` (characters rendered each time) and `suffix` (typing cursor suffix content). `interval` represents typing interval time in `ms`. |
| `maxWidth`                                    |      String       | '500px'  | Maximum width of bubble content.                                                                                                                                                            |
| `avatar-size`                                 |      String       |    ''    | Set avatar placeholder size                                                                                                                                                                 |
| `avatar-gap`                                  |      String       |  '12px'  | Set `gap` value between avatar and bubble                                                                                                                                                   |
| `avatar-shape`                                |      String       |    ''    | Avatar shape, options are `'circle'` (circular) or `'square'` (square).                                                                                                                     |
| `avatar-icon`                                 |      String       |    ''    | Avatar icon, priority higher than `avatar`, supports passing icon names like `'user'`.                                                                                                      |
| `avatar-src-set`                              |      String       |    ''    | Set avatar image srcset attribute                                                                                                                                                           |
| `avatar-alt`                                  |      String       |    ''    | Set avatar image alt attribute                                                                                                                                                              |
| `avatar-fit`                                  |      String       | 'cover'  | Set avatar image `object-fit` attribute, options: `'cover'`, `'contain'`, `'fill'`, `'none'`, `'scale-down'`                                                                                |

## Events

| Event Name     | Parameters     | Type     | Description                            |
| -------------- | -------------- | -------- | -------------------------------------- |
| `@start`       | `ref` instance | Function | Triggered when typing effect starts    |
| `@finish`      | `ref` instance | Function | Triggered when typing effect completes |
| `@writing`     | `ref` instance | Function | Triggered in real-time during typing   |
| `@avatarError` | `ref` instance | Function | Triggered when avatar loading fails    |

## Ref Instance Methods

| Property Name     | Type     | Description                               |
| ----------------- | -------- | ----------------------------------------- |
| `interrupt`       | Function | Interrupt typing.                         |
| `continue`        | Function | Continue unfinished typing.               |
| `restart`         | Function | Restart typing.                           |
| `destroy`         | Function | Actively destroy Bubble component.        |
| `renderedContent` | String   | Get rendered content of typing component. |
| `isTyping`        | Boolean  | Whether currently typing.                 |
| `progress`        | Number   | Typing progress, range 0 - 100.           |

## Slots

| Slot Name  | Parameters | Type | Description                                 |
| ---------- | ---------- | ---- | ------------------------------------------- |
| `#avatar`  | -          | Slot | Custom avatar display content               |
| `#header`  | -          | Slot | Custom bubble top display content           |
| `#content` | -          | Slot | Custom bubble display content               |
| `#loading` | -          | Slot | Custom bubble loading state display content |
| `#footer`  | -          | Slot | Custom bubble bottom display content        |

## Features

1. **Layout Direction** - Supports left alignment (`start`) and right alignment (`end`)
2. **Content Types** - Supports plain text, Markdown, custom slot content
3. **Loading State** - Built-in loading animation, supports custom loading content
4. **Visual Effects** - Provides multiple shapes and variants (rounded/angular corners, filled/outlined/shadow, etc.)
5. **Typing Animation** - Supports progressive text output effects
6. **Flexible Slots** - Provides avatar, header, content, footer, loading state and other slots
