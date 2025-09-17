<script lang="ts" setup>
import type { GlobalShiki } from '@components/XMarkdownCore/hooks/useShiki';
import type { BundledLanguage } from 'shiki';
import type { ElxRunCodeProps } from '../RunCode/type';
import type { CodeBlockExpose } from './shiki-header';
import type { RawProps } from './types';
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight
} from '@shikijs/transformers';
import { computed, h, reactive, ref, toValue, watch } from 'vue';
import HighLightCode from '../../components/HighLightCode/index.vue';
import { SHIKI_SUPPORT_LANGS, shikiThemeDefault } from '../../shared';
import { useMarkdownContext } from '../MarkdownProvider';
import RunCode from '../RunCode/index.vue';
import {
  controlEle,
  controlHasRunCodeEle,
  copyCode,
  isDark,
  languageEle,
  toggleExpand,
  toggleTheme
} from './shiki-header';
import '../../style/shiki.scss';

const props = withDefaults(
  defineProps<{
    raw?: RawProps;
  }>(),
  {
    raw: () => ({})
  }
);

const context = useMarkdownContext();
const { codeXSlot, customAttrs, globalShiki } = toValue(context) || {};
const renderLines = ref<string[]>([]);
const preStyle = ref<any | null>(null);
const preClass = ref<string | null>(null);
const themes = computed(() => context?.value?.themes ?? shikiThemeDefault);
const colorReplacements = computed(() => context?.value?.colorReplacements);
const nowViewBtnShow = computed(() => context?.value?.needViewCodeBtn ?? false);
const viewCodeModalOptions = computed(
  () => context?.value?.viewCodeModalOptions
);
const isExpand = ref(true);
const nowCodeLanguage = ref<BundledLanguage>();
const codeAttrs =
  typeof customAttrs?.code === 'function'
    ? customAttrs.code(props.raw)
    : customAttrs?.code || {};
const shikiTransformers = [
  transformerNotationDiff(),
  transformerNotationErrorLevel(),
  transformerNotationFocus(),
  transformerNotationHighlight(),
  transformerNotationWordHighlight()
];

const { codeToHtml } = globalShiki as GlobalShiki;
// 生成高亮HTML
async function generateHtml() {
  let { language = 'text', content = '' } = props.raw || {};
  if (!(SHIKI_SUPPORT_LANGS as readonly string[]).includes(language)) {
    language = 'text';
  }
  nowCodeLanguage.value = language as BundledLanguage;
  const html = await codeToHtml(content.trim(), {
    lang: language as BundledLanguage,
    themes: themes.value,
    colorReplacements: colorReplacements.value,
    transformers: shikiTransformers
  });
  const parse = new DOMParser();
  const doc = parse.parseFromString(html, 'text/html');
  const preElement = doc.querySelector('pre');
  preStyle.value = preElement?.getAttribute('style');
  const preClassNames = preElement?.className;
  preClass.value = preClassNames ?? '';
  const codeElement = doc.querySelector('pre code');
  if (codeElement) {
    const lines = codeElement.querySelectorAll('.line'); // 获取所有代码行
    renderLines.value = Array.from(lines).map(line => line.outerHTML); // 存储每行HTML
  }
}

watch(
  () => props.raw?.content,
  async content => {
    if (content) {
      await generateHtml();
    }
  },
  { immediate: true }
);

const runCodeOptions = reactive<ElxRunCodeProps>({
  code: [],
  content: '',
  visible: false,
  lang: '',
  preClass: '',
  preStyle: {}
});
function viewCode(renderLines: string[]) {
  if (!renderLines?.length) return;

  Object.assign(runCodeOptions, {
    code: renderLines,
    content: props.raw?.content ?? '',
    lang: nowCodeLanguage.value || 'html',
    preClass: preClass.value || 'pre-md',
    preStyle: preStyle.value || {},
    visible: true
  });
}

watch(
  () => renderLines.value,
  val => {
    if (runCodeOptions.visible) {
      runCodeOptions.code = val;
      runCodeOptions.content = props.raw.content ?? '';
    }
  }
);

// 渲染插槽函数
function renderSlot(slotName: string) {
  if (!codeXSlot) {
    return 'div';
  }
  const slotFn = codeXSlot[slotName];
  if (typeof slotFn === 'function') {
    return slotFn({
      ...props,
      renderLines: renderLines.value,
      isDark,
      isExpand,
      nowViewBtnShow: nowViewBtnShow.value,
      toggleExpand,
      toggleTheme,
      copyCode,
      viewCode
    } satisfies CodeBlockExpose);
  }

  return h(slotFn as any, {
    ...props,
    renderLines: renderLines.value,
    isDark,
    isExpand,
    nowViewBtnShow: nowViewBtnShow.value,
    toggleExpand,
    toggleTheme,
    copyCode,
    viewCode
  } satisfies CodeBlockExpose);
}

function handleHeaderLanguageClick() {
  isExpand.value = !isExpand.value;
}

// 计算属性
const computedClass = computed(() => `pre-md ${preClass.value} is-expanded`);
const codeClass = computed(() => `language-${props.raw?.language || 'text'}`);
const RunCodeComputed = computed(() => {
  return nowCodeLanguage.value === 'html' && nowViewBtnShow.value
    ? RunCode
    : undefined;
});
const codeControllerEleComputed = computed(() => {
  if (nowCodeLanguage.value === 'html' && nowViewBtnShow.value) {
    return controlHasRunCodeEle(
      () => {
        copyCode(renderLines.value);
      },
      () => {
        viewCode(renderLines.value);
      }
    );
  }
  return controlEle(() => {
    copyCode(renderLines.value);
  });
});

watch(
  () => nowViewBtnShow.value,
  v => {
    if (!v) {
      runCodeOptions.visible = false;
    }
  }
);

// 获取是否显示行号
const enableCodeLineNumber = computed(() => {
  return context?.value?.codeXProps?.enableCodeLineNumber ?? false;
});
</script>

<template>
  <div :key="props.raw?.key" :class="computedClass" :style="preStyle">
    <div class="markdown-elxLanguage-header-div is-always-shadow">
      <component
        :is="renderSlot('codeHeader')"
        v-if="codeXSlot?.codeHeader && renderSlot('codeHeader')"
      />
      <template v-else>
        <component
          :is="
            codeXSlot?.codeHeaderLanguage
              ? renderSlot('codeHeaderLanguage')
              : languageEle(props.raw?.language ?? 'text')
          "
          @click="handleHeaderLanguageClick"
        />
        <component
          :is="
            codeXSlot?.codeHeaderControl
              ? renderSlot('codeHeaderControl')
              : codeControllerEleComputed
          "
        />
      </template>
    </div>

    <code
      :class="codeClass"
      :style="{
        display: 'block',
        overflowX: 'auto'
      }"
      v-bind="codeAttrs"
    >
      <HighLightCode
        :enable-code-line-number="enableCodeLineNumber"
        :lang="props.raw?.language ?? 'text'"
        :code="renderLines"
      />
    </code>
    <!-- run-code -->
    <component
      :is="RunCodeComputed"
      v-bind="{ ...viewCodeModalOptions, ...runCodeOptions }"
      v-model:visible="runCodeOptions.visible"
    />
  </div>
</template>
