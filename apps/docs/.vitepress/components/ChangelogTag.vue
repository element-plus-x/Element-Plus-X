<script setup lang="ts">
import { computed } from 'vue';
import {
  getBgColor,
  getBorderColor,
  getColor,
  getEmoji
} from '../config/changelog-types';

const props = defineProps<{
  type: string;
  size?: 'small' | 'default' | 'large';
}>();

const tagColor = computed(() => getColor(props.type));
const tagBgColor = computed(() => getBgColor(props.type));
const tagBorderColor = computed(() => getBorderColor(props.type));
const tagEmoji = computed(() => getEmoji(props.type));

const sizeClass = computed(() => {
  return props.size === 'small' ? 'changelog-tag--small' : '';
});
</script>

<template>
  <span
    class="changelog-tag"
    :class="sizeClass"
    :style="{
      color: tagColor,
      backgroundColor: tagBgColor,
      borderColor: tagBorderColor
    }"
  >
    <span class="changelog-tag__emoji">{{ tagEmoji }}</span>
    <span class="changelog-tag__text">
      <slot />
    </span>
  </span>
</template>

<style scoped lang="less">
.changelog-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 3px 10px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  border-radius: 4px;
  border: 1px solid;
  transition: all 0.2s ease;
  white-space: nowrap;

  &--small {
    padding: 2px 8px;
    font-size: 12px;
    gap: 4px;
  }

  &__emoji {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    line-height: 1;

    .changelog-tag--small & {
      font-size: 12px;
    }
  }

  &__text {
    display: inline-flex;
    align-items: center;
  }
}
</style>
