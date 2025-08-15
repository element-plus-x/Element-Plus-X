---
title: ThoughtChain
---


## Introduction

`ThoughtChain` is a timeline component used to display AI thinking processes, supporting **state management**, **content expand/collapse**, and **dynamic style configuration**. Through visual thinking step sequences, it helps users intuitively understand complex logical flows. The component has built-in multiple state feedback, transition animations, and extension slots, suitable for intelligent conversations, data analysis, process guidance, and other scenarios.

## Code Examples

### Basic Usage

<demo src="./demos/base.vue"></demo>

### Dot Size Control

<demo src="./demos/dot-size.vue"></demo>

### Max Width Control

<demo src="./demos/max-width.vue"></demo>

### Custom Title and Content

<demo src="./demos/key-label.vue"></demo>

### Extension Slots

<demo src="./demos/solt.vue"></demo>

### Manual Expand State Control

<demo src="./demos/handle-expand.vue"></demo>

<!-- <demo src="./demos/status-key-test.vue"></demo> -->

## Attributes

- **Component Attributes**

| Parameter         | Type                          | Default        | Description                           |
| ----------------- | ----------------------------- | -------------- | ------------------------------------- |
| `thinkingItems`   | `Array<ThoughtChainItemBase>` | []             | Thinking items array                  |
| `dotSize`         | 'small'/'default'/'large'     | 'default'      | Timeline dot size                     |
| `maxWidth`        | string                        | '600px'        | Maximum width                         |
| `lineGradient`    | boolean                       | false          | Whether to enable line color gradient |
| `rowKey`          | string                        | 'id'           | Data item unique identifier field     |
| `titleKey`        | string                        | 'title'        | Title field name                      |
| `thinkTitleKey`   | string                        | 'thinkTitle'   | Thinking title field name             |
| `thinkContentKey` | string                        | 'thinkContent' | Thinking content field name           |

- **ThoughtChainItemBase** Array item type definition

| Parameter         | Type                                | Default      | Description                                                    |
| ----------------- | ----------------------------------- | ------------ | -------------------------------------------------------------- |
| `id`              | `string \| number`                  | **Required** | Node unique identifier                                         |
| `title`           | `string`                            | `undefined`  | Main title                                                     |
| `thinkTitle`      | `string`                            | `undefined`  | Collapse panel title (thinking title)                          |
| `thinkContent`    | `string`                            | `undefined`  | Detailed content displayed when expanded                       |
| `status`          | `'loading' \| 'error' \| 'success'` | `undefined`  | Node status identifier (affects icon and color)                |
| `isCanExpand`     | `boolean`                           | `undefined`  | Whether to allow expanding node content                        |
| `isDefaultExpand` | `boolean`                           | `undefined`  | Whether to expand node content by default                      |
| `isMarkdown`      | `boolean`                           | `undefined`  | Whether to enable Markdown format rendering                    |
| `typing`          | `TypingConfig`                      | `undefined`  | Typewriter effect configuration (same as typewriter component) |

## Events

| Event Name     | Parameter Type                   | Description                         |
| -------------- | -------------------------------- | ----------------------------------- |
| `handleExpand` | `item: ThoughtChainItemProps<T>` | Triggered when expand state changes |

## Slots

| Slot Name | Scope Parameters | Description              |
| --------- | ---------------- | ------------------------ |
| `#icon`   | \{ item \}       | Custom timeline dot icon |

## Core Features

1. **Multi-state Visualization**
   - Supports `loading`/`success`/`error`
   - Automatically switches loading animations, icons, and color feedback

2. **Dynamic Content Management**
   - Supports content collapse/expand (configurable default expanded items)
   - Built-in typewriter effect (Typewriter component)
   - Supports Markdown format rendering

3. **Flexible Style Configuration**
   - Custom timeline width, dot size
   - Dynamic color gradient lines
   - CSS variable theme override

4. **Responsive Interaction**
   - Smooth transition animations
   - Supports dynamic addition/deletion of thinking items
   - Two-way binding of expand state
