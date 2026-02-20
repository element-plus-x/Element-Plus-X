<script setup lang="ts">
import type { BubbleEmits, BubbleProps } from './types.d.ts';

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
  noStyle: false
});

const emits = defineEmits<BubbleEmits>();

const internalDestroyed = ref(false);

watch(
  () => props.content,
  (newVal, oldVal) => {
    if (newVal !== oldVal && internalDestroyed.value) {
      restart();
    }
  }
);

function avatarError(e: Event) {
  emits('avatarError', e);
}

function restart() {
  internalDestroyed.value = false;
}

function destroy() {
  internalDestroyed.value = true;
}

onUnmounted(destroy);

defineExpose({
  restart,
  destroy
});
</script>

<template>
  <div
    v-if="!internalDestroyed"
    class="el-bubble"
    :class="{
      'el-bubble-start': placement === 'start',
      'el-bubble-end': placement === 'end',
      'el-bubble-no-style': noStyle
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
        <!-- 内容-默认 -->
        <div
          v-if="!loading && !$slots.content && content"
          class="el-bubble-text"
        >
          {{ content }}
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
