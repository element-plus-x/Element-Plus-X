<script setup lang="ts">
import type { FilesCardEmits, FilesCardProps } from './types';
import { CircleCloseFilled, View } from '@element-plus/icons-vue';
import { getFileType, getSize, previewImage } from '../../utils/index.ts';
import useFileNameParser from '../../utils/useFileNameParser.ts';
import svgIconMap from './fileSvg/index.ts';
import { colorMap } from './options.ts';

const props = withDefaults(defineProps<FilesCardProps>(), {
  uid: undefined,
  name: undefined,
  fileSize: undefined,
  fileType: undefined,
  description: undefined,
  url: undefined,
  thumbUrl: undefined,
  imgFile: undefined,
  iconSize: '42px',
  iconColor: undefined,
  showDelIcon: false,
  maxWidth: '236px',
  style: undefined,
  hoverStyle: undefined,
  imgVariant: 'rectangle',
  imgPreview: true,
  imgPreviewMask: true,
  status: undefined,
  percent: undefined,
  errorTip: undefined
});

const emits = defineEmits<FilesCardEmits>(); // 新增自定义事件
const { name, fileType, description, url, thumbUrl, fileSize, imgVariant } =
  toRefs(props);

const { namePrefix, nameSuffix } = useFileNameParser(name);
const isHovered = ref(false);
const imageHovered = ref(false); // 新增图片悬停状态

/* 图片类型文件预览 开始 */
const _previewImg = ref<string | undefined>(undefined);
/* 图片类型文件预览 结束 */

const _fileType = computed(() => {
  if (fileType.value) return fileType.value;
  if (!name.value) return undefined;
  if (!nameSuffix.value) {
    return 'unknown';
  }
  return getFileType(nameSuffix.value).lowerCase;
});

const _fileTypeUpperCase = computed(() => {
  if (fileType.value)
    return fileType.value.replace(/^\w/, match => match.toUpperCase());
  if (!name.value) return '';
  if (!nameSuffix.value) {
    return 'Unknown';
  }
  return getFileType(nameSuffix.value).upperCase;
});

const _description = computed(() => {
  if (description.value) {
    return description.value;
  }
  const typeStr = _fileTypeUpperCase.value;
  const sizeStr = fileSize.value ? `・${getSize(fileSize.value)}` : '';
  if (props.status === 'uploading') {
    return `上传中...${`・${props.percent || 0}`}%${sizeStr}`;
  }
  if (props.status === 'error') {
    return props.errorTip || '上传失败';
  }
  return `${typeStr}${sizeStr}`;
});

const isImageFile = computed(() => _fileType.value === 'image');
const isSquareVariant = computed(() => imgVariant.value === 'square');
const _previewImgUrl = computed(() => {
  if (!isImageFile.value) return undefined;
  if (thumbUrl.value) return thumbUrl.value;
  if (url.value) return url.value;
  return _previewImg.value;
});

const _iconSize = computed(() => {
  if (
    (isSquareVariant.value && isImageFile.value && !props.iconSize) ||
    (isSquareVariant.value && isImageFile.value && props.iconSize === '42px')
  ) {
    return '64px';
  }
  return props.iconSize;
});

watch(
  () => props.imgFile,
  async newFile => {
    if (newFile) {
      try {
        const url = await previewImage(newFile);
        _previewImg.value = url;
      } catch (error) {
        console.error('Preview failed:', error);
      }
    } else {
      _previewImg.value = undefined;
    }
  },
  { deep: true, immediate: true }
);

function handleDelete() {
  emits('delete', { ...props });
}

// 遮罩展开时触发预览
const imgRef = ref();
function handlePreviewAction(type: 'self' | 'mask') {
  if (props.imgPreview && imgRef.value && _previewImgUrl && type === 'mask') {
    imgRef.value!.showPreview();
  }
  if (type === 'self') {
    emits('imagePreview', { ...props });
  }
}

defineExpose({
  namePrefix,
  nameSuffix,
  colorMap
});
</script>

