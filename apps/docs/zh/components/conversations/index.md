---
title: 'Conversations'
---

## 介绍

`Conversations` 是一个基于 Vue 3 和 Element Plus 开发的会话管理组件，支持分组展示、菜单交互、滚动加载、自定义样式等功能。适用于消息列表、文件管理、任务分组等场景，通过灵活的配置和插槽扩展，满足多样化的业务需求。

## 代码演示

### 基础使用

<demo src="./demos/base.vue"></demo>

### 时间分组与吸顶效果

<demo src="./demos/time-grouping.vue"></demo>

### 自定义分组排序

<demo src="./demos/custom-group-sort.vue"></demo>

### 内置下拉菜单

<demo src="./demos/built-in-menu.vue"></demo>

### 内置下拉菜单按钮展示风格

<demo src="./demos/built-in-menu-type.vue"></demo>

### 自定义菜单交互

<demo src="./demos/custom-menu.vue"></demo>

### 懒加载功能

<demo src="./demos/lazy-loading.vue"></demo>

### 自定义样式与分组标题

<demo src="./demos/absolute-custom.vue"></demo>

## 属性

| 属性名                 | 类型                          | 是否必填 | 默认值    | 描述                                                      |
| ---------------------- | ----------------------------- | -------- | --------- | --------------------------------------------------------- |
| `items`                | `ConversationItem<T>[]`       | 否       | `[]`      | 会话项数据列表，包含 `label`、`group`、`disabled` 等字段  |
| `groupable`            | `boolean \| GroupableOptions` | 否       | `false`   | 是否启用分组功能，传入对象可自定义分组排序（`sort` 函数） |
| `showBuiltInMenu`      | `boolean`                     | 否       | `false`   | 是否显示内置菜单（重命名、删除）                          |
| `loadMore`             | `() => void`                  | 否       | -         | 懒加载回调函数，滚动至底部时触发                          |
| `loadMoreLoading`      | `boolean`                     | 否       | `false`   | 加载更多状态，控制加载动画显示                            |
| `showToTopBtn`         | `boolean`                     | 否       | `false`   | 是否显示返回顶部按钮                                      |
| `labelKey`             | `string`                      | 否       | `'label'` | 会话项标签字段名                                          |
| `rowKey`               | `string`                      | 否       | `'id'`    | 会话项唯一标识字段名                                      |
| `itemsStyle`           | `CSSProperties`               | 否       | `{}`      | 会话项默认样式                                            |
| `itemsHoverStyle`      | `CSSProperties`               | 否       | `{}`      | 会话项悬停样式                                            |
| `itemsActiveStyle`     | `CSSProperties`               | 否       | `{}`      | 会话项激活样式                                            |
| `itemsMenuOpenedStyle` | `CSSProperties`               | 否       | `{}`      | 会话项菜单打开时样式                                      |

## 插槽

| 插槽名         | 参数                                                      | 描述                                                       |
| -------------- | --------------------------------------------------------- | ---------------------------------------------------------- |
| `#groupTitle`  | `{ group: GroupItem }`                                    | 自定义分组标题，支持添加图标或特殊样式                     |
| `#label`       | `{ item: ConversationItem<T> }`                           | 自定义会话项标签内容，支持文本溢出处理或富文本             |
| `#more-filled` | `{ item, isHovered, isActive, isMenuOpened, isDisabled }` | 会话项右侧附加内容，显示状态标识（如：禁用标记、操作图标） |
| `#menu`        | `{ item: ConversationItem<T> }`                           | 自定义菜单内容，支持按钮、图标或复杂交互组件               |
| `#header`      | -                                                         | 容器头部插槽，用于添加搜索栏、筛选按钮等自定义内容         |
| `#footer`      | -                                                         | 容器底部插槽，用于添加分页、统计信息等自定义内容           |

## 事件

| 事件           | 参数                                                               | 描述                                                                                                 |
| -------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `@menuCommand` | `(command: ConversationMenuCommand, item: ConversationItem): void` | 菜单命令回调，支持重命名、删除等操作。如果你选择自定义菜单，这个方法失效，需要自行处点击菜单的逻辑。 |
| `:loadMore`    | --                                                                 | 绑定懒加载回调，滚动至底部时触发                                                                     |

## 功能特性

1. **灵活分组管理**

- 自动根据 `group` 字段分组，未分组项统一归至“未分组”标题下
- 支持自定义分组排序（通过 `groupable.sort` 函数），实现业务逻辑定制
- 分组标题吸顶显示，滚动时保持导航可见性

2. **丰富的交互支持**

- 内置基础菜单（重命名、删除），支持通过 `@menu-command` 监听命令回调
- 自定义菜单插槽，轻松扩展分享、编辑等复杂操作
- 会话项状态样式独立配置（默认、悬停、激活、菜单打开），视觉反馈清晰

3. **性能优化**

- 懒加载功能：滚动至底部自动加载更多数据，减少初始渲染压力
- 虚拟滚动（规划中）：支持超大列表场景，提升内存使用效率

4. **高度可定制**

- 全量样式属性：通过 `itemsStyle` 系列属性自定义会话项外观
- 深度插槽扩展：标签、分组标题、菜单内容均可通过插槽完全自定义
- 响应式设计：支持自适应宽度和滚动条隐藏，适配不同容器尺寸
