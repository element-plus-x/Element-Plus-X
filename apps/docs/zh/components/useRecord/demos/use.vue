<docs>
---
title: useRecord 调用浏览器内置 语音识别
---

调用浏览器原生的语音识别 API，在 `谷歌浏览器` 中使用，需要在 `🪄魔法环境` 中才能正常使用。
</docs>

<script setup lang="ts">
import {
  Eleme,
  Loading,
  Mic,
  Microphone,
  RefreshRight,
  Service
} from '@element-plus/icons-vue';
import { useRecord } from 'vue-element-plus-x';

// useRecord 这是常规 写法
// const { start, value, loading, stop } = useRecord({ onEnd: handleEnd })

// useRecord 下面的写法是对 value 的解构赋值，将 value 取名为 text 并赋值给 text，让他和下面的 value 变量名不冲突
const {
  start,
  value: text,
  loading,
  stop
} = useRecord({
  onEnd: handleEnd
});

const value = ref('');
const senderRef = ref();

function handleStart() {
  start();
}

function handleEnd(res: string) {
  console.log('end:', res);
}

function submit() {
  console.log('submit:', text);
}

watch(
  text,
  val => {
    console.log('text:', val);
    value.value = val;
  },
  { deep: true }
);
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <div style="display: flex">
      <el-button :disabled="loading" @click="handleStart">
        {{ loading ? '录音中' : '开始录音' }}
      </el-button>
      <el-button :disabled="!loading" @click="stop"> 结束录音 </el-button>
    </div>

    <XSender ref="senderRef" v-model="value" @submit="submit">
      <template #action-list>
        <div class="btn-list">
          <el-button
            v-if="!loading"
            :loading="loading"
            type="primary"
            circle
            plain
            color="#EC0078"
            @click="handleStart"
          >
            <el-icon>
              <Mic />
            </el-icon>
          </el-button>

          <el-button
            v-else
            type="primary"
            circle
            color="#EC0078"
            :z-index="99"
            @click="stop"
          >
            <el-icon class="loading">
              <Eleme />
            </el-icon>
          </el-button>
        </div>
      </template>
    </XSender>

    <XSender ref="senderRef" v-model="value" @submit="submit">
      <template #action-list>
        <div class="btn-list">
          <el-button
            v-if="!loading"
            :loading="loading"
            type="primary"
            circle
            color="#626aef"
            @click="handleStart"
          >
            <el-icon><Microphone /></el-icon>
          </el-button>

          <el-button
            v-else
            type="primary"
            circle
            color="#626aef"
            plain
            :z-index="99"
            @click="stop"
          >
            <el-icon class="loading">
              <Loading />
            </el-icon>
          </el-button>
        </div>
      </template>
    </XSender>

    <XSender ref="senderRef" v-model="value" @submit="submit">
      <template #action-list>
        <div class="btn-list">
          <el-button
            v-if="!loading"
            :loading="loading"
            type="primary"
            color="#FE0006"
            test
            @click="handleStart"
          >
            <el-icon><Service /></el-icon>
          </el-button>

          <el-button
            v-else
            type="primary"
            color="#FE0006"
            plain
            :z-index="99"
            @click="stop"
          >
            <el-icon class="loading">
              <RefreshRight />
            </el-icon>
          </el-button>
        </div>
      </template>
    </XSender>
  </div>
</template>

<style scoped lang="less">
// 旋转
.loading {
  animation: rotate 1s linear infinite;
}

// 旋转样式
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