<template>
  <div
    :style="{
      '--elx-files-card-icon-size': `${_iconSize}`,
      '--elx-files-card-max-width': `${props.maxWidth}`,
      ...props.style,
      ...(isHovered && props.hoverStyle ? props.hoverStyle : {})
    }"
    class="elx-files-card"
    :class="{
      'elx-files-card-square': isSquareVariant && isImageFile,
      'elx-files-card-hovered': isHovered,
      'elx-files-card-error': props.status === 'error',
      'elx-files-card-done': props.status === 'done',
      'elx-files-card-uploading': props.status === 'uploading'
    }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div
      v-if="props.status === 'uploading' && !(isSquareVariant && isImageFile)"
      class="elx-files-card-progress"
      :style="{ width: `${props.percent || 0}%` }"
    />

    <slot v-if="$slots.icon || _fileType" name="icon" v-bind="{ item: props }">
      <component
        :is="svgIconMap[_fileType!]"
        v-if="!isImageFile"
        class="elx-files-card-icon"
        :color="props.iconColor || colorMap[_fileType!]"
      />

      <!-- 图片文件处理区域（新增遮罩层逻辑） -->
      <template v-if="isImageFile">
        <div
          class="elx-files-card__image-preview"
          :class="{
            'elx-files-card__image-preview--square':
              isSquareVariant && isImageFile
          }"
          @mouseenter="imageHovered = true"
          @mouseleave="imageHovered = false"
        >
          <el-image
            v-if="_previewImgUrl"
            ref="imgRef"
            class="elx-files-card-img"
            :src="_previewImgUrl"
            :preview-src-list="props.imgPreview ? [_previewImgUrl] : []"
            fit="cover"
            :show-progress="false"
            hide-on-click-modal
            @show="handlePreviewAction('self')"
          />

          <!-- 无预览地址时显示默认图标 -->
          <component
            :is="svgIconMap[_fileType!]"
            v-else
            class="elx-files-card-img"
            :color="props.iconColor || colorMap[_fileType!]"
          />

          <!-- 遮罩层 -->
          <!-- 悬停时才展示 -->
          <transition name="elx-files-card-fade">
            <slot
              v-if="
                imageHovered &&
                _previewImgUrl &&
                props.imgPreviewMask &&
                props.imgPreview
              "
              name="image-preview-actions"
              v-bind="{
                item: { ...props, prefix: namePrefix, suffix: nameSuffix }
              }"
            >
              <div
                class="elx-files-card__preview-mask"
                @click="handlePreviewAction('mask')"
              >
                <el-icon>
                  <View />
                </el-icon>
                <span>预览</span>
              </div>
            </slot>
          </transition>

          <!-- 如果有状态，不悬停，也展示 -->
          <!-- 状态判断显示区域 -->
          <div
            v-if="props.status === 'uploading' && isSquareVariant"
            class="elx-files-card__preview-mask-loading"
          >
            <el-progress
              color="#fff"
              type="circle"
              :percentage="props.percent"
              class="elx-files-card__circle-progress"
            />
          </div>
          <div
            v-else-if="props.status === 'error' && isSquareVariant"
            class="elx-files-card__preview-mask-error"
          >
            <span class="error-text">{{ props.errorTip || '上传失败' }}</span>
          </div>
        </div>
      </template>
    </slot>

    <slot
      v-if="
        ($slots.content || props.name || description) &&
        !(isSquareVariant && isImageFile)
      "
      name="content"
      v-bind="{ item: props }"
    >
      <div class="elx-files-card-content">
        <div v-if="props.name" class="elx-files-card-name">
          <slot
            name="name-prefix"
            v-bind="{
              item: { ...props, prefix: namePrefix, suffix: nameSuffix }
            }"
          >
            <div class="elx-files-card-name-prefix">
              {{ namePrefix }}
            </div>
          </slot>
          <slot
            name="name-suffix"
            v-bind="{
              item: { ...props, prefix: namePrefix, suffix: nameSuffix }
            }"
          >
            <div class="elx-files-card-name-suffix">
              {{ nameSuffix }}
            </div>
          </slot>
        </div>

        <slot
          name="description"
          v-bind="{
            item: { ...props, prefix: namePrefix, suffix: nameSuffix }
          }"
        >
          <div
            class="elx-files-card-description"
            :class="{
              'elx-files-card-description-error': props.status === 'error',
              'elx-files-card-description-done': props.status === 'done',
              'elx-files-card-description-uploading':
                props.status === 'uploading'
            }"
          >
            {{ _description }}
          </div>
        </slot>
      </div>
    </slot>

    <div
      v-if="props.showDelIcon && isHovered"
      class="elx-files-card-delete-icon"
      @click="handleDelete"
    >
      <slot name="del-icon" v-bind="{ item: props }">
        <el-icon>
          <CircleCloseFilled />
        </el-icon>
      </slot>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./style.scss"></style>
