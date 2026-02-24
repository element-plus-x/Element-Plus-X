<script setup lang="ts">
import type { WelcomeProps } from './types';
import { useNamespace } from '../../hooks/useNamespace';
import { useTheme } from '../../hooks/useTheme';

const props = withDefaults(defineProps<WelcomeProps>(), {
  variant: 'filled' as const,
  direction: 'ltr' as const
});

const solts = defineSlots();
const {
  prefixCls,
  className,
  rootClassName,
  variant,
  direction,
  classNames,
  icon,
  title,
  extra,
  description,
  style,
  styles
} = toRefs(props);

const ns = useNamespace('welcome');
const { getCommonOverrides, getComponentOverrides, toCssVars } = useTheme();

const themeStyle = computed(() => {
  return {
    ...toCssVars(getCommonOverrides()),
    ...toCssVars(getComponentOverrides('Welcome'))
  };
});

const containerStyle = computed(() => {
  return {
    ...themeStyle.value,
    ...(style.value || {})
  };
});
// 提取计算逻辑到独立函数
function getContainerClass() {
  return [prefixCls.value || ns.b(), className.value, rootClassName.value];
}

const getIconClass = () => classNames.value?.icon;
const getTitleClass = () => classNames.value?.title;
const getExtraClass = () => classNames.value?.extra;
const getDescriptionClass = () => classNames.value?.description;

const hasIcon = computed(() => !!icon.value);
const hasTitleOrExtra = computed(() => !!title.value || !!extra.value);
const hasExtraOrSlot = computed(() => !!extra.value || !!solts.extra);
const hasDescription = computed(() => !!description.value);

const containerClass = computed(getContainerClass);
const iconClass = computed(getIconClass);
const titleClass = computed(getTitleClass);
const extraClass = computed(getExtraClass);
const descriptionClass = computed(getDescriptionClass);
</script>

<template>
  <div
    :class="[
      containerClass,
      ns.m(variant),
      direction === 'rtl' ? ns.m('rtl') : ''
    ]"
    :style="containerStyle"
  >
    <slot name="image">
      <div
        v-if="hasIcon"
        :class="[ns.e('icon'), iconClass]"
        :style="styles?.icon"
      >
        <el-image :src="icon" class="icon-image" />
      </div>
    </slot>

    <div :class="ns.e('content')">
      <div v-if="hasTitleOrExtra" :class="ns.e('header')">
        <div
          v-if="title"
          :class="[ns.e('title'), titleClass]"
          :style="styles?.title"
        >
          {{ title }}
        </div>
        <div
          v-if="hasExtraOrSlot"
          :class="[ns.e('extra'), extraClass]"
          :style="styles?.extra"
        >
          <slot name="extra">
            {{ extra }}
          </slot>
        </div>
      </div>

      <div
        v-if="hasDescription"
        :class="[ns.e('description'), descriptionClass]"
        :style="styles?.description"
      >
        {{ description }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./style.scss"></style>
