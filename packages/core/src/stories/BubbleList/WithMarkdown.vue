<script setup lang="ts">
import BubbleList from '@components/BubbleList/index.vue';
import ConfigProvider from '@components/ConfigProvider/index.vue';
import { MarkdownRenderer } from 'x-markdown-vue';
import 'katex/dist/katex.min.css';

import 'shiki';
import 'shiki-stream';

const list = ref([
  {
    key: '1',
    content: `### 行内公式
1. 欧拉公式：$e^{i\\pi} + 1 = 0$
2. 二次方程求根公式：$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$
3. 向量点积：$\\vec{a} \\cdot \\vec{b} = a_x b_x + a_y b_y + a_z b_z$

### []包裹公式
\\[ e^{i\\pi} + 1 = 0 \\]

\\[\\boxed{boxed包裹}\\]`,
    placement: 'start' as const,
    avatar: 'https://avatars.githubusercontent.com/u/76239030?s=40&v=4',
    role: 'ai'
  },
  {
    key: '2',
    content: '请问有什么可以帮助您的？',
    placement: 'end' as const,
    avatar: 'https://avatars.githubusercontent.com/u/1?s=40&v=4',
    role: 'user'
  },
  {
    key: '3',
    content: `### 块级公式与代码块

傅里叶变换：
$$
F(\\omega) = \\int_{-\\infty}^{\\infty} f(t) e^{-i\\omega t} dt
$$

矩阵乘法：
$$
\\begin{bmatrix}
a & b \\\\
c & d
\\end{bmatrix}
\\begin{bmatrix}
x \\\\
y
\\end{bmatrix}
=
\\begin{bmatrix}
ax + by \\\\
cx + dy
\\end{bmatrix}
$$

任务列表：
- [x] Add some task
- [ ] Do some task

\`\`\`typescript
const greeting: string = "Hello World";
console.log(greeting);
\`\`\``,
    placement: 'start' as const,
    avatar: 'https://avatars.githubusercontent.com/u/76239030?s=40&v=4',
    role: 'ai'
  }
]);
</script>

<template>
  <ConfigProvider>
    <div class="component-container">
      <div class="component-title">BubbleList 与 x-markdown-vue 结合使用</div>
      <p class="tip">
        通过 <code>#content</code> 插槽，可以对列表中的每条消息进行 Markdown
        渲染，支持公式、代码块、任务列表等
      </p>

      <div class="list-container">
        <BubbleList :list="list" max-height="500px">
          <template #content="{ item }">
            <div class="markdown-content-wrapper">
              <MarkdownRenderer :markdown="item.content" />
            </div>
          </template>
        </BubbleList>
      </div>
    </div>
  </ConfigProvider>
</template>

<style scoped lang="scss">
.component-container {
  padding: 12px;
  border-radius: 15px;

  .component-title {
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 12px;
    font-weight: 700;
    line-height: 1.5;
    margin-bottom: 12px;

    &::after {
      position: absolute;
      content: '';
      display: block;
      width: 5px;
      height: 75%;
      border-radius: 15px;
      left: 0;
      background-color: #409eff;
    }
  }

  .tip {
    color: #666;
    font-size: 14px;
    margin-bottom: 16px;

    code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 4px;
    }
  }

  .list-container {
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
  }
}

// 样式隔离与 Markdown 基础样式修复
.markdown-content-wrapper {
  word-break: break-word;
  color: #24292e;

  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    margin-top: 16px;
    margin-bottom: 8px;
    font-weight: 600;
    line-height: 1.25;
    &:first-child {
      margin-top: 0;
    }
  }

  :deep(p) {
    margin-top: 0;
    margin-bottom: 8px;
    line-height: 1.6;
    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(ul),
  :deep(ol) {
    padding-left: 20px;
    margin-top: 0;
    margin-bottom: 8px;

    ul,
    ol {
      margin-top: 4px;
      margin-bottom: 0;
    }
  }

  :deep(ul) {
    list-style-type: disc;
  }

  :deep(ol) {
    list-style-type: decimal;
  }

  :deep(li) {
    margin: 4px 0;
    line-height: 1.6;

    // 修复任务列表样式
    &.task-list-item {
      list-style-type: none;
      padding-left: 0;
      display: flex;
      align-items: flex-start;
      margin-left: -20px; // 抵消父级 padding

      input[type='checkbox'] {
        margin: 5px 8px 0 0;
        flex-shrink: 0;
      }
    }
  }

  :deep(a) {
    color: #0366d6;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  :deep(code):not(pre code) {
    background-color: rgba(27, 31, 35, 0.05);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family:
      ui-monospace,
      SFMono-Regular,
      SF Mono,
      Menlo,
      Consolas,
      Liberation Mono,
      monospace;
    font-size: 85%;
  }

  :deep(blockquote) {
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
    margin: 0 0 8px 0;
  }

  :deep(hr) {
    height: 0.25em;
    padding: 0;
    margin: 16px 0;
    background-color: #e1e4e8;
    border: 0;
  }

  :deep(table) {
    display: block;
    width: 100%;
    overflow: auto;
    margin-top: 0;
    margin-bottom: 16px;
    border-collapse: collapse;

    th,
    td {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }

    tr {
      background-color: #fff;
      border-top: 1px solid #c6cbd1;
      &:nth-child(2n) {
        background-color: #f6f8fa;
      }
    }
  }
}

// 修复代码块渲染问题
:deep(.x-md-code-block) {
  pre {
    background-color: #f6f8fa !important;
    padding: 16px;
    border-radius: 8px;
    overflow: auto;

    code {
      font-family:
        ui-monospace,
        SFMono-Regular,
        SF Mono,
        Menlo,
        Consolas,
        Liberation Mono,
        monospace;
      font-size: 14px;
      line-height: 1.5;

      .line {
        display: block;
        min-height: 1rem;
      }
    }
  }
}
</style>
