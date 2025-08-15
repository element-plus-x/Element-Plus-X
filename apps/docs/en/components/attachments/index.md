---
title: Attachments
---

# Attachments File Upload Component 📪️

## Introduction

The `Attachments` component is a feature-rich attachment management component that supports file list display, upload, drag-and-drop interaction, scroll browsing, and more. It is suitable for scenarios that require handling multiple file uploads and displays (such as form attachments, file management interfaces). The component has a built-in file upload button, drag-and-drop prompt area, and provides flexible custom slots and style configuration.

## Code Examples

### Basic Usage

<demo src="./demos/base.vue"></demo>

### Scroll Mode

<demo src="./demos/scroll-mode.vue"></demo>

### Custom File List

<demo src="./demos/custom-list.vue"></demo>

### Drag and Drop Upload

<demo src="./demos/drag-upload.vue"></demo>

### Custom Scroll Buttons

<demo src="./demos/custom-scroll-buttons.vue"></demo>

## Props

| Name             | Type                                         | Required | Default     | Description                                                                                 |
| ---------------- | -------------------------------------------- | -------- | ----------- | ------------------------------------------------------------------------------------------- |
| `items`          | `FilesCardProps[]`                           | No       | `[]`        | File list data (includes basic file info such as name, type, status, etc.)                  |
| `overflow`       | `'scrollX' \| 'scrollY' \| 'wrap'`           | No       | `'scrollX'` | Scroll layout mode (horizontal scroll/vertical scroll/wrap)                                 |
| `listStyle`      | `CSSProperties`                              | No       | `{}`        | Custom style for the list container                                                         |
| `uploadIconSize` | `string`                                     | No       | `'64px'`    | Upload button icon size                                                                     |
| `dragTarget`     | `string \| Ref<HTMLElement> \| null`         | No       | `null`      | Drag target element (supports selector string or DOM ref, defaults to the component itself) |
| `hideUpload`     | `boolean`                                    | No       | `false`     | Whether to hide the default upload button                                                   |
| `limit`          | `number`                                     | No       | `undefined` | File quantity limit (hides upload button if exceeded)                                       |
| `beforeUpload`   | `(file: File) => boolean`                    | No       | `undefined` | Pre-upload validation function (return `false` to prevent upload)                           |
| `httpRequest`    | `(options: { file: File }) => Promise<void>` | No       | `undefined` | Custom upload request function (must return a Promise)                                      |

## Slots

| Slot Name          | Slot Parameter                                 | Description                                                                              |
| ------------------ | ---------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `#file-list`       | `{ items: FilesCardProps[] }`                  | Custom file list content (overrides default `FilesCard` display)                         |
| `#prev-button`     | `{ show: boolean, onScrollLeft: () => void }`  | Custom left scroll button (`scrollX` mode), `show` controls visibility                   |
| `#next-button`     | `{ show: boolean, onScrollRight: () => void }` | Custom right scroll button (`scrollX` mode), `show` controls visibility                  |
| `#empty-upload`    | `-`                                            | Custom upload area when file list is empty (default shows plus upload button)            |
| `#no-empty-upload` | `-`                                            | Custom upload placeholder when file list is not empty (default shows plus upload button) |
| `#drop-area`       | `-`                                            | Custom overlay content during drag upload (default shows upload icon and text)           |

## Events

| Event Name      | Callback Parameter                                     | Description                                                                                 |
| --------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `uploadChange`  | `(file: File, fileList: FileListProps)`                | Triggered when file selection changes (includes selected file and current file list)        |
| `uploadSuccess` | `(response: any, file: File, fileList: FileListProps)` | Triggered when file upload succeeds (returns response, current file, and file list)         |
| `uploadError`   | `(error: any, file: File, fileList: FileListProps)`    | Triggered when file upload fails (returns error, current file, and file list)               |
| `uploadDrop`    | `(files: File[], props: FileListProps)`                | Triggered when files are dropped (includes dropped files array and component props)         |
| `deleteCard`    | `(item: FilesCardProps, index: number)`                | Triggered when the file card delete button is clicked (returns deleted file info and index) |

## Support for el-upload Props

The component internally uses the **elementplus** `el-upload` component, so it supports most of its upload properties, such as: `httpRequest`, `beforeUpload`, etc. For details, please refer to: [element-plus/upload](https://element-plus.org/zh-CN/component/upload.html)

## Features

1. **Multiple Layout Modes**: Supports `scrollX` (horizontal scroll), `scrollY` (vertical scroll), and `wrap` (auto wrap) layouts to adapt to different screen spaces and file quantities.
2. **Drag-and-Drop Upload Interaction**: Built-in drag target area (customizable via `dragTarget`), shows a semi-transparent overlay prompt during drag, supports folder filtering and file type validation.
3. **Highly Customizable**: Fully customize file list display via the `#file-list` slot (e.g., replace with custom card component), supports custom scroll buttons and upload button styles.
4. **File Status Management**: With the `FilesCard` component, supports visual states for uploading (progress bar), completed, failed, etc., and automatically syncs file list updates.
