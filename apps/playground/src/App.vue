<script setup lang="ts">
import AttachmentsDemo from './components/AttachmentsDemo.vue'
import BubbleDemo from './components/BubbleDemo.vue'
import MarkdownDemo from './components/MarkdownDemo/index.vue'
import BubbleListDemo from './components/BubbleListDemo.vue'
import ConversationsDemo from './components/ConversationsDemo.vue'
import FilesCardDemo from './components/FilesCardDemo.vue'
import MentionSenderDemo from './components/MentionSenderDemo.vue'
import PromptsDemo from './components/PromptsDemo.vue'
import SenderDemo from './components/SenderDemo.vue'
import ThinkingDemo from './components/ThinkingDemo.vue'
import ThoughtChainDemo from './components/ThoughtChainDemo.vue'
import useRecordDemo from './components/useRecordDemo.vue'
import useSendDemo from './components/useSendDemo.vue'
import useXStreamSIPDemo from './components/useXStreamSIPDemo.vue'
import useXStreamSSEDemo from './components/useXStreamSSEDemo.vue'
import WelcomeDemo from './components/WelcomeDemo.vue'
</script>

<template>
  <div id="app">
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
      <el-tab-pane label="Markdown">
        <MarkdownDemo />
      </el-tab-pane>
      <el-tab-pane label="Bubble">
        <BubbleDemo />
      </el-tab-pane>

      <el-tab-pane label="BubbleList">
        <BubbleListDemo />
      </el-tab-pane>

      <el-tab-pane label="Conversations">
        <ConversationsDemo />
      </el-tab-pane>

      <el-tab-pane label="FilesCard">
        <FilesCardDemo />
      </el-tab-pane>

      <el-tab-pane label="Attachments">
        <AttachmentsDemo />
      </el-tab-pane>

      <el-tab-pane label="Sender">
        <SenderDemo />
      </el-tab-pane>

      <el-tab-pane label="MentionSender">
        <MentionSenderDemo />
      </el-tab-pane>

      <el-tab-pane label="Welcome">
        <WelcomeDemo />
      </el-tab-pane>

      <el-tab-pane label="Prompts">
        <PromptsDemo />
      </el-tab-pane>

      <el-tab-pane label="Thinking">
        <ThinkingDemo />
      </el-tab-pane>

      <el-tab-pane label="ThoughtChain">
        <ThoughtChainDemo />
      </el-tab-pane>

      <el-tab-pane label="useRecord">
        <useRecordDemo />
      </el-tab-pane>

      <el-tab-pane label="useSend">
        <useSendDemo />
      </el-tab-pane>

      <el-tab-pane label="useXStream-SSE">
        <useXStreamSSEDemo />
      </el-tab-pane>

      <el-tab-pane label="useXStream-SIP">
        <useXStreamSIPDemo />
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
  background-color: beige;
}

:deep() {
    .el-tabs__content {
      height: calc(100vh - 64px - 130px);
    }
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
