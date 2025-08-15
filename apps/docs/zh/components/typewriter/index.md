---
title: 'Typewriter'
---

# Typewriter 打字器 ✍

::: warning
**`XMarkdown 组件`** 已经推出，可以和 `Typewriter 组件` 组合使用，请升级到 `beta 1.2.2` 版本。
:::

::: info
`v1.2.0 版本` 提供解决 **样式覆盖** 、**渲染图表** 以及 **自定义代码高亮样式、自定义插件** 简单方案

一、我们在组件库新增了 `prismjs` 官方的 css 样式文件，可以在项目直接引入，解决 **md 代码块高亮**问题。

二、我们在组件库新增了 `Mermaid.js`。用于解决 `mermaid 格式` 简单的**图表**渲染问题。

三、我们把 `markdown-it` 内置的 **代码高亮方法** 和 **插件** 暴露出来。方便开发者更好的集成第三方生态的 **样式** 和 **插件**

🐵 此温馨提示更新时间：`2025-07-06`
:::

## 介绍

`Typewriter` 是一个可高度定制化开发的 `打字器组件`，灵感来自 `ant-design-x` 官方 `气泡组件` 案例，将打字方法剥离出来。支持 Markdown 渲染 和 动态打字效果。

## 代码演示

### 基本使用

<demo src="./demos/content.vue"></demo>

### Markdown 渲染

<demo src="./demos/isMarkdown.vue"></demo>

### MD-代码块高亮（v1.2.0 新增）

提供一个内置的样式

<demo src="./demos/newMarkDown.vue"></demo>

### MD-插件模式（v1.2.0 新增）

如果你觉得内置的样式不好看或者内置的插件不能满足你的需求，可以通过插件模式自定定义 **样式** 和 **插件**。

<demo src="./demos/mermaid.vue"></demo>

### 开启打字效果

<demo src="./demos/typing.vue"></demo>

### 打字器雾化效果

<demo src="./demos/isFog.vue"></demo>

### 动态更新内容

<demo src="./demos/updates.vue"></demo>

### 控制打字

<demo src="./demos/customized.vue"></demo>

## 属性

| 属性名            | 类型                                                               | 是否必填 | 默认值  | 描述                                               |
| ----------------- | ------------------------------------------------------------------ | -------- | ------- | -------------------------------------------------- |
| `content`         | String                                                             | 否       | `''`    | 要展示的文本内容，支持纯文本或 Markdown 格式。     |
| `isMarkdown`      | Boolean                                                            | 否       | `false` | 是否启用 Markdown 渲染模式。                       |
| `typing`          | Boolean \| `{ step?: number, interval?: number, suffix?: string }` | 否       | `false` | 是否启用打字机效果。                               |
| `typing.step`     | Number                                                             | 否       | `2`     | 每次打字吐多少字符。                               |
| `typing.interval` | Number                                                             | 否       | `50`    | 每次打字的间隔时间 单位( `ms` )。                  |
| `typing.suffix`   | String                                                             | 否       | `'\|'`  | 打字器后缀光标字符（仅在非 Markdown 模式下生效）。 |
| `isFog`           | Boolean \| `{ bgColor?: string, width?: string }`                  | 否       | `false` | 是否启用雾化效果，可以设置背景色和宽度。           |

## 事件

| 事件名     | 参数       | 类型     | 描述                     |
| ---------- | ---------- | -------- | ------------------------ |
| `@start`   | `ref` 实例 | Function | 当打字效果开始时触发     |
| `@finish`  | `ref` 实例 | Function | 当打字效果完成时触发     |
| `@writing` | `ref` 实例 | Function | 当打字效果进行中不断触发 |

## Ref 实例方法

| 属性名            | 类型     | 描述                         |
| ----------------- | -------- | ---------------------------- |
| `interrupt`       | Function | 中断打字。                   |
| `continue`        | Function | 继续未完成的打字。           |
| `restart`         | Function | 重新开始打字。               |
| `destroy`         | Function | 主动销毁打字组件。           |
| `renderedContent` | String   | 获取打字组件渲染的内容。     |
| `isTyping`        | Boolean  | 是否正在打字。               |
| `progress`        | Number   | 打字进度，取值范围 0 - 100。 |

## 功能特性

1. **Markdown 支持**：支持渲染 Markdown 格式的文本，并应用 GitHub 风格的样式。
2. **动态打字效果**：可以模拟打字机的效果，逐步显示文本内容。
3. **代码高亮**：内置 Prism.js，支持代码块的语法高亮。
4. **XSS 安全**：使用 DOMPurify 对 HTML 内容进行过滤，防止 XSS 攻击。
5. **灵活配置**：支持自定义打字速度、光标字符、后缀等参数。
6. **定制化开发**：支持更据组件打字的状态做定制化开发。
