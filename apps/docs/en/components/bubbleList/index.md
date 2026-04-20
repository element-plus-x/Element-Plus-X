---
title: 'BubbleList'
---

## Introduction

`BubbleList` is built on the `Bubble` component and is used to display a list of chat bubbles. It has built-in virtual scrolling (`virtua/vue`), auto-follow-to-bottom, scroll state machine, unread count, bidirectional pagination loading, back-to-bottom button, and mixed node rendering — all out of the box, configure as needed.

## Code Examples

### Basic Usage

<demo src="./demos/list.vue"></demo>

### Scroll Control Methods

<demo src="./demos/scroll-to.vue"></demo>

### Auto Scroll Control

<demo src="./demos/auto-scroll.vue"></demo>

### Back to Bottom Button

<demo src="./demos/back-button.vue"></demo>

### Streaming Follow

<demo src="./demos/streaming-follow.vue"></demo>

### Bidirectional Pagination Loading

<demo src="./demos/bidirectional-loading.vue"></demo>

### Mixed Nodes

<demo src="./demos/mixed-nodes.vue"></demo>

### Slot Customization

<demo src="./demos/customized.vue"></demo>

### Theme Overrides

Override `BubbleList` theme variables via `ConfigProvider.themeOverrides`. See the full variable list and copyable template:

