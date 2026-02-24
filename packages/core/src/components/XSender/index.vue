<script setup lang="ts">
import type { PropType } from 'vue';
import type { MentionConfig, SelectConfig, TriggerConfig } from 'x-sender';
import type {
  ChatNode,
  FocusType,
  ModelValue,
  SenderState,
  TipConfig,
  Write,
  XSenderEmits
} from './types';
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import XSender from 'x-sender';
import { useNamespace } from '../../hooks/useNamespace';
import ClearButton from './components/ClearButton/index.vue';
import LoadingButton from './components/LoadingButton/index.vue';
import SendButton from './components/SendButton/index.vue';
import 'x-sender/lib/XSender.css';

defineOptions({
  name: 'XSender'
});

/**
 *  支持的配置属性
 */
const props = defineProps({
  placeholder: {
    type: String,
    default: '请输入内容'
  },
  device: {
    type: String as PropType<'pc' | 'h5' | 'auto'>,
    default: 'auto'
  },
  autoFocus: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String as PropType<'default' | 'updown'>,
    default: 'default'
  },
  maxLength: {
    type: Number,
    default: -1
  },
  submitType: {
    type: String as PropType<'enter' | 'shiftEnter'>,
    default: 'enter'
  },
  customStyle: {
    type: Object as PropType<Partial<CSSStyleDeclaration>>,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: false
  },
  headerAnimationTimer: {
    type: Number,
    default: 300
  },
  mentionConfig: {
    type: Object as PropType<MentionConfig>,
    default: undefined
  },
  triggerConfig: {
    type: Array as PropType<TriggerConfig[]>,
    default: undefined
  },
  selectConfig: {
    type: Array as PropType<SelectConfig[]>,
    default: undefined
  },
  tipConfig: {
    type: [Boolean, Object] as PropType<boolean | TipConfig>,
    default: true
  },
  getPlugin: {
    type: Function as PropType<() => typeof XSender>,
    default: () => XSender
  }
});

/**
 *  暴露的事件
 */
const emits = defineEmits<XSenderEmits>();

const ns = useNamespace('x-sender');

const rootStyle = computed(() =>
  ns.cssVarBlock({
    'header-duration': `${props.headerAnimationTimer}ms`
  })
);

const instance = getCurrentInstance();

// 判断是否存在 pasteFile 监听器
const hasOnPasteFileListener = computed(() => {
  return !!instance?.vnode.props?.onPasteFile;
});

/**
 *  输入框相关
 */
let sender: XSender | null = null;
const busKey = 'X-SENDER-BUS-EVENT';
const container = ref<HTMLElement | null>(null);
const senderState = reactive<SenderState>({
  isEmpty: true,
  textLength: 0, // 该属性值只会在配置了maxLength情况下才拥有赋值
  tipShow: false // 前置提示弹窗是否显示
});
// 创建输入框
function createChat() {
  const Plugin = props.getPlugin ? props.getPlugin() || XSender : XSender;
  const {
    EVENT_COMMON_CHANGE,
    EVENT_COMMON_SEND,
    EVENT_COMMON_TIP_STATE,
    EVENT_COMMON_DIALOG_CLOSE
  } = Plugin.EventSet;
  sender = new Plugin(container.value!, {
    placeholder: props.placeholder,
    device: props.device,
    autoFocus: props.autoFocus,
    maxLength: props.maxLength,
    chatStyle: props.customStyle,
    mentionConfig: props.mentionConfig,
    triggerConfig: props.triggerConfig,
    selectConfig: props.selectConfig,
    tipConfig: props.tipConfig,
    keyboardSendFun:
      props.submitType === 'enter'
        ? event => !event.shiftKey && event.key === 'Enter'
        : event => event.shiftKey && event.key === 'Enter',
    keyboardWrapFun:
      props.submitType === 'shiftEnter'
        ? event => !event.shiftKey && event.key === 'Enter'
        : event => event.shiftKey && event.key === 'Enter'
  });
  // 订阅发送方法
  sender.bus.on(busKey, EVENT_COMMON_SEND, onSubmit);
  // 订阅输入框变化事件
  sender.bus.on(busKey, EVENT_COMMON_CHANGE, () => {
    senderState.isEmpty = sender!.isEmpty(true);
    senderState.textLength = sender!.chatEditor.textLength;
    emits('change');
  });
  // 订阅前置标签变化事件
  sender.bus.on(busKey, EVENT_COMMON_TIP_STATE, (state: boolean) => {
    senderState.tipShow = state;
  });
  // 粘贴文件
  sender.chatElement.richText.addEventListener('paste', handleInternalPaste);
  // 输入框点击关闭弹窗
  sender.chatElement.richText.addEventListener('click', () => {
    sender?.bus.emit(EVENT_COMMON_DIALOG_CLOSE);
  });
  // 禁用输入框
  if (props.disabled) {
    sender.disable();
  }
}
// 获取当前所有标签的数据
function getModelValue(): ModelValue {
  return {
    html: sender?.getHtml() || '',
    text: sender?.getText() || '',
    ...(sender?.getTagData() || {
      mention: [],
      trigger: {},
      select: {},
      input: {}
    })
  };
}
// 提交发送方法
function onSubmit() {
  emits('submit');
}
// 取消发送方法
function onCancel() {
  emits('cancel');
}
// 清空输入框方法
function onClear() {
  sender?.reset({
    clearHistory: true
  });
}
// 点击内容区域聚焦输入框
function onContentMouseDown() {
  if (sender) {
    sender.nextTick(() => sender?.focus('mark'));
  }
}
// 聚焦到文本最前方
function focus(type: FocusType) {
  sender?.focus(type);
}
// 失去焦点
function blur() {
  sender?.chatElement.richText.blur();
}
// 内容全选
function selectAll() {
  if (!sender) {
    return;
  }
  const chatNode = sender.chatEditor.NODES;
  const firstGrid = chatNode[0];
  const firstWrite = firstGrid.children[0] as Write;
  const firstWriteNode = firstWrite.$el!.children[0].childNodes[0];
  const lastGrid = chatNode[chatNode.length - 1];
  const lastWrite = lastGrid.children[lastGrid.children.length - 1] as Write;
  const lastWriteNode = lastWrite.$el!.children[0].childNodes[0];
  const range = new Range();
  range.setStart(firstWriteNode, firstWrite.text.length ? 0 : 1);
  range.setEnd(
    lastWriteNode,
    lastWrite.text.length ? lastWrite.text.length : 1
  );
  const sel = sender.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}
