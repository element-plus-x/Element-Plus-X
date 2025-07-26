# MentionSender Mention Input Box 🦥

## Introduction

`MentionSender` is an input box component for chat scenarios.

::: warning
Its functionality is basically the same as the `Sender` component. The only difference is the **properties and methods related to the directive popover**. Click here to quickly understand the difference 👉 [**Directive Difference**](https://element-plus-x.com/components/mentionSender/#packages-vue-element-plus-x-src-mentionSender-demos-options)
:::

Currently, we do not plan to combine the **directive features** of `MentionSender` and `Sender` into one, and we distinguish them only by component. In the future, we will consider merging the two features into a new component: `EditorSender` rich text input box component, to support more input box requirements.

::: tip
The `EditorSender` rich text input component will be inspired by Doubao's input box and will be available in the future:

<img src="./image1.png" width="100%">
:::

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
| `placeholder`             | String               | No       | ''                         | Placeholder text for the input box.                                                                                                                                                                                                                    |
| `auto-size`               | Object               | No       | \{ minRows:1, maxRows:6 \} | Set the minimum and maximum number of visible rows for the input box.                                                                                                                                                                                  |
| `read-only`               | Boolean              | No       | false                      | Whether the input box is read-only.                                                                                                                                                                                                                    |
| `disabled`                | Boolean              | No       | false                      | Whether the input box is disabled.                                                                                                                                                                                                                     |
| `submitBtnDisabled`       | Boolean \| undefined | No       | undefined                  | Disable the built-in send button. (Note the usage scenario)                                                                                                                                                                                            |
| `loading`                 | Boolean              | No       | false                      | Whether to show the loading state. When `true`, the input box will display a loading animation.                                                                                                                                                        |
| `clearable`               | Boolean              | No       | false                      | Whether the input box can be cleared. Shows the default clear button.                                                                                                                                                                                  |
| `allowSpeech`             | Boolean              | No       | false                      | Whether to allow voice input. Shows the built-in speech recognition button by default, using the browser's built-in speech recognition API.                                                                                                            |
| `submitType`              | String               | No       | 'enter'                    | Submission method. Supports `'shiftEnter'` (submit with `Shift + Enter`), `'cmdOrCtrlEnter'` (submit with `Command + Enter` or `Ctrl + Enter`), `'altEnter'` (submit with `Alt + Enter`).                                                              |
| `headerAnimationTimer`    | Number               | No       | 300                        | Custom header display duration in ms.                                                                                                                                                                                                                  |
| `inputWidth`              | String               | No       | '100%'                     | Width of the input box.                                                                                                                                                                                                                                |
| `variant`                 | String               | No       | 'default'                  | Variant type of the input box. Supports `'default'`, `'updown'`.                                                                                                                                                                                       |
| `showUpdown`              | Boolean              | No       | true                       | Whether to show the built-in style when the variant is `updown`.                                                                                                                                                                                       |
| `inputStyle`              | Object               | No       | \{}                        | Style of the input box.                                                                                                                                                                                                                                |
| `triggerStrings`          | string[]             | No       | []                         | String array for trigger directives.                                                                                                                                                                                                                   |
| `triggerPopoverVisible`   | Boolean              | No       | false                      | Whether the popover for the trigger directive is visible. Control with `v-model:triggerPopoverVisible`.                                                                                                                                                |
| `triggerPopoverWidth`     | String               | No       | 'fit-content'              | Width of the popover for the trigger directive. Supports percentage and other CSS units.                                                                                                                                                               |
| `triggerPopoverLeft`      | String               | No       | '0px'                      | Left margin of the popover for the trigger directive. Supports percentage and other CSS units.                                                                                                                                                         |
| `triggerPopoverOffset`    | Number               | No       | 8                          | Offset of the popover for the trigger directive. Must be a number, unit is px.                                                                                                                                                                         |
| `triggerPopoverPlacement` | String               | No       | 'top-start'                | Placement of the popover for the trigger directive. Values: `'top'` \| `'top-start'` \| `'top-end'` \| `'bottom'` \| `'bottom-start'` \| `'bottom-end'` \| `'left'` \| `'left-start'` \| `'left-end'` \| `'right'` \| `'right-start'` \| `'right-end'` |

## Events

| Event Name        | Description                                                   | Callback Parameter                    |
| ----------------- | ------------------------------------------------------------- | ------------------------------------- |
| `submit`          | Triggered when the built-in submit button is clicked.         | None                                  |
| `cancel`          | Triggered when the built-in loading button is clicked.        | None                                  |
| `recordingChange` | Triggered when the built-in speech recognition state changes. | None                                  |
| `select`          | Triggered when the trigger field is pressed.                  | `option: MentionOption`               |
| `search`          | Triggered when the user selects an option.                    | `searchValue: string, prefix: string` |
| `pasteFile`       | Triggered when paste files                  | `interface PasteFileEvent{firstFile: File; fileList: FileList}` |

## Ref Instance Methods

| Name               | Type     | Description                                                                                                                                 |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `openHeader`       | Function | Open the custom header of the input box.                                                                                                    |
| `closeHeader`      | Function | Close the custom header of the input box.                                                                                                   |
| `clear`            | Function | Clear the content of the input box.                                                                                                         |
| `blur`             | Function | Remove focus from the input box.                                                                                                            |
| `focus`            | Function | Focus the input box. By default, `focus('all')` selects all text, `focus('start')` focuses at the start, `focus('end')` focuses at the end. |
| `submit`           | Function | Submit the input content.                                                                                                                   |
| `cancel`           | Function | Cancel the loading state.                                                                                                                   |
| `startRecognition` | Function | Start speech recognition.                                                                                                                   |
| `stopRecognition`  | Function | Stop speech recognition.                                                                                                                    |
| `popoverVisible`   | Boolean  | Popover visibility for the trigger directive.                                                                                               |
| `inputInstance`    | Object   | Input box instance.                                                                                                                         |

## Slots

| Slot Name          | Parameter                        | Type | Description                                |
| ------------------ | -------------------------------- | ---- | ------------------------------------------ |
| `#header`          | -                                | Slot | For customizing the header content.        |
| `#prefix`          | -                                | Slot | For customizing the prefix content.        |
| `#action-list`     | -                                | Slot | For customizing the action list.           |
| `#footer`          | -                                | Slot | For customizing the footer content.        |
| `#trigger-label`   | `#trigger-label={ item, index }` | Slot | For customizing the popover label.         |
| `#trigger-loading` | -                                | Slot | For customizing the popover loading state. |
| `#trigger-header`  | -                                | Slot | For customizing the popover header.        |
| `#trigger-footer`  | -                                | Slot | For customizing the popover footer.        |

## Features

1. **Focus Control**: Supports setting focus to the start, end, or selecting all text, and can also remove focus.
2. **Custom Content**: Provides slots for header, prefix, and action list, allowing users to customize these parts.
3. **Submission Function**: Supports submitting input with `Shift + Enter`, and allows custom actions after submission.
4. **Loading State**: Can display a loading state to simulate the submission process.
5. **Voice Input**: Supports voice input for more convenient input.
6. **Clear Function**: The input box can be cleared for easy re-entry.
