<!-- ClearButton 清理按钮 -->
<script setup lang="ts">
import type { ELXButtonType } from '@components/ELXButton/index.ts';
import {
  elxButtonEmits,
  elxButtonProps,
  useButton
} from '@components/ELXButton/index.ts';
import { ElButton } from 'element-plus';
import { h } from 'vue';
import ELXClearButton from './components/ELXClearButton.vue';
import ELXLoadingButton from './components/ELXLoadingButton.vue';
import ELXSendButton from './components/ELXSendButton.vue';
import ELXSpeechButton from './components/ELXSpeechButton.vue';
import ELXSpeechButtonLoading from './components/ELXSpeechLoadingButton.vue';

const props = defineProps(elxButtonProps);
const emit = defineEmits(elxButtonEmits);
const slots = useSlots();

const { handleClick } = useButton(props, emit);

const elxButtonTypeEmpty = computed(() => {
  return props.elxButtonType?.trim()?.length > 0;
});

const classNameVars = computed(() => {
  const classNames = ['elx-button'];
  if (elxButtonTypeEmpty.value) {
    classNames.push(`elx-button-type-${props.elxButtonType}`);
  }
  return classNames.join(' ');
});

const ELXButtonMap: Record<ELXButtonType & string, Component> = {
  clear: ELXClearButton,
  loading: ELXLoadingButton,
  send: ELXSendButton,
  speech: ELXSpeechButton,
  speechLoading: ELXSpeechButtonLoading
};

const handleDefaultSlot = computed(() => {
  return h(ELXButtonMap[props.elxButtonType] ?? slots.default);
});

const coverProps = computed(() => {
  let loading = props.loading;
  if (elxButtonTypeEmpty.value) {
    loading = false;
  }
  return {
    loading
  };
});
</script>

<template>
  <component
    :is="
      h(
        ElButton,
        {
          ...$attrs,
          ...props,
          ...coverProps,
          class: classNameVars,
          onClick: handleClick
        },
        { ...$slots, default: () => handleDefaultSlot }
      )
    "
  />
</template>

<style scoped lang="scss" src="./style.scss"></style>
