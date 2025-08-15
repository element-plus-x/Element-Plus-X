---
title: Welcome
---

## Introduction

The `Welcome` component can clearly communicate to users the scope of achievable intentions and expected functionality. Using appropriate welcome recommendation components can effectively reduce user learning costs and help users quickly understand and get started smoothly.

## Code Examples

### Basic Usage

<demo src="./demos/base.vue"></demo>

### Style Variants

<demo src="./demos/variant.vue"></demo>

### Background Color

<demo src="./demos/bg.vue"></demo>

### Custom Image

<demo src="./demos/image.vue"></demo>

### Custom Subtitle

<demo src="./demos/extra.vue"></demo>

## Properties

| Property Name   | Type   | Required | Default | Description                                                            |
| --------------- | ------ | -------- | ------- | ---------------------------------------------------------------------- |
| `variant`       | string | No       | filled  | Component style variant (filled/borderless)                            |
| `direction`     | string | No       | ltr     | Text direction (ltr/rtl)                                               |
| `icon`          | string | No       | -       | Icon URL address                                                       |
| `title`         | string | No       | -       | Main title text content                                                |
| `extra`         | string | No       | -       | Subtitle text content                                                  |
| `description`   | string | No       | -       | Description text content                                               |
| `className`     | string | No       | -       | Custom class name for outer container                                  |
| `rootClassName` | string | No       | -       | Custom class name for root node                                        |
| `classNames`    | object | No       | -       | Custom class names for each part ({ icon, title, extra, description }) |
| `style`         | object | No       | -       | Custom styles for outer container                                      |
| `styles`        | object | No       | -       | Custom styles for each part ({ icon, title, extra, description })      |
| `prefixCls`     | string | No       | welcome | Component class name prefix                                            |

## Slots

| Slot Name | Parameters | Type | Description                  |
| --------- | ---------- | ---- | ---------------------------- |
| `#image`  | -          | Slot | Custom welcome image content |
| `#extra`  | -          | Slot | Custom subtitle content      |

## Features

1. Currently supports `filled` (filled) and `borderless` (borderless) two visual styles through the `variant` property
2. Supports `direction` property to control text direction
3. Can control styles through `classNames` and `styles` with fine granularity
4. Supports `image` and `extra` slots to extend custom content