- [Theme Tokens](/en/guide/theme-tokens#bubblelist)
- [/theme-overrides.template.ts](/theme-overrides.template.ts)

<demo src="./demos/theme-overrides.vue"></demo>

### Using with x-markdown-vue

Starting from `v2.0.0`, the component library no longer bundles `XMarkdown` / `XMarkdownAsync`. For Markdown rendering, use the standalone package [x-markdown-vue](https://www.npmjs.com/package/x-markdown-vue), or see the dedicated docs: [XMarkdown](/en/components/xMarkdown/).

#### Installation

```bash
pnpm add x-markdown-vue
pnpm add katex
pnpm add shiki shiki-stream
```

::: tip
If you need code block syntax highlighting, please install `shiki` and `shiki-stream`. Otherwise, you may see this error in the console: `Streaming highlighter initialization failed: Error: Failed to load shiki-stream module`
:::

#### Basic Usage

<demo src="./demos/with-markdown.vue"></demo>

#### Fog Effect

By setting the `enable-animate` property, you can achieve a typewriter fog effect:

```vue
<script setup>
import { ref } from 'vue';
import { BubbleList } from 'vue-element-plus-x';
import { MarkdownRenderer } from 'x-markdown-vue';
import 'x-markdown-vue/style';

const list = ref([
  { content: '', placement: 'start' } // Streaming content will be updated dynamically
]);
</script>

<template>
  <BubbleList :list="list">
    <template #content="{ item }">
      <MarkdownRenderer :markdown="item.content" :enable-animate="true" />
    </template>
  </BubbleList>
</template>
```

## Props

| Name                      | Type                 | Required | Default                                        | Description                                                                                                                                                                                |
| ------------------------- | -------------------- | -------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `list`                    | `Array`              | Yes      | -                                              | Message array. Each object is passed through to the built-in `Bubble` component and supports all `Bubble` props.                                                                           |
| `autoScroll`              | `Boolean`            | No       | `true`                                         | Whether to auto-scroll to the bottom when new messages are added. When disabled, new messages accumulate as unread count.                                                                  |
| `maxHeight`               | `String`             | No       | -                                              | Maximum list height. Defaults to filling the parent container.                                                                                                                             |
| `virtual`                 | `Boolean`            | No       | `true`                                         | Whether to enable virtual scrolling (based on `virtua/vue`). Recommended to keep on for large datasets.                                                                                    |
| `smoothScroll`            | `Boolean`            | No       | `false`                                        | Whether programmatic scrolling uses smooth animation by default.                                                                                                                           |
| `itemKey`                 | `string \| Function` | No       | `'key'`                                        | Unique node identifier. Can be a field name or `(item, index) => key` function.                                                                                                            |
| `itemType`                | `string \| Function` | No       | -                                              | Non-bubble node type identifier. When matched, renders via the `#item` slot. Can be a field name or function.                                                                              |
| `showBackButton`          | `Boolean`            | No       | `true`                                         | Whether to show the back-to-bottom button.                                                                                                                                                 |
| `backButtonThreshold`     | `Number`             | No       | `80`                                           | Threshold (px from bottom) to trigger showing the back-to-bottom button.                                                                                                                   |
| `backButtonPosition`      | `Object`             | No       | `{ bottom: '20px', left: 'calc(50% - 19px)' }` | CSS positioning of the back-to-bottom button. Supports `top / right / bottom / left / transform`.                                                                                          |
| `backButtonSmoothScroll`  | `Boolean`            | No       | `true`                                         | Whether clicking the back-to-bottom button uses smooth scrolling.                                                                                                                          |
| `alwaysShowScrollbar`     | `Boolean`            | No       | `false`                                        | Whether to always show the scrollbar.                                                                                                                                                      |
| `btnLoading`              | `Boolean`            | No       | `true`                                         | Whether to show loading state on the built-in back-to-bottom button.                                                                                                                       |
| `btnColor`                | `String`             | No       | `'#409EFF'`                                    | Color of the built-in back-to-bottom button.                                                                                                                                               |
| `btnIconSize`             | `Number`             | No       | `24`                                           | Icon size (px) of the built-in back-to-bottom button.                                                                                                                                      |
| `topStatus`               | `{ type, text? }`    | No       | -                                              | Top boundary status. `type` can be `idle / loading / no-more / error`.                                                                                                                     |
| `bottomStatus`            | `{ type, text? }`    | No       | -                                              | Bottom boundary status, same as `topStatus`.                                                                                                                                               |
| `loadMoreTopThreshold`    | `Number`             | No       | `100`                                          | Distance from top (px) to trigger `@load-more-top`.                                                                                                                                        |
| `loadMoreBottomThreshold` | `Number`             | No       | `100`                                          | Distance from bottom (px) to trigger `@load-more-bottom`.                                                                                                                                  |
| `shouldFollowContent`     | `Function`           | No       | -                                              | Custom content follow strategy. Return `true` to scroll to bottom, `false` to accumulate unread. Callback params include `reason / item / index / scrollState / unreadCount / autoScroll`. |

## Events

| Event Name             | Parameters                                                    | Description                                                           |
| ---------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------- |
| `@load-more-top`       | -                                                             | Triggered when scrolling up reaches the threshold. Load history here. |
| `@load-more-bottom`    | -                                                             | Triggered when scrolling down reaches the threshold. Load more here.  |
| `@scroll-state-change` | `(state: 'AT_BOTTOM' \| 'SCROLLED_UP' \| 'HAS_NEW_MESSAGES')` | Triggered when scroll state changes.                                  |
| `@unread-count-change` | `(count: number)`                                             | Triggered when unread count changes.                                  |

## Ref Instance Methods

| Method / Property        | Signature                                   | Description                                                                           |
| ------------------------ | ------------------------------------------- | ------------------------------------------------------------------------------------- |
| `scrollToTop`            | `(smooth?: boolean) => void`                | Scroll to the top. `smooth` controls animation (defaults to the `smoothScroll` prop). |
| `scrollToBottom`         | `(smooth?: boolean) => void`                | Scroll to the bottom, resets unread count and state machine.                          |
| `scrollToBubble`         | `(index: number, smooth?: boolean) => void` | Scroll to the message at the specified index.                                         |
| `loadMoreTopComplete`    | `() => void`                                | Call after top data finishes loading. The component auto-fixes scroll position.       |
| `loadMoreBottomComplete` | `() => void`                                | Call after bottom data finishes loading.                                              |
| `currentScrollState`     | `BubbleListScrollState`                     | Current scroll state: `AT_BOTTOM / SCROLLED_UP / HAS_NEW_MESSAGES`.                   |
| `currentUnreadCount`     | `number`                                    | Current unread message count.                                                         |

## Slots

| Slot Name       | Context Type                  | Description                                                                                                                                 |
| --------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `#avatar`       | `BubbleListItemContext`       | Custom bubble avatar.                                                                                                                       |
| `#header`       | `BubbleListItemContext`       | Custom bubble header area.                                                                                                                  |
| `#content`      | `BubbleListItemContext`       | Custom bubble content area.                                                                                                                 |
| `#footer`       | `BubbleListItemContext`       | Custom bubble footer area.                                                                                                                  |
| `#loading`      | `BubbleListItemContext`       | Custom bubble loading state.                                                                                                                |
| `#backToBottom` | `BubbleListBackButtonContext` | Custom back-to-bottom button. Context includes `unreadCount / scrollState / label / autoScroll / virtualEnabled / scrollToBottom(smooth?)`. |
| `#topStatus`    | `BubbleListBoundaryContext`   | Custom top boundary status area. Context includes `status / position / scrollState / unreadCount / autoScroll`.                             |
| `#bottomStatus` | `BubbleListBoundaryContext`   | Custom bottom boundary status area, same as `#topStatus`.                                                                                   |
| `#item`         | `BubbleListItemContext`       | Custom rendering for non-bubble type nodes, triggered when matched by `itemType`.                                                           |

---

## title: BubbleList

::: warning
`Added in version 1.1.6` Added **scroll to bottom button, similar to Doubao🔥**. Added **scrollbar on mouse hover** to enhance interaction experience. Please update and try it out.

🐵 This warm tip was last updated: `2025-04-13`
:::

::: tip
Note: The new version's auto-scroll will automatically scroll when the `list` length changes. However, after scrolling up, you need to manually call the `scrollToBottom` method to re-enable auto-scroll. Or, when the scrollbar reaches the bottom, auto-scroll will be triggered again.

The logic is the same as before, so you can upgrade without any worries.
:::

## Introduction

`BubbleList` relies on the `Bubble` component and is used to display a list of chat bubbles. This component supports setting the `maximum list height` and has an `auto-scroll` feature. It also provides various `scroll control` methods that users can easily call. It is powerful and requires no mental burden for developers.

## Code Examples

### Basic Usage

<demo src="./demos/list.vue"></demo>

### Customized List

<demo src="./demos/customized.vue"></demo>

### Auto Scroll & Scroll to Specific Position

<demo src="./demos/scroll-to.vue"></demo>

### Back to Top Button

<demo src="./demos/back-button.vue"></demo>

### Theme Overrides (themeOverrides)

Override `BubbleList` theme tokens via `ConfigProvider.themeOverrides`. See the full token list and template:

- [Theme Tokens](/en/guide/theme-tokens#bubblelist)
- [/theme-overrides.template.ts](/theme-overrides.template.ts)

<demo src="./demos/theme-overrides.vue"></demo>

### Using with x-markdown-vue

Starting from `v2.0.0`, the component library no longer bundles `XMarkdown` / `XMarkdownAsync`. For Markdown rendering, use [x-markdown-vue](https://www.npmjs.com/package/x-markdown-vue) or see the dedicated page: [XMarkdown](/en/components/xMarkdown/).

#### Installation

```bash
pnpm add x-markdown-vue
pnpm add katex
pnpm add shiki shiki-stream
```

::: tip
If you need code block syntax highlighting, please install `shiki` and `shiki-stream`. Otherwise, you may see this error in the console: `Streaming highlighter initialization failed: Error: Failed to load shiki-stream module`
:::

#### Basic Usage

<demo src="./demos/with-markdown.vue"></demo>

#### Fog Effect

<demo src="./demos/fog-effect.vue"></demo>

## Props

| Name                  | Type                                           | <div style="width: 70px">Required</div> | Default                                        | Description                                                                                                                                                                                                                                               |
| --------------------- | ---------------------------------------------- | --------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `list`                | Array                                          | Yes                                     | None                                           | Array containing bubble information. Each element is an object with `content`, `placement`, `loading`, `shape`, `variant`, and other `Bubble` properties to configure the display and style of each bubble. For Markdown, render via the `#content` slot. |
| `autoScroll`          | Boolean                                        | No                                      | true                                           | Whether to enable automatic scrolling.                                                                                                                                                                                                                    |
| `maxHeight`           | String                                         | No                                      | '-'                                            | Maximum height of the bubble list container.(By default, the height of the wrapper container is inherited)                                                                                                                                                |
| `alwaysShowScrollbar` | Boolean                                        | No                                      | false                                          | Whether to always show the scrollbar. Default is `false`.                                                                                                                                                                                                 |
| `backButtonThreshold` | Number                                         | No                                      | 80                                             | Back to bottom button display threshold. When the scrollbar is more than this distance from the bottom, the button will be shown.                                                                                                                         |
| `showBackButton`      | Boolean                                        | No                                      | true                                           | Whether to show the back to bottom button. Default is `true`.                                                                                                                                                                                             |
| `backButtonPosition`  | `{ bottom: '20px', left: 'calc(50% - 19px)' }` | No                                      | `{ bottom: '20px', left: 'calc(50% - 19px)' }` | Position of the back to bottom button. Default is centered at the bottom.                                                                                                                                                                                 |
| `btnLoading`          | Boolean                                        | No                                      | true                                           | Whether to enable loading state for the back to bottom button. Default is `true`.                                                                                                                                                                         |
| `btnColor`            | String                                         | No                                      | '#409EFF'                                      | Color of the back to bottom button. Default is `'#409EFF'`.                                                                                                                                                                                               |
| `btnIconSize`         | Number                                         | No                                      | 24                                             | Icon size of the back to bottom button. Default is 24px.                                                                                                                                                                                                  |

## Events

## Ref Instance Methods

| Name             | Type     | Description                           |
| ---------------- | -------- | ------------------------------------- |
| `scrollToTop`    | Function | Scroll to the top.                    |
| `scrollToBottom` | Function | Scroll to the bottom.                 |
| `scrollToBubble` | Function | Scroll to the specified bubble index. |

## Slots

| Slot Name  | Parameter | Type | Description                         |
| ---------- | --------- | ---- | ----------------------------------- |
| `#avatar`  | -         | Slot | Custom avatar display content       |
| `#header`  | -         | Slot | Custom bubble header content        |
| `#content` | -         | Slot | Custom bubble content               |
| `#loading` | -         | Slot | Custom bubble loading state content |
| `#footer`  | -         | Slot | Custom bubble footer content        |

## Features

1. **Smart Scrolling** - Automatically tracks the latest message position
2. **Deep Customization** - Full slot passthrough for bubble components
3. **Multiple Scrolling Methods** - Scroll to top, bottom, or specific position
4. **Multiple Styles** - Supports various styles such as round, square, etc.
