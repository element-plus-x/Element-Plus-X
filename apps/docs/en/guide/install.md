#### **I. Environment Requirements**

| Tool    | Version Requirement        | Description            |
| ------- | -------------------------- | ---------------------- |
| Node.js | ≥ 18.x (Recommended ≥20.x) | Mainstream LTS version |
| Vue     | ≥ 3.3.X                    | Vue 3 official version |
| pnpm    | ≥ 10.X                     | pnpm installation      |

#### **II. Installation**

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

**CDN Import (Optional)**

We recommend installing via a package manager. If you want to use a CDN build, please verify the published artifacts:

```html
<script src="https://unpkg.com/vue-element-plus-x@latest/dist/umd/index.js"></script>
```

#### **III. Usage**

Built-in **Tree Shaking** optimization. Both on-demand import and full import are supported.

1. **On-demand Import**

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

2. **Full Import**

```ts
// main.ts
import { createApp } from 'vue';
import ElementPlusX from 'vue-element-plus-x';
import App from './App.vue';

const app = createApp(App);
// Use app.use() for global import
app.use(ElementPlusX);
app.mount('#app');
```
