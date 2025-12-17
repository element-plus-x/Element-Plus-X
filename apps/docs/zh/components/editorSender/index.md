---
title: 'EditorSender'
---

## 介绍

**`EditorSender`** 重磅来袭 🙊 专为 **`多模态模型`**、**`自定义提示词场景`** 设计的输入框组件，解决 **标签插入，内容提及，自定义提示词输入** 等核心开发需求，更好的展现多模态功能的强大。

::: warning
`EditorSender` 组件 和 `Sender` 组件 有一定的开发上的差异，请根据实际情况选择使用。

<img src="./image.png" width="100%">
:::

## 代码演示

### 基础用法

<demo src="./demos/basic.vue"></demo>

### 提示语

<demo src="./demos/placeholder.vue"></demo>

### 自动聚焦

<demo src="./demos/autoFocus.vue"></demo>

### 状态属性

<demo src="./demos/state.vue"></demo>

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

<demo src="./demos/custom-style.vue"></demo>

### 限制最大输入长度

<demo src="./demos/max-length.vue"></demo>

### 提交方式

<demo src="./demos/submit-type.vue"></demo>

### 黏贴文件

<demo src='./demos/pasteFile.vue'></demo>

## 高级用法

### 插入 text 内容

<demo src="./demos/insert-text.vue"></demo>

### 插入 html 内容

<demo src="./demos/insert-html.vue"></demo>

### 插入 选择标签

<demo src="./demos/insert-select-tag.vue"></demo>

### 插入 输入标签

<demo src="./demos/insert-input-tag.vue"></demo>

### 插入 用户标签

<demo src="./demos/insert-user-tag.vue"></demo>

### 插入 自定义标签

<demo src="./demos/insert-custom-tag.vue"></demo>

### 混合标签覆盖写入

<demo src="./demos/mix-tag.vue"></demo>

### 前置提示标签

<demo src="./demos/prefix-tag.vue"></demo>

## 属性

| 属性名                    | 类型                              | 是否必填 | 默认值       | 说明                                                             |
|------------------------|---------------------------------| -------- |-----------|----------------------------------------------------------------|
| `placeholder`          | String                          | 否       | '请输入内容'   | 输入框的提示语文本                                                      |
| `device`               | 'pc' \| 'h5' \| 'h5'            | 否       | 'auto'    | 使用编辑器的设备类型                                                     |
| `autoFocus`            | Boolean                         | 否       | false     | 是否在组件挂载后自动聚焦到输入框                                               |
| `variant`              | 'default' \| 'updown'           | 否       | 'default' | 输入框的变体类型，default为水平布局，updown为垂直布局                              |
| `mentionConfig`        | MentionConfig                   | 否       | undefined | @提及功能的配置项                                                      |
| `triggerConfig`        | TriggerConfig[]                 | 否       | undefined | 扩展自定义弹窗的触发配置项                                                  |
| `selectConfig`         | SelectConfig[]                  | 否       | undefined | 标签下拉选择配置项                                                      |
| `maxLength`            | Number                          | 否       | -1        | 限制输入框的最大字数，性能开销较大，非必要不建议设置                                     |
| `submitType`           | 'enter' \| 'shiftEnter'         | 否       | 'enter'   | 控制换行与提交模式：'enter'为Enter提交、Shift+Enter换行；'shiftEnter'为Shift+Enter提交、Enter换行 |
| `customStyle`          | Record<string, any>             | 否       | {}        | 用于修改输入框的样式                                                     |
| `loading`              | Boolean                         | 否       | false     | 发送按钮的加载状态，为true时显示加载动画                                         |
| `disabled`             | Boolean                         | 否       | false     | 是否禁用输入框，禁用后无法输入和操作                                             |
| `clearable`            | Boolean                         | 否       | false     | 是否显示清空按钮                                                       |
| `headerAnimationTimer` | Number                          | 否       | 300       | 头部展开/收起动画的时长，单位为ms                                             |
| `tipConfig`            | Boolean \| TipConfig            | 否       | true      | 启用前置标签 或自定义模版                                                  |
| `getPlugin`            | () => typeof XSender            | 否       | undefined | 自定义更新基础库依赖                                                     |

## 事件

| 事件名             | 说明            | 回调参数                                                            |
| ------------------ |---------------|-----------------------------------------------------------------|
| `submit`           | 提交内容时触发       | 无                                                               |
| `change`           | 输入内容发生变化时触发   | 无                                                               |
| `cancel`           | 取消加载状态时触发     | 无                                                               |
| `pasteFile`        | 黏贴文件时触发的事件    | `interface PasteFileEvent{firstFile: File; fileList: FileList}` |

## Ref 实例方法

| 方法名               | 类型                                                                | 描述                                                 |
|-------------------|-------------------------------------------------------------------|----------------------------------------------------|
| `getSender`       | () => XSender                                                     | 获取当前发送器的XSender实例对象                                |
| `focus`           | (type: 'first' \| 'last' \| 'mark') => void                       | 将光标 聚焦到文本指定位置，'first'为最前方，'last'为最后方，'mark'为最后出现位置 |
| `blur`            | () => void                                                        | 移除输入框的焦点                                           |
| `selectAll`       | () => void                                                        | 全选输入框内容                                            |
| `clear`           | () => void                                                        | 清空输入框内容                                            |
| `setSelect `      | (key: string, id: string) => void                                 | 插入一个选择标签                                           |
| `setInput`        | (key: string, placeholder: string, defaultValue?: string) => void | 插入一个输入标签                                           |
| `setMention`      | (id: string) => void                                              | 插入一个@提及标签                                          |
| `setTrigger`      | (key: string, id: string) => void                                 | 插入一个自定义触发符标签                                       |
| `setChatNode`     | (model: ChatNode[][]) => void                                     | 混合式插入多种标签                                          |
| `setHtml`         | (html: string) => void                                            | 在当前光标处插入HTML片段（建议使用行内或行内块元素）                       |
| `setText`         | (txt: string) => void                                             | 在当前光标处插入文本                                         |
| `showSelect`      | (key: string, elm: HTMLElement) => void                           | 外部调用唤起标签选择弹窗                                       |
| `showTip`         | (props: Record<string, string>) => void                           | 打开前置提示标签                                           |
| `closeTip`        | () => void                                                        | 关闭前置提示标签                                           |
| `senderState`     | SenderState                                                       | 暴露的组件状态对象，识别内容是否为空以及前置标签开启状态                       |

## 插槽

| 插槽名         | 参数 | 描述                           |
| -------------- | ---- | ------------------------------ |
| `#header`      | -    | 用于自定义输入框的头部内容     |
| `#prefix`      | -    | 用于自定义输入框的前缀内容     |
| `#action-list` | -    | 用于自定义输入框的操作列表内容 |
| `#footer`      | -    | 用于自定义输入框的底部内容     |

## 更多定制化功能
1. **自定义交互弹窗**：请参考[CustomDialog](https://jianfv.top/XSender/guide/customDialog)。
2. **自定义交互组件**：请参考[CustomComponent](https://jianfv.top/XSender/guide/customComponent)。

## 功能特性

1. **全类型标签引擎**：无缝支持@用户、选择标签、自定义标签等多类型标记，标签插入/更新/管理一键搞定，满足复杂内容标记需求。
2. **跨设备自适应交互**：PC端内置弹窗系统，H5端支持自定义弹窗，自动适配不同设备操作习惯，兼顾原生体验与定制自由。

