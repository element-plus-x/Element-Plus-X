<script setup lang="ts">
import { computed, defineProps, withDefaults } from 'vue'

withDefaults(defineProps<{
  className?: string
}>(), {
  className: '',
})

// 定义常量
const SIZE = 1000
const COUNT = 4
const RECT_WIDTH = 140
const RECT_RADIUS = RECT_WIDTH / 2
const RECT_HEIGHT_MIN = 250
const RECT_HEIGHT_MAX = 500
const DURATION = 0.8

// 计算矩形的位置和高度范围
const rects = computed(() => {
  const dest = (SIZE - RECT_WIDTH * COUNT) / (COUNT - 1)
  return Array.from({ length: COUNT }).map((_, index) => {
    const x = index * (dest + RECT_WIDTH)
    const yMin = SIZE / 2 - RECT_HEIGHT_MIN / 2
    const yMax = SIZE / 2 - RECT_HEIGHT_MAX / 2
    return { x, yMin, yMax }
  })
})
</script>

<template>
  <svg
    :class="className"
    color="currentColor"
    :viewBox="`0 0 ${SIZE} ${SIZE}`"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <title>Speech Recording</title>

    <template v-for="(item, index) in rects" :key="index">
      <rect
        fill="currentColor"
        :rx="RECT_RADIUS"
        :ry="RECT_RADIUS"
        :height="RECT_HEIGHT_MIN"
        :width="RECT_WIDTH"
        :x="item.x"
        :y="item.yMin"
      >
        <animate
          attributeName="height"
          :values="`${RECT_HEIGHT_MIN}; ${RECT_HEIGHT_MAX}; ${RECT_HEIGHT_MIN}`"
          keyTimes="0; 0.5; 1"
          :dur="`${DURATION}s`"
          :begin="`${(DURATION / COUNT) * index}s`"
          repeatCount="indefinite"
        />
        <animate
          attributeName="y"
          :values="`${item.yMin}; ${item.yMax}; ${item.yMin}`"
          keyTimes="0; 0.5; 1"
          :dur="`${DURATION}s`"
          :begin="`${(DURATION / COUNT) * index}s`"
          repeatCount="indefinite"
        />
      </rect>
    </template>
  </svg>
</template>

<style scoped>
/* 可以在这里添加样式 */
</style>
