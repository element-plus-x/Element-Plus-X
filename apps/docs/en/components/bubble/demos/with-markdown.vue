<docs>
---
title: Using with x-markdown-vue
---

Supports formulas, code blocks, task lists, and streaming rendering.
</docs>

<script setup lang="ts">
import { MarkdownRenderer } from 'x-markdown-vue';
import 'x-markdown-vue/style';
import 'katex/dist/katex.min.css';

import 'shiki';
import 'shiki-stream';

const avatar = 'https://avatars.githubusercontent.com/u/76239030?s=40&v=4';

const staticContent = ref(`### Inline Formulas
1. Euler's formula: $e^{i\\pi} + 1 = 0$
2. Quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$
3. Vector dot product: $\\vec{a} \\cdot \\vec{b} = a_x b_x + a_y b_y + a_z b_z$

### [] Wrapped Formula
\\[ e^{i\\pi} + 1 = 0 \\]

\\[\\boxed{boxed content}\\]

### Block Formulas
1. Fourier Transform:
$$
F(\\omega) = \\int_{-\\infty}^{\\infty} f(t) e^{-i\\omega t} dt
$$

2. Matrix Multiplication:
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

3. Taylor Series:
$$
f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!} (x - a)^n
$$

### Task List & Code Block
- [x] Add some task
- [ ] Do some task

\`\`\`typescript
const greeting: string = "Hello World";
console.log(greeting);
\`\`\`
`);

const streamingContent = ref('');
let interval: ReturnType<typeof setInterval>;

function startStreaming() {
  streamingContent.value = '';
  const text = `# Title
This is a Markdown example.
- List item 1
- List item 2
**Bold text** and *italic text*

- [x] Add some task
- [ ] Do some task

\`\`\`typescript
const greeting = "Hello World";
console.log(greeting);
\`\`\`
`;
  let index = 0;
  interval = setInterval(() => {
    if (index < text.length) {
      streamingContent.value += text[index];
      index++;
    } else {
      clearInterval(interval);
    }
  }, 30);
}

function stopStreaming() {
  clearInterval(interval);
}

function resetStreaming() {
  stopStreaming();
  streamingContent.value = '';
}

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <div class="markdown-demo-container">
    <div class="demo-section">
      <div class="demo-title">
        Basic Usage (Supports formulas, code blocks, task lists)
      </div>
      <Bubble :avatar="avatar" placement="start">
        <template #content>
          <div class="markdown-content-wrapper">
            <MarkdownRenderer :markdown="staticContent" />
          </div>
        </template>
      </Bubble>
    </div>

    <div class="demo-section">
      <div class="demo-title">Streaming Rendering</div>
      <p class="demo-tip">
        Use <code>enable-animate</code> property to achieve typewriter effect,
        simulating AI streaming output
      </p>
      <div class="btn-list">
        <el-button type="primary" @click="startStreaming">
          Start Streaming
        </el-button>
        <el-button @click="stopStreaming"> Stop </el-button>
        <el-button @click="resetStreaming"> Reset </el-button>
      </div>
      <Bubble :avatar="avatar" placement="start">
        <template #content>
          <div class="markdown-content-wrapper">
            <MarkdownRenderer
              :markdown="streamingContent"
              :enable-animate="true"
            />
          </div>
        </template>
      </Bubble>
    </div>
  </div>
</template>

<style scoped lang="scss">
.markdown-demo-container {
  .demo-section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .demo-title {
    font-weight: 600;
    margin-bottom: 12px;
    color: var(--vp-c-text-1);
  }

  .demo-tip {
    color: var(--vp-c-text-2);
    font-size: 14px;
    margin-bottom: 12px;

    code {
      background: var(--vp-c-default-soft);
      padding: 2px 6px;
      border-radius: 4px;
    }
  }

  .btn-list {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }
}

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

    &.task-list-item {
      list-style-type: none;
      padding-left: 0;
      display: flex;
      align-items: flex-start;
      margin-left: -20px;

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

:deep(.x-md-animated-word) {
  animation: fadeIn 0.2s ease-in-out forwards;
  display: inline-block;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
