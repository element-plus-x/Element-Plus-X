<script lang="ts" setup>
import type { FilesCardProps } from '../FilesCard/types.d.ts'
import type { FileListProps } from './types'
import { ArrowLeftBold, ArrowRightBold, Plus, UploadFilled } from '@element-plus/icons-vue'
import { debounce } from 'radash'
import FilesCard from '../FilesCard/index.vue'

const props = withDefaults(defineProps<FileListProps>(), {
  items: () => [],
  overflow: 'scrollX',
  listStyle: () => ({}),
  uploadIconSize: '64px',
  dragTarget: undefined,
  hideUpload: false,
})

const emits = defineEmits(['uploadChange', 'uploadSuccess', 'uploadError', 'uploadDrop', 'deleteCard'])

/* 列表相关 开始 */
const containerRef = ref<HTMLDivElement | null>(null)
const wrapperRef = ref<HTMLDivElement | null>(null)
const firstMount = ref(false)
const pingStart = ref(false)
const pingEnd = ref(false)
const TOLERANCE = 1
function checkPing() {
  const containerEle = containerRef.value
  if (!containerEle)
    return

  if (props.overflow === 'scrollX') {
    pingStart.value = Math.abs(containerEle.scrollLeft) >= TOLERANCE
    pingEnd.value = containerEle.scrollWidth - containerEle.clientWidth - Math.abs(containerEle.scrollLeft) >= TOLERANCE
  }
  else if (props.overflow === 'scrollY') {
    pingStart.value = containerEle.scrollTop !== 0
    pingEnd.value = containerEle.scrollHeight - containerEle.clientHeight !== containerEle.scrollTop
  }
  else {
    pingStart.value = false
    pingEnd.value = false
  }
}
function onScrollOffset(offset: -1 | 1) {
  const containerEle = containerRef.value
  if (containerEle) {
    containerEle.scrollTo({
      left: props.overflow === 'scrollX' ? containerEle.scrollLeft + offset * containerEle.clientWidth : containerEle.scrollLeft,
      top: props.overflow === 'scrollY' ? containerEle.scrollTop + offset * containerEle.clientHeight : containerEle.scrollTop,
      behavior: 'smooth',
    })
  }
}
function onScrollLeft() {
  onScrollOffset(-1)
}
function onScrollRight() {
  onScrollOffset(1)
}
const debouncedCheckPing = debounce({ delay: 100 }, checkPing)
/* 列表相关 结束 */

/* 上传相关 开始 */
const targetElement = ref<HTMLElement | null>(null)
// 是否在 targetElement 上进行了拖拽
const isTargetDrag = ref(false)
const debouncedStyle = debounce({ delay: 100 }, toggleDragStyle)
// 是否超过上传长度限制
const _isOverLimit = computed(() => {
  if (props.limit && props.items.length >= props.limit) {
    return true
  }
  return false
})

// 添加/移除 拖拽类名和定位信息
const dropAreaRef = ref()
function toggleDragStyle(isDrag: boolean) {
  isTargetDrag.value = isDrag
  if (targetElement.value) {
    const isBodyTarget = targetElement.value === document.body // 判断是否为body

    if (isDrag) {
      // 针对body特殊处理：使用fixed定位并铺满视口
      // 有滚动条就会有问题，所以这么处理，后续再看看这个怎么优化
      if (isBodyTarget && dropAreaRef.value) {
        dropAreaRef.value.style.position = 'fixed'
        dropAreaRef.value.style.width = '100vw' // 视口宽度
        dropAreaRef.value.style.height = '100vh' // 视口高度
        dropAreaRef.value.style.left = '0'
        dropAreaRef.value.style.top = '0'
      }
      else {
        // 其他元素保持原逻辑
        targetElement.value.style.position = 'relative'
      }
    }
    else {
      targetElement.value.style.position = ''
    }
  }
}

