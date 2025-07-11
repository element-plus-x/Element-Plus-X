<script setup lang="ts">
import type { ComputedRef } from 'vue';
import type {
  TypewriterEmits,
  TypewriterInstance,
  TypewriterProps,
  TypingConfig
} from './types.d.ts';

const props = withDefaults(defineProps<TypewriterProps>(), {
  content: '',
  typing: false,
  renderer: undefined
});
const emits = defineEmits<TypewriterEmits>();
const typeWriterRef = ref<HTMLElement | null>(null);

const typingIndex = ref(0);
const isTyping = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;
const contentCache = ref(''); // 添加缓存变量

// 配置合并逻辑修改
const mergedConfig: ComputedRef<TypingConfig> = computed(() => {
  const defaultConfig: TypingConfig = {
    step: typeof props.typing === 'object' ? (props.typing.step ?? 2) : 2,
    interval:
      typeof props.typing === 'object' ? (props.typing.interval ?? 50) : 50,
    // 根据条件动态设置后缀
    suffix:
      typeof props.typing === 'object' ? (props.typing.suffix ?? '|') : '|'
  };

  // 处理打字配置
  if (props.typing === true) {
    return {
      ...defaultConfig
    };
  }

  if (typeof props.typing === 'object') {
    return {
      ...defaultConfig,
      ...props.typing,
      // 强制覆盖后缀设置
      suffix: props.typing.suffix ?? '|'
    };
  }

  return defaultConfig;
});
// 修改内容处理逻辑
const processedContent = computed(() => {
  if (!props.content) return '';

  // 非打字模式直接渲染完整内容
  if (!props.typing) {
    return props.content;
  }

  // 打字模式处理截断内容
  const displayed = contentCache.value.slice(0, typingIndex.value);
  return displayed;
});
// 计算属性
const typingProgress = computed(() => {
  return contentCache.value
    ? Math.min((typingIndex.value / contentCache.value.length) * 100, 100)
    : 0;
});
// 修改渲染内容计算属性
const renderedContent = computed(() => {
  return processedContent.value;
});

const instance: TypewriterInstance = {
  interrupt,
  continue: continueTyping,
  restart,
  destroy,
  renderedContent: computed(() => renderedContent.value),
  isTyping: toRef(isTyping),
  progress: computed(() => typingProgress.value)
};

// 打字逻辑
watch(
  () => props.content,
  (newVal, oldVal) => {
    if (!props.typing) {
      typingIndex.value = newVal?.length || 0;
      isTyping.value = false;
      contentCache.value = newVal || '';
      return;
    }

    const shouldReset = !oldVal || !newVal?.startsWith(oldVal);

    if (shouldReset) {
      typingIndex.value = 0;
      contentCache.value = newVal || '';
    } else {
      contentCache.value = newVal || '';
    }

    if (!isTyping.value) {
      startTyping();
    }
  },
  { immediate: true }
);

function startTyping() {
  clearTimeout(timer!);
  if (!props.typing || !contentCache.value) return;

  isTyping.value = true;
  emits('start', instance);

  const typeNext = () => {
    typingIndex.value += mergedConfig.value.step!;
    emits('writing', instance);

    if (typingIndex.value >= contentCache.value.length) {
      finishTyping();
      return;
    }

    timer = setTimeout(typeNext, mergedConfig.value.interval);
  };

  timer = setTimeout(typeNext, mergedConfig.value.interval);
}

function finishTyping() {
  isTyping.value = false;
  typingIndex.value = contentCache.value.length;
  if ((props.typing as TypingConfig)?.isRequestEnd ?? true) {
    emits('finish', instance);
  }
}

// 公共方法
function interrupt() {
  clearTimeout(timer!);
  isTyping.value = false;
}

function continueTyping() {
  if (typingIndex.value < contentCache.value.length) {
    startTyping();
  }
}

function restart() {
  typingIndex.value = 0;
  startTyping();
}

function destroy() {
  clearTimeout(timer!);
  timer = null;
  typingIndex.value = 0;
  isTyping.value = false;
}

// 生命周期
onUnmounted(destroy);

// 暴露方法
defineExpose(instance);
</script>

<template>
  <div ref="typeWriterRef" class="typer-container">
    <component
      :is="renderer"
      v-if="renderer"
      :markdown="renderedContent"
      :is-typing="isTyping"
      :progress="typingProgress"
      :suffix="mergedConfig.suffix"
    >
      <!-- 可根据需要传递默认插槽内容 -->
    </component>
    <!-- 如果没有renderer，则渲染默认内容 -->
    <div
      v-else
      class="typer-content"
      :class="[
        {
          'typing-cursor': typing && mergedConfig.suffix && isTyping
        }
      ]"
      :style="{
        '--cursor-char': `'${mergedConfig.suffix}'`
      }"
    >
      <!-- 显示打字机渲染内容 -->
      {{ renderedContent }}
    </div>
  </div>
</template>

<!-- 样式转移-暂定方案-为后续主题做准备 -->
<style scoped lang="scss" src="./style.scss"></style>
