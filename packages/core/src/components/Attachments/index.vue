<script lang="ts" setup>
import type { FilesCardProps } from '../FilesCard/types';
import type { AttachmentsEmits, FileListProps } from './types';
import {
  ArrowLeftBold,
  ArrowRightBold,
  Plus,
  UploadFilled
} from '@element-plus/icons-vue';
import { debounce } from 'radash';
import FilesCard from '../FilesCard/index.vue';

const props = withDefaults(defineProps<FileListProps>(), {
  items: () => [],
  overflow: 'scrollX',
  listStyle: () => ({}),
  uploadIconSize: '64px',
  dragTarget: undefined,
  hideUpload: false
});

const emits = defineEmits<AttachmentsEmits>();

/* 列表相关 开始 */
const containerRef = ref<HTMLDivElement | null>(null);
const wrapperRef = ref<HTMLDivElement | null>(null);
const firstMount = ref(false);
const pingStart = ref(false);
const pingEnd = ref(false);
const TOLERANCE = 1;
function checkPing() {
  const containerEle = containerRef.value;
  if (!containerEle) return;

  if (props.overflow === 'scrollX') {
    pingStart.value = Math.abs(containerEle.scrollLeft) >= TOLERANCE;
    pingEnd.value =
      containerEle.scrollWidth -
        containerEle.clientWidth -
        Math.abs(containerEle.scrollLeft) >=
      TOLERANCE;
  } else if (props.overflow === 'scrollY') {
    pingStart.value = containerEle.scrollTop !== 0;
    pingEnd.value =
      containerEle.scrollHeight - containerEle.clientHeight !==
      containerEle.scrollTop;
  } else {
    pingStart.value = false;
    pingEnd.value = false;
  }
}
function onScrollOffset(offset: -1 | 1) {
  const containerEle = containerRef.value;
  if (containerEle) {
    containerEle.scrollTo({
      left:
        props.overflow === 'scrollX'
          ? containerEle.scrollLeft + offset * containerEle.clientWidth
          : containerEle.scrollLeft,
      top:
        props.overflow === 'scrollY'
          ? containerEle.scrollTop + offset * containerEle.clientHeight
          : containerEle.scrollTop,
      behavior: 'smooth'
    });
  }
}
function onScrollLeft() {
  onScrollOffset(-1);
}
function onScrollRight() {
  onScrollOffset(1);
}
const debouncedCheckPing = debounce({ delay: 100 }, checkPing);
/* 列表相关 结束 */

/* 上传相关 开始 */
const targetElement = ref<HTMLElement | null>(null);
// 是否在 targetElement 上进行了拖拽
const isTargetDrag = ref(false);
const debouncedStyle = debounce({ delay: 100 }, toggleDragStyle);
// 是否超过上传长度限制
const _isOverLimit = computed(() => {
  if (props.limit && props.items.length >= props.limit) {
    return true;
  }
  return false;
});

// 添加/移除 拖拽类名和定位信息
const dropAreaRef = ref();
function toggleDragStyle(isDrag: boolean) {
  isTargetDrag.value = isDrag;
  if (targetElement.value) {
    const isBodyTarget = targetElement.value === document.body; // 判断是否为body

    if (isDrag) {
      // 针对body特殊处理：使用fixed定位并铺满视口
      // 有滚动条就会有问题，所以这么处理，后续再看看这个怎么优化
      if (isBodyTarget && dropAreaRef.value) {
        dropAreaRef.value.style.position = 'fixed';
        dropAreaRef.value.style.width = '100vw'; // 视口宽度
        dropAreaRef.value.style.height = '100vh'; // 视口高度
        dropAreaRef.value.style.left = '0';
        dropAreaRef.value.style.top = '0';
      } else {
        // 其他元素保持原逻辑
        targetElement.value.style.position = 'relative';
      }
    } else {
      targetElement.value.style.position = '';
    }
  }
}

function handleUploadChange(file: File, props: FileListProps) {
  emits('uploadChange', file, props);
}