function handleUploadChange(file: File, fileList: FileListProps) {
  emits('uploadChange', file, fileList)
}

function handleUploadSuccess(response: any, file: File, fileList: FileListProps) {
  emits('uploadSuccess', response, file, fileList)
}

function handleUploadError(error: any, file: File, fileList: FileListProps) {
  emits('uploadError', error, file, fileList)
}

function getTargetElement() {
  if (!props.dragTarget)
    return wrapperRef.value
  // 新增：处理原生 DOM 元素（如 document.body）
  if (props.dragTarget instanceof HTMLElement) {
    return props.dragTarget
  }
  if (typeof props.dragTarget === 'string') {
    return document.getElementById(props.dragTarget)
  }
  if (isRef(props.dragTarget)) {
    return props.dragTarget.value as HTMLElement
  }
  // 兜底返回 wrapperRef（保持原有逻辑）
  return wrapperRef.value
}

function targetDragEnter(event: DragEvent) {
  event.preventDefault()
  debouncedStyle(true)
}

function targetDropLeave(event: DragEvent) {
  event.preventDefault()
  // 新增逻辑：若离开后进入的元素仍在目标元素内部，不执行样式移除
  const relatedTarget = event.relatedTarget as Node
  if (targetElement.value && targetElement.value.contains(relatedTarget)) {
    return
  }
  debouncedStyle(false)
}

function targetDrop(event: DragEvent) {
  event.preventDefault()
  debouncedStyle(false)
  if (event.dataTransfer) {
    const files = event.dataTransfer.files
    if (files.length) {
      emits('uploadDrop', [...files], { ...props })
    }
  }
}

function targetDragOver(event: DragEvent) {
  event.preventDefault()
}

/* 上传相关 结束 */

/* 卡片相关 开始 */
function handleDelete(item: FilesCardProps, index: number) {
  emits('deleteCard', item, index)
  nextTick(() => debouncedCheckPing())
}

/* 卡片相关 结束 */

