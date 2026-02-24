---
title: Theme Tokens
---

# Theme Tokens

This page lists all overridable `--elx-*` CSS variables and provides a `themeOverrides` template:

- [/theme-overrides.template.ts](/theme-overrides.template.ts)

## Quick Start

`ConfigProvider` maps `themeOverrides` keys to CSS variables in the form `--elx-{key}` and applies them on global `html`:

```ts
const themeOverrides = {
  common: {
    'color-primary': '#7c3aed'
  },
  components: {
    Welcome: {
      'welcome-filled-bg': '#f0f9ff'
    }
  }
};
```

## Common Tokens (common)

| themeOverrides key       | CSS Variable                   | Default (Light)                   | Default (Dark)                    |
| ------------------------ | ------------------------------ | --------------------------------- | --------------------------------- |
| `color-primary`          | `--elx-color-primary`          | `#409eff`                         | `#409eff`                         |
| `color-success`          | `--elx-color-success`          | `#67c23a`                         | -                                 |
| `color-warning`          | `--elx-color-warning`          | `#e6a23c`                         | -                                 |
| `color-danger`           | `--elx-color-danger`           | `#f56c6c`                         | -                                 |
| `color-info`             | `--elx-color-info`             | `#909399`                         | -                                 |
| `text-color-primary`     | `--elx-text-color-primary`     | `#303133`                         | `#e5eaf3`                         |
| `text-color-regular`     | `--elx-text-color-regular`     | `#606266`                         | `#cfd3dc`                         |
| `text-color-secondary`   | `--elx-text-color-secondary`   | `#909399`                         | `#a3a6ad`                         |
| `text-color-placeholder` | `--elx-text-color-placeholder` | `#a8abb2`                         | `#8d9095`                         |
| `bg-page`                | `--elx-bg-page`                | `#f5f7fa`                         | `#1b1b1f`                         |
| `bg-surface`             | `--elx-bg-surface`             | `#ffffff`                         | `#141414`                         |
| `border-color`           | `--elx-border-color`           | `#dcdfe6`                         | `#4c4d4f`                         |
| `border-radius-base`     | `--elx-border-radius-base`     | `4px`                             | -                                 |
| `border-radius-small`    | `--elx-border-radius-small`    | `2px`                             | -                                 |
| `border-radius-round`    | `--elx-border-radius-round`    | `20px`                            | -                                 |
| `fill-color`             | `--elx-fill-color`             | `#f0f2f5`                         | `#303030`                         |
| `fill-color-light`       | `--elx-fill-color-light`       | `#f5f7fa`                         | `#262727`                         |
| `padding-xs`             | `--elx-padding-xs`             | `4px`                             | -                                 |
| `padding-sm`             | `--elx-padding-sm`             | `8px`                             | -                                 |
| `padding-md`             | `--elx-padding-md`             | `12px`                            | -                                 |
| `padding-lg`             | `--elx-padding-lg`             | `16px`                            | -                                 |
| `padding-xl`             | `--elx-padding-xl`             | `20px`                            | -                                 |
| `box-shadow`             | `--elx-box-shadow`             | `0 2px 12px 0 rgba(0, 0, 0, 0.1)` | `0 2px 12px 0 rgba(0, 0, 0, 0.3)` |
| `box-shadow-light`       | `--elx-box-shadow-light`       | `0 2px 8px 0 rgba(0, 0, 0, 0.06)` | -                                 |

## Component Tokens (components)

`components` is only for organization and conflict avoidance; in the end, everything maps to `--elx-*` CSS variables.

### Attachments

