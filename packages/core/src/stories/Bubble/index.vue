<script setup lang="ts">
import Bubble from '@components/Bubble/index.vue';
import ConfigProvider from '@components/ConfigProvider/index.vue';
</script>

<template>
  <ConfigProvider>
    <div class="component-container">
      <p>
        1.3.0 版本支持 打字器 雾化效果 使用 Mermaid.js 支持简单的图表和函数公式
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
  </ConfigProvider>
</template>

<style scoped lang="scss">
.component-container {
  padding: 12px;
  border-radius: 15px;
}
</style>
