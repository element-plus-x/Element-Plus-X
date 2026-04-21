<div align="center">
  <a href="https://element-plus-x.com">
    <img src="https://cdn.element-plus-x.com/element-plus-x.png" alt="Element-Plus-X" width="180" class="logo" />
  </a>
</div>

<div align="center">

[![License](https://img.shields.io/badge/license-MIT-blue)](https://github.com/HeJiaYue520/Element-Plus-X/blob/main/LICENSE)&emsp;[![GitHub stars](https://img.shields.io/github/stars/HeJiaYue520/Element-Plus-X)](https://github.com/HeJiaYue520/Element-Plus-X)&emsp;[![npm version](https://img.shields.io/npm/v/vue-element-plus-x)](https://www.npmjs.com/package/vue-element-plus-x)&emsp;[![npm](https://img.shields.io/npm/dm/vue-element-plus-x.svg)](https://www.npmjs.com/package/vue-element-plus-x)&emsp;[![english doc](https://img.shields.io/badge/docs-English-blue?style=flat-square&logo=read-the-docs)](https://github.com/HeJiaYue520/Element-Plus-X/blob/main/README.en.md)[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/element-plus-x/Element-Plus-X)

</div>

<div align="center">

本项目 CDN 加速及安全防护由 Tencent EdgeOne 赞助

[亚洲最佳CDN、边缘和安全解决方案 - Tencent EdgeOne](https://edgeone.ai/zh?from=github)

<img src="readme/edgeone.png"/>

</div>

<div align="center">
<h2>💖项目模版，已经推出💖</h2>
<img src="https://cdn.element-plus-x.com/chat/1.webp" />&emsp;
<img src="https://cdn.element-plus-x.com/demo.webp" calss="element-plus-x-bubble" />&emsp;
<img src="https://cdn.element-plus-x.com/demo1.webp" calss="element-plus-x-bubble" />&emsp;
<img src="https://cdn.element-plus-x.com/demo3.webp" calss="element-plus-x-bubble" />&emsp;
<img src="https://cdn.element-plus-x.com/demo4.webp" calss="element-plus-x-bubble" />&emsp;
</div>

<div align="center">

[English](./README.en.md) | **简体中文**

</div>&emsp;

# 🚀 Element-Plus-X

**开箱即用的企业级 AI 组件库（基于 Vue 3 + Element-Plus）**

## 📢 快速链接

| 资源类型          | <div style="width: 300px;" >链接</div>                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **文档**          | [📖 开发文档](https://element-plus-x.com)                                                                                  |
| **在线演示**      | [👁️ 在线预览](https://v.element-plus-x.com)                                                                                |
| **代码仓库**      | [🐙 GitHub](https://github.com/element-plus-x/Element-Plus-X) <br> [🚠 Gitee](https://gitee.com/he-jiayue/element-plus-x)  |
| **NPM 包**        | [📦 npm](https://www.npmjs.com/package/vue-element-plus-x)                                                                 |
| **问题反馈**      | [🐛 提交 Bug](https://github.com/element-plus-x/Element-Plus-X/issues)                                                     |
| **交流讨论**      | [🐒 交流群](https://github.com/element-plus-x/Element-Plus-X?tab=readme-ov-file#-%E7%A4%BE%E5%8C%BA%E6%94%AF%E6%8C%81)     |
| **模版项目 预览** | [👀 在线预览](https://chat.element-plus-x.com/)                                                                            |
| **模版项目 源码** | [🐙 GitHub](https://github.com/HeJiaYue520/ruoyi-element-ai) <br> [🚠 Gitee](https://gitee.com/he-jiayue/ruoyi-element-ai) |

## 🛠️ 核心特性

- ✨ **企业级 AI 组件**：内置聊天机器人、语音交互等场景化组件
- 🚀 **零配置集成**：基于 Element-Plus 设计体系，开箱即用
- 📦 **按需加载**：提供 Tree Shaking 优化

## 📦 安装

```bash
# NPM
npm install vue-element-plus-x

# PNPM（推荐）
pnpm install vue-element-plus-x

# Yarn
yarn install vue-element-plus-x

```

## 📚 使用案例

1. **按需引入**

```vue
<script setup>
import { BubbleList, XSender } from 'vue-element-plus-x';

const list = [
  {
    content: 'Hello, Element Plus X',
    role: 'user'
  }
];
</script>

<template>
  <div
    style="display: flex; flex-direction: column; height: 230px; justify-content: space-between;"
  >
    <BubbleList :list="list" />
    <XSender />
  </div>
</template>
```

2. **全局引入**

```ts
// main.ts
import { createApp } from 'vue';
import ElementPlusX from 'vue-element-plus-x';
import App from './App.vue';

const app = createApp(App);
// 使用 app.use() 全局引入
app.use(ElementPlusX);
app.mount('#app');
```

3. **CDN 引入**

```html
<!-- 该方法 有待测试 -->
<!-- CDN 引入 -->
<script src="https://unpkg.com/vue-element-plus-x@1.3.0/dist/umd/index.js"></script>
```

## 🌟 已实现 组件 和 Hooks

| 组件名               | 描述                               | 文档链接                                                           |
| -------------------- | ---------------------------------- | ------------------------------------------------------------------ |
| `Bubble`             | 气泡消息组件 （拓展）              | [📄 文档](https://element-plus-x.com/zh/components/bubble/)        |
| `BubbleList`         | 气泡消息列表 （拓展）              | [📄 文档](https://element-plus-x.com/zh/components/bubbleList/)    |
| `Conversations`      | 会话管理组件 （拓展）              | [📄 文档](https://element-plus-x.com/zh/components/conversations/) |
| `Welcome`            | 欢迎组件                           | [📄 文档](https://element-plus-x.com/zh/components/welcome/)       |
| `Prompts `           | 提示集组件                         | [📄 文档](https://element-plus-x.com/zh/components/prompts/)       |
| `FilesCard`          | 文件卡片组件                       | [📄 文档](https://element-plus-x.com/zh/components/filesCard/)     |
| `Attachments`        | 上传附件组件                       | [📄 文档](https://element-plus-x.com/zh/components/attachments/)   |
| `XSender`            | 智能输入框（含语音交互、提及功能） | [📄 文档](https://element-plus-x.com/zh/components/xsender/)       |
| `Thinking`           | 思考中组件 （拓展）                | [📄 文档](https://element-plus-x.com/zh/components/thinking/)      |
| `ThoughtChain`       | 思考链组件                         | [📄 文档](https://element-plus-x.com/zh/components/thoughtChain/)  |
| `useRecord`          | 浏览器内置语音识别 API Hooks       | [📄 文档](https://element-plus-x.com/zh/components/useRecord/)     |
| `useXStream`         | 流模式接口 Hooks                   | [📄 文档](https://element-plus-x.com/zh/components/useXStream/)    |
| `useSend & XRequest` | 流模式 hooks 的拆分 （拓展）       | [📄 文档](https://element-plus-x.com/zh/components/useSend/)       |

## 🎯开发计划 (每周更新)

🎀我们会在 issue 、交流群 等多方面收集大家的遇到的问题，和需求场景，制定短期和长期的开发计划，查看详情请移步👉 **[开发计划](https://element-plus-x.com/zh/roadmap.html)**

## 🤝 参与贡献

1. **Fork 仓库** → 2. **创建 Feature 分支** → 3. **提交 Pull Request**

详情可以移步👉 **[开发指南](https://element-plus-x.com/zh/guide/develop.html)**

我们欢迎：

- 🐛 Bug 修复
- 💡 新功能提案
- 📝 文档完善
- 🎨 样式优化

## 👥 贡献者

<a href="https://openomy.app/github/element-plus-x/Element-Plus-X" target="_blank" style="display: block; width: 100%;" align="center">
  <img src="https://openomy.app/svg?repo=element-plus-x/Element-Plus-X&chart=bubble&latestMonth=3" target="_blank" alt="Contribution Leaderboard" style="display: block; width: 100%;" />
 </a>

<a href="https://github.com/element-plus-x/Element-Plus-X/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=element-plus-x/Element-Plus-X" />
</a>

## 👥 社区支持

<div align="center">
<img src="https://cdn.element-plus-x.com/vx-2025-07-28.png" alt="微信交流群" width="180" style="margin: 20px;" />
<p>加入微信交流群，获取最新动态和技术支持</p>

<p>交流群如果过期或者失效，可以添加作者 vx</p>
<img src="https://cdn.element-plus-x.com/element-plus-x-author-vx.png" alt="作者vx" width="180" style="margin: 20px;" />
</div>

## 📋 版本策略

### 版本号规则

我们采用语义化版本号（SemVer）：`MAJOR.MINOR.PATCH`

- **MAJOR**: 重大版本更新，可能包含破坏性变更
- **MINOR**: 新功能添加，向后兼容
- **PATCH**: Bug 修复，向后兼容
- **预发布标识**: `-beta.0`, `-rc.1` 等

### 安装方式

```bash
# 安装稳定版（推荐）
pnpm install vue-element-plus-x

# 安装 beta 版本
pnpm install vue-element-plus-x@beta

# 安装指定版本
pnpm install vue-element-plus-x@2.0.0-beta.0
```

### 版本发布渠道

| 渠道   | npm tag  | 说明                   |
| ------ | -------- | ---------------------- |
| 稳定版 | `latest` | 生产环境推荐使用       |
| 测试版 | `beta`   | 新功能预览，可能不稳定 |

## 🏷️ 组件徽标说明

文档中的组件可能带有以下徽标：

| 徽标          | 含义                     |
| ------------- | ------------------------ |
| 🆕 **新增**   | 新增的组件或功能         |
| 🔄 **更新**   | 最近有重大更新的组件     |
| ⚠️ **废弃**   | 即将废弃的组件           |
| 🔬 **实验性** | 实验性功能，API 可能变化 |

## 🚀 发布流程

### 发布 Beta 版本

1. 更新 `packages/core/package.json` 中的版本号为 `X.X.X-beta.X`
2. 运行 `pnpm changeset` 创建变更记录
3. 提交代码并创建 tag: `git tag vX.X.X-beta.X`
4. 推送 tag: `git push origin vX.X.X-beta.X`
5. CI 自动发布到 npm `@beta` tag

### 发布正式版本

1. 更新版本号为正式版本
2. 更新 `CHANGELOG.md`
3. 创建并推送 tag
4. CI 自动发布到 npm `@latest` tag

## 🔧 本地开发

```bash
# 克隆仓库
git clone https://github.com/HeJiaYue520/Element-Plus-X.git

# 安装依赖
pnpm install

# 启动文档开发服务器
pnpm run dev:docs

# 启动组件开发服务器 (Storybook)
pnpm run dev:core

# 构建组件库
pnpm run build:core
```
