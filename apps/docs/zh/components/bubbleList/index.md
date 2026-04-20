---
title: 'BubbleList'
---

## 介绍

`BubbleList` 基于 `Bubble` 组件，用于展示一组对话气泡列表。内置虚拟滚动（`virtua/vue`）、自动追底、滚动状态机、未读计数、双向分页加载、回底按钮和混合节点渲染，开箱即用，按需配置。

## 代码演示

### 基础使用

<demo src="./demos/list.vue"></demo>

### 滚动控制方法

<demo src="./demos/scroll-to.vue"></demo>

### 自动触底控制

<demo src="./demos/auto-scroll.vue"></demo>

### 返回底部按钮

<demo src="./demos/back-button.vue"></demo>

### 流式跟随

<demo src="./demos/streaming-follow.vue"></demo>

### 双向分页加载

<demo src="./demos/bidirectional-loading.vue"></demo>

### 混合节点

<demo src="./demos/mixed-nodes.vue"></demo>

### 插槽自定义

<demo src="./demos/customized.vue"></demo>

### 自定义主题

通过 `ConfigProvider.themeOverrides` 覆盖 `BubbleList` 的主题变量。完整变量表与可复制模板见：

- [主题变量总表](/zh/guide/theme-tokens#bubblelist)
- [/theme-overrides.template.ts](/theme-overrides.template.ts)

<demo src="./demos/theme-overrides.vue"></demo>

### 与 x-markdown-vue 结合使用

从 `v2.0.0` 开始，组件库不再内置 `XMarkdown` / `XMarkdownAsync`。如需 Markdown 渲染，请使用独立包 [x-markdown-vue](https://www.npmjs.com/package/x-markdown-vue)，或查看专属文档：[XMarkdown](/zh/components/xMarkdown/)。

#### 安装

```bash
pnpm add x-markdown-vue
pnpm add katex
pnpm add shiki shiki-stream
```

::: tip
如果需要代码块语法高亮功能，请安装 `shiki` 和 `shiki-stream`。否则控制台可能会报错：`Streaming highlighter initialization failed: Error: Failed to load shiki-stream module`
:::

#### 基础用法

<demo src="./demos/with-markdown.vue"></demo>

#### 雾化效果

<demo src="./demos/fog-effect.vue"></demo>

## 属性

| 属性名                    | 类型                 | 是否必填 | 默认值                                         | 说明                                                                                                                                      |
| ------------------------- | -------------------- | -------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `list`                    | `Array`              | 是       | -                                              | 消息数组，每个对象透传给内置 `Bubble` 组件，支持所有 `Bubble` 属性。                                                                      |
| `autoScroll`              | `Boolean`            | 否       | `true`                                         | 追加新消息时是否自动滚到底部。关闭后新消息累计未读计数。                                                                                  |
| `maxHeight`               | `String`             | 否       | -                                              | 列表最大高度，默认撑满父容器。                                                                                                            |
| `virtual`                 | `Boolean`            | 否       | `true`                                         | 是否开启虚拟滚动（基于 `virtua/vue`），大数据量场景推荐保持开启。                                                                         |
| `smoothScroll`            | `Boolean`            | 否       | `false`                                        | 编程式滚动是否默认使用平滑动画。                                                                                                          |
| `itemKey`                 | `string \| Function` | 否       | `'key'`                                        | 节点唯一标识，可传字段名或 `(item, index) => key` 函数。                                                                                  |
| `itemType`                | `string \| Function` | 否       | -                                              | 非气泡节点类型标识，命中后走 `#item` 插槽渲染；可传字段名或函数。                                                                         |
| `showBackButton`          | `Boolean`            | 否       | `true`                                         | 是否显示回底按钮。                                                                                                                        |
| `backButtonThreshold`     | `Number`             | 否       | `80`                                           | 触发显示回底按钮的阈值（距底部 px）。                                                                                                     |
| `backButtonPosition`      | `Object`             | 否       | `{ bottom: '20px', left: 'calc(50% - 19px)' }` | 回底按钮的 CSS 定位，可配置 `top / right / bottom / left / transform`。                                                                   |
| `backButtonSmoothScroll`  | `Boolean`            | 否       | `true`                                         | 点击回底按钮时是否平滑滚动。                                                                                                              |
| `alwaysShowScrollbar`     | `Boolean`            | 否       | `false`                                        | 是否一直显示滚动条。                                                                                                                      |
| `btnLoading`              | `Boolean`            | 否       | `true`                                         | 是否在内置回底按钮上显示 loading 状态。                                                                                                   |
| `btnColor`                | `String`             | 否       | `'#409EFF'`                                    | 内置回底按钮颜色。                                                                                                                        |
| `btnIconSize`             | `Number`             | 否       | `24`                                           | 内置回底按钮图标大小（px）。                                                                                                              |
| `topStatus`               | `{ type, text? }`    | 否       | -                                              | 顶部边界状态，`type` 可选 `idle / loading / no-more / error`。                                                                            |
| `bottomStatus`            | `{ type, text? }`    | 否       | -                                              | 底部边界状态，同 `topStatus`。                                                                                                            |
| `loadMoreTopThreshold`    | `Number`             | 否       | `100`                                          | 触发 `@load-more-top` 的距顶阈值（px）。                                                                                                  |
| `loadMoreBottomThreshold` | `Number`             | 否       | `100`                                          | 触发 `@load-more-bottom` 的距底阈值（px）。                                                                                               |
| `shouldFollowContent`     | `Function`           | 否       | -                                              | 自定义内容跟随策略，返回 `true` 则触底，`false` 则累计未读。回调参数含 `reason / item / index / scrollState / unreadCount / autoScroll`。 |

## 事件

| 事件名                 | 参数                                                          | 说明                                                 |
| ---------------------- | ------------------------------------------------------------- | ---------------------------------------------------- |
| `@load-more-top`       | -                                                             | 向上滚到顶部达到阈值时触发，可在此请求加载历史消息。 |
| `@load-more-bottom`    | -                                                             | 向下滚到底部达到阈值时触发，可在此请求加载更多消息。 |
| `@scroll-state-change` | `(state: 'AT_BOTTOM' \| 'SCROLLED_UP' \| 'HAS_NEW_MESSAGES')` | 滚动状态变化时触发。                                 |
| `@unread-count-change` | `(count: number)`                                             | 未读计数变化时触发。                                 |

## Ref 实例方法

| 方法 / 属性              | 签名                                        | 说明                                                                      |
| ------------------------ | ------------------------------------------- | ------------------------------------------------------------------------- |
| `scrollToTop`            | `(smooth?: boolean) => void`                | 滚动到顶部，`smooth` 控制是否平滑动画（默认由 `smoothScroll` 属性决定）。 |
| `scrollToBottom`         | `(smooth?: boolean) => void`                | 滚动到底部，同时清零未读计数并重置状态机。                                |
| `scrollToBubble`         | `(index: number, smooth?: boolean) => void` | 滚动到指定索引的消息。                                                    |
| `loadMoreTopComplete`    | `() => void`                                | 顶部数据加载完成后调用，组件自动修复滚动位置。                            |
| `loadMoreBottomComplete` | `() => void`                                | 底部数据加载完成后调用。                                                  |
| `currentScrollState`     | `BubbleListScrollState`                     | 当前滚动状态：`AT_BOTTOM / SCROLLED_UP / HAS_NEW_MESSAGES`。              |
| `currentUnreadCount`     | `number`                                    | 当前未读消息数量。                                                        |

## 插槽

| 插槽名          | 上下文类型                    | 说明                                                                                                                   |
| --------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `#avatar`       | `BubbleListItemContext`       | 自定义气泡头像。                                                                                                       |
| `#header`       | `BubbleListItemContext`       | 自定义气泡顶部区域。                                                                                                   |
| `#content`      | `BubbleListItemContext`       | 自定义气泡内容区域。                                                                                                   |
| `#footer`       | `BubbleListItemContext`       | 自定义气泡底部区域。                                                                                                   |
| `#loading`      | `BubbleListItemContext`       | 自定义气泡加载状态。                                                                                                   |
| `#backToBottom` | `BubbleListBackButtonContext` | 自定义回底按钮，上下文含 `unreadCount / scrollState / label / autoScroll / virtualEnabled / scrollToBottom(smooth?)`。 |
| `#topStatus`    | `BubbleListBoundaryContext`   | 自定义顶部边界状态区，上下文含 `status / position / scrollState / unreadCount / autoScroll`。                          |
| `#bottomStatus` | `BubbleListBoundaryContext`   | 自定义底部边界状态区，同 `#topStatus`。                                                                                |
| `#item`         | `BubbleListItemContext`       | 非气泡类型节点的自定义渲染，由 `itemType` 命中后触发。                                                                 |
