---
title: Thinking
---


## Introduction

`Thinking` is a component used to display thinking states, supporting **state management**, **content expand/collapse**, and **custom styling**. Through visual feedback of different states (start/thinking/end/error), it helps users intuitively understand AI's thinking process. The component has built-in transition animations and provides flexible extension slots, suitable for use in intelligent conversations, data analysis, and other scenarios.

::: info

This component can be used together with components like `BubbleList` to achieve richer interactive experiences.

:::

## Code Examples

### Basic Usage

<demo src="./demos/base.vue"></demo>

### Content Expand/Collapse

<demo src="./demos/content.vue"></demo>

### State Management

<demo src="./demos/v-model.vue"></demo>

### State Styles

<demo src="./demos/status.vue"></demo>

### Auto Collapse

<demo src="./demos/autoCollapse.vue"></demo>

### Disabled State

<demo src="./demos/disabled.vue"></demo>

### Width Customization

<demo src="./demos/width.vue"></demo>

### Content Color Style Customization

<demo src="./demos/color.vue"></demo>

### Slot Customization

<demo src="./demos/solt.vue"></demo>

## Attributes

| Attribute         | Type           | Required | Default                  | Description                                                                                   |
| ----------------- | -------------- | -------- | ------------------------ | --------------------------------------------------------------------------------------------- |
| `content`         | String         | No       | `''`                     | Main content text to display, no typing effect, determined by interface response              |
| `modelValue`      | Boolean        | No       | `true`                   | Expand state bound through v-model, default is expanded                                       |
| `status`          | ThinkingStatus | No       | `'start'`                | Component state: `start` (start) / `thinking` (thinking) / `end` (complete) / `error` (error) |
| `autoCollapse`    | Boolean        | No       | `false`                  | Whether to automatically collapse content area when component state changes to `end`          |
| `disabled`        | Boolean        | No       | `false`                  | Whether to disable component interaction                                                      |
| `buttonWidth`     | String         | No       | `'160px'`                | Trigger button width                                                                          |
| `duration`        | String         | No       | `'0.2s'`                 | Transition animation duration                                                                 |
| `maxWidth`        | String         | No       | `'500px'`                | Maximum width of content area                                                                 |
| `backgroundColor` | String         | No       | `'#fcfcfc'`              | Background color of content area                                                              |
| `color`           | String         | No       | `'var(--el-color-info)'` | Content text color                                                                            |

## Events

| Event Name | Parameters                              | Type     | Description                                   |
| ---------- | --------------------------------------- | -------- | --------------------------------------------- |
| `@change`  | \{value:boolean,status:ThinkingStatus\} | Function | Triggered when expand state or status changes |

## Slots

| Slot Name      | Parameters    | Type | Description                           |
| -------------- | ------------- | ---- | ------------------------------------- |
| `#status-icon` | \{ status \}  | Slot | Custom status icon                    |
| `#label`       | \{ status \}  | Slot | Custom button text                    |
| `#arrow`       | -             | Slot | Custom arrow icon                     |
| `#content`     | \{ content \} | Slot | Custom content area (non-error state) |
| `#error`       | -             | Slot | Custom error message content display  |

## Features

1. **Multi-state Management**
   - Supports four states: `start`/`thinking`/`end`/`error`, automatically switches corresponding icons and text
   - Forces display of fixed error prompt in error state

2. **Interactive Feedback**
   - Smooth sliding animation when expanding/collapsing content area
   - Button click feedback supports custom transition effects

3. **Style Customization**
   - Controls visual properties such as size and color through CSS variables
   - Provides complete slot extension capabilities, supports custom icons and content

4. **Smart Behavior**
   - Automatically adjusts expand state when status changes
   - Maintains visual feedback but blocks interaction in disabled state
