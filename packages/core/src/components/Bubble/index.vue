<script setup lang="ts">
import type { BubbleEmits, BubbleProps } from './types';
import { useNamespace } from '../../hooks/useNamespace';

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
const ns = useNamespace('bubble');

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
    :class="[
      ns.b(),
      placement === 'start' ? ns.m('start') : '',
      placement === 'end' ? ns.m('end') : '',
      noStyle ? ns.m('no-style') : ''
    ]"
    :style="{
      '--el-box-shadow-tertiary': `0 1px 2px 0 rgba(0, 0, 0, 0.03),
      0 1px 6px -1px rgba(0, 0, 0, 0.02),
      0 2px 4px 0 rgba(0, 0, 0, 0.02)`,
      '--elx-bubble-content-max-width': `${maxWidth}`,
      '--el-bubble-avatar-placeholder-width': `${$slots.avatar ? '' : avatarSize}`,
      '--el-bubble-avatar-placeholder-height': `${$slots.avatar ? '' : avatarSize}`,
      '--el-bubble-avatar-placeholder-gap': `${avatarGap}`
    }"
  >
    <!-- 头像 -->
    <div
      v-if="!$slots.avatar && avatar"
      :class="[ns.e('avatar'), ns.e('avatar-size')]"
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
      :class="ns.e('avatar-placeholder')"
    />

    <div v-if="$slots.avatar" :class="ns.e('avatar')">
      <slot name="avatar" />
    </div>

    <!-- 内容 -->
    <div :class="ns.e('content-wrapper')">
      <!-- 头部内容 -->
      <div v-if="$slots.header" :class="ns.e('header')">
        <slot name="header" />
      </div>

      <div
        :class="[
          ns.e('content'),
          loading ? ns.em('content', 'loading') : '',
          shape === 'round' && !noStyle ? ns.em('content', 'round') : '',
          shape === 'corner' && !noStyle ? ns.em('content', 'corner') : '',
          variant === 'filled' && !noStyle ? ns.em('content', 'filled') : '',
          variant === 'borderless' && !noStyle
            ? ns.em('content', 'borderless')
            : '',
          variant === 'outlined' && !noStyle
            ? ns.em('content', 'outlined')
            : '',
          variant === 'shadow' && !noStyle ? ns.em('content', 'shadow') : ''
        ]"
      >
        <!-- 内容-默认 -->
        <div
          v-if="!loading && !$slots.content && content"
          :class="ns.e('text')"
        >
          {{ content }}
        </div>

        <!-- 内容-自定义 -->
        <slot
          v-if="!internalDestroyed && $slots.content && !loading"
          name="content"
        />

        <!-- 加载中-默认 -->
        <div v-if="loading && !$slots.loading" :class="ns.e('loading-wrap')">
          <div
            v-for="(_, index) in 3"
            :key="index"
            :class="ns.e('dot')"
            :style="{ animationDelay: `${index * 0.2}s` }"
          />
        </div>

        <!-- 加载中-自定义 -->
        <div v-if="loading && $slots.loading" :class="ns.e('loading-wrap')">
          <slot name="loading" />
        </div>
      </div>

      <div v-if="$slots.footer" :class="ns.e('footer')">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./style.scss"></style>
