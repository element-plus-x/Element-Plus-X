<script setup>
import { ConfigProvider, Welcome } from 'vue-element-plus-x';
</script>

<template>
  <ConfigProvider>
    <div class="demo-container">
      <p>当前使用默认配置（亮色主题，命名空间：elx）</p>
      <Welcome
        title="Welcome"
        description="这是一个默认配置下的 Welcome 组件示例"
      />
    </div>
  </ConfigProvider>
</template>

<style scoped>
.demo-container {
  padding: 16px;
}
</style>
