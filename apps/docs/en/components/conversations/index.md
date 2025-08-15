---
title: Conversations
---

# Conversations Session Management Component 📱

## Introduction

`Conversations` is a session management component developed based on Vue 3 and Element Plus, supporting grouped display, menu interaction, scroll loading, custom styles and other features. Suitable for message lists, file management, task grouping and other scenarios, it meets diverse business needs through flexible configuration and slot extensions.

## Code Examples

### Basic Usage

<demo src="./demos/base.vue"></demo>

### Time Grouping and Sticky Effect

<demo src="./demos/time-grouping.vue"></demo>

### Custom Group Sorting

<demo src="./demos/custom-group-sort.vue"></demo>

### Built-in Dropdown Menu

<demo src="./demos/built-in-menu.vue"></demo>

### Built-in Dropdown Menu Button Type

<demo src="./demos/built-in-menu-type.vue"></demo>

### Custom Menu Interaction

<demo src="./demos/custom-menu.vue"></demo>

### Lazy Loading Feature

<demo src="./demos/lazy-loading.vue"></demo>

### Custom Styles and Group Titles

<demo src="./demos/absolute-custom.vue"></demo>

## Properties

| Property Name          | Type                          | Required | Default   | Description                                                                              |
| ---------------------- | ----------------------------- | -------- | --------- | ---------------------------------------------------------------------------------------- |
| `items`                | `ConversationItem<T>[]`       | No       | `[]`      | Session item data list, containing `label`, `group`, `disabled` and other fields         |
| `groupable`            | `boolean \| GroupableOptions` | No       | `false`   | Whether to enable grouping, passing object can customize group sorting (`sort` function) |
| `showBuiltInMenu`      | `boolean`                     | No       | `false`   | Whether to show built-in menu (rename, delete)                                           |
| `loadMore`             | `() => void`                  | No       | -         | Lazy loading callback function, triggered when scrolling to bottom                       |
| `loadMoreLoading`      | `boolean`                     | No       | `false`   | Load more state, controls loading animation display                                      |
| `showToTopBtn`         | `boolean`                     | No       | `false`   | Whether to show back to top button                                                       |
| `labelKey`             | `string`                      | No       | `'label'` | Session item label field name                                                            |
| `rowKey`               | `string`                      | No       | `'id'`    | Session item unique identifier field name                                                |
| `itemsStyle`           | `CSSProperties`               | No       | `{}`      | Session item default style                                                               |
| `itemsHoverStyle`      | `CSSProperties`               | No       | `{}`      | Session item hover style                                                                 |
| `itemsActiveStyle`     | `CSSProperties`               | No       | `{}`      | Session item active style                                                                |
| `itemsMenuOpenedStyle` | `CSSProperties`               | No       | `{}`      | Session item style when menu is opened                                                   |

## Slots

| Slot Name      | Parameters                                                | Description                                                                                                |
| -------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `#groupTitle`  | `{ group: GroupItem }`                                    | Custom group title, supports adding icons or special styles                                                |
| `#label`       | `{ item: ConversationItem<T> }`                           | Custom session item label content, supports text overflow handling or rich text                            |
| `#more-filled` | `{ item, isHovered, isActive, isMenuOpened, isDisabled }` | Session item right side additional content, displays status indicators (e.g.: disabled mark, action icons) |
| `#menu`        | `{ item: ConversationItem<T> }`                           | Custom menu content, supports buttons, icons or complex interactive components                             |
| `#header`      | -                                                         | Container header slot, for adding search bars, filter buttons and other custom content                     |
| `#footer`      | -                                                         | Container footer slot, for adding pagination, statistics and other custom content                          |

## Events

| Event          | Parameters                                                         | Description                                                                                                                                                            |
| -------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@menuCommand` | `(command: ConversationMenuCommand, item: ConversationItem): void` | Menu command callback, supports rename, delete and other operations. If you choose custom menu, this method is disabled, you need to handle menu click logic yourself. |
| `:loadMore`    | --                                                                 | Bind lazy loading callback, triggered when scrolling to bottom                                                                                                         |

## Features

1. **Flexible Group Management**

- Automatically groups by `group` field, ungrouped items are unified under "Ungrouped" title
- Supports custom group sorting (through `groupable.sort` function), implements business logic customization
- Group title sticky display, maintains navigation visibility when scrolling

2. **Rich Interaction Support**

- Built-in basic menu (rename, delete), supports monitoring command callbacks through `@menu-command`
- Custom menu slots, easily extend sharing, editing and other complex operations
- Session item state styles independently configured (default, hover, active, menu opened), clear visual feedback

3. **Performance Optimization**

- Lazy loading feature: automatically loads more data when scrolling to bottom, reduces initial rendering pressure
- Virtual scrolling (planned): supports ultra-large list scenarios, improves memory usage efficiency

4. **Highly Customizable**

- Full style properties: customize session item appearance through `itemsStyle` series properties
- Deep slot extensions: labels, group titles, menu content can all be completely customized through slots
- Responsive design: supports adaptive width and scrollbar hiding, adapts to different container sizes
