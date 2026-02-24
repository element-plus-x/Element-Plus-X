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
      <p>Using custom theme overrides</p>
      <Welcome
        variant="filled"
        title="Welcome"
        description="This example shows styles overridden by themeOverrides"
      />
    </div>
  </ConfigProvider>
</template>

<style scoped>
.demo-container {
  padding: 16px;
}
</style>
