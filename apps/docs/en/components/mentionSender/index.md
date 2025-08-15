---
title: MentionSender
---


## Introduction

`MentionSender` is an input box component for chat scenarios.

::: warning
Its functionality is basically the same as the `Sender` component. The only difference is the **properties and methods related to the directive popover**. Click here to quickly understand the difference 👉 [**Directive Difference**](https://element-plus-x.com/components/mentionSender/#packages-vue-element-plus-x-src-mentionSender-demos-options)
:::

Currently, we do not plan to combine the **directive features** of `MentionSender` and `Sender` into one, and we distinguish them only by component.

## Code Examples

### Basic Usage

<demo src="./demos/basic.vue"></demo>

### Placeholder

<demo src="./demos/placeholder.vue"></demo>

### Two-way Binding (Unbound, value will not change)

<demo src="./demos/v-model.vue"></demo>

### Submit Button Disabled State

<demo src="./demos/submit-btn-disabled.vue"></demo>

### Custom Max and Min Rows

<demo src="./demos/autosize.vue"></demo>

### Various States of the Input Component

<demo src="./demos/state.vue"></demo>

### Submission Methods

<demo src="./demos/submit-type.vue"></demo>

### Paste Files

<demo src="./demos/pasteFile.vue"></demo>

### Speech Recognition

::: warning
Built-in browser speech recognition API. You can use the [`useRecord`](https://element-plus-x.com/components/useRecord/) **hook** for easier integration and control of built-in speech recognition.
:::

<demo src="./demos/allow-speech.vue"></demo>

### Variant - Vertical Style

<demo src="./demos/variant.vue"></demo>

### Custom Action List

<demo src="./demos/action-list.vue"></demo>

### Custom Prefix

<demo src="./demos/prefix.vue"></demo>

### Custom Header

<demo src="./demos/header.vue"></demo>

### Custom Footer

<demo src="./demos/footer.vue"></demo>

### Custom Input Box Style

<demo src="./demos/input-style.vue"></demo>

### Input Focus Control

<demo src="./demos/focus.vue"></demo>

## Mention Directive Usage (Difference from Sender Component)

::: warning
Below are the **properties and methods** related to directives that are **different** from the `Sender` component. Please pay attention to the **usage differences**.

**💌 If you need to trigger a mention directive list in the middle of a content, you can use this component.**

This warm tip was last updated: `2025-04-16`
:::

### Custom Trigger Directive Array

<demo src="./demos/options.vue"></demo>

### Custom Trigger Directive String

<demo src="./demos/trigger-strings.vue"></demo>

### Custom Trigger Directive Separator

<demo src="./demos/trigger-split.vue"></demo>

### Trigger Directive Loading

<demo src="./demos/trigger-loading.vue"></demo>

### Custom Trigger Directive Filter

<demo src="./demos/filter-option.vue"></demo>

### Whole Deletion

<demo src="./demos/whole.vue"></demo>

### Trigger Directive Popover Placement

<demo src="./demos/trigger-popover-placement.vue"></demo>

### Trigger Directive Popover Offset

<demo src="./demos/trigger-popover-offset.vue"></demo>

### Popover Slots

<demo src="./demos/solts.vue"></demo>

### Search Event

<demo src="./demos/search.vue"></demo>

### Select Event

<demo src="./demos/select.vue"></demo>

## Props

| Name                      | Type                 | Required | Default                    | Description                                                                                                                                                                                                                                            |
| ------------------------- | -------------------- | -------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `v-model`                 | String               | No       | ''                         | Bound value of the input box, use `v-model` for two-way binding.                                                                                                                                                                                       |
| `placeholder`