function handleUploadSuccess(response: any, file: File, props: FileListProps) {
  console.log('上传成功', response, file, props);
  emits('uploadSuccess', response, file, props);
}

function handleUploadError(error: any, file: File, props: FileListProps) {
  emits('uploadError', error, file, props);
}

function getTargetElement() {
  if (!props.dragTarget) return wrapperRef.value;
  // 新增：处理原生 DOM 元素（如 document.body）
  if (props.dragTarget instanceof HTMLElement) {
    return props.dragTarget;
  }
  if (typeof props.dragTarget === 'string') {
    return document.getElementById(props.dragTarget);
  }
  if (isRef(props.dragTarget)) {
    return props.dragTarget.value as HTMLElement;
  }
  // 兜底返回 wrapperRef（保持原有逻辑）
  return wrapperRef.value;
}

function targetDragEnter(event: DragEvent) {
  event.preventDefault();
  debouncedStyle(true);
}

function targetDropLeave(event: DragEvent) {
  event.preventDefault();
  // 新增逻辑：若离开后进入的元素仍在目标元素内部，不执行样式移除
  const relatedTarget = event.relatedTarget as Node;
  if (targetElement.value && targetElement.value.contains(relatedTarget)) {
    return;
  }
  debouncedStyle(false);
}

function targetDrop(event: DragEvent) {
  event.preventDefault();
  debouncedStyle(false);
  if (event.dataTransfer) {
    const files = event.dataTransfer.files;
    if (files.length) {
      emits('uploadDrop', [...files], { ...props });
    }
  }
}

function targetDragOver(event: DragEvent) {
  event.preventDefault();
}

/* 上传相关 结束 */

/* 卡片相关 开始 */
function handleDelete(item: FilesCardProps, index: number) {
  emits('deleteCard', item, index);
  nextTick(() => debouncedCheckPing());
}

/* 卡片相关 结束 */

