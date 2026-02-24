<script setup>
import { ConfigProvider, Welcome } from 'vue-element-plus-x';

const themeOverrides = {
  components: {
    Welcome: {
      'welcome-filled-bg': '#f0f9ff',
      'welcome-filled-border': '#7dd3fc',
      'welcome-title-color': 'rgba(0, 0, 0, 0.88)',
      'welcome-description-color': 'rgba(0, 0, 0, 0.65)'
    }
  }
};
</script>

<template>
  <ConfigProvider :theme-overrides="themeOverrides">
    <div class="demo-container">
      <p>使用自定义主题覆盖</p>
      <Welcome
        variant="filled"
        title="Welcome"
        description="这是使用 themeOverrides 覆盖后的样式示例"
      />
    </div>
  </ConfigProvider>
</template>

<style scoped>
.demo-container {
  padding: 16px;
}
</style>
