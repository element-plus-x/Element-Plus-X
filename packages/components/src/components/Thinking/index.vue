<script lang='ts' setup>
import type { ThinkingInstance, ThinkingProps } from './types'
import { computed, ref, watch } from 'vue'

const props = withDefaults(defineProps<ThinkingProps>(), {
  thinkingItems: () => [],
  dotSize: 'default',
})

const emits = defineEmits<{
  handleExpand: [value: ThinkingInstance['expandKeys']]
}>()

const dotMargin = computed(() => {
  switch (props.dotSize) {
    case 'small':
      return '-4px 0 0 -7px'
    case 'large':
      return '-11px 0 0 -15px'
    default:
      return '-8px 0 0 -11px'
  }
})

// 计算默认展开项
const activeNamesComputed = computed(() =>
  props.thinkingItems
    .filter(item => item.isCanExpand && item.isDefaultExpand)
    .map(item => String(item.id)),
)

const defaultActiveNodes = ref<string[]>([...activeNamesComputed.value])

function handleExpand(activeNames: string[]) {
  emits('handleExpand', activeNames)
}

watch(() => activeNamesComputed.value, (v) => {
  defaultActiveNodes.value = [...v]
})
</script>

<template>
  <div class="el-thinking">
    <el-timeline style="max-width: 600px">
      <TransitionGroup name="thinking" tag="el-timeline-item">
        <el-timeline-item
          v-for="item in props.thinkingItems" :key="item.id" :type="item.type" :timestamp="item.title"
          :hide-timestamp="item.hideTitle" :placement="item.placement ?? 'top'"
        >
          <div v-if="!item.isCanExpand">
            {{ item.content }}
          </div>
          <el-collapse v-else-if="!item.isDefaultExpand" @change="handleExpand">
            <el-collapse-item :title="item.content">
              {{ item.expandContent }}
            </el-collapse-item>
          </el-collapse>
          <el-collapse v-else-if="item.isDefaultExpand" v-model="defaultActiveNodes" @change="handleExpand">
            <el-collapse-item :title="item.content" :name="String(item.id)">
              {{ item.expandContent }}
            </el-collapse-item>
          </el-collapse>

          <template #dot>
            <div class="el-thinking-item-dot">
              <el-button
                :size="props.dotSize" :type="item.type" :icon="item.dotIcon" :loading="item.isLoading"
                :loading-icon="item.loadingIcon" circle
              />
            </div>
          </template>
        </el-timeline-item>
      </TransitionGroup>
    </el-timeline>
  </div>
</template>

<style lang="scss" scoped>
.el-thinking {
  width: 100%;
  margin: 0 0 0 7px;



  &-item-dot {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: v-bind(dotMargin)
  }

  :deep(.el-collapse) {
    border: none;

    .el-collapse-item__header {
      height: 20px;
      font-weight: normal;
    }

    .el-collapse-item__arrow {
      margin: 0 0 0 8px;
    }

    .el-collapse-item__header {
      margin-bottom: 5px;
    }

    .el-collapse-item__header,
    .el-collapse-item__wrap {
      border: none;
    }

    .el-collapse-item__content {
      color: var(--el-text-color-secondary);
      padding: 0;
    }
  }

  :deep(.el-timeline) {
    padding: 10px 0 0 5px;
  }

  :deep(.el-timeline-item__timestamp) {
    color: var(--el-text-color-primary);
  }

  :deep(.el-timeline-item__content) {
    color: var(--el-text-color-secondary);
  }
}

.thinking-move,
.thinking-enter-active,
.thinking-leave-active {
  transition: all 0.5s ease;
}

.thinking-enter-from,
.thinking-leave-to {
  opacity: 0;
  transform: translateY(10px) scaleY(0.9);
}

.thinking-leave-active {
  position: absolute;
}
</style>
