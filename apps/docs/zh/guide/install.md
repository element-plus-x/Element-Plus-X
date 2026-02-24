#### **一、环境要求**

| 工具    | 版本要求            | 说明          |
| ------- | ------------------- | ------------- |
| Node.js | ≥ 18.x（推荐≥20.x） | 主流 LTS 版本 |
| Vue     | ≥ 3.3.X             | Vue 3 正式版  |
| pnpm    | ≥ 10.X              | pnpm 安装     |

#### **二、安装**

::: code-group

```sh [npm]
npm install vue-element-plus-x --save
```

```sh [pnpm]
pnpm add vue-element-plus-x --save
```

```sh [yarn]
yarn add vue-element-plus-x --save
```

:::

**CDN 引入（可选）**

推荐优先使用包管理器安装。若要通过 CDN 方式引入，请以实际发布产物为准：

```html
<script src="https://unpkg.com/vue-element-plus-x@latest/dist/umd/index.js"></script>
```

#### **三、使用方式**

内置 **Tree Shaking** 优化，支持按需引入与全量引入。

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

2. **全量引入**

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
