---
title: 'XSender'
badge:
  type: 'new'
  version: '2.0.0-beta.0'
---

## Introduction

`XSender` is a component with built-in smart conversation features including **input**, **tag selection**, **command popup**, **user mention**, and other scenarios.

:::warning

The plugin version must be greater than `1.3.98`. The previous version was named `EditorSender`, and there are significant API differences. Please take note.

:::

## Code Examples

### Basic Usage

<demo src="./demos/basic.vue"></demo>

### Placeholder

<demo src="./demos/placeholder.vue"></demo>

### Auto Focus

<demo src="./demos/auto-focus.vue"></demo>

### Status

<demo src="./demos/status.vue"></demo>

### Submit Type

<demo src="./demos/submit-type.vue"></demo>

### Layout Variant

<demo src="./demos/variant.vue"></demo>

### Custom Action List

<demo src="./demos/action-list.vue"></demo>

### Custom Prefix

<demo src="./demos/prefix.vue"></demo>

### Custom Header

<demo src="./demos/header.vue"></demo>

### Custom Footer

<demo src="./demos/footer.vue"></demo>

### Custom Input Style

<demo src="./demos/custom-style.vue"></demo>

### Max Length

<demo src="./demos/max-length.vue"></demo>

## Advanced Usage

### Input

<demo src="./demos/input.vue"></demo>

### Tag Selection

<demo src="./demos/select.vue"></demo>

### User Mention

<demo src="./demos/mention.vue"></demo>

### Command Trigger

<demo src="./demos/trigger.vue"></demo>

### Prefix Tip

<demo src="./demos/befor-tip.vue"></demo>

## Properties

### Props

| Property               | Type                 | Required | Default      | Description                                                                                       |
| ---------------------- | -------------------- | -------- | ------------ | ------------------------------------------------------------------------------------------------- |
| `placeholder`          | string               | false    | `请输入内容` | Placeholder text                                                                                  |
| `device`               | PC \| H5 \| auto     | false    | `auto`       | Interaction device                                                                                |
| `autoFocus`            | boolean              | false    | `false`      | Auto focus after render                                                                           |
| `variant`              | default \| updown    | false    | `default`    | Layout variant                                                                                    |
| `maxLength`            | number               | false    | `-1`         | Input length limit                                                                                |
| `submitType`           | enter \| shiftEnter  | false    | `enter`      | Submit type                                                                                       |
| `customStyle`          | CSSStyleDeclaration  | false    | `{}`         | Custom input style                                                                                |
| `loading`              | boolean              | false    | `false`      | Loading state                                                                                     |
| `disabled`             | boolean              | false    | `false`      | Disabled state                                                                                    |
| `clearable`            | boolean              | false    | `false`      | Show clear button                                                                                 |
| `headerAnimationTimer` | number               | false    | `300`        | Header animation duration                                                                         |
| `mentionConfig`        | MentionConfig        | false    | `null`       | User mention config                                                                               |
| `triggerConfig`        | TriggerConfig[]      | false    | `null`       | Command popup config                                                                              |
| `selectConfig`         | SelectConfig[]       | false    | `null`       | Tag selection config                                                                              |
| `tipConfig`            | TipConfig \| boolean | false    | `true`       | Prefix tip config (`true` enables defaults, `false` disables, object enables with custom options) |
| `getPlugin`            | () => typeof XSender | false    | `null`       | Custom underlying plugin version                                                                  |

`tipConfig` is passed through to the underlying `x-sender` plugin as-is. This component does not merge defaults on its own: booleans act as an on/off switch, and an object provides custom options.

### MentionConfig

| Property      | Type                                                | Required | Default    | Description                 |
| ------------- | --------------------------------------------------- | -------- | ---------- | --------------------------- |
| `dialogTitle` | string                                              | true     | `''`       | Mention popup title         |
| `options`     | \<{ id: string, name: string, avatar?: string }\>[] | true     | `[]`       | Data options                |
| `callEvery`   | boolean                                             | false    | `false`    | Enable "mention all" option |
| `everyText`   | string                                              | false    | `所有人`   | "Mention all" option text   |
| `asyncMatch`  | (matchStr: string) => Promise<MentionItem[]>        | false    | `null`     | Enable async matching mode  |
| `emptyText`   | string                                              | false    | `暂无数据` | Empty result text           |

### TriggerConfig

| Property      | Type                               | Required | Default | Description                       |
| ------------- | ---------------------------------- | -------- | ------- | --------------------------------- |
| `dialogTitle` | string                             | true     | `''`    | Command popup title               |
| `key`         | string                             | true     | `null`  | Trigger key for command selection |
| `options`     | \<{ id: string, name: string }\>[] | true     | `[]`    | Data options                      |

### SelectConfig

| Property          | Type                                                 | Required | Default          | Description               |
| ----------------- | ---------------------------------------------------- | -------- | ---------------- | ------------------------- |
| `dialogTitle`     | string                                               | true     | `''`             | Tag selection popup title |
| `key`             | string                                               | true     | `null`           | Tag selection identifier  |
| `options`         | \<{ id: string, name: string, preview?: string }\>[] | true     | `[]`             | Data options              |
| `multiple`        | boolean                                              | false    | `false`          | Enable multiple selection |
| `emptyText`       | string                                               | false    | `暂无数据`       | Empty result text         |
| `showSearch`      | boolean                                              | false    | `false`          | Enable search function    |
| `placeholder`     | string                                               | false    | `输入关键字查询` | Search placeholder        |
| `searchEmptyText` | string                                               | false    | `暂无数据`       | Empty search result text  |

### TipConfig

| Property         | Type     | Required | Default | Description             |
| ---------------- | -------- | -------- | ------- | ----------------------- |
| `tipTemplate`    | string   | false    | `''`    | Prefix tip template     |
| `dialogTemplate` | string   | false    | `''`    | Command popup template  |
| `closeNames`     | string[] | false    | `[]`    | Key list to close popup |
| `offsetTop`      | number   | false    | `0`     | Popup top offset        |
