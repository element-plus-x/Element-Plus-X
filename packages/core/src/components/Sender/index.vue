<script setup lang="ts">
import type { SenderEmits, SenderProps } from './types.d.ts';
import {
  ClearButton,
  LoadingButton,
  SendButton,
  SpeechButton,
  SpeechLoadingButton
} from './components';

const props = withDefaults(defineProps<SenderProps>(), {
  placeholder: '请输入内容',
  autoSize: () => ({
    minRows: 1,
    maxRows: 6
  }),
  submitType: 'enter',
  headerAnimationTimer: 300,
  inputWidth: '100%',
  modelValue: '', // 显式定义value的默认值

  variant: 'default',
  showUpdown: true,
  submitBtnDisabled: undefined,

  // el-input 属性透传
  inputStyle: () => {},

  triggerStrings: () => [], // 指令字符数组，默认空数组
  triggerPopoverVisible: false,
  triggerPopoverWidth: 'fit-content',
  triggerPopoverLeft: '0px',
  triggerPopoverOffset: 8,
  triggerPopoverPlacement: 'top-start'
});

const emits = defineEmits<SenderEmits>();

const slots = defineSlots();

// 获取当前组件实例
const instance = getCurrentInstance();
// 判断是否存在 submit 监听器
const hasOnRecordingChangeListener = computed(() => {
  return !!instance?.vnode.props?.onRecordingChange;
});
// 判断是否存在 pasteFile 监听器
const hasOnPasteFileListener = computed(() => {
  return !!instance?.vnode.props?.onPasteFile;
});

const senderRef = ref();
const inputRef = ref();
const internalValue = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    if (props.readOnly || props.disabled)
      return;
    emits('update:modelValue', val);
  }
});

const inputInstance = computed(() => inputRef.value?.ref);

// 处理输入法组合状态
const isComposing = ref(false);
const popoverRef = ref();
// 判断是否存在 trigger 监听器
const hasOnTriggerListener = computed(() => {
  return !!instance?.vnode.props?.onTrigger;
});

// 计算提交按钮禁用状态
const isSubmitDisabled = computed(() => {
  // 用户显式设置了 submitBtnDisabled 时优先使用
  if (typeof props.submitBtnDisabled === 'boolean') {
    return props.submitBtnDisabled;
  }
  // 否则保持默认逻辑：无内容时禁用
  return !internalValue.value;
});

const popoverVisible = computed({
  get() {
    return props.triggerPopoverVisible;
  },
  set(value) {
    if (props.readOnly || props.disabled)
      return;
    emits('update:triggerPopoverVisible', value);
  }
});

// 当前触发 指令的 字符
const triggerString = ref('');

// 监听输入值变化
watch(
  () => internalValue.value,
  (newVal, oldVal) => {
    if (isComposing.value)
      return;
    // 触发逻辑：当输入值等于数组中的任意一个指令字符时触发
    // 确保 oldVal 是字符串类型
    const triggerStrings = props.triggerStrings || []; // 如果为 undefined，就使用空数组
    const validOldVal = typeof oldVal === 'string' ? oldVal : '';
    const wasOldValTrigger = triggerStrings.includes(validOldVal);
    const isNewValTrigger = triggerStrings.includes(newVal);

    // 触发显示：从空变为触发字符
    if (oldVal === '' && isNewValTrigger) {
      triggerString.value = newVal;
      if (hasOnTriggerListener.value) {
        emits('trigger', {
          oldValue: oldVal, // 关闭时返回之前触发的字符
          newValue: newVal,
          triggerString: newVal,
          isOpen: true
        });
        popoverVisible.value = true;
      }
      else {
        popoverVisible.value = true;
      }
    }
    // 关闭：从触发字符变为非触发字符
    else if (!isNewValTrigger && wasOldValTrigger) {
      if (hasOnTriggerListener.value) {
        emits('trigger', {
          oldValue: oldVal || '', // 关闭时返回之前触发的字符
          newValue: newVal,
          triggerString: undefined,
          isOpen: false
        });
        popoverVisible.value = false;
      }
      else {
        popoverVisible.value = false;
      }
    }
    // 触发显示：从非空且非触发字符变为触发字符
    else if (oldVal !== '' && isNewValTrigger && !wasOldValTrigger) {
      triggerString.value = newVal;
      if (hasOnTriggerListener.value) {
        emits('trigger', {
          oldValue: oldVal || '', // 关闭时返回之前触发的字符
          newValue: newVal,
          triggerString: newVal,
          isOpen: true
        });
        popoverVisible.value = true;
      }
      else {
        popoverVisible.value = true;
      }
    }
  },
  { deep: true, immediate: true }
);

