---
title: 'prompts'
---

# Prompts 提示集组件 🎁

## 介绍

`Prompts` 用于显示一组与当前上下文相关的预定义的问题或建议。

## 代码演示

### 基本使用

<demo src="./demos/base.vue"></demo>

### 禁用状态

<demo src="./demos/disabled.vue"></demo>

### 垂直排列

<demo src="./demos/vertical.vue"></demo>

### 可换行

<demo src="./demos/wrap.vue"></demo>

### 响应式宽度

<demo src="./demos/responsive.vue"></demo>

### 定制化样式

<demo src="./demos/customized.vue"></demo>

### 嵌套组合

<demo src="./demos/nested.vue"></demo>

## 属性

| 属性名     | 类型                  | 是否必填 | 默认值  | 描述                                                                 |
| ---------- | --------------------- | -------- | ------- | -------------------------------------------------------------------- |
| `title`    | `string`              | 否       | `''`    | 提示集的主标题文本内容                                               |
| `items`    | `PromptsItemsProps[]` | 否       | `[]`    | 提示项数组，每个元素包含标签、图标、描述等信息（具体结构见下方说明） |
| `wrap`     | `boolean`             | 否       | `false` | 是否允许提示项自动换行（仅水平排列时生效）                           |
| `vertical` | `boolean`             | 否       | `false` | 是否垂直排列提示项（垂直模式下布局方向为列排列）                     |
| `style`    | `CSSProperties`       | 否       | `{}`    | 组件容器的自定义样式（直接作用于最外层`div.el-prompts`）             |

**`PromptsItemsProps` 结构说明**（单个提示项属性）：

```typescript
interface PromptsItemsProps {
  key: string | number; // 唯一标识（用于状态关联）
  label?: string; // 提示项标签文本
  icon?: ComponentVNode; // 提示项图标（Vue组件形式）
  description?: string; // 提示项描述文本
  disabled?: boolean; // 是否禁用（禁用时不响应交互）
  itemStyle?: CSSProperties; // 提示项自定义基础样式
  itemHoverStyle?: CSSProperties; // 提示项悬停状态自定义样式
  itemActiveStyle?: CSSProperties; // 提示项激活状态自定义样式
  children?: PromptsItemsProps[]; // 子提示项数组（用于嵌套展示）
}
```

## 事件

| 事件名       | 参数                        | 类型     | 描述                             |
| ------------ | --------------------------- | -------- | -------------------------------- |
| `@itemClick` | `(item: PromptsItemsProps)` | Function | 当某个提示集被点击时触发的事件。 |

## 插槽

| 插槽名         | 参数                          | 类型   | 描述                                                                         |
| -------------- | ----------------------------- | ------ | ---------------------------------------------------------------------------- |
| `#title`       | -                             | `Slot` | 自定义提示集标题内容（若同时设置`title`属性，插槽内容会覆盖属性文本）        |
| `#icon`        | `{ item: PromptsItemsProps }` | `Slot` | 自定义提示项的图标内容（接收当前提示项`item`参数，可覆盖`item.icon`）        |
| `#label`       | `{ item: PromptsItemsProps }` | `Slot` | 自定义提示项的标签内容（接收当前提示项`item`参数，可覆盖`item.label`）       |
| `#description` | `{ item: PromptsItemsProps }` | `Slot` | 自定义提示项的描述内容（接收当前提示项`item`参数，可覆盖`item.description`） |

## 功能特性

1. **多维度内容展示**：支持通过`items`属性配置标签、图标、描述等基础信息，同时提供`label`/`icon`/`description`插槽实现内容高度自定义。
2. **灵活布局控制**：通过`vertical`属性切换垂直/水平排列模式，`wrap`属性控制水平排列时的自动换行能力，适配不同场景布局需求。
3. **交互状态反馈**：内置悬停（背景色变浅）和激活（背景色加深）状态样式，支持通过`itemHoverStyle`/`itemActiveStyle`自定义状态样式，提升交互体验。
4. **禁用状态支持**：单个提示项可通过`item.disabled`属性禁用，禁用状态下不响应点击事件且背景色变灰，明确提示不可操作。
5. **嵌套层级展示**：支持通过`item.children`配置子提示项，组件自动递归渲染嵌套结构，满足多级分类或关联提示的展示需求。6.**细粒度样式定制**：支持通过`style`属性控制组件整体样式，通过`itemStyle`控制单个提示项基础样式，支持状态样式单独配置（`itemHoverStyle`/`itemActiveStyle`）。