// 插入一个选择标签
function setSelect(key: string, id: string) {
  const targetConfig = props.selectConfig?.find(item => item.key === key);
  if (!targetConfig) {
    throw new Error(`selectConfig find key: ${key} not found`);
  }
  const targetRow = targetConfig.options.find(item => item.id === id);
  if (!targetRow) {
    throw new Error(`selectConfig ${key} find options: ${id} not found`);
  }
  sender?.setSelect({
    key,
    id,
    name: targetRow.name
  });
}
// 插入一个输入标签
function setInput(key: string, placeholder: string, defaultValue?: string) {
  sender?.setInput({
    key,
    placeholder,
    text: defaultValue
  });
}
// 插入一个@提及标签
function setMention(id: string) {
  const targetRow = props.mentionConfig?.options?.find(item => item.id === id);
  if (!targetRow) {
    throw new Error(`mentionConfig find options: ${id} not found`);
  }
  sender?.setMention({
    id,
    name: targetRow.name
  });
}
// 插入一个自定义触发符标签
function setTrigger(key: string, id: string) {
  const targetRow = props.triggerConfig?.find(item => item.key === key);
  if (!targetRow) {
    throw new Error(`triggerConfig find key: ${key} not found`);
  }
  const targetOption = targetRow.options.find(item => item.id === id);
  if (!targetOption) {
    throw new Error(`triggerConfig ${key} find options: ${id} not found`);
  }
  sender?.setTrigger({
    key,
    id,
    name: targetOption.name
  });
}
// 混合式插入
function setChatNode(model: ChatNode[][]) {
  // sender?.reset({
  //   clearHistory: true,
  //   chatNode: model,
  // });
  sender?.setChatNode(model);
}
// 在当前光标处插入html片段
function setHtml(html: string) {
  sender?.setHtml(html);
}
// 在当前光标处插入text内容
function setText(txt: string) {
  sender?.setText(txt);
}
// 外部调用唤起标签选择弹窗
function showSelect(key: string, elm: HTMLElement) {
  if (!props.selectConfig?.some(item => item.key === key)) {
    throw new Error(`selectConfig find key: ${key} not found`);
  }
  sender?.showSelectPopup(key, elm);
}
// 打开前置提示标签
function showTip(props: Record<string, string>) {
  sender?.showTip(props);
}
// 关闭前置提示标签
function closeTip() {
  sender?.closeTip();
}

function handleInternalPaste(e: ClipboardEvent) {
  const files = e.clipboardData?.files;
  if (files?.length && hasOnPasteFileListener.value) {
    emits('pasteFile', files[0], files);
    e.preventDefault();
  }
}

/**
 *  监听响应props的响应式修改 按需更新sender对应的配置项
 */
