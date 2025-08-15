---
title: 'Bubble'
---

# Bubble 对话气泡 🔥

::: warning
`1.1.6 版本` 继承打字器雾化属性。请及时更新尝试

🐵 此温馨提示更新时间：`2025-04-13`
:::

## 介绍

`Bubble` 是一个对话气泡组件，常用于聊天的时候。它可以展示对话内容，支持自定义头像、头部、内容、底部，并且具备打字效果和加载状态展示。该组件内置 `Typewriter` 打字器组件，能够实现文本的打字动画效果。

## 代码演示

### 基本使用

<demo src="./demos/content.vue"></demo>

### 头像、位置

<demo src="./demos/avatar-and-placement.vue"></demo>

### 头部、底部

<demo src="./demos/header-and-footer.vue"></demo>

### 加载状态

<demo src="./demos/loading.vue"></demo>

### 打字器配置

<demo src="./demos/typing.vue"></demo>

### 开启Markdown渲染

<demo src="./demos/is-markdown.vue"></demo>

### 继承打字器的图表和md样式

<demo src="./demos/cssAndMermaid.vue"></demo>

### 雾化效果

<demo src="./demos/is-fog.vue"></demo>

### 自定义内容

<demo src="./demos/content-customize.vue"></demo>

### 变体和形状

<demo src="./demos/variant-and-shape.vue"></demo>

### 控制打字

<demo src="./demos/customized.vue"></demo>

## 属性

| <div style="width: 130px">属性名</div> |       类型        |  默认值  | 说明                                                                                                                                     |
| :------------------------------------- | :---------------: | :------: | :--------------------------------------------------------------------------------------------------------------------------------------- |
| `content`                              |      String       |    ''    | 气泡内要展示的文本内容                                                                                                                   |
| `placement`                            |      String       | 'start'  | 气泡的位置，可选值为 `'start'` 或 `'end'`，分别表示左侧和右侧。                                                                          |
| `avatar`                               |      String       |    ''    | 气泡头像的图片地址                                                                                                                       |
| `loading`                              |      Boolean      |  false   | 是否显示加载状态。为 `true` 时，气泡内会显示加载状态。                                                                                   |
| `shape`                                |      String       |   null   | 气泡的形状，可选值为 `'round'`（圆角）或 `'corner'`（有角）。                                                                            |
| `variant`                              |      String       | 'filled' | 气泡的样式变体，可选值为 `'filled'`（填充）、`'borderless'`（无边框）、`'outlined'`（轮廓）、`'shadow'`（阴影）。                        |
| `noStyle`                              |      Boolean      |  false   | 是否去除样式，为 `true` 时，将去除气泡内置 `padding` 和 `背景色`                                                                         |
| `isMarkdown`                           |      Boolean      |  false   | 是否将 `content` 内容作为 Markdown 格式处理。                                                                                            |
| `typing`                               | Boolean \| Object |  false   | 是否开启打字效果。若为对象，可设置 `step`（每次渲染的字符数）和 `suffix`（打字光标后缀内容）。`interval` 表示打字间隔时间，单位为 `ms`。 |
| `maxWidth`                             |      String       | '500px'  | 气泡内容的最大宽度。                                                                                                                     |
| `avatar-size`                          |      String       |    ''    | 设置头像占位大小                                                                                                                         |
| `avatar-gap`                           |      String       |  '12px'  | 设置头像和气泡之间的 `gap` 值                                                                                                            |
| `avatar-shape`                         |      String       |    ''    | 头像形状，可选值为 `'circle'`（圆形）或 `'square'`（方形）。                                                                             |
| `avatar-icon`                          |      String       |    ''    | 头像图标，优先级高于 `avatar`，支持传入图标名称，如 `'user'`。                                                                           |
| `avatar-src-set`                       |      String       |    ''    | 设置头像图片 srcset 属性                                                                                                                 |
| `avatar-alt`                           |      String       |    ''    | 设置头像图片 alt 属性                                                                                                                    |
| `avatar-fit`                           |      String       | 'cover'  | 设置头像图片的 `object-fit` 属性,可选属性值：`'cover'`、`'contain'`、`'fill'`、`'none'`、`'scale-down'`                                  |

## 事件

| 事件名         | 参数       | 类型     | 描述               |
| -------------- | ---------- | -------- | ------------------ |
| `@start`       | `ref` 实例 | Function | 打字效果开始时触发 |
| `@finish`      | `ref` 实例 | Function | 打字效果完成时触发 |
| `@writing`     | `ref` 实例 | Function | 打字中实时触发     |
| `@avatarError` | `ref` 实例 | Function | 头像加载失败时触发 |

## Ref 实例方法

| 属性名            | 类型     | 描述                         |
| ----------------- | -------- | ---------------------------- |
| `interrupt`       | Function | 中断打字。                   |
| `continue`        | Function | 继续未完成的打字。           |
| `restart`         | Function | 重新开始打字。               |
| `destroy`         | Function | 主动销毁 Bubble 组件。       |
| `renderedContent` | String   | 获取打字组件渲染的内容。     |
| `isTyping`        | Boolean  | 是否正在打字。               |
| `progress`        | Number   | 打字进度，取值范围 0 - 100。 |

## 插槽

| 插槽名     | 参数 | 类型 | 描述                       |
| ---------- | ---- | ---- | -------------------------- |
| `#avatar`  | -    | Slot | 自定义头像展示内容         |
| `#header`  | -    | Slot | 自定义气泡顶部展示内容     |
| `#content` | -    | Slot | 自定义气泡展示内容         |
| `#loading` | -    | Slot | 自定义气泡加载状态展示内容 |
| `#footer`  | -    | Slot | 自定义气泡底部展示内容     |

## 功能特性

1. **布局方向** - 支持左对齐(`start`)和右对齐(`end`)
2. **内容类型** - 支持纯文本、Markdown、自定义插槽内容
3. **加载状态** - 内置加载动画，支持自定义加载内容
4. **视觉效果** - 提供多种形状和变体（圆角/直角、填充/描边/阴影等）
5. **打字动画** - 支持渐进式文字输出效果
6. **灵活插槽** - 提供头像、头部、内容、底部、加载状态等插槽
