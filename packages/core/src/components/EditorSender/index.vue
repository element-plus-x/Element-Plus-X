<script setup lang="ts">
import type {
  EditorProps,
  EditorSenderEmits,
  FocusType,
  ModelValue,
  SenderState,
  Write
} from './types';
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import XSender from 'x-sender';
import ClearButton from './components/ClearButton/index.vue';
import LoadingButton from './components/LoadingButton/index.vue';
import SendButton from './components/SendButton/index.vue';
import 'x-sender/lib/XSender.css';

/**
 *  支持的配置属性
 */
const props = withDefaults(defineProps<EditorProps>(), {
  placeholder: '请输入内容', // 输入框提示占位语
  device: 'auto', // 使用编辑器设备类型
  autoFocus: false, // 是否在聊天框生成后自动聚焦
  variant: 'default', // 输入框的变体类型
  maxLength: -1, // 限制输入框最大字数 *注 该配置项性能开销较大 非必要情况请别设置（像豆包和文心一言都不对这块做限制，不应因小失大）
  submitType: 'enter', // 控制换行与提交模式
  customStyle: () => ({}), // 修改输入样式
  loading: false, // 发送按钮加载状态
  disabled: false, // 是否禁用输入框
  clearable: false, // 是否显示清空按钮
  headerAnimationTimer: 300, // 展开动画时间
  mentionConfig: undefined, // 提及弹窗配置
  triggerConfig: undefined, // 触发弹窗配置
  selectConfig: undefined, // 选择弹窗配置
  tipConfig: true, // 前置提示弹窗配置
  getPlugin: () => XSender, // 默认注入当前版本的插件依赖 当发生依赖插件bug时 可以让用户手动注入指定版本的插件依赖 避免频繁更新ELX版本
});
/**
 *  暴露的事件
 */
const emits = defineEmits<EditorSenderEmits>();

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
  const Plugin = props.getPlugin() || XSender;
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
    keyboardSendFun: props.submitType === 'enter'
      ? event => !event.shiftKey && event.key === 'Enter'
      : event => event.shiftKey && event.key === 'Enter',
    keyboardWrapFun: props.submitType === 'shiftEnter'
      ? event => !event.shiftKey && event.key === 'Enter'
      : event => event.shiftKey && event.key === 'Enter'
  });
  // 订阅发送方法
  sender.bus.on(busKey, 'send', onSubmit);
  // 订阅输入框变化事件
  sender.bus.on(busKey, 'editorChange', () => {
    senderState.isEmpty = sender!.isEmpty(true);
    senderState.textLength = sender!.chatEditor.textLength;
    emits('change');
  });
  // 订阅前置标签变化事件
  sender.bus.on(busKey, 'tipState', (state: boolean) => {
    senderState.tipShow = state;
  });
}
// 获取当前所有标签的数据
function getModelValue(): ModelValue {
  return {
    html: sender?.getHtml() || '',
    text: sender?.getText() || '',
    ...(sender?.getTagData() || { mention: [], trigger: {}, select: {}, input: {} })
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
  range.setEnd(lastWriteNode, lastWrite.text.length ? lastWrite.text.length : 1);
  const sel = sender.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}
// 插入一个选择标签
function setSelectTag(key: string, tagId: string) {
}
// 插入一个输入标签
function setInputTag(key: string, placeholder: string, defaultValue?: string) {
}
// 插入一个@提及标签
function setUserTag(userId: string) {
}
// 插入一个自定义触发符标签
function setCustomTag(prefix: string, id: string) {
}
// 混合式插入
function setMixTags(tags: MixTag[][]) {
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
function openSelectDialog(option: SelectDialogOption) {
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
watch(() => props.placeholder, () => {
  sender?.updateConfig({ placeholder: props.placeholder });
});
watch(() => props.maxLength, () => {
  sender?.updateConfig({ maxLength: props.maxLength });
});
watch(() => props.submitType, () => {
  sender?.updateConfig({
    keyboardSendFun: props.submitType === 'enter'
      ? event => !event.shiftKey && event.key === 'Enter'
      : event => event.shiftKey && event.key === 'Enter',
    keyboardWrapFun: props.submitType === 'shiftEnter'
      ? event => !event.shiftKey && event.key === 'Enter'
      : event => event.shiftKey && event.key === 'Enter'
  });
});
watch(() => props.customStyle, () => {
  sender?.updateConfig({ chatStyle: props.customStyle });
});
watch(() => props.mentionConfig, () => {
  sender?.updateConfig({ mentionConfig: props.mentionConfig });
}, { deep: true });
watch(() => props.triggerConfig, () => {
  sender?.updateConfig({ triggerConfig: props.triggerConfig });
}, { deep: true });
watch(() => props.selectConfig, () => {
  sender?.updateConfig({ selectConfig: props.selectConfig });
}, { deep: true });
watch(() => props.tipConfig, () => {
  sender?.updateConfig({ tipConfig: props.tipConfig });
}, { deep: true });

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
  getSender: () => sender,
  blur,
  focus,
  clear: onClear,
  selectAll,
  getModelValue,
  setText,
  setHtml,
  showTip,
  closeTip,
  senderState
});
</script>

<template>
  <div
    class="el-editor-sender-wrap"
    :style="{
      '--el-editor-sender-header-duration': `${headerAnimationTimer}ms`
    }"
  >
    <!-- 头部容器 -->
    <Transition name="slide">
      <div v-if="$slots.header" class="el-editor-sender-header">
        <div class="el-editor-sender-header-container">
          <slot name="header" />
        </div>
      </div>
    </Transition>
    <!-- 内容容器 -->
    <div
      class="el-editor-sender-content"
      :class="{ 'content-variant-updown': props.variant === 'updown' }"
      @mousedown="onContentMouseDown"
    >
      <!-- Prefix 前缀 -->
      <div
        v-if="$slots.prefix && props.variant === 'default'"
        class="el-editor-sender-prefix"
      >
        <slot name="prefix" />
      </div>
      <!-- 输入区域 -->
      <div class="el-editor-sender-chat-room" @mousedown.stop="() => {}">
        <!-- 输入框载体 这里多嵌套一层是为了存放渲染后的弹窗元素 -->
        <div
          ref="container"
          class="el-editor-sender-chat"
          @paste="handleInternalPaste"
        />
      </div>
      <!-- 默认操作列表 -->
      <div
        v-if="props.variant === 'default'"
        class="el-editor-sender-action-list"
      >
        <slot name="action-list">
          <div class="el-editor-sender-action-list-presets">
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
        class="el-editor-sender-updown-action-list"
      >
        <!-- 变体 updown： Prefix 前缀 -->
        <div v-if="$slots.prefix" class="el-editor-sender-prefix">
          <slot name="prefix" />
        </div>

        <!-- 变体 updown：操作列表 -->
        <div class="el-editor-sender-action-list">
          <slot name="action-list">
            <div class="el-editor-sender-action-list-presets">
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
    <Transition name="slide">
      <div v-if="$slots.footer" class="el-editor-sender-footer">
        <slot name="footer" />
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss" src="./style.scss"></style>
