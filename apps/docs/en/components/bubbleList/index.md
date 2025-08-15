---
title: BubbleList
---


::: warning
`Added in version 1.1.6` Inherits the **fog effect** from the typewriter. Added **scroll to bottom button, similar to Doubao🔥**. Added **scrollbar on mouse hover** to enhance interaction experience. Please update and try it out.

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

### Scroll Complete Event

::: warning
This is only needed in very special cases. It is not suitable for streaming output, as it will quickly trigger the typing end event.
:::

<demo src="./demos/on-complete.vue"></demo>

## Props

| Name                  | Type                                           | <div style="width: 70px">Required</div> | Default                                        | Description                                                                                                                                                                                                                         |
| --------------------- | ---------------------------------------------- | --------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `list`                | Array                                          | Yes                                     | None                                           | Array containing bubble information. Each element is an object with `content`, `placement`, `loading`, `shape`, `variant`, `isMarkdown`, `typing`, and other `Bubble` properties to configure the display and style of each bubble. |
| `maxHeight`           | String                                         | No                                      | '500px'                                        | Maximum height of the bubble list container. A vertical scrollbar appears if exceeded.                                                                                                                                              |
| `alwaysShowScrollbar` | Boolean                                        | No                                      | false                                          | Whether to always show the scrollbar. Default is `false`.                                                                                                                                                                           |
| `backButtonThreshold` | Number                                         | No                                      | 80                                             | Scrollbar display threshold. When the scrollbar is less than this distance from the bottom, the scrollbar will be shown.                                                                                                            |
| `showBackButton`      | Boolean                                        | No                                      | true                                           | Whether to show the back to top button. Default is `true`.                                                                                                                                                                          |
| `backButtonPosition`  | `{ bottom: '20px', left: 'calc(50% - 19px)' }` | No                                      | `{ bottom: '20px', left: 'calc(50% - 19px)' }` | Position of the back to top button. Default is centered at the bottom.                                                                                                                                                              |
| `btnLoading`          | Boolean                                        | No                                      | true                                           | Whether to enable loading state for the back to top button. Default is `true`.                                                                                                                                                      |
| `btnColor`            | String                                         | No                                      | '#409EFF'                                      | Color of the back to top button. Default is `'#409EFF'`.                                                                                                                                                                            |
| `btnIconSize`         | Number                                         | No                                      | 24                                             | Icon size of the back to top button. Default is 24px.                                                                                                                                                                               |
| `triggerIndices`      | 'only-last' \| 'all' \| number[]               | No                                      | 'only-last'                                    | Index array of bubbles that trigger the `complete` event. Default is `'only-last'`.                                                                                                                                                 |

## Events

| Event Name  | Parameter         | Type     | Description                                                |
| ----------- | ----------------- | -------- | ---------------------------------------------------------- |
| `@complete` | (instance, index) | Function | Triggered when the typing effect of a bubble is completed. |

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
4. **Typing Effect** - Supports typing effect
5. **Multiple Styles** - Supports various styles such as round, square, etc.
