<script setup lang="ts">
import { ConfigProvider } from '../../components';

const props = defineProps<{
  markdown: string;
}>();
const timer = ref();
const index = ref(0);
function start() {
  timer.value = setInterval(() => {
    index.value += 5;
    if (index.value > props.markdown.length) {
      clearInterval(timer.value);
      index.value = props.markdown.length;
    }
  }, 80);
}
function pause() {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
}

const content = computed(() => {
  return props.markdown.slice(0, index.value);
});

function redo() {
  index.value = 0;
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
  start();
}

onMounted(() => {
  start();
});
</script>

<template>
  <el-button @click="start"> 开始 </el-button>
  <el-button @click="pause"> 暂停 </el-button>
  <el-button @click="redo"> 重新开始 </el-button>
  <div class="component-container">
    <!-- <MarkdownRenderer v-bind="$attrs" :markdown="content" /> -->
    <ConfigProvider>
      <XMarkdown v-bind="$attrs" :markdown="content" :enable-animate="true" />
    </ConfigProvider>
  </div>
</template>

<style scoped lang="scss">
.component-container {
  background-color: white;
  padding: 12px;
  border-radius: 15px;
}
</style>
