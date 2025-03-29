<script setup lang="ts">
import UseBubble from './components/demo-useBubble.vue'
import UseBubbleList from './components/demo-useBubbleList.vue'
import UseChat from './components/demo-useChat.vue'
import UseRequest from './components/demo-useRequest.vue'
import UseSender from './components/demo-useSender.vue'
import UseRecord from './components/useRecord.vue'
</script>

<template>
  <div id="app">
    <UseRecord />
    <el-alert
      title="💖 欢迎使用 Element-Plus-X"
      type="success"
      closable
    >
      <p class="self-description">
        详情可移步使用文档：👉 <a href="https://element-plus-x.com">element-plus-x.com</a>
      </p>
    </el-alert>

    <el-tabs type="border-card" class="demo-tabs">
      <el-tab-pane label="Bubble">
        <UseBubble />
      </el-tab-pane>
      <el-tab-pane label="BubbleList">
        <UseBubbleList />
      </el-tab-pane>
      <el-tab-pane label="Sender">
        <UseSender />
      </el-tab-pane>
      <el-tab-pane label="UseRequest">
        <UseRequest />
      </el-tab-pane>
      <el-tab-pane label="UseRequest">
        <UseChat />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.demo-tabs {
  min-height: calc(100vh - 64px - 64px);
  background-color: beige;
}

.self-description {
  font-size: 14px;
  a {
    text-emphasis: none;
    color: coral;
    font-weight: 700;
  }
}
</style>
