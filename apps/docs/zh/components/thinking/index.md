---
title: 'thinking'
---

# Thinking 思考中 🍓

## 介绍

`Thinking` 是一个用于展示思考中状态的组件，支持 **状态管理** 、**内容展开/收起** 和 **自定义样式**。通过不同状态（开始/思考中/完成/错误）的视觉反馈，帮助用户直观理解AI的思考流程。组件内置过渡动画，提供灵活的扩展插槽，适合在智能对话、数据分析等场景中使用。

::: info

此组件可以和 `BubbleList` 等组件一起使用，以实现更丰富的交互体验。

:::

## 代码演示

### 基本使用

<demo src="./demos/base.vue"></demo>

### 内容展开/收起

<demo src="./demos/content.vue"></demo>

### 状态管理

<demo src="./demos/v-model.vue"></demo>

### 状态样式

<demo src="./demos/status.vue"></demo>

### 自动收起

<demo src="./demos/autoCollapse.vue"></demo>

### 禁用状态

<demo src="./demos/disabled.vue"></demo>

### 宽度定制

<demo src="./demos/width.vue"></demo>

### 内容颜色样式定制

<demo src="./demos/color.vue"></demo>

### 插槽定制

<demo src="./demos/solt.vue"></demo>

## 属性

| 属性名            | 类型           | 是否必填 | 默认值                   | 描述                                                                         |
| ----------------- | -------------- | -------- | ------------------------ | ---------------------------------------------------------------------------- |
| `content`         | String         | 否       | `''`                     | 显示的主要内容文本 无打字效果，由接口返回决定                                |
| `modelValue`      | Boolean        | 否       | `true`                   | 通过 v-model 绑定展开状态，默认为展开状                                      |
| `status`          | ThinkingStatus | 否       | `'start'`                | 组件状态：`start`（开始）/`thinking`（思考中）/`end`（完成）/`error`（错误） |
| `autoCollapse`    | Boolean        | 否       | `false`                  | 是否在组件状态变为 `end` 时自动收起内容区域                                  |
| `disabled`        | Boolean        | 否       | `false`                  | 是否禁用组件交互                                                             |
| `buttonWidth`     | String         | 否       | `'160px'`                | 触发按钮宽度                                                                 |
| `duration`        | String         | 否       | `'0.2s'`                 | 过渡动画时长                                                                 |
| `maxWidth`        | String         | 否       | `'500px'`                | 内容区域最大宽度                                                             |
| `backgroundColor` | String         | 否       | `'#fcfcfc'`              | 内容区域背景色                                                               |
| `color`           | String         | 否       | `'var(--el-color-info)'` | 内容文字颜色                                                                 |

## 事件

| 事件名    | 参数                                    | 类型     | 描述                     |
| --------- | --------------------------------------- | -------- | ------------------------ |
| `@change` | \{value:boolean,status:ThinkingStatus\} | Function | 展开状态或状态变化时触发 |

## 插槽

| 插槽名         | 参数          | 类型 | 描述                         |
| -------------- | ------------- | ---- | ---------------------------- |
| `#status-icon` | \{ status \}  | Slot | 自定义状态图标               |
| `#label`       | \{ status \}  | Slot | 自定义按钮文字               |
| `#arrow`       | -             | Slot | 自定义箭头图标               |
| `#content`     | \{ content \} | Slot | 自定义内容区域（非错误状态） |
| `#error`       | -             | Slot | 自定义错误信息内容展示       |

## 功能特性

1. **多状态管理**
   - 支持`start`/`thinking`/`end`/`error`四种状态，自动切换对应图标和文案
   - 错误状态时强制显示固定错误提示

2. **交互反馈**
   - 展开/收起内容区域时带有平滑滑动动画
   - 按钮点击反馈支持自定义过渡效果

3. **样式定制**
   - 通过CSS变量控制尺寸、颜色等视觉属性
   - 提供完整的插槽扩展能力，支持自定义图标和内容

4. **智能行为**
   - 状态切换时自动调整展开状态
   - 禁用状态时保持视觉反馈但阻断交互
