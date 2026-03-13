<script lang="ts" setup>
import type { ElxRunCodeContentProps } from '../type';
import DOMPurify from 'dompurify';
import _ from 'lodash';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import HighLightCode from '../../HighLightCode/index.vue';
import { useMarkdownContext } from '../../MarkdownProvider';
import CustomLoading from './custom-loading.vue';
import { SELECT_OPTIONS_ENUM } from './options';

const props = defineProps<ElxRunCodeContentProps>();

const computedClass = computed(() => `pre-md ${props.preClass}`);

const codeClass = computed(() => `language-${props.lang || 'text'}`);

const iframeRef = ref<HTMLIFrameElement>();

const allHtml = computed(() => props.content);

const codeContainerRef = ref<HTMLElement>();

const isLoading = ref(false);

const context = useMarkdownContext();

const isSafeViewCode = computed(() => {
  return context.value.secureViewCode;
});
const enableCodeLineNumber = computed(() => {
  return context.value?.enableCodeLineNumber || false;
});
function doRenderIframe() {
  const iframe = iframeRef.value;
  if (!iframe)
    return;

  isLoading.value = true;

  const rawHtml = allHtml.value || '';
  let sanitizedHtml = rawHtml;

  // 安全模式过滤
  if (isSafeViewCode.value) {
    sanitizedHtml = DOMPurify.sanitize(rawHtml, {
      WHOLE_DOCUMENT: true,
      FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
      FORBID_ATTR: ['onerror', 'onclick', 'onload', 'style']
    });
  }

  // 检查 <head> 中是否有 UTF-8 charset
  let finalHtml = sanitizedHtml;
  const hasHead = /<head[^>]*>/i.test(sanitizedHtml);
  const hasUtf8Meta =
    /<head[^>]*>[\s\S]*?<meta\s[^>]*charset=["']?utf-8["']?/i.test(
      sanitizedHtml
    );

  if (hasHead) {
    if (!hasUtf8Meta) {
      finalHtml = sanitizedHtml.replace(
        /<head[^>]*>/i,
        match => `${match}<meta charset="UTF-8">`
      );
    }
  }
  else {
    // 没有 <head>，插入 <head><meta charset="UTF-8"></head> 到 <html> 或最前
    if (/<html[^>]*>/i.test(sanitizedHtml)) {
      finalHtml = sanitizedHtml.replace(
        /<html[^>]*>/i,
        match => `${match}<head><meta charset="UTF-8"></head>`
      );
    }
    else {
      // 甚至没有 <html>，包一层完整结构
      finalHtml = `
        <!DOCTYPE html>
        <html>
          <head><meta charset="UTF-8"></head>
          <body>${sanitizedHtml}</body>
        </html>
      `;
    }
  }

  const blob = new Blob([finalHtml], { type: 'text/html' });

  if (iframe.src && iframe.src.startsWith('blob:')) {
    URL.revokeObjectURL(iframe.src);
  }

  iframe.src = URL.createObjectURL(blob);

  const onLoad = () => {
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
    iframe.removeEventListener('load', onLoad);
  };
  iframe.addEventListener('load', onLoad);
}

const renderIframe = _.debounce(() => {
  doRenderIframe();
}, 300);

function startRender() {
  if (typeof window === 'undefined') return;
  if (props.nowView === SELECT_OPTIONS_ENUM.VIEW) {
    isLoading.value = true;
    renderIframe();
  }
}

watch(
  () => [props.nowView, isSafeViewCode.value],
  () => {
    startRender();
  },
  { immediate: true }
);
watch(
  () => props.code,
  () => {
    startRender();
  },
  { immediate: true }
);

onMounted(() => {
  nextTick(() => {
    startRender();
  });
});
</script>

<template>
  <el-scrollbar
    ref="codeContainerRef"
    class="elx-run-code-content-scrollbar"
    :style="preStyle"
  >
    <div
      v-show="props.nowView === SELECT_OPTIONS_ENUM.CODE"
      class="elx-xmarkdown-container elx-run-code-content"
    >
      <pre>
          <div
          :class="computedClass"
          :style="preStyle"
          >
            <code
                class="elx-run-code-content-code"
                :class="codeClass"
            >
              <HighLightCode
              :enable-code-line-number="enableCodeLineNumber"
              :lang="props.lang"
              :code="props.code"
              />
            </code>
        </div>
    </pre>
    </div>
    <div
      v-show="props.nowView === SELECT_OPTIONS_ENUM.VIEW"
      style="position: relative; width: 100%; height: 100%"
      class="elx-run-code-content-view"
    >
      <div v-if="isLoading" class="iframe-loading-mask">
        <CustomLoading />
      </div>
      <div v-show="!isLoading" class="elx-run-code-content-view-iframe">
        <iframe
          ref="iframeRef"
          sandbox="allow-scripts"
          style="border: 0; width: 100%; height: 79.5vh"
        />
      </div>
    </div>
  </el-scrollbar>
</template>

<style src="./style/index.scss"></style>
