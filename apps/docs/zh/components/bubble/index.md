---
title: 'Bubble'
---

::: info
`2.0.0 版本` 移除了内置的 Typewriter 打字器组件。如需 Markdown 渲染功能，请使用 [x-markdown-vue](https://www.npmjs.com/package/x-markdown-vue)
:::

## 介绍

`Bubble` 是一个对话气泡组件，常用于聊天的时候。它可以展示对话内容，支持自定义头像、头部、内容、底部，并且具备加载状态展示。

## 代码演示

### 基本使用

<demo src="./demos/content.vue"></demo>

### 头像、位置

<demo src="./demos/avatar-and-placement.vue"></demo>

### 头部、底部

<demo src="./demos/header-and-footer.vue"></demo>

### 加载状态

<demo src="./demos/loading.vue"></demo>

### 自定义内容

<demo src="./demos/content-customize.vue"></demo>

### 变体和形状

<demo src="./demos/variant-and-shape.vue"></demo>

### 自定义主题

通过 `ConfigProvider.themeOverrides` 覆盖 `Bubble` 的主题变量。完整变量表与可复制模板见：

- [主题变量总表](/zh/guide/theme-tokens#bubble)
- [/theme-overrides.template.ts](/theme-overrides.template.ts)

<demo src="./demos/theme-overrides.vue"></demo>

### 与 x-markdown-vue 结合使用

从 v2.0.0 开始，Typewriter 组件已移除。如需 Markdown 渲染功能，请使用 [x-markdown-vue](https://www.npmjs.com/package/x-markdown-vue)，或查看专属文档：[XMarkdown](/zh/components/xMarkdown/)。

#### 安装

```bash
pnpm add x-markdown-vue
pnpm add katex
pnpm add shiki shiki-stream
```

::: tip
如果需要代码块语法高亮功能，请安装 `shiki` 和 `shiki-stream`。否则控制台可能会报错：`Streaming highlighter initialization failed: Error: Failed to load shiki-stream module`
:::

#### 完整演示

<demo src="./demos/with-markdown.vue"></demo>

#### 基础用法

```vue
<template>
  <Bubble :avatar="avatar" placement="start">
    <template #content>
      <MarkdownRenderer :markdown="content" />
    </template>
  </Bubble>
</template>

<script setup>
import { ref } from 'vue';
import { MarkdownRenderer } from 'x-markdown-vue';
import 'x-markdown-vue/style';

const avatar = ref('https://example.com/avatar.png');
const content = ref('**Hello** World!\n\n这是 **Markdown** 内容');
</script>
```

#### 流式渲染（替代打字效果）

```vue
<template>
  <Bubble :avatar="avatar" placement="start">
    <template #content>
      <MarkdownRenderer :markdown="content" :enable-animate="true" />
    </template>
  </Bubble>
</template>

<script setup>
import { ref } from 'vue';
import { MarkdownRenderer } from 'x-markdown-vue';
import 'x-markdown-vue/style';

const content = ref('');
</script>
```

## 属性

| <div style="width: 130px">属性名</div> |  类型   |  默认值  | 说明                                                                                                              |
| :------------------------------------- | :-----: | :------: | :---------------------------------------------------------------------------------------------------------------- |
| `content`                              | String  |    ''    | 气泡内要展示的文本内容                                                                                            |
| `placement`                            | String  | 'start'  | 气泡的位置，可选值为 `'start'` 或 `'end'`，分别表示左侧和右侧。                                                   |
| `avatar`                               | String  |    ''    | 气泡头像的图片地址                                                                                                |
| `loading`                              | Boolean |  false   | 是否显示加载状态。为 `true` 时，气泡内会显示加载状态。                                                            |
| `shape`                                | String  |   null   | 气泡的形状，可选值为 `'round'`（圆角）或 `'corner'`（有角）。                                                     |
| `variant`                              | String  | 'filled' | 气泡的样式变体，可选值为 `'filled'`（填充）、`'borderless'`（无边框）、`'outlined'`（轮廓）、`'shadow'`（阴影）。 |
| `noStyle`                              | Boolean |  false   | 是否去除样式，为 `true` 时，将去除气泡内置 `padding` 和 `背景色`                                                  |
| `maxWidth`                             | String  | '500px'  | 气泡内容的最大宽度。                                                                                              |
| `avatar-size`                          | String  |    ''    | 设置头像占位大小                                                                                                  |
| `avatar-gap`                           | String  |  '12px'  | 设置头像和气泡之间的 `gap` 值                                                                                     |
| `avatar-shape`                         | String  |    ''    | 头像形状，可选值为 `'circle'`（圆形）或 `'square'`（方形）。                                                      |
| `avatar-icon`                          | String  |    ''    | 头像图标，优先级高于 `avatar`，支持传入图标名称，如 `'user'`。                                                    |
| `avatar-src-set`                       | String  |    ''    | 设置头像图片 srcset 属性                                                                                          |
| `avatar-alt`                           | String  |    ''    | 设置头像图片 alt 属性                                                                                             |
| `avatar-fit`                           | String  | 'cover'  | 设置头像图片的 `object-fit` 属性,可选属性值：`'cover'`、`'contain'`、`'fill'`、`'none'`、`'scale-down'`           |

## 事件

| 事件名         | 参数       | 类型     | 描述               |
| -------------- | ---------- | -------- | ------------------ |
| `@avatarError` | `ref` 实例 | Function | 头像加载失败时触发 |

## Ref 实例方法

| 属性名    | 类型     | 描述                   |
| --------- | -------- | ---------------------- |
| `restart` | Function | 重新开始。             |
| `destroy` | Function | 主动销毁 Bubble 组件。 |

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
2. **内容类型** - 支持纯文本、自定义插槽内容
3. **加载状态** - 内置加载动画，支持自定义加载内容
4. **视觉效果** - 提供多种形状和变体（圆角/直角、填充/描边/阴影等）
5. **灵活插槽** - 提供头像、头部、内容、底部、加载状态等插槽