onMounted(() => {
  firstMount.value = true
  nextTick(() => debouncedCheckPing())
  window.addEventListener('resize', debouncedCheckPing)

  // 如果有拖拽目标元素，则监听拖拽事件
  if (wrapperRef.value) {
    console.log('wrapperRef===>', getTargetElement())
    targetElement.value = getTargetElement() || wrapperRef.value
    // 监听拖拽事件
    targetElement.value.addEventListener('dragenter', targetDragEnter, false)
    targetElement.value.addEventListener('dragleave', targetDropLeave, false)
    targetElement.value.addEventListener('drop', targetDrop, false)
    targetElement.value.addEventListener('dragover', targetDragOver, false)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', debouncedCheckPing)
  if (targetElement.value) {
    targetElement.value.removeEventListener('dragenter', targetDragEnter, false)
    targetElement.value.removeEventListener('dragleave', targetDropLeave, false)
    targetElement.value.removeEventListener('drop', targetDrop, false)
    targetElement.value.removeEventListener('dragover', targetDragOver, false)
  }
})

watch(
  () => [props.overflow, props.items.length],
  () => {
    // 确保 DOM 更新后再调用 checkPing
    nextTick(() => debouncedCheckPing())
  },
  {
    immediate: true, // 组件初始化时立即调用一次
    deep: true, // 如果 items 是对象或数组，需要深度监听
  },
)

// 监听 props.dragTarget
watch(
  () => props.dragTarget,
  () => {
    // 确保 DOM 更新后再调用 checkPing
    // 确保 DOM 更新后再调用 checkPing
    nextTick(() => {
      // 如果有拖拽目标元素，则监听拖拽事件
      if (wrapperRef.value) {
        targetElement.value = getTargetElement() || wrapperRef.value
        // 监听拖拽事件
        targetElement.value.addEventListener('dragenter', targetDragEnter, false)
        targetElement.value.addEventListener('dragleave', targetDropLeave, false)
        targetElement.value.addEventListener('drop', targetDrop, false)
        targetElement.value.addEventListener('dragover', targetDragOver, false)
      }
    })
  },
  {
    immediate: true, // 组件初始化时立即调用一次
    deep: true,
  },
)

defineExpose({
  onScrollLeft,
  onScrollRight,
  debouncedCheckPing,
})
</script>

<template>
  <div
    ref="wrapperRef" class="elx-attachments-wrapper" :class="{
      'elx-attachments-overflow-ping-start': overflow === 'scrollX' && pingStart,
      'elx-attachments-overflow-ping-end': overflow === 'scrollX' && pingEnd,
    }" :style="{
      ...listStyle,
      '--elx-attachments-upload-icon-size': props.uploadIconSize,
    }"
  >
    <div v-if="!items.length && !props.hideUpload">
      <el-upload
        class="elx-attachments-upload-btn"
        :class="{ 'elx-has-upload-slot': $slots['no-empty-upload'] }" v-bind="$attrs" :show-file-list="false"
        @change="handleUploadChange" @success="handleUploadSuccess" @error="handleUploadError"
      >
        <template #trigger>
          <slot name="empty-upload">
            <el-icon class="uploader-icon">
              <Plus />
            </el-icon>
          </slot>
        </template>
      </el-upload>
    </div>

    <div class="elx-attachments-background">
      <div v-if="overflow === 'scrollX' && pingStart" class="elx-attachments-background-start" />
      <div v-if="overflow === 'scrollX' && pingEnd" class="elx-attachments-background-end" />
    </div>

    <div
      ref="containerRef" class="elx-attachments" :class="{
        [`elx-attachments-overflow-${overflow}`]: overflow,
      }" :style="{
        ...(overflow === 'scrollX' ? { whiteSpace: 'nowrap', overflowX: 'auto', overflowY: 'hidden' } : {}),
        ...(overflow === 'scrollY' ? { overflowX: 'hidden', overflowY: 'auto' } : {}),
        ...(overflow === 'wrap' ? { display: 'flex', flexWrap: 'wrap' } : {}),
      }" @scroll="debouncedCheckPing"
    >
      <div
        v-if="items.length" :class="{
          'elx-attachments-file-card-wrap': overflow === 'scrollX',
        }"
      >
        <slot name="file-list" :items="items">
          <div v-for="(item, index) in items" :key="item.uid" class="elx-attachments-card">
            <transition name="card-motion">
              <FilesCard
                v-if="item.uid" v-bind="item" class="elx-attachments-card-item"
                @delete="handleDelete(item, index)"
              />
            </transition>
          </div>
        </slot>

        <div v-if="items.length && !_isOverLimit && !props.hideUpload" class="elx-attachments-upload-placeholder">
          <el-upload
            v-bind="$attrs" :show-file-list="false" :style="{
              height: overflow === 'scrollY' && '',
            }"
            class="elx-attachments-upload-btn" :class="{ 'elx-has-upload-slot': $slots['no-empty-upload'] }"
            @change="handleUploadChange" @success="handleUploadSuccess"
            @error="handleUploadError"
          >
            <template #trigger>
              <slot name="no-empty-upload">
                <el-icon class="uploader-icon">
                  <Plus />
                </el-icon>
              </slot>
            </template>
          </el-upload>
        </div>
      </div>
    </div>

    <slot name="prev-button" :show="overflow === 'scrollX' && pingStart" :on-scroll-left="onScrollLeft">
      <el-button
        v-if="overflow === 'scrollX' && pingStart" size="small" class="elx-attachments-prev-btn"
        @click="onScrollLeft"
      >
        <el-icon>
          <ArrowLeftBold />
        </el-icon>
      </el-button>
    </slot>

    <slot name="next-button" :show="overflow === 'scrollX' && pingEnd" :on-scroll-right="onScrollRight">
      <el-button
        v-if="overflow === 'scrollX' && pingEnd" size="small" class="elx-attachments-next-btn"
        @click="onScrollRight"
      >
        <el-icon>
          <ArrowRightBold />
        </el-icon>
      </el-button>
    </slot>

    <!-- 使用 DropArea 组件 -->
    <teleport v-if="targetElement && isTargetDrag" :to="targetElement">
      <slot name="drop-area">
        <div ref="dropAreaRef" class="elx-attachments-drop-area">
          <el-icon class="elx-attachments-drop-area-icon">
            <UploadFilled />
          </el-icon>
          <div class="elx-attachments-drop-area-text">
            在此处拖放文件上传
          </div>
        </div>
      </slot>
    </teleport>
  </div>
