<div align="center">
  <a href="https://element-plus-x.com">
    <img src="https://cdn.element-plus-x.com/element-plus-x.png" alt="Element-Plus-X" width="180" class="logo" />
  </a>
</div>

<div align="center">

[![License](https://img.shields.io/badge/license-MIT-blue)](https://github.com/HeJiaYue520/Element-Plus-X/blob/main/LICENSE)&emsp;[![GitHub stars](https://img.shields.io/github/stars/HeJiaYue520/Element-Plus-X)](https://github.com/HeJiaYue520/Element-Plus-X)&emsp;[![npm version](https://img.shields.io/npm/v/vue-element-plus-x)](https://www.npmjs.com/package/vue-element-plus-x)&emsp;[![npm](https://img.shields.io/npm/dm/vue-element-plus-x.svg)](https://www.npmjs.com/package/vue-element-plus-x)&emsp;[![english doc](https://img.shields.io/badge/%E6%96%87%E6%A1%A3-%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-brightgreen?style=flat-square&logo=read-the-docs)](https://github.com/HeJiaYue520/Element-Plus-X/blob/main/packages/components/README.md)

</div>

<div align="center">
<h2>💖The project template has been released💖</h2>
<img src="https://cdn.element-plus-x.com/chat/1.webp" />&emsp;
<img src="https://cdn.element-plus-x.com/demo.webp" calss="element-plus-x-bubble" />&emsp;
<img src="https://cdn.element-plus-x.com/demo1.webp" calss="element-plus-x-bubble" />&emsp;
<img src="https://cdn.element-plus-x.com/demo3.webp" calss="element-plus-x-bubble" />&emsp;
<img src="https://cdn.element-plus-x.com/demo4.webp" calss="element-plus-x-bubble" />&emsp;

</div>

<div align="center">

**English** | [简体中文](./README.md)

</div>&emsp;

# 🚀 Element-Plus-X

**An out-of-the-box enterprise-level AI component library (based on Vue 3 + Element-Plus)**

## 📢 Quick Links

| Resource Type                    | <div style="width: 300px;">Link</div>                                                                                      |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Documentation**                | [📖 Development Documentation](https://element-plus-x.com)                                                                 |
| **Online Demo**                  | [👁️ Online Preview](https://v.element-plus-x.com)                                                                          |
| **Code Repository**              | [🐙 GitHub](https://github.com/HeJiaYue520/Element-Plus-X) <br> [🚠 Gitee](https://gitee.com/he-jiayue/element-plus-x)     |
| **NPM Package**                  | [📦 npm](https://www.npmjs.com/package/vue-element-plus-x)                                                                 |
| **Issue Feedback**               | [🐛 Submit a Bug](https://github.com/HeJiaYue520/Element-Plus-X/issues)                                                    |
| **Community**                    | [🐒 Discussion Group](https://element-plus-x.com/introduce.html#%F0%9F%91%A5-%E7%A4%BE%E5%8C%BA%E6%94%AF%E6%8C%81)         |
| **Template Project Preview**     | [👀 Online Preview](https://chat.element-plus-x.com/)                                                                      |
| **Template Project Source Code** | [🐙 GitHub](https://github.com/HeJiaYue520/ruoyi-element-ai) <br> [🚠 Gitee](https://gitee.com/he-jiayue/ruoyi-element-ai) |

## 🛠️ Core Features

- ✨ **Enterprise-level AI Components**: Pre-built scenario-based components such as chatbots and voice interaction.
- 🚀 **Zero-configuration Integration**: Based on the Element-Plus design system, ready to use right out of the box.
- 📦 **On-demand Loading**: Provides Tree Shaking optimization.

## 🔎 Installation

```bash
# NPM
npm install vue-element-plus-x

# PNPM (Recommended)
pnpm install vue-element-plus-x

# Yarn
yarn install vue-element-plus-x

```

## 📚 Usage Examples

1. **On-demand Import**

```vue
<script>
import { BubbleList, Sender } from 'vue-element-plus-x';

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
    <Sender />
  </div>
</template>
```

2. **Global Import**

```ts
// main.ts
import { createApp } from 'vue';
import ElementPlusX from 'vue-element-plus-x';
import App from './App.vue';

const app = createApp(App);
// Globally import using app.use()
app.use(ElementPlusX);
app.mount('#app');
```

3. **CDN Import**

```html
<!-- This method is still under testing -->
<!-- CDN Import -->
<script src="https://unpkg.com/vue-element-plus-x@1.3.0/dist/umd/index.js"></script>
```

## 🌟 Implemented Components and Hooks

| Component Name       | Description                                                                    | Documentation Link                                                       |
| -------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------ |
| `Typewriter`         | Typewriter animation component                                                 | [📄 Documentation](https://element-plus-x.com/components/typewriter/)    |
| `Bubble`             | Extended bubble message component                                              | [📄 Documentation](https://element-plus-x.com/components/bubble/)        |
| `BubbleList`         | Extended bubble message list component                                         | [📄 Documentation](https://element-plus-x.com/components/bubbleList/)    |
| `Conversations`      | Extended conversation management component                                     | [📄 Documentation](https://element-plus-x.com/components/conversations/) |
| `Welcome`            | Welcome component                                                              | [📄 Documentation](https://element-plus-x.com/components/welcome/)       |
| `Prompts`            | Prompt set component                                                           | [📄 Documentation](https://element-plus-x.com/components/prompts/)       | <!-- 修正了原表格中Prompts后的多余空格 --> |
| `FilesCard`          | File card component                                                            | [📄 Documentation](https://element-plus-x.com/components/filesCard/)     |
| `Attachments`        | File attachment upload component                                               | [📄 Documentation](https://element-plus-x.com/components/attachments/)   |
| `Sender`             | Intelligent input box (with voice interaction and built-in command operations) | [📄 Documentation](https://element-plus-x.com/components/sender/)        |
| `MentionSender`      | Command input box (with mention list)                                          | [📄 Documentation](https://element-plus-x.com/components/mentionSender/) |
| `Thinking`           | Extended "Thinking..." component                                               | [📄 Documentation](https://element-plus-x.com/components/thinking/)      |
| `ThoughtChain`       | Thought chain component                                                        | [📄 Documentation](https://element-plus-x.com/components/thoughtChain/)  |
| `useRecord`          | Browser-built voice recognition API Hooks                                      | [📄 Documentation](https://element-plus-x.com/components/useRecord/)     |
| `useXStream`         | Stream mode interface Hooks                                                    | [📄 Documentation](https://element-plus-x.com/components/useXStream/)    |
| `useSend & XRequest` | Split version of stream mode Hooks (extended)                                  | [📄 Documentation](https://element-plus-x.com/components/useSend/)       |

## 🎯 Development Plan (Updated Weekly)

🎀 We will collect everyone's encountered problems and demand scenarios in various aspects such as issues and communication groups, and develop short-term and long-term development plans. For more details, please move on 👉 **[Development Plan](https://element-plus-x.com/roadmap.html)**

## 🤝 Contribute

1. **Fork the repository** → 2. **Create a Feature branch** → 3. **Submit a Pull Request**

Details can be moved 👉 **[Development Guide](https://element-plus-x.com/guide/develop.html)**

We welcome:

- 🐛 Bug fixes
- 💡 Proposals for new features
- 📝 Documentation improvements
- 🎨 Style optimizations

## 👥 Community Support

<div align="center">
<img src="https://cdn.element-plus-x.com/vx-2025-07-14.png" alt="WeChat communication group" width="180" style="margin: 20px;" />
<p>Join the WeChat communication group to get the latest news and technical support</p>

<p>If the group link expires, scan the author's QR code:</p>
<img src="https://cdn.element-plus-x.com/element-plus-x-author-vx.png" alt="Author's WeChat" width="180" style="margin: 20px;" />
</div>
