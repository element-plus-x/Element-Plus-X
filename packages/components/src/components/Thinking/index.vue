<script setup lang="ts">
import type { ThinkingProps, ThinkingStatus } from './types.d.ts'
import { ArrowDownBold, CircleCloseFilled, Loading, Opportunity, SuccessFilled } from '@element-plus/icons-vue'

const props = withDefaults(defineProps<ThinkingProps>(), {
  content: '',
  modelValue: true,
  status: 'start' as ThinkingStatus,
  disabled: false,
  autoCollapse: false,
  buttonWidth: '160px',
  duration: '0.2s',
  maxWidth: '500px',
  backgroundColor: '#fcfcfc',
  color: 'var(--el-color-info)',
})

// 定义组件 Emits
const emit = defineEmits<{
  (e: 'change', value: { value: boolean, status: ThinkingStatus }): void
  (e: 'update:expanded', value: boolean): void
}>()

const isExpanded = ref(props.modelValue)

// 监听 modelValue 变化
watch(() => props.modelValue, (newVal) => {
  isExpanded.value = newVal
})

// 处理展开/收起
function changeExpand() {
  if (props.disabled)
    return
  isExpanded.value = !isExpanded.value
  emit('change', { value: isExpanded.value, status: props.status })
  emit('update:expanded', isExpanded.value)
}

// 显示内容（带错误状态处理）
const displayedContent = computed(() => {
  return props.status === 'error'
    ? '思考过程中出现错误'
    : props.content
})

// 自动收起逻辑
watch(() => props.status, (newVal) => {
  if (newVal === 'end' && props.autoCollapse) {
    isExpanded.value = false
  }
})
</script>

<template>
  <div
    class="el-thinking" :style="{
      '--el-thinking-button-width': props.buttonWidth,
      '--el-thinking-animation-duration': props.duration,
      '--el-thinking-content-wrapper-width': props.maxWidth,
      '--el-thinking-content-wrapper-background-color': props.backgroundColor,
      '--el-thinking-content-wrapper-color': props.color,
    }"
  >
    <!-- 触发按钮 -->
    <button
      class="trigger"
      :class="[status, { disabled: !props.disabled }]"
      :disabled="props.disabled"
      @click="changeExpand"
    >
      <span class="status-icon">
        <slot name="status-icon" :status="props.status">
          <el-icon
            v-if="status === 'thinking'"
            class="is-loading el-icon-center"
          >
            <Loading />
          </el-icon>

          <el-icon v-if="status === 'start'" class="el-icon-center start-color">
            <Opportunity />
          </el-icon>

          <el-icon v-if="status === 'end'" class="el-icon-center end-color">
            <SuccessFilled />
          </el-icon>

          <el-icon v-if="status === 'error'" class="el-icon-center error-color">
            <CircleCloseFilled />
          </el-icon>

        </slot>
      </span>

      <span class="label">
        <slot name="label" :status="props.status">
          {{
            status === 'thinking' ? '思考中...'
            : status === 'error' ? '思考遇到问题'
              : status === 'end' ? '思考完成' : '开始思考'
          }}
        </slot>
      </span>

      <transition name="rotate">
        <span v-if="!props.disabled" class="arrow el-icon-center" :class="{ expanded: isExpanded }">
          <slot name="arrow">
            <el-icon class="el-icon-center">
              <ArrowDownBold />
            </el-icon>
          </slot>
        </span>
      </transition>
    </button>

    <!-- 内容区域 -->
    <Transition name="slide">
      <div
        v-show="isExpanded"
        v-if="displayedContent"
        class="content-wrapper"
        :class="{ 'error-state': status === 'error' }"
      >
        <div class="content">
          <slot v-if="status !== 'error'" name="content" :content="displayedContent">
            <pre>{{ displayedContent }}</pre>
          </slot>

          <slot v-else name="error" :error-content="displayedContent">
            <div class="error-message">
              {{ displayedContent }}
            </div>
          </slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.el-thinking {
  font-family: system-ui, sans-serif;
  margin: 0 auto;
}

.trigger {
  display: flex;
  align-items: center;
  height: 100%;
  width: var(--el-thinking-button-width);
  gap: 8px;
  padding: var(--el-padding-sm, 12px) calc(var(--el-padding-sm, 12px) + 4px);
  border: 1px solid #e4e4e4;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  margin-bottom: 8px;

  /* 居中 */
  .el-icon-center {
    height: 100%;
    display: flex;
    align-items: center;
  }

  /* 开始颜色 */
  .start-color {
    color: var(--el-color-warning);
  }

  /* 完成颜色 */
  .end-color {
    color: var(--el-color-success);
  }

  /* 思考中颜色 */
  .is-loading {
    color: var(--el-color-primary);
  }

  /* 思考失败颜色 */
  .error-color {
    color: var(--el-color-danger);
  }
}

.trigger:hover {
  background: #f8f8f8;
}

.trigger.disabled {
  cursor: pointer;
}

.trigger:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.status-icon {
  font-size: 1.2em;
}

.arrow {
  margin-left: auto;
  transition: transform var(--el-thinking-animation-duration);
}

.arrow.expanded {
  transform: rotate(180deg);
}

/* 滑动动画 */
.slide-enter-active,
.slide-leave-active {
  height: calc-size(max-content, size);
  transition:
    height var(--el-thinking-animation-duration) ease-in-out,
    opacity var(--el-thinking-animation-duration) ease-in-out;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  height: 0 !important;
  opacity: 0;
}

/* 内容区域样式 */
.content-wrapper {
  box-sizing: border-box;
  min-width: 0;
}

.content pre {
  border: 1px solid #eee;
  background: var(--el-thinking-content-wrapper-background-color);
  padding: var(--el-padding-sm, 12px) calc(var(--el-padding-sm, 12px) + 4px);
  border-radius: calc(var(--el-border-radius-base) + 4px);
  max-width: var(--el-thinking-content-wrapper-width);
  font-size: 14px;
  color: var(--el-thinking-content-wrapper-color);
  white-space: pre-wrap;
  font-family: DeepSeek-CJK-patch,Inter,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Cantarell,Helvetica Neue,Oxygen,Open Sans,sans-serif;
  margin: 0;
  line-height: var(--el-font-line-height-primary);
}

.error-state {
  border-color: #ffd0d0;
  background: #fff0f0;
}

.error-message {
  color: #dc3545;
  height: fit-content;
  padding: 8px;
  background: #ffeef0;
  border-radius: 4px;
}
</style>