| themeOverrides key              | CSS Variable                          | Default (Light)                     | Default (Dark)                    |
| ------------------------------- | ------------------------------------- | ----------------------------------- | --------------------------------- |
| `attachments-fade-rgb`          | `--elx-attachments-fade-rgb`          | `255, 255, 255`                     | `20, 20, 20`                      |
| `attachments-nav-bg`            | `--elx-attachments-nav-bg`            | `rgba(0, 0, 0, 0.3)`                | `rgba(255, 255, 255, 0.12)`       |
| `attachments-nav-bg-hover`      | `--elx-attachments-nav-bg-hover`      | `rgba(0, 0, 0, 0.5)`                | `rgba(255, 255, 255, 0.18)`       |
| `attachments-nav-bg-active`     | `--elx-attachments-nav-bg-active`     | `rgba(0, 0, 0, 0.7)`                | `rgba(255, 255, 255, 0.25)`       |
| `attachments-nav-color`         | `--elx-attachments-nav-color`         | `#ffffff`                           | `#ffffff`                         |
| `attachments-drop-bg`           | `--elx-attachments-drop-bg`           | `rgba(225, 225, 225, 0.3)`          | `rgba(255, 255, 255, 0.08)`       |
| `attachments-upload-icon-color` | `--elx-attachments-upload-icon-color` | `var(--elx-text-color-placeholder)` | `var(--elx-text-color-secondary)` |
| `attachments-upload-icon-size`  | `--elx-attachments-upload-icon-size`  | `64px`                              | `64px`                            |

### Bubble

| themeOverrides key         | CSS Variable                     | Default (Light)                            | Default (Dark)                             |
| -------------------------- | -------------------------------- | ------------------------------------------ | ------------------------------------------ |
| `bubble-content-max-width` | `--elx-bubble-content-max-width` | `500px`                                    | `500px`                                    |
| `bubble-bg`                | `--elx-bubble-bg`                | `var(--el-fill-color)`                     | `var(--el-fill-color)`                     |
| `bubble-border-color`      | `--elx-bubble-border-color`      | `var(--el-border-color)`                   | `var(--el-border-color)`                   |
| `bubble-text-color`        | `--elx-bubble-text-color`        | `var(--el-text-color-primary)`             | `var(--el-text-color-primary)`             |
| `bubble-radius`            | `--elx-bubble-radius`            | `calc(var(--el-border-radius-base) + 4px)` | `calc(var(--el-border-radius-base) + 4px)` |
| `bubble-padding-y`         | `--elx-bubble-padding-y`         | `var(--el-padding-sm, 12px)`               | `var(--el-padding-sm, 12px)`               |
| `bubble-padding-x`         | `--elx-bubble-padding-x`         | `calc(var(--el-padding-sm, 12px) + 4px)`   | `calc(var(--el-padding-sm, 12px) + 4px)`   |
| `bubble-shadow`            | `--elx-bubble-shadow`            | `var(--el-box-shadow)`                     | `var(--el-box-shadow)`                     |
| `bubble-dot-color`         | `--elx-bubble-dot-color`         | `var(--el-color-primary)`                  | `var(--el-color-primary)`                  |

### BubbleList

| themeOverrides key       | CSS Variable                   | Default (Light) | Default (Dark) |
| ------------------------ | ------------------------------ | --------------- | -------------- |
| `bubble-list-max-height` | `--elx-bubble-list-max-height` | `100%`          | `100%`         |
| `bubble-list-btn-size`   | `--elx-bubble-list-btn-size`   | `24px`          | `24px`         |

### Conversations

| themeOverrides key                 | CSS Variable                             | Default (Light) | Default (Dark) |
| ---------------------------------- | ---------------------------------------- | --------------- | -------------- |
| `conversations-list-auto-bg-color` | `--elx-conversations-list-auto-bg-color` | `#fff`          | `#fff`         |
| `conversations-label-height`       | `--elx-conversations-label-height`       | `20px`          | `20px`         |

### FilesCard

| themeOverrides key               | CSS Variable                           | Default (Light)                   | Default (Dark)                   |
| -------------------------------- | -------------------------------------- | --------------------------------- | -------------------------------- |
| `files-card-bg`                  | `--elx-files-card-bg`                  | `rgba(0, 0, 0, 0.04)`             | `rgba(255, 255, 255, 0.06)`      |
| `files-card-border-color`        | `--elx-files-card-border-color`        | `rgba(0, 0, 0, 0.1)`              | `rgba(255, 255, 255, 0.12)`      |
| `files-card-progress-bg`         | `--elx-files-card-progress-bg`         | `rgba(0, 0, 0, 0.06)`             | `rgba(255, 255, 255, 0.06)`      |
| `files-card-delete-bg`           | `--elx-files-card-delete-bg`           | `rgba(255, 255, 255, 0.9)`        | `rgba(0, 0, 0, 0.55)`            |
| `files-card-delete-border-color` | `--elx-files-card-delete-border-color` | `var(--elx-border-color)`         | `rgba(255, 255, 255, 0.12)`      |
| `files-card-delete-color`        | `--elx-files-card-delete-color`        | `var(--elx-text-color-secondary)` | `rgba(255, 255, 255, 0.72)`      |
| `files-card-delete-shadow`       | `--elx-files-card-delete-shadow`       | `0 2px 8px rgba(0, 0, 0, 0.12)`   | `0 4px 12px rgba(0, 0, 0, 0.35)` |
| `files-card-icon-size`           | `--elx-files-card-icon-size`           | `42px`                            | `42px`                           |
| `files-card-max-width`           | `--elx-files-card-max-width`           | `236px`                           | `236px`                          |

