<div align="center">
  <a href="https://element-plus-x.com">
    <img src="https://cdn.element-plus-x.com/element-plus-x.png" alt="Element-Plus-X" width="180" class="logo" />
  </a>
</div>

<div align="center">

  [![License](https://img.shields.io/badge/license-MIT-blue)](https://github.com/HeJiaYue520/Element-Plus-X/blob/main/LICENSE)&emsp;[![GitHub stars](https://img.shields.io/github/stars/HeJiaYue520/Element-Plus-X)](https://github.com/HeJiaYue520/Element-Plus-X)&emsp;[![npm version](https://img.shields.io/npm/v/vue-element-plus-x)](https://www.npmjs.com/package/vue-element-plus-x)&emsp;[![npm](https://img.shields.io/npm/dm/vue-element-plus-x.svg)](https://www.npmjs.com/package/vue-element-plus-x)

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
| 资源类型         | <div style="width: 300px;" >链接</div>                                                                 |
|------------------|----------------------------------------------------------------------|
| **文档**         | [📖 开发文档](https://element-plus-x.com)                             |
| **在线演示**     | [👁️ 在线预览](https://v.element-plus-x.com)                         |
| **代码仓库**     | [🐙 GitHub](https://github.com/element-plus-x/Element-Plus-X) <br> [🚠 Gitee](https://gitee.com/he-jiayue/element-plus-x)          |
| **NPM 包**       | [📦 npm](https://www.npmjs.com/package/vue-element-plus-x)           |
| **问题反馈**     | [🐛 提交 Bug](https://github.com/element-plus-x/Element-Plus-X/issues)  |
| **交流讨论**     | [🐒 交流群](https://github.com/element-plus-x/Element-Plus-X?tab=readme-ov-file#-%E7%A4%BE%E5%8C%BA%E6%94%AF%E6%8C%81)  |
| **模版项目 预览** | [👀 在线预览](https://chat.element-plus-x.com/)                       |
| **模版项目 源码** | [🐙 GitHub](https://github.com/HeJiaYue520/ruoyi-element-ai) <br> [🚠 Gitee](https://gitee.com/he-jiayue/ruoyi-element-ai)  |

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
<script>
import { BubbleList, Sender } from 'vue-element-plus-x'
const list = [
  {
    content: 'Hello, Element Plus X',
    role: 'user',
  },
]
</script>

<template>
  <div style="display: flex; flex-direction: column; height: 230px; justify-content: space-between;">
    <BubbleList :list="list" />
    <Sender />
  </div>
</template>
```

2. **全局引入**

```ts
// main.ts
import { createApp } from 'vue'
import ElementPlusX from 'vue-element-plus-x'
import App from './App.vue'

const app = createApp(App)
// 使用 app.use() 全局引入
app.use(ElementPlusX)
app.mount('#app')
```

3. **CDN 引入**
```html
<!-- 该方法 有待测试 -->
<!-- CDN 引入 -->
<script src="https://unpkg.com/vue-element-plus-x@1.0.81/dist/umd/index.js"></script>
```

## 🌟 已实现 组件 和 Hooks

| 组件名       | 描述                     | 文档链接               |
| ------------ | ------------------------ | ---------------------- |
| `Typewriter` | 打字动画组件             | [📄 文档](https://element-plus-x.com/components/typewriter/) |
| `Bubble`     | 气泡消息组件 （拓展）        | [📄 文档](https://element-plus-x.com/components/bubble/) |
| `BubbleList` | 气泡消息列表 （拓展）        | [📄 文档](https://element-plus-x.com/components/bubbleList/) |
| `Conversations` | 会话管理组件 （拓展）        | [📄 文档](https://element-plus-x.com/components/conversations/) |
| `Welcome`    | 欢迎组件           | [📄 文档](https://element-plus-x.com/components/welcome/) |
| `Prompts `    | 提示集组件           | [📄 文档](https://element-plus-x.com/components/prompts/) |
| `FilesCard`       |  文件卡片组件          | [📄 文档](https://element-plus-x.com/components/filesCard/) |
| `Attachments`       |  上传附件组件          | [📄 文档](https://element-plus-x.com/components/attachments/) |
| `Sender`     | 智能输入框（含语音交互、内置指令操作） | [📄 文档](https://element-plus-x.com/components/sender/) |
| `MentionSender`     | 指令输入框 （提及列表） | [📄 文档](https://element-plus-x.com/components/mentionSender/) |
| `Thinking`      | 思考中组件 （拓展）  | [📄 文档](https://element-plus-x.com/components/thinking/) |
| `ThoughtChain` | 思考链组件             | [📄 文档](https://element-plus-x.com/components/thoughtChain/) |
| `useRecord` | 浏览器内置语音识别 API Hooks   | [📄 文档](https://element-plus-x.com/components/useRecord/) |
| `useXStream` | 流模式接口 Hooks | [📄 文档](https://element-plus-x.com/components/useXStream/) |
| `useSend & XRequest` | 流模式 hooks 的拆分 （拓展）  | [📄 文档](https://element-plus-x.com/components/useSend/) |

## 🎯开发计划 (每周更新)

🎀我们会在 issue 、交流群 等多方面收集大家的遇到的问题，和需求场景，制定短期和长期的开发计划，查看详情请移步👉 **[开发计划](https://element-plus-x.com/roadmap.html)**

## 🤝 参与贡献

1. **Fork 仓库** → 2. **创建 Feature 分支** → 3. **提交 Pull Request**

详情可以移步👉 **[开发指南](https://element-plus-x.com/guide/develop.html)**

我们欢迎：

- 🐛 Bug 修复
- 💡 新功能提案
- 📝 文档完善
- 🎨 样式优化

## 👥 社区支持
<div align="center">
<h3>💖三群二维码已经更新,如果图片是二群二维码,应该是浏览器有缓存,请刷新重试💖</h3>
<img src="https://cdn.element-plus-x.com/vx-2025-06-16.png" alt="微信交流群" width="180" style="margin: 20px;" />
<p>加入微信交流群，获取最新动态和技术支持</p>

<p>交流群如果过期或者失效，可以添加作者 vx</p>
<img src="https://cdn.element-plus-x.com/element-plus-x-author-vx.png" alt="作者vx" width="180" style="margin: 20px;" />
</div>