</template>

<style scoped>
/* CSS 动画样式调整 */
.card-motion-enter-active,
.card-motion-move,
.card-motion-leave-active {
  transition: all 0.3s ease;
  opacity: 1;
  transform: translateX(0);
}

.card-motion-enter-from,
.card-motion-leave-to {
  opacity: 0;
  /* 从左侧外进入（进场）/ 移动到右侧外（退场） */
  transform: translateX(-100%);
  /* 进场初始位置在左侧外 */
  /* 如果你希望从左侧稍微偏移进入，可以用 translateX(-10px) */
}

.card-motion-leave-active {
  /* 退场时从当前位置移动到右侧外 */
  transform: translateX(100%);
  opacity: 0;
}

.elx-attachments-file-card-wrap {
  display: flex;
  height: 100%;
  align-items: center;
}

.elx-attachments-upload-placeholder {
  display: inline-block;
  width: fit-content;
  align-self: center;
  margin: 6px;
}

.elx-attachments-card {
  display: inline-block;
  vertical-align: top;
}

.elx-attachments-card-item {
  margin: 6px;
}

.elx-attachments-prev-btn,
.elx-attachments-next-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  border: none;
  padding: 4px 0px;
  border-radius: 3px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.7);
  }
}

.elx-attachments-prev-btn {
  left: 8px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}

.elx-attachments-next-btn {
  right: 8px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}

.elx-attachments-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  pointer-events: none;
}

.elx-attachments-background-start {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 50px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0));
  z-index: 5;
}

.elx-attachments-background-end {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 50px;
  background: linear-gradient(to left, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0));
  z-index: 5;
}

.elx-attachments-overflow-scrollX {
  height: 100%;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
}

.elx-attachments-overflow-scrollY {
  width: 100%;
  height: 100%;
}

.elx-attachments-wrapper {
  position: relative;
  display: block;
}

.elx-attachments-upload-btn {
  display: flex;
}

:deep() {
  .elx-has-upload-slot .el-upload{
    border: none;
  }
  .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    &:hover {
      border-color: var(--el-color-primary);

      .el-icon.uploader-icon {
        color: var(--el-color-primary);
      }
    }
  }

  .el-icon.uploader-icon {
    font-size: 28px;
    color: #8c939d;
    text-align: center;
    width: var(--elx-attachments-upload-icon-size);
    height: var(--elx-attachments-upload-icon-size);
  }

  .el-upload-dragger {
    padding: 0;

    &:hover {
      .el-icon {
        color: var(--el-color-primary);
      }
    }
  }
}

/* 设置穿梭节点的样式 */
.elx-attachments-drop-area {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  border-radius: 15px;
  border: 2px dashed var(--el-color-primary);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: rgba(225, 225, 225, 0.3);
  backdrop-filter: blur(2px);

  .elx-attachments-drop-area-icon {
    font-size: 50px;
    color: var(--el-color-primary);
  }

  .elx-attachments-drop-area-text {
    font-size: 16px;
    color: var(--el-color-primary);
    margin-top: 10px;
    text-align: center;
    width: 100%;
    max-width: 300px;
  }
}
</style>