/* 内容容器聚焦 开始 */
function onContentMouseDown(e: MouseEvent) {
  // 点击容器后设置输入框的聚焦，会触发 &:focus-within 样式
  if (e.target !== senderRef.value.querySelector(`.el-textarea__inner`)) {
    e.preventDefault();
  }
  inputRef.value.focus();
}
/* 内容容器聚焦 结束 */

/* 头部显示隐藏 开始 */
const visiableHeader = ref(false);
function openHeader() {
  if (!slots.header)
    return false;

  if (props.readOnly)
    return false;

  visiableHeader.value = true;
}
function closeHeader() {
  if (!slots.header)
    return;
  if (props.readOnly)
    return;
  visiableHeader.value = false;
}
/* 头部显示隐藏 结束 */

/* 使用浏览器自带的语音转文字功能 开始 */
const recognition = ref<SpeechRecognition | null>(null);
const speechLoading = ref<boolean>(false);

function startRecognition() {
  if (props.readOnly)
    return; // 直接返回，不执行后续逻辑
  if (hasOnRecordingChangeListener.value) {
    speechLoading.value = true;
    emits('recordingChange', true);
    return;
  }
  if ('webkitSpeechRecognition' in window) {
    recognition.value = new webkitSpeechRecognition();
    recognition.value!.continuous = true;
    recognition.value.interimResults = true;
    recognition.value.lang = 'zh-CN';
    recognition.value.onresult = (event: SpeechRecognitionEvent) => {
      let results = '';
      for (let i = 0; i <= event.resultIndex; i++) {
        results += event.results[i][0].transcript;
      }
      if (!props.readOnly) {
        internalValue.value = results;
      }
    };
    recognition.value.onstart = () => {
      speechLoading.value = true;
    };
    recognition.value.onend = () => {
      speechLoading.value = false;
    };
    recognition.value.onerror = (event: SpeechRecognitionError) => {
      console.error('语音识别出错:', event.error);
      speechLoading.value = false;
    };
    recognition.value.start();
  }
  else {
    console.error('浏览器不支持 Web Speech API');
  }
}

function stopRecognition() {
  // 如果有自定义处理函数
  if (hasOnRecordingChangeListener.value) {
    speechLoading.value = false;
    emits('recordingChange', false);
    return;
  }
  if (recognition.value) {
    recognition.value.stop();
    speechLoading.value = false;
  }
}
/* 使用浏览器自带的语音转文字功能 结束 */

/* 输入框事件 开始 */
function submit() {
  if (
    props.readOnly ||
    props.loading ||
    props.disabled ||
    isSubmitDisabled.value
  ) {
    return;
  }
  emits('submit', internalValue.value);
}
// 取消按钮
function cancel() {
  if (props.readOnly)
    return;
  emits('cancel', internalValue.value);
}

function clear() {
  if (props.readOnly)
    return; // 直接返回，不执行后续逻辑
  inputRef.value.clear();
  internalValue.value = '';
}