onMounted(() => {
  firstMount.value = true;
  nextTick(() => debouncedCheckPing());
  window.addEventListener('resize', debouncedCheckPing);

  // 如果有拖拽目标元素，则监听拖拽事件
  if (wrapperRef.value) {
    targetElement.value = getTargetElement() || wrapperRef.value;
    // 监听拖拽事件
    targetElement.value.addEventListener('dragenter', targetDragEnter, false);
    targetElement.value.addEventListener('dragleave', targetDropLeave, false);
    targetElement.value.addEventListener('drop', targetDrop, false);
    targetElement.value.addEventListener('dragover', targetDragOver, false);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', debouncedCheckPing);
  if (targetElement.value) {
    targetElement.value.removeEventListener(
      'dragenter',
      targetDragEnter,
      false
    );
    targetElement.value.removeEventListener(
      'dragleave',
      targetDropLeave,
      false
    );
    targetElement.value.removeEventListener('drop', targetDrop, false);
    targetElement.value.removeEventListener('dragover', targetDragOver, false);
  }
});

watch(
  () => [props.overflow, props.items.length],
  () => {
    // 确保 DOM 更新后再调用 checkPing
    nextTick(() => debouncedCheckPing());
  },
  {
    immediate: true, // 组件初始化时立即调用一次
    deep: true // 如果 items 是对象或数组，需要深度监听
  }
);

// 监听 props.dragTarget
watch(
  () => props.dragTarget,
  () => {
    // 确保 DOM 更新后再调用 checkPing
    nextTick(() => {
      // 如果有拖拽目标元素，则监听拖拽事件
      if (wrapperRef.value) {
        targetElement.value = getTargetElement() || wrapperRef.value;
        // 监听拖拽事件
        targetElement.value.addEventListener(
          'dragenter',
          targetDragEnter,
          false
        );
        targetElement.value.addEventListener(
          'dragleave',
          targetDropLeave,
          false
        );
        targetElement.value.addEventListener('drop', targetDrop, false);
        targetElement.value.addEventListener('dragover', targetDragOver, false);
      }
    });
  },
  {
    immediate: true, // 组件初始化时立即调用一次
    deep: true
  }
);

defineExpose({
  onScrollLeft,
  onScrollRight,
  debouncedCheckPing
});
</script>

<template>
  <div
    ref="wrapperRef"
    class="elx-attachments-wrapper"
    :class="{
      'elx-attachments-overflow-ping-start':
        overflow === 'scrollX' && pingStart,
      'elx-attachments-overflow-ping-end': overflow === 'scrollX' && pingEnd
    }"
    :style="{
      ...listStyle,
      '--elx-attachments-upload-icon-size': props.uploadIconSize
    }"
  >
    <div v-if="!items.length && !props.hideUpload">
      <slot name="empty-upload">
        <el-upload
          class="elx-attachments-upload-btn"
          v-bind="$attrs"
          :show-file-list="false"
          @change="handleUploadChange"
          @success="handleUploadSuccess"
          @error="handleUploadError"
        >
          <el-icon class="elx-attachments__uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </slot>
    </div>

    <div class="elx-attachments-background">
      <div
        v-if="overflow === 'scrollX' && pingStart"
        class="elx-attachments-background-start"
      />
      <div
        v-if="overflow === 'scrollX' && pingEnd"
        class="elx-attachments-background-end"
      />
    </div>

    <div
      ref="containerRef"
      class="elx-attachments"
      :class="{
        [`elx-attachments-overflow-${overflow}`]: overflow
      }"
      :style="{
        ...(overflow === 'scrollX'
          ? { whiteSpace: 'nowrap', overflowX: 'auto', overflowY: 'hidden' }
          : {}),
        ...(overflow === 'scrollY'
          ? { overflowX: 'hidden', overflowY: 'auto' }
          : {}),
        ...(overflow === 'wrap' ? { display: 'flex', flexWrap: 'wrap' } : {})
      }"
      @scroll="debouncedCheckPing"
    >
      <div
        v-if="items.length"
        :class="{
          'elx-attachments-file-card-wrap': overflow === 'scrollX'
        }"
      >
        <slot name="file-list" :items="items">
          <div
            v-for="(item, index) in items"
            :key="item.uid"
            class="elx-attachments-card"
          >
            <transition name="elx-attachments-card-motion">
              <FilesCard
                v-if="item.uid"
                v-bind="item"
                class="elx-attachments-card-item"
                @delete="handleDelete(item, index)"
              />
            </transition>
          </div>
        </slot>

        <div
          v-if="items.length && !_isOverLimit && !props.hideUpload"
          class="elx-attachments-upload-placeholder"
        >
          <slot name="no-empty-upload">
            <el-upload
              v-bind="$attrs"
              :show-file-list="false"
              :style="{
                height: overflow === 'scrollY' && ''
              }"
              class="elx-attachments-upload-btn"
              @change="handleUploadChange"
              @success="handleUploadSuccess"
              @error="handleUploadError"
            >
              <template #trigger>
                <el-icon class="elx-attachments__uploader-icon">
                  <Plus />
                </el-icon>
              </template>
            </el-upload>
          </slot>
        </div>
      </div>
    </div>

    <slot
      name="prev-button"
      :show="overflow === 'scrollX' && pingStart"
      :on-scroll-left="onScrollLeft"
    >
      <el-button
        v-if="overflow === 'scrollX' && pingStart"
        size="small"
        class="elx-attachments-prev-btn"
        @click="onScrollLeft"
      >
        <el-icon>
          <ArrowLeftBold />
        </el-icon>
      </el-button>
    </slot>

    <slot
      name="next-button"
      :show="overflow === 'scrollX' && pingEnd"
      :on-scroll-right="onScrollRight"
    >
      <el-button
        v-if="overflow === 'scrollX' && pingEnd"
        size="small"
        class="elx-attachments-next-btn"
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
          <div class="elx-attachments-drop-area-text">在此处拖放文件上传</div>
        </div>
      </slot>
    </teleport>
  </div>
</template>

<style scoped lang="scss" src="./style.scss"></style>
