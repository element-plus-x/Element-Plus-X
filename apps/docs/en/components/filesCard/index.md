---
title: FilesCard
---


## Introduction

The `FilesCard` component is a flexible file display component that supports visual presentation of various file types (images, documents, compressed files, etc.), including file icons, names, descriptions, status and other information. It provides rich customization options and interactive features, suitable for file management, upload preview and other scenarios.

## Code Examples

### Basic Usage

<demo src="./demos/base.vue"></demo>

### Status Setting

<demo src="./demos/status.vue"></demo>

### Display Delete Icon

<demo src="./demos/delete-icon.vue"></demo>

### Image File Display

<demo src="./demos/image-preview.vue"></demo>

### Custom Styles and Interaction

<demo src="./demos/custom-style.vue"></demo>

### Custom Built-in File Colors

<demo src="./demos/custom-color.vue"></demo>

## Properties

| Property Name    | Type                               | Required | Default           | Description                                                                                       |
| ---------------- | ---------------------------------- | -------- | ----------------- | ------------------------------------------------------------------------------------------------- |
| `uid`            | `string \| number`                 | Yes       |        | File unique identifier                                                                            |
| `name`           | `string`                           | No       | `undefined`       | File name (supports automatic suffix parsing to match icons)                                      |
| `fileSize`       | `number`                           | No       | `undefined`       | File size (unit: bytes, automatically converted to readable format)                               |
| `fileType`       | `string`                           | No       | `undefined`       | File type (priority higher than `name` suffix parsing, e.g. `'image'`, `'document'`)              |
| `description`    | `string`                           | No       | `undefined`       | Description text (supports dynamic generation of file type and size info)                         |
| `url`            | `string`                           | No       | `undefined`       | File access URL (image files can be used for preview)                                             |
| `thumbUrl`       | `string`                           | No       | `undefined`       | Image thumbnail URL                                                                               |
| `imgFile`        | `File \| Blob`                     | No       | `undefined`       | Image file stream (automatically parsed as preview URL, only for temporary display before upload) |
| `iconSize`       | `string`                           | No       | `'42px'`          | Icon/image size                                                                                   |
| `iconColor`      | `string`                           | No       | `undefined`       | Icon color for non-image files (supports custom color values)                                     |
| `showDelIcon`    | `boolean`                          | No       | `false`           | Whether to show hover delete icon                                                                 |
| `maxWidth`       | `string`                           | No       | `'236px'`         | Card maximum width                                                                                |
| `style`          | `CSSProperties`                    | No       | `undefined`       | Card custom styles                                                                                |
| `hoverStyle`     | `CSSProperties`                    | No       | `undefined`       | Card custom styles when hovering                                                                  |
| `imgVariant`     | `'rectangle' \| 'square'`          | No       | `'rectangle'`     | Image card form (rectangle/square)                                                                |
| `imgPreview`     | `boolean`                          | No       | `true`            | Whether to enable image preview functionality                                                     |
| `imgPreviewMask` | `boolean`                          | No       | `true`            | Whether to show image preview mask overlay                                                        |
| `status`         | `'uploading' \| 'done' \| 'error'` | No       | `undefined`       | File status (controls progress bar, error prompts and other visual feedback)                      |
| `percent`        | `number`                           | No       | `0`               | Upload progress percentage (used with `status="uploading"`)                                       |
| `errorTip`       | `string`                           | No       | `'Upload failed'` | Custom error status prompt text                                                                   |

## Slots

| Slot Name                | Slot Parameters                            | Description                                                                |
| ------------------------ | ------------------------------------------ | -------------------------------------------------------------------------- |
| `#icon`                  | `{ item: FilesCardProps }`                 | Custom icon area (priority higher than auto-parsed built-in icons)         |
| `#content`               | `{ item: FilesCardProps }`                 | Custom content area (overrides default name and description display)       |
| `#name-prefix`           | `{ item: FilesCardProps, prefix, suffix }` | Custom file name prefix (for truncation display scenarios)                 |
| `#name-suffix`           | `{ item: FilesCardProps, prefix, suffix }` | Custom file name suffix (for truncation display scenarios)                 |
| `#description`           | `{ item: FilesCardProps, prefix, suffix }` | Custom description text (overrides default generated description)          |
| `#image-preview-actions` | `{ item: FilesCardProps, prefix, suffix }` | Image preview mask content (displayed on hover, requires `imgPreviewMask`) |
| `#del-icon`              | `{ item: FilesCardProps }`                 | Custom delete icon (default uses Element Plus `CircleCloseFilled` icon)    |

## Events

| Event Name      | Callback Parameters | Description                                                                         |
| --------------- | ------------------- | ----------------------------------------------------------------------------------- |
| `delete`        | `{ ...props }`      | Triggered when delete button is clicked, passes complete properties of current card |
| `image-preview` | `{ ...props }`      | Called when image preview function is triggered (click image or mask layer)         |

## Features

1. **Automatic File Type Recognition** Automatically matches built-in icons based on file name suffixes (supports common formats like `.pdf`, `.png`, `.zip`, etc.), displays generic file icon when no match is found.
2. **Multi-state Visualization** Supports `uploading` (uploading with progress bar), `done` (completed), `error` (failed with custom prompt) three states, state styles automatically switch.
3. **Enhanced Image File Support** Supports image preview functionality (based on Element Plus image preview component), provides square/rectangle variants, supports direct parsing of local image file streams through `imgFile`.
4. **Highly Customizable** Custom icon colors, sizes, card styles and hover effects, flexibly extend content through slots (such as file name truncation display, status overlay).
5. **Responsive Design** Supports controlling card maximum width through `maxWidth`, adapts to different layout scenarios, file descriptions automatically truncate to prevent overflow.