// 在这判断组合键的回车键 (目前支持四种模式)
function handleKeyDown(e: { target: HTMLTextAreaElement } & KeyboardEvent) {
  if (props.readOnly)
    return; // 直接返回，不执行后续逻辑
  const _resetSelectionRange = () => {
    const cursorPosition = e.target.selectionStart; // 获取光标位置
    const textBeforeCursor = internalValue.value.slice(0, cursorPosition); // 光标前的文本
    const textAfterCursor = internalValue.value.slice(cursorPosition); // 光标后的文本
    internalValue.value = `${textBeforeCursor}\n${textAfterCursor}`; // 插入换行符
    e.target.setSelectionRange(cursorPosition + 1, cursorPosition + 1); // 更新光标位置
  };
  // 是否按下组合键
  let _isComKeyDown = false;
  switch (props.submitType) {
    case 'cmdOrCtrlEnter':
      _isComKeyDown = e.metaKey || e.ctrlKey; // Mac 下使用 Command 键，Windows 下使用 Ctrl 键
      break;
    case 'shiftEnter':
      _isComKeyDown = e.shiftKey; // Shift + Enter
      break;
    case 'altEnter':
      _isComKeyDown = e.altKey; // Alt + Enter
      break;
    case 'enter':
      _isComKeyDown = e.shiftKey || e.metaKey || e.ctrlKey || e.altKey; // 只处理 Enter 键
      break;
    default:
      _isComKeyDown = false; // 默认不处理组合键
      break;
  }
  if (e.keyCode === 13) {
    e.preventDefault();
    if (props.submitType === 'enter') {
      _isComKeyDown ? _resetSelectionRange() : submit();
    }
    else {
      _isComKeyDown ? submit() : _resetSelectionRange();
    }
  }
}
/* 输入框事件 结束 */

/* 焦点 事件 开始 */
function blur() {
  if (props.readOnly) {
    return false;
  }
  inputRef.value.blur();
}

function focus(type = 'all') {
  if (props.readOnly) {
    return false;
  }
  if (type === 'all') {
    inputRef.value.select();
  }
  else if (type === 'start') {
    focusToStart();
  }
  else if (type === 'end') {
    focusToEnd();
  }
}

// 聚焦到文本最前方
function focusToStart() {
  if (inputRef.value) {
    // 获取底层的 textarea DOM 元素
    const textarea = inputRef.value.ref;
    if (textarea) {
      textarea.focus(); // 聚焦到输入框
      textarea.setSelectionRange(0, 0); // 设置光标到最前方
    }
  }
}

// 聚焦到文本最后方
function focusToEnd() {
  if (inputRef.value) {
    // 获取底层的 textarea DOM 元素
    const textarea = inputRef.value.ref;
    if (textarea) {
      textarea.focus(); // 聚焦到输入框
      textarea.setSelectionRange(
        internalValue.value.length,
        internalValue.value.length
      ); // 设置光标到最后方
    }
  }
}
/* 焦点 事件 结束 */

// 处理输入法开始/结束 (此方法是拼音输入法的时候用)
function handleCompositionStart() {
  isComposing.value = true;
}

function handleCompositionEnd() {
  isComposing.value = false;
}

function handleInternalPaste(e: ClipboardEvent) {
  const files = e.clipboardData?.files;
  if (files?.length && hasOnPasteFileListener.value) {
    emits('pasteFile', files[0], files);
    e.preventDefault();
  }
}

defineExpose({
  openHeader, // 打开头部
  closeHeader, // 关闭头部
  clear, // 清空输入框
  blur, // 失去焦点
  focus, // 获取焦点
  // 按钮操作
  submit,
  cancel,
  startRecognition,
  stopRecognition,
  popoverVisible,
  inputInstance
});
</script>

