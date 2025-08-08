# FilesCard 文件卡片 📇

## 介绍

`FilesCard` 组件是一个灵活的文件展示组件，支持多种文件类型（图片、文档、压缩包等）的可视化呈现，包含文件图标、名称、描述、状态等信息，同时提供丰富的自定义选项和交互功能，适用于文件管理、上传预览等场景。

## 代码演示

### 基本使用

<demo src="./demos/base.vue"></demo>

### 状态设置

<demo src="./demos/status.vue"></demo>

### 展示删除图标

<demo src="./demos/delete-icon.vue"></demo>

### 图片文件展示

<demo src="./demos/image-preview.vue"></demo>

### 自定义样式与交互

<demo src="./demos/custom-style.vue"></demo>

### 自定义内置文件颜色

<demo src="./demos/custom-color.vue"></demo>

## 属性

| 属性名           | 类型                               | 是否必填 | 默认值        | 描述                                                               |
| ---------------- | ---------------------------------- | -------- | ------------- | ------------------------------------------------------------------ |
| `uid`            | `string \| number`                 | 是       |    | 文件唯一标识符                                                     |
| `name`           | `string`                           | 否       | `undefined`   | 文件名（支持自动解析后缀匹配图标）                                 |
| `fileSize`       | `number`                           | 否       | `undefined`   | 文件大小（单位：字节，自动转换为易读格式）                         |
| `fileType`       | `string`                           | 否       | `undefined`   | 文件类型（优先级高于 `name` 后缀解析，如 `'image'`、`'document'`） |
| `description`    | `string`                           | 否       | `undefined`   | 描述文本（支持动态生成文件类型和大小信息）                         |
| `url`            | `string`                           | 否       | `undefined`   | 文件访问地址（图片文件可用于预览）                                 |
| `thumbUrl`       | `string`                           | 否       | `undefined`   | 图片缩略图地址                                                     |
| `imgFile`        | `File \| Blob`                     | 否       | `undefined`   | 图片文件流（自动解析为预览地址，仅用于上传前临时展示）             |
| `iconSize`       | `string`                           | 否       | `'42px'`      | 图标/图片尺寸                                                      |
| `iconColor`      | `string`                           | 否       | `undefined`   | 非图片文件的图标颜色（支持自定义色值）                             |
| `showDelIcon`    | `boolean`                          | 否       | `false`       | 是否显示悬停删除图标                                               |
| `maxWidth`       | `string`                           | 否       | `'236px'`     | 卡片最大宽度                                                       |
| `style`          | `CSSProperties`                    | 否       | `undefined`   | 卡片自定义样式                                                     |
| `hoverStyle`     | `CSSProperties`                    | 否       | `undefined`   | 卡片悬停时的自定义样式                                             |
| `imgVariant`     | `'rectangle' \| 'square'`          | 否       | `'rectangle'` | 图片卡片形态（长方形/正方形）                                      |
| `imgPreview`     | `boolean`                          | 否       | `true`        | 是否开启图片预览功能                                               |
| `imgPreviewMask` | `boolean`                          | 否       | `true`        | 是否显示图片预览遮罩蒙层                                           |
| `status`         | `'uploading' \| 'done' \| 'error'` | 否       | `undefined`   | 文件状态（控制进度条、错误提示等视觉反馈）                         |
| `percent`        | `number`                           | 否       | `0`           | 上传进度百分比（配合 `status="uploading"` 使用）                   |
| `errorTip`       | `string`                           | 否       | `'上传失败'`  | 错误状态自定义提示文本                                             |

## 插槽

| 插槽名                   | 插槽参数                                   | 描述                                                                |
| ------------------------ | ------------------------------------------ | ------------------------------------------------------------------- |
| `#icon`                  | `{ item: FilesCardProps }`                 | 自定义图标区域（优先级高于自动解析的内置图标）                      |
| `#content`               | `{ item: FilesCardProps }`                 | 自定义内容区域（覆盖默认的名称和描述展示）                          |
| `#name-prefix`           | `{ item: FilesCardProps, prefix, suffix }` | 文件名前缀自定义（用于截断显示场景）                                |
| `#name-suffix`           | `{ item: FilesCardProps, prefix, suffix }` | 文件名后缀自定义（用于截断显示场景）                                |
| `#description`           | `{ item: FilesCardProps, prefix, suffix }` | 描述文本自定义（覆盖默认生成的描述）                                |
| `#image-preview-actions` | `{ item: FilesCardProps, prefix, suffix }` | 图片预览遮罩层内容（悬停时显示，需配合 `imgPreviewMask` 使用）      |
| `#del-icon`              | `{ item: FilesCardProps }`                 | 自定义删除图标（默认使用 Element Plus 的 `CircleCloseFilled` 图标） |

## 事件

| 事件名          | 回调参数       | 描述                                       |
| --------------- | -------------- | ------------------------------------------ |
| `delete`        | `{ ...props }` | 删除按钮点击时触发，传递当前卡片的完整属性 |
| `image-preview` | `{ ...props }` | 图片预览功能触发时调用（点击图片或遮罩层） |

## 功能特性

1. **文件类型自动识别**根据文件名后缀自动匹配内置图标（支持常见格式如 `.pdf`、`.png`、`.zip` 等），无匹配时显示通用文件图标。
2. **多状态可视化**支持 `uploading`（上传中，带进度条）、`done`（完成）、`error`（失败，带自定义提示）三种状态，状态样式自动切换。
3. **图片文件增强支持**支持图片预览功能（基于 Element Plus 图片预览组件），提供正方形/长方形变体，支持通过 `imgFile` 直接解析本地图片文件流。
4. **高度可定制化**自定义图标颜色、尺寸、卡片样式及悬停效果，通过插槽灵活扩展内容（如文件名截断显示、状态覆盖层）。
5. **响应式设计**支持通过 `maxWidth` 控制卡片最大宽度，适配不同布局场景，文件描述自动截断防止溢出。
