<script setup>
import { ConfigProvider, Welcome } from 'vue-element-plus-x';
</script>

<template>
  <ConfigProvider>
    <div class="demo-container">
      <p>Using default configuration (light theme, namespace: elx)</p>
      <Welcome
        title="Welcome"
        description="This is a Welcome example with default config"
      />
    </div>
  </ConfigProvider>
</template>

<style scoped>
.demo-container {
  padding: 16px;
}
</style>
