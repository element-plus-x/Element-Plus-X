---
title: 'welcome'
---

# Welcome 欢迎 🌹

## 介绍

`Welcome` 这个组件可以清晰传达给用户可实现的意图范围和预期功能。使用合适的欢迎推荐组件，可以有效降低用户学习成本，让用户快速了解并顺利开始。

## 代码演示

### 基本使用

<demo src="./demos/base.vue"></demo>

### 样式变体

<demo src="./demos/variant.vue"></demo>

### 背景颜色

<demo src="./demos/bg.vue"></demo>

### 自定义图片

<demo src="./demos/image.vue"></demo>

### 自定义副标题

<demo src="./demos/extra.vue"></demo>

## 属性

| 属性名          | 类型   | 是否必填 | 默认值  | 描述                                                    |
| --------------- | ------ | -------- | ------- | ------------------------------------------------------- |
| `variant`       | string | 否       | filled  | 组件样式变体（filled/borderless）                       |
| `direction`     | string | 否       | ltr     | 文本方向（ltr/rtl）                                     |
| `icon`          | string | 否       | -       | 图标URL地址                                             |
| `title`         | string | 否       | -       | 主标题文本内容                                          |
| `extra`         | string | 否       | -       | 副标题文本内容                                          |
| `description`   | string | 否       | -       | 描述文本内容                                            |
| `className`     | string | 否       | -       | 容器外层自定义类名                                      |
| `rootClassName` | string | 否       | -       | 根节点自定义类名                                        |
| `classNames`    | object | 否       | -       | 各部分自定义类名（{ icon, title, extra, description }） |
| `style`         | object | 否       | -       | 容器外层自定义样式                                      |
| `styles`        | object | 否       | -       | 各部分自定义样式（{ icon, title, extra, description }） |
| `prefixCls`     | string | 否       | welcome | 组件类名前缀                                            |

## 插槽

| 插槽名   | 参数 | 类型 | 描述               |
| -------- | ---- | ---- | ------------------ |
| `#image` | -    | Slot | 自定义欢迎图片内容 |
| `#extra` | -    | Slot | 自定义副标题内容   |

## 功能特性

1. 通过 `variant` 属性目前暂时支持 `filled`（填充）和 `borderless`（无边框）两种视觉风格
2. 支持 `direction` 属性控制文本方向
3. 可通过 `classNames` 和 `styles` 细粒度控制样式
4. 支持 `image` 、 `extra` 插槽扩展自定义内容
