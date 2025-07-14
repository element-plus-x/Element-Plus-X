<script setup lang="ts">
import Bubble from '@components/Bubble/index.vue';
// import ConfigProvider from '@components/ConfigProvider/index.vue';
// import markdownItMermaid from '@jsonlee_12138/markdown-it-mermaid';

// const mdPlugins = [
//   markdownItMermaid({
//     forceLegacyMathML: true,
//     delay: 100
//   })
// ];
</script>

<template>
  <!-- <ConfigProvider :md-plugins="mdPlugins"> -->
  <div class="component-container">
    <b>雾化效果和markdown内容已去除，支持传入renderer自定义渲染器</b>
    <p>
      1.2.0 版本支持 打字器 雾化效果 使用 Mermaid.js 支持简单的图表和函数公式
    </p>
    <p style="color: #ff8c00">
      在这个版本的 md 我们将 markdown-it
      配置全部暴露出来了，需要大家自行集成配置，包括代码高亮和简单的图表、函数公式这些。
    </p>
    <p style="color: #f00">
      后面可能会上一个大的版本，找到更好的处理 md
      渲染的方法。大家有好的想法可以加交流群或者作者VX一起交流
    </p>
    <div class="component-1">
      <Bubble v-bind="$attrs" />
    </div>
  </div>
  <!-- </ConfigProvider> -->
</template>

<style scoped lang="scss">
.component-container {
  background-color: white;
  padding: 12px;
  border-radius: 15px;
}
</style>
