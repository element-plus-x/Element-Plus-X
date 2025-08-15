---
title: 'editorSender'
---

# EditorSender 编辑输入框 🌺

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

### 异步加载 @成员

<demo src="./demos/async-user-tag.vue"></demo>

### 自定义提及弹框

<demo src="./demos/custom-mention.vue"></demo>

### 设备类型 pc/h5

<demo src="./demos/device.vue"></demo>

## 属性

| 属性名                 | 类型                                       | 是否必填 | 默认值       | 说明                                                                                              |
| ---------------------- | ------------------------------------------ | -------- | ------------ | ------------------------------------------------------------------------------------------------- |
| `placeholder`          | String                                     | 否       | '请输入内容' | 输入框的提示语文本                                                                                |
| `device`               | 'pc' \| 'h5'                               | 否       | 'pc'         | 使用编辑器的设备类型，PC端内置丰富的弹出选择功能，H5端需参考自定义弹窗实现                        |
| `autoFocus`            | Boolean                                    | 否       | false        | 是否在组件挂载后自动聚焦到输入框                                                                  |
| `variant`              | 'default' \| 'updown'                      | 否       | 'default'    | 输入框的变体类型，default为水平布局，updown为垂直布局                                             |
| `userList`             | UserInfo[]                                 | 否       | []           | @提及功能的用户列表                                                                               |
| `customTrigger`        | CustomTag[]                                | 否       | []           | 扩展自定义弹窗的触发配置列表                                                                      |
| `selectList`           | SelectTag[]                                | 否       | []           | 配置标签下拉选择的选项列表                                                                        |
| `maxLength`            | Number                                     | 否       | undefined    | 限制输入框的最大字数，性能开销较大，非必要不建议设置                                              |
| `submitType`           | 'enter' \| 'shiftEnter'                    | 否       | 'enter'      | 控制换行与提交模式：'enter'为Enter提交、Shift+Enter换行；'shiftEnter'为Shift+Enter提交、Enter换行 |
| `customStyle`          | Record<string, any>                        | 否       | {}           | 用于修改输入框的样式                                                                              |
| `loading`              | Boolean                                    | 否       | false        | 发送按钮的加载状态，为true时显示加载动画                                                          |
| `disabled`             | Boolean                                    | 否       | false        | 是否禁用输入框，禁用后无法输入和操作                                                              |
| `clearable`            | Boolean                                    | 否       | false        | 是否显示清空按钮                                                                                  |
| `headerAnimationTimer` | Number                                     | 否       | 300          | 头部展开/收起动画的时长，单位为ms                                                                 |
| `asyncMatchFun`        | (searchVal: string) => Promise<UserInfo[]> | 否       | undefined    | 异步加载群成员的方法，用于@提及功能的远程搜索                                                     |
| `customDialog`         | Boolean                                    | 否       | false        | 是否启用自定义弹窗，开启后内部弹窗将不会创建，需自行实现弹窗逻辑                                  |

## 事件

| 事件名             | 说明                     | 回调参数                                                |
| ------------------ | ------------------------ | ------------------------------------------------------- |
| `submit`           | 提交内容时触发           | `payload: SubmitResult` - 包含提交的各类内容            |
| `change`           | 输入内容发生变化时触发   | 无                                                      |
| `cancel`           | 取消加载状态时触发       | 无                                                      |
| `showAtDialog`     | 显示@用户弹窗时触发      | 无                                                      |
| `showSelectDialog` | 显示选择标签弹窗时触发   | `key: string` - 标签键名, `elm: HTMLElement` - 触发元素 |
| `showTagDialog`    | 显示自定义标签弹窗时触发 | `prefix: string` - 标签前缀                             |

## Ref 实例方法

| 方法名             | 类型                                                              | 描述                                                            |
| ------------------ | ----------------------------------------------------------------- | --------------------------------------------------------------- |
| `getCurrentValue`  | () => SubmitResult                                                | 获取当前输入框的内容，包括文本、HTML和各类标签信息              |
| `focusToStart`     | () => void                                                        | 将光标聚焦到文本最前方                                          |
| `focusToEnd`       | () => void                                                        | 将光标聚焦到文本最后方                                          |
| `blur`             | () => void                                                        | 移除输入框的焦点                                                |
| `selectAll`        | () => void                                                        | 全选输入框内容                                                  |
| `clear`            | (txt?: string) => void                                            | 清空输入框内容，可选参数txt为清空后插入的文本                   |
| `setSelectTag`     | (key: string, tagId: string) => void                              | 插入一个选择标签                                                |
| `setInputTag`      | (key: string, placeholder: string, defaultValue?: string) => void | 插入一个输入标签                                                |
| `setUserTag`       | (userId: string) => void                                          | 插入一个@提及标签                                               |
| `setCustomTag`     | (prefix: string, id: string) => void                              | 插入一个自定义触发符标签                                        |
| `setMixTags`       | (tags: MixTag[][]) => void                                        | 混合式插入多种标签                                              |
| `setHtml`          | (html: string) => void                                            | 在当前光标处插入HTML片段（建议使用行内或行内块元素）            |
| `setText`          | (txt: string) => void                                             | 在当前光标处插入文本                                            |
| `openSelectDialog` | (option: SelectDialogOption) => void                              | 外部调用唤起标签选择弹窗                                        |
| `customSetUser`    | (user: UserInfo) => void                                          | 自定义弹窗中写入@提及标签（私有API，会自动截取触发符）          |
| `customSetTag`     | (prefix: string, tag: TagInfo) => void                            | 自定义弹窗中写入自定义触发符号标签（私有API，会自动截取触发符） |
| `updateSelectTag`  | (elm: HTMLElement, tag: TagInfo) => void                          | 更新选择标签内容                                                |
| `openTipTag`       | (options: TipOptions) => void                                     | 打开前置提示标签                                                |
| `closeTipTag`      | () => void                                                        | 关闭前置提示标签                                                |
| `chat`             | ChatArea 实例                                                     | 暴露的chat实例对象                                              |
| `opNode`           | ChatOperateNode 实例                                              | 暴露的ChatNode操作对象                                          |
| `chatState`        | ChatState 对象                                                    | 暴露的组件状态对象                                              |

## 插槽

| 插槽名         | 参数 | 描述                           |
| -------------- | ---- | ------------------------------ |
| `#header`      | -    | 用于自定义输入框的头部内容     |
| `#prefix`      | -    | 用于自定义输入框的前缀内容     |
| `#action-list` | -    | 用于自定义输入框的操作列表内容 |
| `#footer`      | -    | 用于自定义输入框的底部内容     |

## 功能特性

1. **全类型标签引擎**：无缝支持@用户、选择标签、自定义标签等多类型标记，标签插入/更新/管理一键搞定，满足复杂内容标记需求。

2. **跨设备自适应交互**：PC端内置弹窗系统，H5端支持自定义弹窗，自动适配不同设备操作习惯，兼顾原生体验与定制自由。