### Thinking

| themeOverrides key                          | CSS Variable                                      | Default (Light)                 | Default (Dark)                  |
| ------------------------------------------- | ------------------------------------------------- | ------------------------------- | ------------------------------- |
| `thinking-button-width`                     | `--elx-thinking-button-width`                     | `160px`                         | `160px`                         |
| `thinking-animation-duration`               | `--elx-thinking-animation-duration`               | `0.2s`                          | `0.2s`                          |
| `thinking-content-wrapper-width`            | `--elx-thinking-content-wrapper-width`            | `500px`                         | `500px`                         |
| `thinking-content-wrapper-background-color` | `--elx-thinking-content-wrapper-background-color` | `rgba(0, 0, 0, 0.02)`           | `rgba(255, 255, 255, 0.04)`     |
| `thinking-content-wrapper-color`            | `--elx-thinking-content-wrapper-color`            | `var(--elx-text-color-regular)` | `var(--elx-text-color-regular)` |
| `thinking-trigger-bg`                       | `--elx-thinking-trigger-bg`                       | `#fff`                          | `rgba(255, 255, 255, 0.06)`     |
| `thinking-trigger-bg-hover`                 | `--elx-thinking-trigger-bg-hover`                 | `rgba(0, 0, 0, 0.03)`           | `rgba(255, 255, 255, 0.08)`     |
| `thinking-trigger-border-color`             | `--elx-thinking-trigger-border-color`             | `var(--elx-border-color)`       | `rgba(255, 255, 255, 0.12)`     |
| `thinking-content-bg`                       | `--elx-thinking-content-bg`                       | `rgba(0, 0, 0, 0.02)`           | `rgba(255, 255, 255, 0.04)`     |
| `thinking-content-color`                    | `--elx-thinking-content-color`                    | `var(--elx-text-color-regular)` | `var(--elx-text-color-regular)` |

### Welcome

| themeOverrides key          | CSS Variable                      | Default (Light)       | Default (Dark) |
| --------------------------- | --------------------------------- | --------------------- | -------------- |
| `welcome-border-radius`     | `--elx-welcome-border-radius`     | `8px`                 | -              |
| `welcome-icon-size`         | `--elx-welcome-icon-size`         | `64px`                | -              |
| `welcome-icon-size-small`   | `--elx-welcome-icon-size-small`   | `48px`                | -              |
| `welcome-gap`               | `--elx-welcome-gap`               | `16px`                | -              |
| `welcome-gap-small`         | `--elx-welcome-gap-small`         | `8px`                 | -              |
| `welcome-padding`           | `--elx-welcome-padding`           | `24px`                | -              |
| `welcome-filled-bg`         | `--elx-welcome-filled-bg`         | `#e6f4ff`             | -              |
| `welcome-filled-border`     | `--elx-welcome-filled-border`     | `#91caff`             | -              |
| `welcome-title-color`       | `--elx-welcome-title-color`       | `rgba(0, 0, 0, 0.88)` | -              |
| `welcome-description-color` | `--elx-welcome-description-color` | `rgba(0, 0, 0, 0.65)` | -              |

### XSender

| themeOverrides key         | CSS Variable                     | Default (Light) | Default (Dark) |
| -------------------------- | -------------------------------- | --------------- | -------------- |
| `x-sender-header-duration` | `--elx-x-sender-header-duration` | `300ms`         | `300ms`        |
