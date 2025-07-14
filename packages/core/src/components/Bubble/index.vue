<script setup lang="ts">
import type {
  TypewriterInstance,
  TypingConfig
} from '../Typewriter/types.d.ts';
import type { BubbleEmits, BubbleProps } from './types.d.ts';
import Typewriter from '../Typewriter/index.vue';

const props = withDefaults(defineProps<BubbleProps>(), {
  content: '',
  avatar: '',
  placement: 'start',
  variant: 'filled',
  maxWidth: '500px',
  avatarSize: '',
  avatarGap: '12px',
  avatarShape: 'circle',
  avatarSrcSet: '',
  avatarAlt: '',
  avatarFit: 'cover',
  noStyle: false,
  renderer: undefined
});

const emits = defineEmits<BubbleEmits>();

const internalDestroyed = ref(false); // 内部销毁状态
// 新增：响应式变量跟踪打字状态
const isTypingClass = ref(false);

// 监听内容变化自动重置
watch(
  () => props.content,
  (newVal, oldVal) => {
    if (newVal !== oldVal && internalDestroyed.value) {
      restart(); // 内容变化时自动重置
    }
  }
);

const typewriterRef = ref<TypewriterInstance>();
const instance: TypewriterInstance = {
  interrupt,
  continue: continueTyping,
  restart,
  destroy,
  renderedContent: computed(() =>
    internalDestroyed.value
      ? ''
      : typewriterRef.value?.renderedContent.value || ''
  ),
  isTyping: computed(
    () =>
      !internalDestroyed.value && (typewriterRef.value?.isTyping.value || false)
  ),
  progress: computed(() =>
    internalDestroyed.value ? 0 : typewriterRef.value?.progress.value || 0
  )
};

const DEFAULT_TYPING: TypingConfig = {
  step: 2,
  suffix: '|',
  interval: 50,
  isRequestEnd: true
};

const _typing = computed(() => {
  if (typeof props.typing === 'undefined') {
    return false;
  } else if (typeof props.typing === 'boolean') {
    return props.typing;
  } else {
    return Object.assign({}, DEFAULT_TYPING, props.typing);
  }
}) as boolean | TypingConfig;

function onStart(instance: TypewriterInstance) {
  emits('start', instance);
}

function onFinish(instance: TypewriterInstance) {
  isTypingClass.value = false;
  emits('finish', instance);
}

function onWriting(instance: TypewriterInstance) {
  isTypingClass.value = true;
  emits('writing', instance);
}

function avatarError(e: Event) {
  emits('avatarError', e);
}

function interrupt() {
  typewriterRef.value?.interrupt();
}

function continueTyping() {
  typewriterRef.value?.continue();
}

function restart() {
  internalDestroyed.value = false;
  typewriterRef.value?.restart();
}

function destroy() {
  typewriterRef.value?.destroy();
  internalDestroyed.value = true;
}

// 组件卸载时自动销毁
onUnmounted(instance.destroy);
defineExpose(instance);
</script>

<template>
  <div
    v-if="!internalDestroyed"
    class="el-bubble"
    :class="{
      'el-bubble-start': placement === 'start',
      'el-bubble-end': placement === 'end',
      'el-bubble-no-style': noStyle,
      'el-bubble-is-typing': isTypingClass // 新增动态类名
    }"
    :style="{
      '--el-box-shadow-tertiary': `0 1px 2px 0 rgba(0, 0, 0, 0.03),
      0 1px 6px -1px rgba(0, 0, 0, 0.02),
      0 2px 4px 0 rgba(0, 0, 0, 0.02)`,
      '--bubble-content-max-width': `${maxWidth}`,
      '--el-bubble-avatar-placeholder-width': `${$slots.avatar ? '' : avatarSize}`,
      '--el-bubble-avatar-placeholder-height': `${$slots.avatar ? '' : avatarSize}`,
      '--el-bubble-avatar-placeholder-gap': `${avatarGap}`
    }"
  >
    <!-- 头像 -->
    <div
      v-if="!$slots.avatar && avatar"
      class="el-bubble-avatar el-bubble-avatar-size"
    >
      <el-avatar
        :size="0"
        :src="avatar"
        :shape="avatarShape"
        :src-set="avatarSrcSet"
        :alt="avatarFit"
        @error="avatarError"
      />
    </div>

    <!-- 头像属性进行占位 -->
    <div
      v-if="!$slots.avatar && !avatar && avatarSize"
      class="el-bubble-avatar-placeholder"
    />

    <div v-if="$slots.avatar" class="el-bubble-avatar">
      <slot name="avatar" />
    </div>

    <!-- 内容 -->
    <div class="el-bubble-content-wrapper">
      <!-- 头部内容 -->
      <div v-if="$slots.header" class="el-bubble-header">
        <slot name="header" />
      </div>

      <div
        class="el-bubble-content"
        :class="{
          'el-bubble-content-loading': loading,
          'el-bubble-content-round': shape === 'round' && !noStyle,
          'el-bubble-content-corner': shape === 'corner' && !noStyle,
          'el-bubble-content-filled': variant === 'filled' && !noStyle,
          'el-bubble-content-borderless': variant === 'borderless' && !noStyle,
          'el-bubble-content-outlined': variant === 'outlined' && !noStyle,
          'el-bubble-content-shadow': variant === 'shadow' && !noStyle
        }"
      >
        <div
          v-if="!loading"
          class="el-typewriter"
          :class="{
            'no-content': !content
          }"
        >
          <Typewriter
            v-if="!$slots.content && content"
            ref="typewriterRef"
            :typing="_typing"
            :content="content"
            :renderer="renderer"
            @start="onStart"
            @writing="onWriting"
            @finish="onFinish"
          />
        </div>

        <!-- 内容-自定义 -->
        <slot
          v-if="!internalDestroyed && $slots.content && !loading"
          name="content"
        />

        <!-- 加载中-默认 -->
        <div v-if="loading && !$slots.loading" class="el-bubble-loading-wrap">
          <div
            v-for="(_, index) in 3"
            :key="index"
            class="dot"
            :style="{ animationDelay: `${index * 0.2}s` }"
          />
        </div>

        <!-- 加载中-自定义 -->
        <div v-if="loading && $slots.loading" class="el-bubble-loading-wrap">
          <slot name="loading" />
        </div>
      </div>

      <div v-if="$slots.footer" class="el-bubble-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./style.scss"></style>
