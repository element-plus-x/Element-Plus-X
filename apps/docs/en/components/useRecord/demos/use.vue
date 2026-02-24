<docs>
---
title: useRecord calls browser built-in speech recognition
---

Calls the browser's native speech recognition API, when used in `Google Chrome`, it needs to be in a `🪄magic environment` to work properly.
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

// useRecord This is the conventional way
// const { start, value, loading, stop } = useRecord({ onEnd: handleEnd })

// useRecord The following way is destructuring assignment for value, renaming value to text and assigning it to text, avoiding conflict with the value variable name below
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
        {{ loading ? 'Recording' : 'Start Recording' }}
      </el-button>
      <el-button :disabled="!loading" @click="stop"> Stop Recording </el-button>
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
// Rotation
.loading {
  animation: rotate 1s linear infinite;
}

// Rotation style
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
