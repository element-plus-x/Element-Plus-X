<script setup lang="ts">
import type { ThinkingEmits, ThinkingProps, ThinkingStatus } from './types';
import {
  ArrowUpBold,
  CircleCloseFilled,
  Loading,
  Opportunity,
  SuccessFilled
} from '@element-plus/icons-vue';
import { useNamespace } from '../../hooks/useNamespace';

const props = withDefaults(defineProps<ThinkingProps>(), {
  content: '',
  modelValue: true,
  status: 'start' as ThinkingStatus,
  disabled: false,
  autoCollapse: false,
  buttonWidth: '160px',
  duration: '0.2s',
  maxWidth: '500px',
  backgroundColor: 'var(--elx-thinking-content-bg, rgba(0, 0, 0, 0.02))',
  color: 'var(--elx-thinking-content-color, var(--elx-text-color-regular))'
});

// 定义组件 Emits
const emit = defineEmits<ThinkingEmits>();
const ns = useNamespace('thinking');

const rootStyle = computed(() =>
  ns.cssVarBlock({
    'button-width': props.buttonWidth,
    'animation-duration': props.duration,
    'content-wrapper-width': props.maxWidth,
    'content-wrapper-background-color': props.backgroundColor,
    'content-wrapper-color': props.color
  })
);

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
  <div :class="ns.b()" :style="rootStyle">
    <!-- 触发按钮 -->
    <button
      :class="[
        ns.e('trigger'),
        ns.em('trigger', status),
        props.disabled ? ns.em('trigger', 'disabled') : ''
      ]"
      :disabled="props.disabled"
      @click="changeExpand"
    >
      <span :class="ns.e('status-icon')">
        <slot name="status-icon" :status="props.status">
          <el-icon
            v-if="status === 'thinking'"
            :class="[ns.is('loading'), ns.e('icon-center')]"
          >
            <Loading />
          </el-icon>

          <el-icon
            v-if="status === 'start'"
            :class="[ns.e('icon-center'), ns.e('start-color')]"
          >
            <Opportunity />
          </el-icon>

          <el-icon
            v-if="status === 'end'"
            :class="[ns.e('icon-center'), ns.e('end-color')]"
          >
            <SuccessFilled />
          </el-icon>

          <el-icon
            v-if="status === 'error'"
            :class="[ns.e('icon-center'), ns.e('error-color')]"
          >
            <CircleCloseFilled />
          </el-icon>

          <el-icon
            v-if="status === 'cancel'"
            :class="[ns.e('icon-center'), ns.e('cancel-color')]"
          >
            <CircleCloseFilled />
          </el-icon>
        </slot>
      </span>

      <span :class="ns.e('label')">
        <slot name="label" :status="props.status">
          {{
            status === 'thinking'
              ? '思考中...'
              : status === 'error'
                ? '思考遇到问题'
                : status === 'end'
                  ? '思考完成'
                  : status === 'cancel'
                    ? '中断思考'
                    : '开始思考'
          }}
        </slot>
      </span>

      <transition :name="`${ns.b()}-rotate`">
        <span
          v-if="!props.disabled"
          :class="[
            ns.e('arrow'),
            ns.e('icon-center'),
            isExpanded ? ns.em('arrow', 'expanded') : ''
          ]"
        >
          <slot name="arrow">
            <el-icon :class="ns.e('icon-center')">
              <ArrowUpBold />
            </el-icon>
          </slot>
        </span>
      </transition>
    </button>

    <!-- 内容区域 -->
    <Transition :name="`${ns.b()}-slide`">
      <div
        v-show="isExpanded"
        v-if="displayedContent"
        :class="[
          ns.e('content-wrapper'),
          status === 'error' ? ns.em('content-wrapper', 'error-state') : ''
        ]"
      >
        <div :class="ns.e('content')">
          <slot
            v-if="status !== 'error'"
            name="content"
            :content="displayedContent"
          >
            <pre>{{ displayedContent }}</pre>
          </slot>

          <slot v-else name="error" :error-content="displayedContent">
            <div :class="ns.e('error-message')">
              {{ displayedContent }}
            </div>
          </slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss" src="./style.scss"></style>
