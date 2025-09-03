---
title: 'Sender'
---

::: warning
`1.1.6 版本` 新增

- 变体 **`上下结构`**
- 自定义底部 `#footer` 插槽
- 自定义指令 `弹框` 和 触发指令的 `回调事件`

🐵 此温馨提示更新时间：`2025-04-16`
:::

## 介绍

`Sender` 是用于聊天的输入框组件。具备丰富的交互功能和自定义特性。它支持语音输入、清空输入内容、多种提交方式，并且允许用户自定义头部、前缀和操作列表等内容。同时，组件提供了焦点控制、提交回调等功能，可满足多样化的输入场景需求。

## 代码演示

### 基础用法

<demo src="./demos/basic.vue"></demo>

### 提示语

<demo src="./demos/placeholder.vue"></demo>

### 双向绑定（未绑定，值不会变）

<demo src="./demos/v-model.vue"></demo>

### 提交按钮禁用状态

<demo src="./demos/submit-btn-disabled.vue"></demo>

### 自定义最大行数和最小行数

<demo src="./demos/autosize.vue"></demo>

### 输入框组件各种状态

<demo src="./demos/state.vue"></demo>

### 提交方式

<demo src="./demos/submit-type.vue"></demo>

### 语音识别

::: warning
浏览器内置语音识别 API，可以使用组件库内置的 [`useRecord`](https://element-plus-x.com/components/useRecord/) **hooks** 更方便内置语音识别集成和控制
:::

<demo src="./demos/allow-speech.vue"></demo>

### 变体-垂直样式

<demo src="./demos/variant.vue"></demo>

### 自定义操作列表

<demo src="./demos/action-list.vue"></demo>

### 自定义前缀

<demo src="./demos/prefix.vue"></demo>

### 自定义头部

<demo src="./demos/header.vue"></demo>

### 自定义底部

<demo src="./demos/footer.vue"></demo>

### 自定义输入框样式

<demo src="./demos/input-style.vue"></demo>

### 触发指令

<demo src="./demos/trigger.vue"></demo>

### 自定义指令弹框

<demo src="./demos/trigger-popover.vue"></demo>

### 输入框聚焦控制

<demo src="./demos/focus.vue"></demo>

### 黏贴文件

<demo src="./demos/pasteFile.vue"></demo>

## 属性

| 属性名                    | 类型                 | 是否必填 | 默认值                     | 说明                                                                                                                                                                                                                       |
| ------------------------- | -------------------- | -------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`                 | String               | 否       | ''                         | 输入框的绑定值，使用 `v-model` 进行双向绑定。                                                                                                                                                                              |
| `placeholder`             | String               | 否       | ''                         | 输入框的提示语文本。                                                                                                                                                                                                       |
| `auto-size`               | Object               | 否       | \{ minRows:1, maxRows:6 \} | 设置输入框的最小展示行数和最大展示行数。                                                                                                                                                                                   |
| `read-only`               | Boolean              | 否       | false                      | 输入框是否为只读状态。                                                                                                                                                                                                     |
| `disabled`                | Boolean              | 否       | false                      | 输入框是否为禁用状态。                                                                                                                                                                                                     |
| `submitBtnDisabled`       | Boolean \| undefined | 否       | undefined                  | 内置发送按钮禁用状态。(注意使用场景)                                                                                                                                                                                       |
| `loading`                 | Boolean              | 否       | false                      | 是否显示加载状态。为 `true` 时，输入框会显示加载动画。                                                                                                                                                                     |
| `clearable`               | Boolean              | 否       | false                      | 输入框是否可清空内容。展示默认清空按钮                                                                                                                                                                                     |
| `allowSpeech`             | Boolean              | 否       | false                      | 是否允许语音输入。默认展示内置语音识别按钮,内置浏览器内置语音识别 API                                                                                                                                                      |
| `submitType`              | String               | 否       | 'enter'                    | 提交方式，支持 `'shiftEnter'`（按 `Shift + Enter` 提交）、 `'cmdOrCtrlEnter'`（按 `Command + Enter` 或 `Ctrl + Enter` 提交）、 `'altEnter'`（按 `Alt + Enter` 提交）。                                                     |
| `headerAnimationTimer`    | Number               | 否       | 300                        | 输入框的自定义头部显示时长，单位为 `ms`。                                                                                                                                                                                  |
| `inputWidth`              | String               | 否       | '100%'                     | 输入框的宽度。                                                                                                                                                                                                             |
| `variant`                 | String               | 否       | 'default'                  | 输入框的变体类型，支持 `'default'`、`'updown'`。                                                                                                                                                                           |
| `showUpdown`              | Boolean              | 否       | true                       | 当变体为 `updown` 时，是否展示内置样式。                                                                                                                                                                                   |
| `inputStyle`              | Object               | 否       | \{}                        | 输入框的样式。                                                                                                                                                                                                             |
| `triggerStrings`          | string[]             | 否       | []                         | 触发指令的 `字符串数组`。                                                                                                                                                                                                  |
| `triggerPopoverVisible`   | Boolean              | 否       | false                      | 触发指令的 `弹框` 是否可见。需要使用 `v-model:triggerPopoverVisible` 进行控制。                                                                                                                                            |
| `triggerPopoverWidth`     | String               | 否       | 'fit-content'              | 触发指令的 `弹框` 的宽度。可使用百分比等css单位。                                                                                                                                                                          |
| `triggerPopoverLeft`      | String               | 否       | '0px'                      | 触发指令的 `弹框` 的左边距。可使用百分比等css单位。                                                                                                                                                                        |
| `triggerPopoverOffset`    | Number               | 否       | 8                          | 触发指令的 `弹框` 的间距。只能是数字类型，单位px                                                                                                                                                                           |
| `triggerPopoverPlacement` | String               | 否       | 'top-start'                | 触发指令的 `弹框` 的位置。取值：`'top'` \| `'top-start'` \| `'top-end'` \| `'bottom'` \| `'bottom-start'` \| `'bottom-end'` \| `'left'` \| `'left-start'` \| `'left-end'` \| `'right'` \| `'right-start'` \| `'right-end'` |

## 事件

| 事件名            | 说明                                  | 回调参数                                                                        |
| ----------------- | ------------------------------------- | ------------------------------------------------------------------------------- |
| `submit`          | 内置 `提交按钮` 提交时触发的事件。    | 无                                                                              |
| `cancel`          | 内置 `loading按钮` 点击时触发的事件。 | 无                                                                              |
| `recordingChange` | 内置语音识别状态变化时触发的事件。    | 无                                                                              |
| `trigger`         | 指令弹框发生变化时触发的事件。        | `interface TriggerEvent{oldValue: string; newValue: string; isOpen: boolean; }` |
| `pasteFile`       | 黏贴文件时触发的事件                  | `interface PasteFileEvent{firstFile: File; fileList: FileList}`                 |

## Ref 实例方法

| 属性名             | 类型     | 描述                                                                                                            |
| ------------------ | -------- | --------------------------------------------------------------------------------------------------------------- |
| `openHeader`       | Function | 打开输入框的自定义头部。                                                                                        |
| `closeHeader`      | Function | 关闭输入框的自定义头部。                                                                                        |
| `clear`            | Function | 清空输入框的内容。                                                                                              |
| `blur`             | Function | 移除输入框的焦点。                                                                                              |
| `focus`            | Function | 聚焦输入框。 默认 `focus('all')` 聚焦整个文本，`focus('start')` 聚焦文本最前方，`focus('end')` 聚焦文本最后方。 |
| `submit`           | Function | 提交输入内容。                                                                                                  |
| `cancel`           | Function | 取消加载状态。                                                                                                  |
| `startRecognition` | Function | 开始语音识别。                                                                                                  |
| `stopRecognition`  | Function | 停止语音识别。                                                                                                  |
| `popoverVisible`   | Boolean  | 触发指令的 `弹框` 可见性。                                                                                      |
| `inputInstance`    | Object   | 输入框实例。                                                                                                    |

## 插槽

| 插槽名         | 参数 | 类型 | 描述                             |
| -------------- | ---- | ---- | -------------------------------- |
| `#header`      | -    | Slot | 用于自定义输入框的头部内容。     |
| `#prefix`      | -    | Slot | 用于自定义输入框的前缀内容。     |
| `#action-list` | -    | Slot | 用于自定义输入框的操作列表内容。 |
| `#footer`      | -    | Slot | 用于自定义输入框的尾部内容。     |

## 功能特性

1. **焦点控制**：支持将焦点设置到文本最前方、最后方或选中整个文本，也可取消焦点。
2. **自定义内容**：提供头部、前缀、操作列表等插槽，允许用户自定义这些部分的内容。
3. **提交功能**：支持按 `Shift + Enter` 提交输入内容，提交后可执行自定义操作。
4. **加载状态**：可显示加载状态，模拟提交处理过程。
5. **语音输入**：支持语音输入功能，提升输入的便捷性。
6. **清空功能**：输入框可清空内容，方便用户重新输入。
