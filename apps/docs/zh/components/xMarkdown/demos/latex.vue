<docs>
---
title: LaTeX 数学公式
---

通过 `enable-latex` 启用数学公式渲染，需安装 `katex` 并引入其样式文件。
</docs>

<script setup lang="ts">
import 'katex/dist/katex.min.css';
import 'shiki';
import 'shiki-stream';

const MarkdownRenderer = shallowRef();
onMounted(async () => {
  if (typeof window === 'undefined') return;
  await import('x-markdown-vue/style');
  const mod = await import('x-markdown-vue');
  MarkdownRenderer.value = mod.MarkdownRenderer ?? mod.default ?? mod;
});

const content = `### 行内公式

欧拉公式：$e^{i\\pi} + 1 = 0$

二次方程：$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$

向量点积：$\\vec{a} \\cdot \\vec{b} = a_x b_x + a_y b_y + a_z b_z$

### 块级公式

傅里叶变换：

$$
F(\\omega) = \\int_{-\\infty}^{\\infty} f(t) e^{-i\\omega t} dt
$$

矩阵乘法：

$$
\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} \\cdot \\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} ax+by \\\\ cx+dy \\end{bmatrix}
$$

Boxed 公式：

$$\\boxed{E = mc^2}$$
`;
</script>

<template>
  <component
    :is="MarkdownRenderer"
    v-if="MarkdownRenderer"
    :markdown="content"
    :enable-latex="true"
  />
  <div v-else style="padding: 16px; color: #999">加载中...</div>
</template>
