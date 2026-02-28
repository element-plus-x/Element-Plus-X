---
title: 'XSender'
---

## 介绍

`XSender` 这个组件内置了**输入框**、**标签选择**、**指令弹窗**、**提及用户**等场景智能对话的场景功能。

:::warning

⚠️ 插件版本需要大于 `1.3.98` 版本，之前旧版本插件名为 `EditorSender` ，其中API 有很大的使用差异，需要注意。

:::

## 代码演示

### 基础用法

<demo src="./demos/basic.vue"></demo>

### 提示语

<demo src="./demos/placeholder.vue"></demo>

### 自动聚焦

<demo src="./demos/auto-focus.vue"></demo>

### 状态属性

<demo src="./demos/status.vue"></demo>

### 提交方式

<demo src="./demos/submit-type.vue"></demo>

### 布局变体

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

### 输入长度限制

<demo src="./demos/max-length.vue"></demo>

## 进阶用法

### 输入框

<demo src="./demos/input.vue"></demo>

### 标签选择框

<demo src="./demos/select.vue"></demo>

### 提及用户

<demo src="./demos/mention.vue"></demo>

### 指令弹窗

<demo src="./demos/trigger.vue"></demo>

### 前置提示词

<demo src="./demos/befor-tip.vue"></demo>

## 属性

### Props

| 属性                   | 类型                 | 是否必填 | 默认值       | 说明                                                                        |
| ---------------------- | -------------------- | -------- | ------------ | --------------------------------------------------------------------------- |
| `placeholder`          | string               | false    | `请输入内容` | 提示占位语                                                                  |
| `device`               | PC \| H5 \| auto     | false    | `auto`       | 交互设备                                                                    |
| `autoFocus`            | boolean              | false    | `false`      | 渲染完成后是否自动聚焦                                                      |
| `variant`              | default \| updown    | false    | `default`    | 布局变体                                                                    |
| `maxLength`            | number               | false    | `-1`         | 输入长度限制                                                                |
| `submitType`           | enter \| shiftEnter  | false    | `enter`      | 提交类型                                                                    |
| `customStyle`          | CSSStyleDeclaration  | false    | `{}`         | 自定义输入框样式                                                            |
| `loading`              | boolean              | false    | `false`      | 加载中状态                                                                  |
| `disabled`             | boolean              | false    | `false`      | 禁用状态                                                                    |
| `clearable`            | boolean              | false    | `false`      | 显示清空按钮                                                                |
| `headerAnimationTimer` | number               | false    | `300`        | 头部动画时间                                                                |
| `mentionConfig`        | MentionConfig        | false    | `null`       | 提及用户配置                                                                |
| `triggerConfig`        | TriggerConfig[]      | false    | `null`       | 指令弹窗配置                                                                |
| `selectConfig`         | SelectConfig[]       | false    | `null`       | 标签选择弹窗配置                                                            |
| `tipConfig`            | TipConfig \| boolean | false    | `true`       | 前置提示词配置（`true` 启用默认配置，`false` 禁用，对象表示启用并传入配置） |
| `getPlugin`            | () => typeof XSender | false    | `null`       | 自定义底层插件版本                                                          |

`tipConfig` 会原样透传给底层 `x-sender` 插件：组件本身不对配置做合并处理，`true/false` 用于开关功能，对象用于自定义配置项。

### MentionConfig

| 属性          | 类型                                                | 是否必填 | 默认值     | 说明                         |
| ------------- | --------------------------------------------------- | -------- | ---------- | ---------------------------- |
| `dialogTitle` | string                                              | true     | `''`       | 提及用户弹窗标题             |
| `options`     | \<{ id: string, name: string, avatar?: string }\>[] | true     | `[]`       | 数据选项                     |
| `callEvery`   | boolean                                             | false    | `false`    | 是否需要提及所有人选项       |
| `everyText`   | string                                              | false    | `所有人`   | 提及所有人的选项文案         |
| `asyncMatch`  | (matchStr: string) => Promise<MentionItem[]>        | false    | `null`     | 提及弹窗选项启用异步匹配模式 |
| `emptyText`   | string                                              | false    | `暂无数据` | 异步匹配选项为空时的提示文案 |

### TriggerConfig

| 属性          | 类型                               | 是否必填 | 默认值 | 说明                 |
| ------------- | ---------------------------------- | -------- | ------ | -------------------- |
| `dialogTitle` | string                             | true     | `''`   | 指令弹窗标题         |
| `key`         | string                             | true     | `null` | 触发指令选择的按键符 |
| `options`     | \<{ id: string, name: string }\>[] | true     | `[]`   | 数据选项             |

### SelectConfig

| 属性              | 类型                                                 | 是否必填 | 默认值           | 说明                     |
| ----------------- | ---------------------------------------------------- | -------- | ---------------- | ------------------------ |
| `dialogTitle`     | string                                               | true     | `''`             | 标签选择弹窗标题         |
| `key`             | string                                               | true     | `null`           | 选择标签标识             |
| `options`         | \<{ id: string, name: string, preview?: string }\>[] | true     | `[]`             | 数据选项                 |
| `multiple`        | boolean                                              | false    | `false`          | 开启多选                 |
| `emptyText`       | string                                               | false    | `暂无数据`       | 无选项时的提示文案       |
| `showSearch`      | boolean                                              | false    | `false`          | 开启搜索功能             |
| `placeholder`     | string                                               | false    | `输入关键字查询` | 搜索提示占位语           |
| `searchEmptyText` | string                                               | false    | `暂无数据`       | 搜索内容为空时的提示文案 |

### TipConfig

| 属性             | 类型     | 是否必填 | 默认值 | 说明                 |
| ---------------- | -------- | -------- | ------ | -------------------- |
| `tipTemplate`    | string   | false    | `''`   | 前置提示词模板       |
| `dialogTemplate` | string   | false    | `''`   | 指令弹窗模板         |
| `closeNames`     | string[] | false    | `[]`   | 关闭弹窗的按键符列表 |
| `offsetTop`      | number   | false    | `0`    | 弹窗顶部偏移量       |
