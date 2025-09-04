<docs>
---
title: 插槽
---

你可以拦截一些标签，也可以是自定义的标签，然后自定义去渲染这些标签。如果是想自定义渲染图片或者视频，说不定会很方便
</docs>

<script setup lang="ts">
const markdown = `
<img src="https://avatars.githubusercontent.com/u/76239030?v=4" alt="">

<self-btn>自定义标签</self-btn>
`;
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <XMarkdown :markdown="markdown" allowHtml>
      <template #img="{ ...props }">
        <img :key="props.key" :src="props.src" style="border-radius: 30px">
      </template>

      <template #self-btn="{ ...props }">
        <el-button :key="props.key">
          控制台查看 props 打印{{ console.log(props) }}
        </el-button>
      </template>
    </XMarkdown>
  </div>
</template>

<style scoped lang="less"></style>
