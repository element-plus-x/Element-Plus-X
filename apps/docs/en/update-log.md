---
title: Changelog
---

This page summarizes notable changes. For full release details, refer to GitHub Releases/Changesets.

## [v2.0.0] - 2026-02-20

### 🎨 Theme

- Improved `ConfigProvider` theme support: `light/dark` switching and VitePress dark mode integration
- Added support for overriding `--elx-*` theme variables via `themeOverrides` (applied globally on `html`)

### 📚 Documentation

- Added a Theme guide focused on VitePress integration
- Updated `ConfigProvider` docs (CSS variable prefix note) and exposed it in the sidebar

### 💥 Breaking Changes

- **Removed `Typewriter` component**: The typewriter component has been removed from the component library and migrated to an independent Markdown rendering library [x-markdown-vue](https://www.npmjs.com/package/x-markdown-vue)

- **Removed `XMarkdown` / `XMarkdownAsync` components**: XMarkdown component has been removed from the component library and migrated to an independent NPM package [x-markdown-vue](https://www.npmjs.com/package/x-markdown-vue)
  - 📦 **New Package**: [x-markdown-vue](https://www.npmjs.com/package/x-markdown-vue)
  - 📂 **GitHub**: [element-plus-x/x-markdown](https://github.com/element-plus-x/x-markdown)
  - API is fully compatible, just replace the package name

- **Removed `Sender` / `MentionSender` components**: Sender and MentionSender components have been removed from the component library, please use `XSender` component instead

- **`Bubble` component changes**:
  - Removed `typing` property
  - Removed `isMarkdown` property
  - Removed `isFog` property
  - Removed `@start`, `@writing`, `@finish` events

- **`BubbleList` component changes**:
  - Removed `triggerIndices` property
  - `@complete` event parameter changed: no longer provides `TypewriterInstance` parameter

- **`ThoughtChain` component changes**:
  - Removed `typing` property
  - Removed `isMarkdown` property

### 📚 Migration Guide

#### New Markdown Rendering Library

[x-markdown-vue](https://www.npmjs.com/package/x-markdown-vue) is a powerful Vue 3 Markdown rendering component library that supports streaming rendering, code highlighting, LaTeX math formulas, Mermaid diagrams, and more.

```bash
pnpm add x-markdown-vue
```

#### Basic Usage

```vue
<template>
  <MarkdownRenderer :markdown="content" />
</template>

<script setup>
import { MarkdownRenderer } from 'x-markdown-vue';
import 'x-markdown-vue/style';

const content = ref('# Hello World\n\nThis is **Markdown** content');
</script>
```

#### Streaming Rendering (Alternative to Typing Effect)

```vue
<template>
  <MarkdownRenderer :markdown="content" :enable-animate="true" />
</template>
```

#### Using with Bubble Component

```vue
<template>
  <Bubble :avatar="avatar" placement="start">
    <template #content>
      <MarkdownRenderer :markdown="content" />
    </template>
  </Bubble>
</template>

<script setup>
import { MarkdownRenderer } from 'x-markdown-vue';
import 'x-markdown-vue/style';
</script>
```

## [v1.3.0] - 2025-07-15

### 🐛 Fixes

- Fixed **`Typewriter`** typing component completion event not working issue

### 🚀 New Features

- **`XMarkdown`** rendering component is here! Used for rendering built-in styles and custom components in `markdown components`. Incremental updates + custom rendering dual support

### 📚 Documentation Updates

- Updated development documentation
- Changed online preview to `storybook` project

### 🛠 Improvements

- Removed `playground` files, added `storybook` real-time preview mode for demonstrations

## [v1.2.0] - 2025-05-05

### 💥 Breaking Changes

- `types` **TypeScript type import syntax change**. After upgrade, please modify the original type syntax

  Previous syntax: too long

  ```vue
  import { BubbleProps } from
  'vue-element-plus-x/types/components/Bubble/types.d.ts'
  ```

  v1.2.0+ syntax: more concise

  ```vue
  import { BubbleProps } from 'vue-element-plus-x/types/Bubble'
  ```

- Auto-import conflict issue. If your project uses **unplugin-auto-import/vite** to auto-import **vue** and **ElementPlus**, you might see this error in the console![image-20250505212717436](/public/image-20250505212717436.png)![image-20250505213158083](/public/image-20250505213158083.png)

  ```tex
  The h function issue is caused by the component library's built-in Mermaid.js processing basic charts and functions, but Mermaid.js has a built-in rendering h method that conflicts with Vue's h function.
  The ElButtonGroup error is caused by the unplugin-vue-components/resolvers package's ElementPlusResolver causing duplicate import issues.
  ```

  **Solution: Modify project vite configuration**

  ```ts
  // vite.config.ts

  // plugin section

  plugins: [
    AutoImport({
      imports: ['vue'],
      ignore: ['h'], // Ignore auto-import h
      resolvers: [
        ElementPlusResolver({
          exclude: /ElButtonGroup/ // Ignore auto-import ElButtonGroup
        })
      ],
      dts: 'src/auto-import.d.ts'
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ];
  ```

  In subsequent project usage of h function, import manually. ElButtonGroup hasn't been encountered in usage yet, seems like the unplugin-vue-components/resolvers package hasn't updated its handling of ElButtonGroup. Even in elementplus source code, there doesn't seem to be any usage.

  ```vue
  import { h } from 'vue'
  ```

  💩 Because this is secondary development, after discovering the issue, we temporarily chose this approach. If there's a better, more elegant solution, please contact us to discuss the solution. 💩

### 🐛 Fixes

- Fixed **`Typewriter`** typing component MD code highlighting output exceeding maximum width style issue
- Fixed **`BubbleList`** bubble list component, after clearing array and adding new bubbles, losing auto-scroll issue
- Fixed **`Sender`**, **`MentionSender`** footer slot click auto-focus issue

### 🚀 New Features

- **`Prompts`** prompt collection component, used to display a set of predefined questions or suggestions related to the current context

- **`Conversations`** conversation management component. Supports grouped display, menu interaction, scroll loading, custom styling and other features. Suitable for message lists, file management, task grouping and other scenarios, meeting diverse business needs through flexible configuration and slot extensions

- **`FilesCard`** file card component, supporting visual presentation of multiple file types (images, documents, compressed packages, etc.), including file icons, names, descriptions, status and other information

- **`Attachments`** attachment upload component, attachment management component, supporting file list display, upload, drag interaction, scroll browsing and other features, suitable for scenarios requiring multi-file upload and display (such as form attachments, file management interfaces)

- **`Typewriter`** typing component's **markdown-it**, added **`prismjs`** highlighted code block style files, developers can import themselves

  **`Typewriter`** typing component's **markdown-it**, added **`Mermaid.js`** to support simple **charts** and **functions** rendering
  **`Typewriter`** typing component's **markdown-it**, opened third-party mdPlugins plugin reception processing, and third-party code highlighting highlight logic processing, details can be found at 👉 [Typewriter Documentation](https://element-plus-x.com/components/typewriter/)

### 📚 Documentation Updates

- Updated homepage introduction and communication requirements documentation. All `antdx` components have been fully replicated

## [v1.1.6] - 2025-04-16

### 🐛 Fixes

- Fixed **`Thinking`** thinking component expand/collapse animation stuttering bug

### 🚀 New Features

- **`Typewriter`** typing component, added **fog effect**. **`Bubble`** bubble component, **`BubbleList`** bubble list component, when not customizing content slots, automatically inherit and support fog effect properties
- **`BubbleList`** component added **back to bottom button**, and added hover content area scrollbar appearance. Enhanced interaction experience
- **`Sender`** component added **variants**, **footer**, **command trigger functionality**
- New **`MentionSender`** component, another **command** way of the **`Sender`** component

### 🛠 Improvements

- **`Sender`** component optimized the send button state to disabled when there's no value, @submit method will also be disabled

  But this creates a problem: there's a scenario where when a user only uploads a file without entering a value in the input box, the built-in send button is also disabled, and the @submit event is also disabled. So we decided to add the `submit-btn-disabled` property for this situation, providing developers with active control. In special scenarios, developers can customize the built-in send button's enable/disable state. (When customizing #action-list, this property also affects the submit event)

- **`Sender`** component added `input-style` property for developers to customize built-in input box styles

### 📚 Documentation Updates

- Updated **`Guide Documentation`** **[Development Documentation](https://element-plus-x.com/guide/develop.html)**, fixed documentation introduction error issues

## [v1.1.1] - 2025-04-06

### 💥 Breaking Changes

- `Sender` input component: two-way binding syntax change. Changed from previous `v-model:value` to direct `v-model` binding

### 🐛 Fixes

- Fixed `Sender` input component `v-model` two-way binding failure issue
- Fixed `Typewriter` typing component stuttering issue under streaming interface output
- Fixed `BubbleList` bubble list component auto-scroll failure issue under streaming interface output. And decoupled `BubbleList` component from typing component
- Fixed `BubbleList` bubble list component `maxWidth` failure issue. **[issue #46](https://github.com/HeJiaYue520/Element-Plus-X/issues/46)**

### 🚀 New Features

- Added `Thinking` thinking component and `ThoughtChain` thought chain component for displaying thinking process under streaming interface output. **[issue #32](https://github.com/HeJiaYue520/Element-Plus-X/issues/32)**, **[issue #45](https://github.com/HeJiaYue520/Element-Plus-X/issues/45)**

- Added `Welcome` welcome component for users to quickly integrate beautiful welcome introduction cards

## [v1.0.81] - 2025-03-29

### 🐛 Fixes

- Fixed `Sender` input component still being able to trigger `@submit` method in `loading` state bug **[issue #22](https://github.com/HeJiaYue520/Element-Plus-X/issues/22)**
- Fixed `Sender` input component still being able to modify values in `read-only` state bug

### 🚀 New Features

- Added `useRecord` hook function to solve the issue where users want to customize `Sender` input component's `#action-list` slot while also wanting to retain the component's built-in browser speech recognition API method. You can use this hook

- Added two hook functions and one utility class. For SSE protocol streaming requests, manage **data (rendering layer)** + **request (control layer)** states. Convenient for `Vue` developers to handle request states when using streaming interfaces; convenient to render needed data

  | Hook Function | Usage                                                                                                                                                                                                                                         | Characteristics                      |
  | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
  | useXStream    | Use alone: can automatically get streaming data; supports starting streaming requests, interrupting streaming requests;                                                                                                                       | More encapsulated, convenient to use |
  | useSend       | Can use alone: pass in start and end methods, returns method loading state.<br />Doesn't support returning data, if you need data and request state support, you need to combine with **XRequest**                                            | More low-level, flexible control     |
  | XRequest      | Can use alone: configure interface base address, use send to send requests, instance has many state listeners for this request.<br />Process data through event callback listeners. Generally used in projects combined with **useSend** hook | More low-level, flexible control     |

### 🛠 Improvements

- Optimized compatibility, `Sender` input component, due to using `defineModel` syntax, this syntax is only available in **`Vue 3.4+`** versions, causing many users to have console errors due to Vue version issues, now changed this syntax to low-version syntax. **(Seamless replacement, no need to change original syntax)**

### 📚 Documentation Updates

- Updated **`Guide Documentation`** **[Development Documentation](https://element-plus-x.com/guide/develop.html)**, focusing on modifying **development commands**, **contributing code**, **local debugging** full process introduction. Standardize `development` and `pr` submission

## [v1.0.6] - 2025-03-23

### 🛠 Improvements

- Integrated ESLint 9.x and Oxlint to standardize development process
- Added build configuration: automatically export full/on-demand components based on component file names

### 📚 Documentation Updates

- Improved Chinese/English documentation content
- Added documentation update log module

## [v0.9.x] - 2025-03-20

### 💥 Breaking Changes

- `Typography` component:
  - Deprecated `speed` property, changed to `step` property (aligned with ant-design-x)
  - Deprecated `typedjs` implementation of typing effect, streaming output failed, and each streaming output would cause component re-rendering
- `Bubble` component:
  - Deprecated `typing.speed` property value, changed to `typing.step` (aligned with ant-design-x)

### 🐛 Fixes

- Fixed `Typography` typing component rendering bug
- Fixed `Sender` input component `autosize` property failure bug

### 🚀 New Features

- **`Typography`/`Bubble` components**:
  - Added interrupt output (`pause`), continue typing (`resume`) and destroy (`destroy`) instance methods
  - Added operation monitoring events
- **`BubbleList` component**:
  - Added `trigger-indices` property for monitoring specified bubble `@complete` completion callbacks
- **`Sender` component**:
  - Added `@recording-change` event to monitor built-in recording button click state
  - Added start recording (`startRecording`) and stop recording (`stopRecording`) instance methods

## [v0.9.x] - 2025-03-14

### 💥 Breaking Changes

- `Typography` component:
  - Deprecated `step` property, changed to `speed` property to control typing speed
- `Bubble` component:
  - Deprecated `typing.step` property value, changed to `typing.speed` to control typing speed

### 🐛 Fixes

- Fixed `Typography` typing component rendering bug

### 🚀 New Features

- **`Bubble` component**:
  - Added `avatar-size` and `avatar-gap` properties to control bubble styles when no avatar is present
