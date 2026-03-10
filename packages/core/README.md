<div align="center">
  <a href="https://v2.element-plus-x.com">
    <img src="https://cdn.element-plus-x.com/element-plus-x.png" alt="Element-Plus-X" width="180" class="logo" />
  </a>
</div>

<div align="center">

[![License](https://img.shields.io/badge/license-MIT-blue)](https://github.com/HeJiaYue520/Element-Plus-X/blob/main/LICENSE)&emsp;[![GitHub stars](https://img.shields.io/github/stars/HeJiaYue520/Element-Plus-X)](https://github.com/HeJiaYue520/Element-Plus-X)&emsp;[![npm version](https://img.shields.io/npm/v/vue-element-plus-x)](https://www.npmjs.com/package/vue-element-plus-x)&emsp;[![npm](https://img.shields.io/npm/dm/vue-element-plus-x.svg)](https://www.npmjs.com/package/vue-element-plus-x)&emsp;[![english doc](https://img.shields.io/badge/docs-English-blue?style=flat-square&logo=read-the-docs)](https://github.com/HeJiaYue520/Element-Plus-X/blob/main/packages/components/README.en.md)

</div>

<div align="center">
<h2>💖项目模版，已经推出�?/h2>
<img src="https://cdn.element-plus-x.com/chat/1.webp" />&emsp;
<img src="https://cdn.element-plus-x.com/demo.webp" calss="element-plus-x-bubble" />&emsp;
<img src="https://cdn.element-plus-x.com/demo1.webp" calss="element-plus-x-bubble" />&emsp;
<img src="https://cdn.element-plus-x.com/demo3.webp" calss="element-plus-x-bubble" />&emsp;
<img src="https://cdn.element-plus-x.com/demo4.webp" calss="element-plus-x-bubble" />&emsp;
</div>

<div align="center">

[English](./README.en.md) | \*_简体中�?_

</div>&emsp;

# 🚀 Element-Plus-X

\*_开箱即用的企业�?AI 组件库（基于 Vue 3 + Element-Plus�?_

## 📢 快速链�?

| 资源类型          | <div style="width: 300px;" >链接</div>                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **文档**          | [📖 开发文档](https://v2.element-plus-x.com)                                                                               |
| **在线演示**      | [👁�?在线预览](https://v.element-plus-x.com)                                                                               |
| **代码仓库**      | [🐙 GitHub](https://github.com/element-plus-x/Element-Plus-X) <br> [🚠 Gitee](https://gitee.com/he-jiayue/element-plus-x)  |
| \*_NPM �?_        | [📦 npm](https://www.npmjs.com/package/vue-element-plus-x)                                                                 |
| **问题反馈**      | [🐛 提交 Bug](https://github.com/element-plus-x/Element-Plus-X/issues)                                                     |
| **交流讨论**      | [🐒 交流群](https://github.com/element-plus-x/Element-Plus-X?tab=readme-ov-file#-%E7%A4%BE%E5%8C%BA%E6%94%AF%E6%8C%81)     |
| **模版项目 预览** | [👀 在线预览](https://chat.element-plus-x.com/)                                                                            |
| **模版项目 源码** | [🐙 GitHub](https://github.com/HeJiaYue520/ruoyi-element-ai) <br> [🚠 Gitee](https://gitee.com/he-jiayue/ruoyi-element-ai) |

## 🛠�?核心特�?

- �?**企业�?AI 组件**：内置聊天机器人、语音交互等场景化组�?- 🚀 **零配置集�?\*：基�?Element-Plus 设计体系，开箱即�?- 📦 **按需加载\*\*：提�?Tree Shaking 优化

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
<!-- 该方�?有待测试 -->
<!-- CDN 引入 -->
<script src="https://unpkg.com/vue-element-plus-x@1.3.0/dist/umd/index.js"></script>
```

## ⚠️ XMarkdown 组件迁移通知

`XMarkdown` 组件已独立为单独�?NPM 包，推荐使用新版本：

📦 **新包地址�?\* [x-markdown-vue](https://www.npmjs.com/package/x-markdown-vue)
📂 **GitHub�?\* [element-plus-x/x-markdown](https://github.com/element-plus-x/x-markdown)

### 迁移方式

```bash
# 安装新包
pnpm add x-markdown-vue
```

```vue
<template>
  <MarkdownRenderer :markdown="content" />
</template>

<script setup lang="ts">
import { MarkdownRenderer } from 'x-markdown-vue';
import 'x-markdown-vue/style';

const content = ref('# Hello World');
</script>
```

新版本特性：

- 🚀 Vue 3 组合�?API
- 🎨 代码高亮（Shiki，支�?100+ 语言�?- 🌊 流式渲染（支�?AI 对话场景�?- 🧮 LaTeX 数学公式
- 📊 Mermaid 图表
- 🌗 深色模式
- 🔌 灵活的插件系�?

## 🌟 已实�?组件 �?Hooks

| 组件�?               | 描述                               | 文档链接                                                              |
| -------------------- | ---------------------------------- | --------------------------------------------------------------------- |
| `Bubble`             | 气泡消息组件 （拓展）              | [📄 文档](https://v2.element-plus-x.com/zh/components/bubble/)        |
| `BubbleList`         | 气泡消息列表 （拓展）              | [📄 文档](https://v2.element-plus-x.com/zh/components/bubbleList/)    |
| `Conversations`      | 会话管理组件 （拓展）              | [📄 文档](https://v2.element-plus-x.com/zh/components/conversations/) |
| `Welcome`            | 欢迎组件                           | [📄 文档](https://v2.element-plus-x.com/zh/components/welcome/)       |
| `Prompts `           | 提示集组�?                         | [📄 文档](https://v2.element-plus-x.com/zh/components/prompts/)       |
| `FilesCard`          | 文件卡片组件                       | [📄 文档](https://v2.element-plus-x.com/zh/components/filesCard/)     |
| `Attachments`        | 上传附件组件                       | [📄 文档](https://v2.element-plus-x.com/zh/components/attachments/)   |
| `XSender`            | 智能输入框（含语音交互、提及功能） | [📄 文档](https://v2.element-plus-x.com/zh/components/xsender/)       |
| `Thinking`           | 思考中组件 （拓展）                | [📄 文档](https://v2.element-plus-x.com/zh/components/thinking/)      |
| `ThoughtChain`       | 思考链组件                         | [📄 文档](https://v2.element-plus-x.com/zh/components/thoughtChain/)  |
| `useRecord`          | 浏览器内置语音识�?API Hooks        | [📄 文档](https://v2.element-plus-x.com/zh/components/useRecord/)     |
| `useXStream`         | 流模式接�?Hooks                    | [📄 文档](https://v2.element-plus-x.com/zh/components/useXStream/)    |
| `useSend & XRequest` | 流模�?hooks 的拆�?（拓展）         | [📄 文档](https://v2.element-plus-x.com/zh/components/useSend/)       |

## 🎯开发计�?(每周更新)

🎀我们会在 issue 、交流群 等多方面收集大家的遇到的问题，和需求场景，制定短期和长期的开发计划，查看详情请移步�?**[开发计划](https://v2.element-plus-x.com/zh/roadmap.html)**

## 🤝 参与贡献

1. **Fork 仓库** �?2. **创建 Feature 分支** �?3. **提交 Pull Request**

详情可以移步👉 **[开发指南](https://v2.element-plus-x.com/guide/develop.html)**

我们欢迎�?

- 🐛 Bug 修复
- 💡 新功能提�?- 📝 文档完善
- 🎨 样式优化

## 👥 社区支持

<div align="center">
<img src="https://cdn.element-plus-x.com/vx-2025-07-28.png" alt="微信交流�? width="180" style="margin: 20px;" />
<p>加入微信交流群，获取最新动态和技术支�?/p>

<p>交流群如果过期或者失效，可以添加作�?vx</p>
<img src="https://cdn.element-plus-x.com/element-plus-x-author-vx.png" alt="作者vx" width="180" style="margin: 20px;" />
</div>
