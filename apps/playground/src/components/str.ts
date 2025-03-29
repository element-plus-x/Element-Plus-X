export const demoStr = `

## 🔎  安装
\`\`\`bash
# NPM
npm install vue-element-plus-x

# PNPM（推荐）
pnpm install vue-element-plus-x

# Yarn
yarn install vue-element-plus-x
\`\`\`

## 📚 使用案例

1. **按需引入**

\`\`\`vue
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
\`\`\`

2. **html渲染**

\`\`\`html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Element-Plus-X</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
\`\`\`
`
