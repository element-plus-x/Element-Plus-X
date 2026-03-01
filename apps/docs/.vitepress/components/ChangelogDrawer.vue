<script setup lang="ts">
import { Close } from '@element-plus/icons-vue';
import { useData } from 'vitepress';
import { computed } from 'vue';
import { getTagLabel } from '../config/changelog-types';
import changelogData from '../data/changelog.json';
import ChangelogTag from './ChangelogTag.vue';

const props = defineProps<{
  modelValue: boolean;
  componentName: string;
}>();

const emit = defineEmits(['update:modelValue']);
const { lang } = useData();

const visible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
});

const isZh = computed(() => lang.value === 'zh-CN');

const componentChangelog = computed(() => {
  if (!props.componentName) return [];
  return (changelogData as any)[props.componentName] || [];
});

function getTypeTagLabel(type: string) {
  return getTagLabel(type, isZh.value ? 'zh' : 'en');
}

function formatContent(content: string) {
  let html = content
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" class="changelog-link">$1</a>'
    )
    .replace(/\n/g, '<br/>');

  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  return html;
}

const fullChangelogLink = computed(() => {
  return lang.value === 'zh-CN' ? '/zh/update-log' : '/en/update-log';
});

const drawerTitle = computed(() => {
  return isZh.value
    ? `${props.componentName} 更新日志`
    : `${props.componentName} Changelog`;
});

const viewFullLogText = computed(() => {
  return isZh.value ? '查看完整日志' : 'View Full Log';
});

const emptyText = computed(() => {
  return isZh.value ? '暂无更新记录' : 'No updates yet';
});
</script>

<template>
  <el-drawer
    v-model="visible"
    :show-close="false"
    size="520px"
    class="changelog-drawer"
    append-to-body
  >
    <template #header="{ close }">
      <div class="drawer-header">
        <div class="left">
          <el-button text circle @click="close">
            <el-icon><Close /></el-icon>
          </el-button>
          <span class="title">{{ drawerTitle }}</span>
        </div>
        <a :href="fullChangelogLink" target="_blank" class="full-log-link">
          {{ viewFullLogText }}
        </a>
      </div>
    </template>

    <div class="drawer-content">
      <el-timeline
        v-if="componentChangelog.length > 0"
        class="changelog-timeline"
      >
        <el-timeline-item
          v-for="(item, index) in componentChangelog"
          :key="index"
          :timestamp="item.date"
          placement="top"
          color="#409eff"
        >
          <div class="version-card">
            <div class="version-header">
              <span class="version-number">v{{ item.version }}</span>
            </div>
            <div class="changes-list">
              <div
                v-for="(change, cIndex) in item.changes"
                :key="cIndex"
                class="change-item"
              >
                <div class="change-tag-wrapper">
                  <ChangelogTag :type="change.type" size="small">
                    {{ getTypeTagLabel(change.type) }}
                  </ChangelogTag>
                </div>
                <span
                  class="change-content"
                  v-html="formatContent(change.content)"
                />
                <div
                  v-if="change.issues?.length || change.pr || change.author"
                  class="change-meta"
                >
                  <template v-if="change.issues?.length">
                    <a
                      v-for="issue in change.issues"
                      :key="issue"
                      :href="`https://github.com/element-plus-x/Element-Plus-X/issues/${issue}`"
                      target="_blank"
                      class="meta-link issue-link"
                    >
                      #{{ issue }}
                    </a>
                  </template>
                  <a
                    v-if="change.pr"
                    :href="`https://github.com/element-plus-x/Element-Plus-X/pull/${change.pr}`"
                    target="_blank"
                    class="meta-link"
                  >
                    PR #{{ change.pr }}
                  </a>
                  <a
                    v-if="change.author"
                    :href="`https://github.com/${change.author}`"
                    target="_blank"
                    class="meta-link author"
                  >
                    @{{ change.author }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
      <el-empty v-else :description="emptyText" />
    </div>
  </el-drawer>
</template>

<style scoped lang="less">
.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);

  .left {
    display: flex;
    align-items: center;
    gap: 12px;

    .title {
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .full-log-link {
    font-size: 14px;
    color: var(--el-color-primary);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.drawer-content {
  padding: 20px 0;

  :deep(.el-timeline) {
    padding-left: 0;
  }

  :deep(.el-timeline-item__wrapper) {
    padding-left: 24px;
  }

  :deep(.el-timeline-item__tail) {
    border-left: 2px dashed var(--el-color-primary-light-5);
  }

  :deep(.el-timeline-item__node--primary) {
    background-color: var(--el-color-primary);
  }

  :deep(.el-timeline-item__node--success) {
    background-color: var(--el-color-primary);
  }

  :deep(.el-timeline-item__timestamp) {
    font-size: 13px;
    color: var(--el-text-color-secondary);
    font-weight: 500;
    margin-bottom: 12px;
  }
}

.changelog-timeline {
  :deep(.el-timeline-item:last-child) {
    .el-timeline-item__tail {
      display: none;
    }
  }
}

.version-card {
  background: var(--el-fill-color-lighter);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid var(--el-border-color-lighter);
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--el-color-primary-light-5);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  }
}

.version-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--el-border-color-extra-light);
}

.version-number {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  background: linear-gradient(
    135deg,
    var(--el-color-primary-light-8),
    var(--el-color-primary-light-9)
  );
  padding: 4px 12px;
  border-radius: 6px;
}

.change-item {
  margin-bottom: 14px;
  line-height: 1.7;
  position: relative;
  padding-left: 0;

  &:last-child {
    margin-bottom: 0;
  }
}

.change-tag-wrapper {
  display: inline-flex;
  align-items: center;
  margin-right: 10px;
  vertical-align: text-bottom;
}

.change-content {
  font-size: 14px;
  color: var(--el-text-color-regular);
  word-break: break-word;
  line-height: 1.7;

  :deep(a) {
    color: var(--el-color-primary);
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  :deep(code) {
    background-color: var(--el-fill-color);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 13px;
  }
}

.change-meta {
  margin-top: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .meta-link {
    color: var(--el-text-color-secondary);
    text-decoration: none;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 2px;

    &:hover {
      color: var(--el-color-primary);
    }

    &.issue-link {
      background-color: var(--el-fill-color);
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: 500;

      &:hover {
        background-color: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
      }
    }

    &.author {
      font-weight: 500;
    }
  }
}
</style>