<template>
  <div
    class="el-sender-wrap"
    tabindex="-1"
    :style="{
      cursor: disabled ? 'not-allowed' : 'default',
      '--el-sender-trigger-popover-width': props.triggerPopoverWidth,
      '--el-sender-trigger-popover-left': props.triggerPopoverLeft
    }"
  >
    <div
      ref="senderRef"
      class="el-sender"
      :style="{
        '--el-box-shadow-tertiary':
          '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
        '--el-sender-input-input-font-size': '14px',
        '--el-sender-header-animation-duration': `${headerAnimationTimer}ms`
      }"
      :class="{
        'el-sender-disabled': disabled
      }"
    >
      <!-- 头部容器 -->
      <Transition name="slide">
        <div v-if="visiableHeader" class="el-sender-header-wrap">
          <div v-if="$slots.header" class="el-sender-header">
            <slot name="header" />
          </div>
        </div>
      </Transition>
      <!-- 内容容器 内置变体逻辑 -->
      <div
        class="el-sender-content"
        :class="{ 'content-variant-updown': props.variant === 'updown' }"
        @mousedown="onContentMouseDown"
      >
        <!-- Prefix 前缀 -->
        <div
          v-if="$slots.prefix && props.variant === 'default'"
          class="el-sender-prefix"
        >
          <slot name="prefix" />
        </div>
        <!-- 输入框 -->
        <el-input
          ref="inputRef"
          v-model="internalValue"
          class="el-sender-input"
          :input-style="
            props.inputStyle || {
              resize: 'none',
              'max-height': '176px',
              'max-width': inputWidth
            }
          "
          :rows="1"
          :autosize="autoSize"
          type="textarea"
          :validate-event="false"
          :placeholder="placeholder"
          :read-only="readOnly || disabled"
          :disabled="disabled"
          @keydown="handleKeyDown"
          @compositionstart="handleCompositionStart"
          @compositionend="handleCompositionEnd"
          @paste="handleInternalPaste"
        />
        <!-- 操作列表 -->
        <div v-if="props.variant === 'default'" class="el-sender-action-list">
          <slot name="action-list">
            <div class="el-sender-action-list-presets">
              <SendButton
                v-if="!loading"
                :disabled="isSubmitDisabled"
                @submit="submit"
              />

              <LoadingButton v-if="loading" @cancel="cancel" />

              <SpeechButton
                v-if="!speechLoading && allowSpeech"
                @click="startRecognition"
              />

              <SpeechLoadingButton
                v-if="speechLoading && allowSpeech"
                @click="stopRecognition"
              />

              <ClearButton v-if="clearable" @clear="clear" />
            </div>
          </slot>
        </div>

        <!-- 变体样式 -->
        <div
          v-if="props.variant === 'updown' && props.showUpdown"
          class="el-sender-updown-wrap"
        >
          <!-- 变体 updown： Prefix 前缀 -->
          <div v-if="$slots.prefix" class="el-sender-prefix">
            <slot name="prefix" />
          </div>

          <!-- 变体 updown：操作列表 -->
          <div class="el-sender-action-list">
            <slot name="action-list">
              <div class="el-sender-action-list-presets">
                <SendButton
                  v-if="!loading"
                  :disabled="isSubmitDisabled"
                  @submit="submit"
                />

                <LoadingButton v-if="loading" @cancel="cancel" />

                <SpeechButton
                  v-if="!speechLoading && allowSpeech"
                  @click="startRecognition"
                />

                <SpeechLoadingButton
                  v-if="speechLoading && allowSpeech"
                  @click="stopRecognition"
                />

                <ClearButton v-if="clearable" @clear="clear" />
              </div>
            </slot>
          </div>
        </div>
      </div>

      <!-- 底部容器 -->
      <Transition name="slide">
        <div v-if="$slots.footer" class="el-sender-footer">
          <slot name="footer" />
        </div>
      </Transition>
    </div>

    <!-- 虚拟触发 popover -->
    <el-popover
      ref="popoverRef"
      :virtual-ref="senderRef"
      virtual-triggering
      :visible="popoverVisible"
      :disabled="props.disabled"
      :show-arrow="false"
      :placement="props.triggerPopoverPlacement"
      :offset="props.triggerPopoverOffset"
      popper-class="el-sender-trigger-popover"
      :teleported="false"
    >
      <slot name="trigger-popover" :trigger-string="triggerString">
        当前触发的字符为：{{ `${triggerString}` }}
        在这里定义的内容，但注意这里的回车事件将会被 输入框 覆盖
      </slot>
    </el-popover>
  </div>
</template>

<style scoped lang="scss" src="./style.scss"></style>
