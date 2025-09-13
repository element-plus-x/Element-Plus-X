<script setup lang="ts">
import type {
  CodeBlockHeaderExpose,
  CodeBlockHeaderFunctionExpose
} from '@components/XMarkdownCore/components/CodeBlock/shiki-header';
import XMarkdown from '@components/XMarkdown/index.vue';
import { SELECT_OPTIONS_ENUM } from '@components/XMarkdownCore/components/RunCode/components/options';
import { ElButton, ElMessage, ElSpace, ElTooltip } from 'element-plus';
import { h } from 'vue';
import CodeHeader from './CodeHeader.vue';

const props = defineProps<{
  markdown: string;
  enableCodePreview?: boolean;
  enableThemeToggle?: boolean;
  enableCodeCopy?: boolean;
}>();
const timer = ref();
const index = ref(0);
function start() {
  timer.value = setInterval(() => {
    index.value += 25;
    if (index.value > props.markdown.length) {
      clearInterval(timer.value);
      index.value = props.markdown.length;
    }
  }, 100);
}
function pause() {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
}

const content = computed(() => {
  return props.markdown.slice(0, index.value);
});

const codeXSlotConfig: CodeBlockHeaderFunctionExpose = {
  codeHeaderLanguage: props => {
    return h(
      'span',
      {
        onClick: (ev: MouseEvent) => {
          const clickExpand = props.toggleExpand(ev);
          console.log('当前代码块是否展开', clickExpand.isExpand);
        }
      },
      {
        default: () =>
          `点击切换折叠状态--${props.raw.language}-${props.isExpand.value}`
      }
    );
  },
  codeHeaderControl: props => {
    return h(
      ElSpace,
      {
        class: `markdown-elxLanguage-header-space`,
        direction: 'horizontal'
      },
      {
        default: () => [
          props.nowViewBtnShow &&
            h(
              ElTooltip,
              {
                content: '预览代码',
                placement: 'top'
              },
              {
                default: () =>
                  h(
                    ElButton,
                    {
                      class: 'shiki-header-button',
                      onClick: () => {
                        if (props.raw.language !== 'html') {
                          ElMessage.warning('当前语言不支持预览代码');
                          return;
                        }
                        props.viewCode(props.renderLines);
                      }
                    },
                    { default: () => '👀' }
                  )
              }
            ),
          h(
            ElTooltip,
            {
              content: '切换主题',
              placement: 'top'
            },
            {
              default: () =>
                h(
                  ElButton,
                  {
                    class: 'shiki-header-button',
                    onClick: () => {
                      props.toggleTheme();
                      console.log('isDark', props.isDark.value);
                    }
                  },
                  { default: () => (props.isDark.value ? '🍪' : '🌙') }
                )
            }
          ),
          h(
            ElTooltip,
            {
              content: '复制代码',
              placement: 'top'
            },
            {
              default: () =>
                h(
                  ElButton,
                  {
                    class: 'shiki-header-button',
                    onClick: () => {
                      props.copyCode(props.renderLines);
                    }
                  },
                  { default: () => '🥢' }
                )
            }
          )
        ]
      }
    );
  },
  viewCodeHeader: props => {
    return h(
      'div',
      {
        onClick: () => {
          if (props.value === SELECT_OPTIONS_ENUM.VIEW) {
            props.changeSelectValue(SELECT_OPTIONS_ENUM.CODE);
          } else {
            props.changeSelectValue(SELECT_OPTIONS_ENUM.VIEW);
          }
        }
      },
      {
        default: () => `自定义切换 ${props.value}`
      }
    );
  },
  viewCodeContent: props => {
    return h(
      'div',
      {},
      {
        default: () =>
          `自定义内容区域 渲染代码长度 ${props.content.length} 当前视图 ${props.value}`
      }
    );
  },
  viewCodeCloseBtn: props => {
    return h(
      'span',
      {
        onClick: () => props.close()
      },
      {
        default: () => `❎`
      }
    );
  }
};

const codeXSlotComponentsConfig: CodeBlockHeaderExpose = {
  codeHeaderLanguage: CodeHeader
};

function redo() {
  index.value = 0;
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
  start();
}

onMounted(() => {
  start();
});
</script>

<template>
  <ElButton @click="start"> 开始 </ElButton>
  <ElButton @click="pause"> 暂停 </ElButton>
  <ElButton @click="redo"> 重新开始 </ElButton>
  <div class="component-container">
    <h4>默认插槽</h4>
    <XMarkdown
      v-bind="$attrs"
      :enable-code-line-number="true"
      :markdown="content"
      :color-replacements="{
        // 这里传一个默认值 使其不受到其他 colorReplacements 的影响
        'vitesse-light': {
          '#ab5959': '#ab5959',
          '#1e754f': '#1e754f'
        },
        'vitesse-dark': {
          '#cb7676': '#cb7676',
          '#4d9375': '#4d9375'
        }
      }"
      :custom-attrs="{
        code: () => {
          return {
            name: 'code',
            class: 'inline-code'
          };
        },
        a: _ => ({
          target: '_blank',
          rel: 'noopener noreferrer'
        })
      }"
    />
    <h4>函数插槽以及使用暴露出来的方法 和 自定义当前主题的颜色</h4>
    <XMarkdown
      v-bind="$attrs"
      :markdown="content"
      :code-x-slot="codeXSlotConfig"
    />
    <h4>组件插槽</h4>
    <XMarkdown
      v-bind="$attrs"
      :markdown="content"
      :code-x-slot="codeXSlotComponentsConfig"
    />
  </div>
</template>

<style scoped lang="scss">
.component-container {
  background-color: white;
  padding: 12px;
  border-radius: 15px;
}
</style>
