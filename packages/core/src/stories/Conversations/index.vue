<script lang="ts" setup>
import type {
  ConversationItem,
  ConversationMenuCommand
} from '@components/Conversations/types';
import { ElMessage } from 'element-plus';

function handleMenuCommand(
  command: ConversationMenuCommand,
  item: ConversationItem
) {
  ElMessage.success(`点击了菜单项：${command} ${item.label}`);
}
</script>

<template>
  <div class="component-container">
    <div class="component-title">
      会话管理组件，高度自动会撑满父元素高度，溢出则会滚动
    </div>

    <div class="conversations-wrap">
      <Conversations v-bind="$attrs" @menu-command="handleMenuCommand" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.component-container {
  padding: 12px;
  border-radius: 15px;
  overflow: auto;

  .component-title {
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 12px;
    font-weight: 700;
    line-height: 1.5;
    margin-bottom: 12px;
    margin-top: 24px;

    &::after {
      position: absolute;
      content: '';
      display: block;
      width: 5px;
      height: 75%;
      border-radius: 15px;
      left: 0;
      background-color: #409eff;
    }
  }

  .conversations-wrap {
    height: 530px;
  }
}
</style>
