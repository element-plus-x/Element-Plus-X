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

**CDN Import**

```html
<!-- This method needs testing -->
<!-- CDN Import -->
<script src="https://unpkg.com/vue-element-plus-x@1.3.0/dist/umd/index.js"></script>

```

#### **III. Verify Installation**

1. Check if the `package.json` file contains:

   ```json
   {
     "dependencies": {
       "vue-element-plus-x": "^1.3.0"
     }
   }
   ```

2. Run the project to verify if components are available:

   ```bash
   npm run dev
   ```

#### **IV. On-demand Loading Instructions**

Built-in **Tree Shaking** optimization, no additional configuration required

1. **On-demand Import**

```vue
<script setup>
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
