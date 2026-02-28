<script setup lang="ts">
import Bubble from '@components/Bubble/index.vue';
import ConfigProvider from '@components/ConfigProvider/index.vue';
import { MarkdownRenderer } from 'x-markdown-vue';
import 'katex/dist/katex.min.css';

import 'shiki';
import 'shiki-stream';

const avatar = 'https://avatars.githubusercontent.com/u/76239030?s=40&v=4';

const staticContent = ref(`### 行内公式
1. 欧拉公式：$e^{i\\pi} + 1 = 0$
2. 二次方程求根公式：$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$
3. 向量点积：$\\vec{a} \\cdot \\vec{b} = a_x b_x + a_y b_y + a_z b_z$

### []包裹公式
\\[ e^{i\\pi} + 1 = 0 \\]

\\[\\boxed{boxed包裹}\\]

### 块级公式
1. 傅里叶变换：
$$
F(\\omega) = \\int_{-\\infty}^{\\infty} f(t) e^{-i\\omega t} dt
$$

2. 矩阵乘法：
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

3. 泰勒级数展开：
$$
f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!} (x - a)^n
$$

### 任务列表与代码块
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
  const text = `# 标题
这是一个 Markdown 示例。
- 列表项 1
- 列表项 2
**粗体文本** 和 *斜体文本*

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
  <ConfigProvider>
    <div class="component-container">
      <div class="component-title">与 x-markdown-vue 结合使用</div>
      <p class="tip">
        从 v2.0.0 开始，Typewriter 组件已移除。如需 Markdown 渲染，请使用
        <a href="https://www.npmjs.com/package/x-markdown-vue" target="_blank"
          >x-markdown-vue</a
        >
      </p>

      <div class="component-title">基础用法（支持公式、代码块、任务列表）</div>
      <Bubble :avatar="avatar" placement="start">
        <template #content>
          <div class="markdown-content-wrapper">
            <MarkdownRenderer :markdown="staticContent" />
          </div>
        </template>
      </Bubble>

      <div class="component-title">流式渲染</div>
      <p class="tip">
        通过 <code>enable-animate</code> 属性实现打字机效果，模拟 AI
        流式输出场景
      </p>
      <div class="btn-list">
        <el-button type="primary" @click="startStreaming">
          开始流式输出
        </el-button>
        <el-button @click="stopStreaming"> 停止 </el-button>
        <el-button @click="resetStreaming"> 重置 </el-button>
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
    margin-top: 24px;

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

  .btn-list {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
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

      // 确保文字可见，Shiki 默认可能生成了与背景色相近的颜色
      .line {
        display: block;
        min-height: 1rem;
      }
    }
  }
}

// 流式渲染动画样式
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
