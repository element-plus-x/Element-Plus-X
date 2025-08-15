---
title: Prompts
---


## Introduction

`Prompts` is used to display a set of predefined questions or suggestions related to the current context.

## Code Examples

### Basic Usage

<demo src="./demos/base.vue"></demo>

### Disabled State

<demo src="./demos/disabled.vue"></demo>

### Vertical Layout

<demo src="./demos/vertical.vue"></demo>

### Wrapping

<demo src="./demos/wrap.vue"></demo>

### Responsive Width

<demo src="./demos/responsive.vue"></demo>

### Customized Styles

<demo src="./demos/customized.vue"></demo>

### Nested Combination

<demo src="./demos/nested.vue"></demo>

## Attributes

| Attribute  | Type                  | Required | Default | Description                                                                                                               |
| ---------- | --------------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| `title`    | `string`              | No       | `''`    | Main title text content of the prompts set                                                                                |
| `items`    | `PromptsItemsProps[]` | No       | `[]`    | Array of prompt items, each element contains label, icon, description and other information (see structure details below) |
| `wrap`     | `boolean`             | No       | `false` | Whether to allow prompt items to wrap automatically (only effective in horizontal layout)                                 |
| `vertical` | `boolean`             | No       | `false` | Whether to arrange prompt items vertically (layout direction is column in vertical mode)                                  |
| `style`    | `CSSProperties`       | No       | `{}`    | Custom styles for component container (directly applied to the outermost `div.el-prompts`)                                |

**`PromptsItemsProps` Structure Details** (single prompt item attributes):

```typescript
interface PromptsItemsProps {
  key: string | number; // Unique identifier (for state association)
  label?: string; // Prompt item label text
  icon?: ComponentVNode; // Prompt item icon (Vue component form)
  description?: string; // Prompt item description text
  disabled?: boolean; // Whether disabled (no interaction response when disabled)
  itemStyle?: CSSProperties; // Custom base styles for prompt item
  itemHoverStyle?: CSSProperties; // Custom styles for prompt item hover state
  itemActiveStyle?: CSSProperties; // Custom styles for prompt item active state
  children?: PromptsItemsProps[]; // Child prompt items array (for nested display)
}
```

## Events

| Event Name   | Parameters                  | Type     | Description                                    |
| ------------ | --------------------------- | -------- | ---------------------------------------------- |
| `@itemClick` | `(item: PromptsItemsProps)` | Function | Event triggered when a prompt item is clicked. |

## Slots

| Slot Name      | Parameters                    | Type   | Description                                                                                                                 |
| -------------- | ----------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------- |
| `#title`       | -                             | `Slot` | Custom prompt set title content (if `title` attribute is also set, slot content will override attribute text)               |
| `#icon`        | `{ item: PromptsItemsProps }` | `Slot` | Custom icon content for prompt item (receives current prompt item `item` parameter, can override `item.icon`)               |
| `#label`       | `{ item: PromptsItemsProps }` | `Slot` | Custom label content for prompt item (receives current prompt item `item` parameter, can override `item.label`)             |
| `#description` | `{ item: PromptsItemsProps }` | `Slot` | Custom description content for prompt item (receives current prompt item `item` parameter, can override `item.description`) |

## Features

1. **Multi-dimensional Content Display**: Supports configuring basic information such as labels, icons, and descriptions through the `items` attribute, while providing `label`/`icon`/`description` slots for highly customizable content.
2. **Flexible Layout Control**: Switch between vertical/horizontal arrangement modes through the `vertical` attribute, control automatic wrapping capability in horizontal arrangement through the `wrap` attribute, adapting to different scene layout requirements.
3. **Interactive State Feedback**: Built-in hover (background color lightens) and active (background color darkens) state styles, supports custom state styles through `itemHoverStyle`/`itemActiveStyle`, enhancing interactive experience.
4. **Disabled State Support**: Individual prompt items can be disabled through the `item.disabled` attribute. In disabled state, no response to click events and background color turns gray, clearly indicating non-operable state.
5. **Nested Hierarchy Display**: Supports configuring child prompt items through `item.children`, component automatically recursively renders nested structure, meeting multi-level classification or related prompt display requirements.
6. **Fine-grained Style Customization**: Supports controlling overall component styles through the `style` attribute, controlling individual prompt item base styles through `itemStyle`, supports separate state style configuration (`itemHoverStyle`/`itemActiveStyle`).
