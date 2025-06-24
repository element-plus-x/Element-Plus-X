<script setup lang="ts">
import type { WelcomeProps } from './types.d.ts'

const props = withDefaults(defineProps<WelcomeProps>(), {
  variant: 'filled' as const,
  direction: 'ltr' as const,
})

const slots = defineSlots()
const { prefixCls, className, rootClassName, variant, direction, classNames, icon, title, extra, description, style, styles } = toRefs(props)
// 提取计算逻辑到独立函数
function getContainerClass() {
  return [
    prefixCls.value || 'welcome',
    className.value,
    rootClassName.value,
    `welcome-${variant.value}`,
    {
      'welcome-rtl': direction.value === 'rtl',
    },
  ]
}

const getIconClass = () => classNames.value?.icon
const getTitleClass = () => classNames.value?.title
const getExtraClass = () => classNames.value?.extra
const getDescriptionClass = () => classNames.value?.description

const hasIcon = computed(() => !!icon.value)
const hasTitleOrExtra = computed(() => !!title.value || !!extra.value)
const hasExtraOrSlot = computed(() => !!extra.value || !!slots.extra)
const hasDescription = computed(() => !!description.value)

const containerClass = computed(getContainerClass)
const iconClass = computed(getIconClass)
const titleClass = computed(getTitleClass)
const extraClass = computed(getExtraClass)
const descriptionClass = computed(getDescriptionClass)
</script>

<template>
  <div
    :class="containerClass"
    :style="style"
    class="welcome-container"
  >
    <!-- S image -->
    <slot name="image">
      <div
        v-if="hasIcon"
        :class="iconClass"
        :style="styles?.icon"
        class="welcome-icon"
      >
        <el-image :src="icon" class="icon-image" />
      </div>
    </slot>
    <!-- E image -->

    <div class="content-wrapper">
      <!-- S 标题 & Extra -->
      <div
        v-if="hasTitleOrExtra"
        class="title-wrapper"
      >
        <div
          v-if="title"
          :class="titleClass"
          :style="styles?.title"
          class="welcome-title"
        >
          {{ title }}
        </div>
        <div
          v-if="hasExtraOrSlot"
          :class="extraClass"
          :style="styles?.extra"
          class="welcome-extra"
        >
          <slot name="extra">
            {{ extra }}
          </slot>
        </div>
      </div>
      <!-- E 标题 & Extra -->

      <!-- S 描述信息 -->
      <div
        v-if="hasDescription"
        :class="descriptionClass"
        :style="styles?.description"
        class="welcome-description"
      >
        {{ description }}
      </div>
      <!-- E 描述信息 -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.welcome-container {
  --border-radius: 8px;
  --icon-size: 64px;
  --icon-size-small: 48px;
  --gap: 16px;
  --gap-small: 8px;
  --padding: 24px;
  --color-filled-bg: #e6f4ff;
  --color-filled-border: #91caff;
  --color-title: rgba(0, 0, 0, 0.88);
  --color-description: rgba(0, 0, 0, 0.65);

  display: flex;
  gap: var(--gap);
  padding: var(--padding);
  border-radius: var(--border-radius);

  &.welcome-filled {
    background-color: var(--color-filled-bg);
    border: 1px solid var(--color-filled-border);
  }

  &.welcome-borderless {
    border: none;
  }

  &.welcome-rtl {
    direction: rtl;
  }
}

.welcome-icon {
  // 图标容器样式
  flex: 0 0 auto;
  width: var(--icon-size);
  height: var(--icon-size);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: calc(var(--border-radius) / 2);
  overflow: hidden;
  font-size: 24px;

  .icon-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 4px;
  }

  // 小尺寸适配
  @media (max-width: 480px) {
    width: var(--icon-size-small);
    height: var(--icon-size-small);
  }
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--gap-small);
}

.title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--gap-small);
}

.welcome-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-title);
}

.welcome-extra {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--gap-small);

  /* 如果内容需要换行 */
  :deep(*) {
    flex-shrink: 0;
  }
}

.welcome-description {
  margin: 0;
  font-size: 14px;
  color: var(--color-description);
  line-height: 1.5;
}
</style>
