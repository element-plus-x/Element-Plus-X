<script lang="ts" setup generic="T = DefaultThoughtChainItemProps">
import type { ElTimeline } from 'element-plus';
import type {
  DefaultColor,
  DefaultThoughtChainItemProps,
  ThoughtChainEmits,
  ThoughtChainItemBase,
  ThoughtChainProps
} from './types.d.ts';
import { Check, Close, Loading } from '@element-plus/icons-vue';
import { get } from 'radash';
import { computed, ref, watch } from 'vue';

const props = withDefaults(defineProps<ThoughtChainProps<T>>(), {
  // @ts-expect-errorFIXME: 暂时不做类型校验, vue类型检测问题
  thinkingItems: () => [],
  dotSize: 'default',
  maxWidth: '600px',
  lineGradient: false,
  rowKey: 'id',
  statusKey: 'status',
  titleKey: 'title',
  thinkTitleKey: 'thinkTitle',
  thinkContentKey: 'thinkContent'
});

const emits = defineEmits<ThoughtChainEmits<T>>();

const defaultDotBackgroundColor: DefaultColor = {
  loading: '#e6a23c',
  success: '#67c23a',
  error: '#f56c6c'
};

const dotMargin = computed(() => {
  switch (props.dotSize) {
    case 'small':
      return '-4px 0 0 -7px';
    case 'large':
      return '-11px 0 0 -15px';
    default:
      return '-8px 0 0 -11px';
  }
});

const timelineRef = ref<InstanceType<typeof ElTimeline>>();

function getNodeBtnColor(item: T) {
  const _type_ = getType(item);
  if (_type_) {
    return props.dotBackgroundColor
      ? props.dotBackgroundColor[_type_]
      : defaultDotBackgroundColor[_type_];
  }
  return '';
}

const getLineColor = computed(() => {
  if (props.thinkingItems.length) {
    const arr = props.thinkingItems.map(item => {
      const _type_ = getType(item);
      if (_type_) {
        return props.dotBackgroundColor
          ? props.dotBackgroundColor[_type_]
          : defaultDotBackgroundColor[_type_];
      }
      return '';
    });

    return arr;
  }
  return [];
});

const activeNamesComputed = computed(() =>
  props.thinkingItems
    .filter(item => item.isCanExpand && item.isDefaultExpand)
    .map(item => String(getId(item)))
);

const defaultActiveNodes = ref<string[]>([...activeNamesComputed.value]);

function handleExpand(item: T) {
  emits('handleExpand', item);
}

function setRadialGradient(
  colors: typeof getLineColor.value,
  ele: HTMLElement[]
) {
  const length = ele.length;
  Array.from(ele).forEach((item, index) => {
    const line = item.children[0];
    if (line) {
      if (colors.length > 0) {
        line.setAttribute(
          'style',
          `
        border: none;
        width:2px;
        background: linear-gradient(to bottom, ${colors[index]} 0% , ${colors[index < length ? index + 1 : index]} 100%);`
        );
      } else {
        line.setAttribute('style', ``);
      }
    }
  });
}

function getEle() {
  if (getLineColor.value && timelineRef.value && props.lineGradient) {
    const ele = timelineRef.value.$el.children[0].children;
    setRadialGradient(getLineColor.value, ele);
  } else if (getLineColor.value && timelineRef.value && !props.lineGradient) {
    const ele = timelineRef.value.$el.children[0].children;
    setRadialGradient([], ele);
  }
}

function isLoading(item: T): boolean {
  const status = getStatus(item);
  return status === 'loading';
}

function isError(item: T): boolean {
  const status = getStatus(item);
  return status === 'error';
}

function getId(item: T) {
  return get(item, props.rowKey);
}

function getType(item: T) {
  const status = getStatus(item) as ThoughtChainItemBase['status'];
  return status ?? 'success';
}

function getTitle(item: T) {
  return (get(item, props.titleKey) as string) ?? '';
}

function getThinkTitle(item: T) {
  return (get(item, props.thinkTitleKey) as string) ?? '';
}
function getThinkContent(item: T) {
  return (get(item, props.thinkContentKey) as string) ?? '';
}

function getStatus(item: T) {
  return get(item, props.statusKey);
}

watch(
  () => activeNamesComputed.value,
  v => {
    defaultActiveNodes.value = [...v];
  }
);

watch(
  () => [getLineColor.value, props.lineGradient],
  () => {
    getEle();
  }
);

onMounted(() => {
  getEle();
});
</script>

<template>
  <div class="el-thought-chain">
    <el-timeline
      ref="timelineRef"
      :style="{
        maxWidth: `${maxWidth}`
      }"
    >
      <TransitionGroup name="thought-chain" tag="el-timeline-item">
        <el-timeline-item
          v-for="item in props.thinkingItems"
          :key="getId(item)"
          :timestamp="getTitle(item)"
          :hide-timestamp="item.hideTitle"
          :placement="item.placement ?? 'top'"
        >
          <div v-if="!item.isCanExpand" class="el-thought-chain-content">
            {{ getThinkTitle(item) }}
          </div>
          <el-collapse
            v-else-if="!item.isDefaultExpand"
            @change="handleExpand(item)"
          >
            <el-collapse-item :title="getThinkTitle(item)">
              <div class="el-thought-chain-content">
                {{ getThinkContent(item) }}
              </div>
            </el-collapse-item>
          </el-collapse>
          <el-collapse
            v-else-if="item.isDefaultExpand"
            v-model="defaultActiveNodes"
            @change="handleExpand(item)"
          >
            <el-collapse-item
              :title="getThinkTitle(item)"
              :name="String(getId(item))"
            >
              <div class="el-thought-chain-content">
                {{ getThinkContent(item) }}
              </div>
            </el-collapse-item>
          </el-collapse>

          <template #dot>
            <div
              :class="{ 'el-thought-chain-item-dot': !$slots.icon }"
              style="position: relative"
            >
              <slot name="icon" :item="item">
                <el-button
                  circle
                  :loading="isLoading(item)"
                  :size="props.dotSize"
                  :style="{
                    '--custom-background-color': getNodeBtnColor(item),
                    '--custom-border-color': getNodeBtnColor(item),
                    backgroundColor: getNodeBtnColor(item),
                    borderColor: getNodeBtnColor(item)
                  }"
                >
                  <template #loading>
                    <el-icon class="thought-chain-loading">
                      <Loading />
                    </el-icon>
                  </template>

                  <template #icon>
                    <el-icon v-if="!isLoading(item)">
                      <Close v-if="isError(item)" />
                      <Check v-else />
                    </el-icon>
                  </template>
                </el-button>
              </slot>
            </div>
          </template>
        </el-timeline-item>
      </TransitionGroup>
    </el-timeline>
  </div>
</template>

<style lang="scss" scoped src="./style.scss"></style>

<style lang="scss" scoped>
.el-thought-chain {
  &-item-dot {
    margin: v-bind(dotMargin);
  }
  &-content {
    white-space: pre-wrap;
    word-break: break-word;
  }
}
</style>
