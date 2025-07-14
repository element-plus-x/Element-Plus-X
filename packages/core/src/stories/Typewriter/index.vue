<script setup lang="ts">
// import ConfigProvider from '@components/ConfigProvider/index.vue';
import Typewriter from '@components/Typewriter/index.vue';
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
    <Typewriter v-bind="$attrs" />
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
