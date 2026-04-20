---
'vue-element-plus-x': major
---

Release 2.0.0 stable version

## Breaking Changes

- Removed built-in Typewriter component. Use [x-markdown-vue](https://www.npmjs.com/package/x-markdown-vue) for Markdown rendering.
- Bubble & BubbleList CSS class names migrated from `el-bubble-*` to BEM-style `elx-bubble` namespace.
- CSS variable `--bubble-content-max-width` renamed to `--elx-bubble-content-max-width`.

## New Features

- Theme system integration: Bubble & BubbleList now support `ConfigProvider.themeOverrides` for full theme customization.
- New theme CSS variables: `--elx-bubble-bg`, `--elx-bubble-text-color`, `--elx-bubble-padding-x/y`, `--elx-bubble-radius`, `--elx-bubble-border-color`, `--elx-bubble-shadow`.
- BubbleList: added virtual scrolling, bidirectional loading, streaming follow, fog effect, mixed nodes, and auto-scroll features.