watch(
  () => props.disabled,
  () => {
    if (props.disabled) {
      sender?.disable();
    } else {
      sender?.enable();
    }
  }
);
watch(
  () => props.placeholder,
  () => {
    sender?.updateConfig({ placeholder: props.placeholder });
  }
);
watch(
  () => props.maxLength,
  () => {
    sender?.updateConfig({ maxLength: props.maxLength });
  }
);
watch(
  () => props.submitType,
  () => {
    sender?.updateConfig({
      keyboardSendFun:
        props.submitType === 'enter'
          ? event => !event.shiftKey && event.key === 'Enter'
          : event => event.shiftKey && event.key === 'Enter',
      keyboardWrapFun:
        props.submitType === 'shiftEnter'
          ? event => !event.shiftKey && event.key === 'Enter'
          : event => event.shiftKey && event.key === 'Enter'
    });
  }
);
watch(
  () => props.customStyle,
  () => {
    sender?.updateConfig({ chatStyle: props.customStyle });
  }
);
watch(
  () => props.mentionConfig,
  () => {
    sender?.updateConfig({ mentionConfig: props.mentionConfig });
  },
  { deep: true }
);
watch(
  () => props.triggerConfig,
  () => {
    sender?.updateConfig({ triggerConfig: props.triggerConfig });
  },
  { deep: true }
);
watch(
  () => props.selectConfig,
  () => {
    sender?.updateConfig({ selectConfig: props.selectConfig });
  },
  { deep: true }
);
watch(
  () => props.tipConfig,
  () => {
    sender?.updateConfig({ tipConfig: props.tipConfig });
  },
  { deep: true }
);

onMounted(() => {
  createChat();
});

onBeforeUnmount(() => {
  if (sender) {
    sender.destroy();
    sender = null;
  }
});

/** 暴露方法 */
defineExpose({
  getPlugin: () => XSender,
  getSender: () => sender,
  senderState,
  blur,
  focus,
  clear: onClear,
  selectAll,
  getModelValue,
  setText,
  setHtml,
  setMention,
  setTrigger,
  setSelect,
  setInput,
  setChatNode,
  showTip,
  closeTip,
  showSelect
});
</script>

<template>
  <div :class="ns.b()" :style="rootStyle">
    <!-- 头部容器 -->
    <Transition :name="`${ns.b()}-slide`">
      <div v-if="$slots.header" :class="ns.e('header')">
        <div :class="ns.e('header-container')">
          <slot name="header" />
        </div>
      </div>
    </Transition>
    <!-- 内容容器 -->
    <div
      :class="[
        ns.e('content'),
        props.variant === 'updown' ? ns.em('content', 'variant-updown') : ''
      ]"
      @mousedown="onContentMouseDown"
    >
      <!-- Prefix 前缀 -->
      <div
        v-if="$slots.prefix && props.variant === 'default'"
        :class="ns.e('prefix')"
      >
        <slot name="prefix" />
      </div>
      <!-- 输入区域 -->
      <div :class="ns.e('chat-room')" @mousedown.stop="() => {}">
        <!-- 输入框载体 这里多嵌套一层是为了存放渲染后的弹窗元素 -->
        <div ref="container" :class="ns.e('chat')" />
      </div>
      <!-- 默认操作列表 -->
      <div v-if="props.variant === 'default'" :class="ns.e('action-list')">
        <slot name="action-list">
          <div :class="ns.e('action-list-presets')">
            <SendButton
              v-if="!props.loading"
              :disabled="senderState.isEmpty || props.disabled"
              @submit="onSubmit"
            />

            <LoadingButton v-if="props.loading" @cancel="onCancel" />

            <ClearButton
              v-if="props.clearable"
              :disabled="senderState.isEmpty || props.disabled"
              @clear="onClear"
            />
          </div>
        </slot>
      </div>
      <!-- 变体操作列表 -->
      <div
        v-else-if="props.variant === 'updown'"
        :class="ns.e('updown-action-list')"
      >
        <!-- 变体 updown： Prefix 前缀 -->
        <div v-if="$slots.prefix" :class="ns.e('prefix')">
          <slot name="prefix" />
        </div>

        <!-- 变体 updown：操作列表 -->
        <div :class="ns.e('action-list')">
          <slot name="action-list">
            <div :class="ns.e('action-list-presets')">
              <SendButton
                v-if="!props.loading"
                :disabled="senderState.isEmpty || props.disabled"
                @submit="onSubmit"
              />

              <LoadingButton v-if="props.loading" @cancel="onCancel" />

              <ClearButton
                v-if="props.clearable"
                :disabled="senderState.isEmpty || props.disabled"
                @clear="onClear"
              />
            </div>
          </slot>
        </div>
      </div>
    </div>
    <!-- 底部容器 -->
    <Transition :name="`${ns.b()}-slide`">
      <div v-if="$slots.footer" :class="ns.e('footer')">
        <slot name="footer" />
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss" src="./style.scss"></style>
