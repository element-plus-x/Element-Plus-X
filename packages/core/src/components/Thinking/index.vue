<script setup lang="ts">
import type {
  ThinkingEmits,
  ThinkingProps,
  ThinkingStatus
} from './types.d.ts';
import {
  ArrowDownBold,
  CircleCloseFilled,
  Loading,
  Opportunity,
  SuccessFilled
} from '@element-plus/icons-vue';

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
  color: 'var(--el-color-info)'
});

// 定义组件 Emits
const emit = defineEmits<ThinkingEmits>();

const isExpanded = ref(props.modelValue);

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  newVal => {
    isExpanded.value = newVal;
  }
);

// 处理展开/收起
function changeExpand() {
  if (props.disabled) return;
  isExpanded.value = !isExpanded.value;
  emit('change', { value: isExpanded.value, status: props.status });
  emit('update:modelValue', isExpanded.value);
}

// 显示内容（带错误状态处理）
const displayedContent = computed(() => {
  return props.status === 'error' ? '思考过程中出现错误' : props.content;
});

// 自动收起逻辑
watch(
  () => props.status,
  newVal => {
    if (newVal === 'end' && props.autoCollapse) {
      isExpanded.value = false;
      emit('update:modelValue', isExpanded.value);
    }
  }
);
</script>

<template>
  <div
    class="el-thinking"
    :style="{
      '--el-thinking-button-width': props.buttonWidth,
      '--el-thinking-animation-duration': props.duration,
      '--el-thinking-content-wrapper-width': props.maxWidth,
      '--el-thinking-content-wrapper-background-color': props.backgroundColor,
      '--el-thinking-content-wrapper-color': props.color
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
            status === 'thinking'
              ? '思考中...'
              : status === 'error'
                ? '思考遇到问题'
                : status === 'end'
                  ? '思考完成'
                  : '开始思考'
          }}
        </slot>
      </span>

      <transition name="rotate">
        <span
          v-if="!props.disabled"
          class="arrow el-icon-center"
          :class="{ expanded: isExpanded }"
        >
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
          <slot
            v-if="status !== 'error'"
            name="content"
            :content="displayedContent"
          >
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

<style scoped lang="scss" src="./style.scss"></style>
