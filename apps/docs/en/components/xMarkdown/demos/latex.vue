<docs>
---
title: LaTeX Math Formulas
---

Enable LaTeX math with `enable-latex`. Install `katex` and import its CSS file.
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

const content = `### Inline Formulas

Euler's formula: $e^{i\\pi} + 1 = 0$

Quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$

Dot product: $\\vec{a} \\cdot \\vec{b} = a_x b_x + a_y b_y + a_z b_z$

### Block Formulas

Fourier Transform:

$$
F(\\omega) = \\int_{-\\infty}^{\\infty} f(t) e^{-i\\omega t} dt
$$

Matrix multiplication:

$$
\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} \\cdot \\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} ax+by \\\\ cx+dy \\end{bmatrix}
$$

Boxed formula:

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
  <div v-else style="padding: 16px; color: #999">Loading...</div>
</template>
