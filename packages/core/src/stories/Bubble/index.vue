<script setup lang="ts">
import Bubble from '@components/Bubble/index.vue';
import ConfigProvider from '@components/ConfigProvider/index.vue';
</script>

<template>
  <ConfigProvider>
    <div class="component-container">
      <p>Bubble 对话气泡组件，常用于聊天场景。</p>
      <p style="color: #ff8c00">
        如需 Markdown 渲染功能，请使用
        <a href="https://www.npmjs.com/package/x-markdown-vue" target="_blank"
          >x-markdown-vue</a
        >
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
