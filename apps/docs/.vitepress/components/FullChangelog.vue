<script setup lang="ts">
import { useData } from 'vitepress';
import { computed } from 'vue';
import { getTagLabel } from '../config/changelog-types';
import changelogData from '../data/changelog.json';
import ChangelogTag from './ChangelogTag.vue';

const { lang } = useData();

const isZh = computed(() => lang.value === 'zh-CN');

interface ChangeItem {
  type: string;
  content: string;
  emoji?: string;
  issues?: string[];
  pr?: string;
  author?: string;
  hash?: string;
}

interface VersionEntry {
  version: string;
  date: string;
  changes: ChangeItem[];
}

type ComponentChangelog = Record<string, VersionEntry[]>;

interface GroupedChanges {
  [type: string]: (ChangeItem & { component: string })[];
}

interface AggregatedVersion {
  version: string;
  date: string;
  groupedChanges: GroupedChanges;
}

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

const aggregatedVersions = computed(() => {
  const data = changelogData as ComponentChangelog;
  const versionMap = new Map<string, AggregatedVersion>();

  for (const [component, versions] of Object.entries(data)) {
    for (const versionEntry of versions) {
      const key = `${versionEntry.version}-${versionEntry.date}`;

      if (!versionMap.has(key)) {
        versionMap.set(key, {
          version: versionEntry.version,
          date: versionEntry.date,
          groupedChanges: {}
        });
      }

      const aggregated = versionMap.get(key)!;
      for (const change of versionEntry.changes) {
        const type = change.type;
        if (!aggregated.groupedChanges[type]) {
          aggregated.groupedChanges[type] = [];
        }
        aggregated.groupedChanges[type].push({
          ...change,
          component
        });
      }
    }
  }

  const versions = Array.from(versionMap.values());

  versions.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateB !== dateA) return dateB - dateA;

    const parseVersion = (v: string) => {
      const parts = v
        .replace(/[^0-9.]/g, '')
        .split('.')
        .map(Number);
      return parts[0] * 10000 + (parts[1] || 0) * 100 + (parts[2] || 0);
    };
    return parseVersion(b.version) - parseVersion(a.version);
  });

  return versions;
});

const typeOrder: Record<string, number> = {
  breaking: 1,
  feature: 2,
  fix: 3,
  refactor: 4,
  perf: 5,
  style: 6,
  docs: 7,
  test: 8,
  build: 9,
  ci: 10,
  chore: 11,
  revert: 12
};

function getSortedTypes(groupedChanges: GroupedChanges) {
  return Object.keys(groupedChanges).sort(
    (a, b) => (typeOrder[a] || 99) - (typeOrder[b] || 99)
  );
}
</script>

<template>
  <div class="full-changelog">
    <div
      v-for="(item, index) in aggregatedVersions"
      :key="index"
      class="version-section"
    >
      <h2 :id="item.version" class="version-title">
        {{ item.version }}
      </h2>
      <span class="version-date">{{ item.date }}</span>

      <div
        v-for="type in getSortedTypes(item.groupedChanges)"
        :key="type"
        class="change-group"
      >
        <div class="change-list">
          <div
            v-for="(change, cIndex) in item.groupedChanges[type]"
            :key="cIndex"
            class="change-item"
          >
            <ChangelogTag :type="change.type" size="small">
              {{ getTypeTagLabel(change.type) }}
            </ChangelogTag>
            <span
              class="change-content"
              v-html="formatContent(change.content)"
            />
            <span class="component-name">{{ change.component }}</span>
            <template
              v-if="change.issues?.length || change.pr || change.author"
            >
              <span class="change-links">
                <template v-if="change.issues?.length">
                  <a
                    v-for="issue in change.issues"
                    :key="issue"
                    :href="`https://github.com/element-plus-x/Element-Plus-X/issues/${issue}`"
                    target="_blank"
                    class="link"
                    >#{{ issue }}</a
                  >
                </template>
                <a
                  v-if="change.pr"
                  :href="`https://github.com/element-plus-x/Element-Plus-X/pull/${change.pr}`"
                  target="_blank"
                  class="link"
                  >#{{ change.pr }}</a
                >
                <a
                  v-if="change.author"
                  :href="`https://github.com/${change.author}`"
                  target="_blank"
                  class="link author"
                  >@{{ change.author }}</a
                >
              </span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.full-changelog {
  margin-top: 16px;
  list-style: none;

  :deep(ul),
  :deep(ol) {
    list-style: none;
    padding-left: 0;
    margin: 0;
  }

  :deep(li) {
    list-style: none;
    &::marker {
      content: none;
    }
  }
}

.version-section {
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
}

.version-section {
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
}

.version-title {
  display: inline;
  margin: 0;
  padding: 0;
  border-bottom: none;
  font-size: 20px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.version-date {
  display: block;
  margin-top: 4px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider-light);
  font-size: 14px;
  font-weight: 400;
  color: var(--vp-c-text-2);
  font-family: monospace;
}

.change-group {
  margin-bottom: 8px;
}

.change-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.change-item {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  line-height: 1.6;
  padding-left: 0;
}

.change-content {
  flex: 1;
  color: var(--vp-c-text-1);
  font-size: 14px;
  word-break: break-word;

  :deep(a) {
    color: var(--vp-c-brand-1);
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  :deep(strong) {
    font-weight: 600;
  }

  :deep(code) {
    background-color: var(--vp-c-mute);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 13px;
  }
}

.component-name {
  font-size: 12px;
  color: var(--vp-c-text-3);
  background: var(--vp-c-mute);
  padding: 1px 6px;
  border-radius: 4px;
}

.change-links {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
  font-size: 13px;

  .link {
    color: var(--vp-c-text-2);
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: var(--vp-c-brand-1);
    }

    &.author {
      font-weight: 500;
    }
  }
}
</style>
