<script setup lang="ts">
import { MoreFilled, Share } from '@element-plus/icons-vue'
</script>

<template>
  <div class="component-container">
    <Welcome
      variant="filled"
      description="filled -- 这是描述信息 ~"
      :style="{ background: 'linear-gradient(97deg, rgba(90,196,255,0.12) 0%, rgba(174,136,255,0.12) 100%)' }"
    />

    <Welcome
      variant="filled"
      title="欢迎使用 Element Plus X 💖"
      description="filled -- 这是描述信息 ~"
      :style="{ background: 'linear-gradient(97deg, rgba(90,196,255,0.12) 0%, rgba(174,136,255,0.12) 100%)' }"
    />

    <Welcome
      variant="borderless"
      title="欢迎使用 Element Plus X 💖"
      description="filled -- 这是描述信息 ~"
      :style="{ background: 'linear-gradient(97deg, rgba(90,196,255,0.12) 0%, rgba(174,136,255,0.12) 100%)' }"
    >
      <template #extra>
        <el-button link type="primary">
          关于我
        </el-button>
      </template>
    </Welcome>

    <Welcome
      variant="filled"
      icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
      title="欢迎使用 Element Plus X 💖"
      description="borderless  -- 这是描述信息 ~"
      :style="{ background: 'linear-gradient(97deg, rgba(90,196,255,0.12) 0%, rgba(174,136,255,0.12) 100%)' }"
    >
      <template #extra>
        <div class="extra-container">
          <el-button plain text color="#ff2828">
            <el-icon><Share /></el-icon>
          </el-button>

          <el-button plain link>
            <el-icon><MoreFilled /></el-icon>
          </el-button>
        </div>
      </template>
    </Welcome>
  </div>
</template>

<style scoped lang="scss">
.component-container {
  background-color: white;
  padding: 12px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: calc(100vh - 220px);
  overflow: auto;

  .extra-container {
    :deep() {
      .el-icon {
        font-size: 18px;
      }
    }
  }
}
</style>
