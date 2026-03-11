<script setup lang="ts">
import type { Component } from 'vue';
import type { IssueForm } from './types';
import {
  getBgColor,
  getBorderColor,
  getColor,
  getIssueCategoryOptions
} from '@configs/commit-types';
import { ElFormItem, ElMessage } from 'element-plus';
import { useData } from 'vitepress';
import { computed, onMounted, reactive, ref, shallowRef } from 'vue';
import { fetchGitHubTags, getComponents } from './utils/data-fetcher';
import {
  generateGitHubIssueUrl,
  generateIssueBody
} from './utils/url-generator';

type Locale = 'zh' | 'en';

const { lang } = useData();
const locale = computed<Locale>(() =>
  lang.value.startsWith('zh') ? 'zh' : 'en'
);

const i18nTexts = {
  zh: {
    markdownTitle: '### 问题描述',
    pageTitle: 'Issue 反馈',
    pageDescription: '请详细描述您遇到的问题，帮助我们更好地理解和解决',
    sections: {
      basicInformation: '基本信息',
      issueDetails: '问题详情',
      expectedVsActual: '预期与实际'
    },
    labels: {
      category: '类别',
      title: '标题',
      version: '组件库版本',
      componentName: '相关组件',
      description: '问题描述',
      reproductionSteps: '复现步骤',
      expectedBehavior: '期望行为',
      actualBehavior: '实际行为',
      reproductionLink: '复现链接'
    },
    placeholders: {
      category: '请选择类别',
      title: '简短描述问题',
      version: '请选择版本',
      componentName: '请选择相关组件（可选）',
      description: '请详细描述遇到的问题',
      reproductionSteps:
        "1. 打开页面 '...'\n2. 点击按钮 '...'\n3. 观察到错误...",
      expectedBehavior: '请描述期望的行为是什么',
      actualBehavior: '请描述实际的行为是什么',
      reproductionLink: '提供复现问题的链接（可选）'
    },
    validation: {
      title: '请输入 Issue 标题',
      category: '请选择类别',
      version: '请选择仓库版本',
      reproductionSteps: '请描述重现步骤',
      expectedBehavior: '请描述期待的行为',
      actualBehavior: '请描述实际的行为'
    },
    buttons: {
      reset: '重置',
      preview: '预览',
      submitIssue: '提交 Issue'
    },
    messages: {
      submitSuccess: '正在跳转到 GitHub 创建 Issue...',
      loadVersionFailed: '版本数据加载失败，请刷新页面重试'
    },
    preview: {
      description: '问题描述',
      noDescription: '暂无描述',
      reproductionSteps: '复现步骤',
      expectedBehavior: '期望行为',
      actualBehavior: '实际行为',
      reproductionLink: '复现链接'
    }
  },
  en: {
    markdownTitle: '### Description',
    pageTitle: 'Issue Feedback',
    pageDescription:
      'Please describe the issue in detail so we can better understand and resolve it.',
    sections: {
      basicInformation: 'Basic Information',
      issueDetails: 'Issue Details',
      expectedVsActual: 'Expected vs Actual'
    },
    labels: {
      category: 'Category',
      title: 'Title',
      version: 'Library Version',
      componentName: 'Related Component',
      description: 'Description',
      reproductionSteps: 'Reproduction Steps',
      expectedBehavior: 'Expected Behavior',
      actualBehavior: 'Actual Behavior',
      reproductionLink: 'Reproduction Link'
    },
    placeholders: {
      category: 'Select a category',
      title: 'Briefly describe the issue',
      version: 'Select a version',
      componentName: 'Select a related component (optional)',
      description: 'Describe the issue in detail',
      reproductionSteps:
        "1. Open page '...'\n2. Click button '...'\n3. Observe the error...",
      expectedBehavior: 'Describe the expected behavior',
      actualBehavior: 'Describe the actual behavior',
      reproductionLink: 'Provide a reproduction link (optional)'
    },
    validation: {
      title: 'Please enter an issue title',
      category: 'Please select a category',
      version: 'Please select a library version',
      reproductionSteps: 'Please describe the reproduction steps',
      expectedBehavior: 'Please describe the expected behavior',
      actualBehavior: 'Please describe the actual behavior'
    },
    buttons: {
      reset: 'Reset',
      preview: 'Preview',
      submitIssue: 'Submit Issue'
    },
    messages: {
      submitSuccess: 'Redirecting to GitHub to create an issue...',
      loadVersionFailed:
        'Failed to load version data. Please refresh the page and try again.'
    },
    preview: {
      description: 'Description',
      noDescription: 'No description provided',
      reproductionSteps: 'Reproduction Steps',
      expectedBehavior: 'Expected Behavior',
      actualBehavior: 'Actual Behavior',
      reproductionLink: 'Reproduction Link'
    }
  }
} as const;

const texts = computed(() => i18nTexts[locale.value]);

const loading = ref(false);
const IsPreview = ref(false);
const MarkdownRenderer = shallowRef<Component | null>(null);
const formRef = ref();
const components = reactive<string[]>(getComponents());
const versions = reactive<string[]>([]);

const categoryOptions = computed(() => getIssueCategoryOptions(locale.value));
const markdown = ref<string>(i18nTexts.zh.markdownTitle);

const form = reactive<IssueForm>({
  category: '',
  title: '',
  description: '',
  relatedComponent: false,
  componentName: '',
  version: '',
  environment: '',
  reproductionLink: '',
  reproductionSteps: '',
  expectedBehavior: '',
  actualBehavior: ''
});

const rules = computed(() => ({
  title: [
    {
      required: true,
      message: texts.value.validation.title,
      trigger: 'blur'
    }
  ],
  category: [
    {
      required: true,
      message: texts.value.validation.category,
      trigger: 'change'
    }
  ],
  version: [
    {
      required: true,
      message: texts.value.validation.version,
      trigger: 'change'
    }
  ],
  reproductionSteps: [
    {
      required: true,
      message: texts.value.validation.reproductionSteps,
      trigger: 'blur'
    }
  ],
  expectedBehavior: [
    {
      required: true,
      message: texts.value.validation.expectedBehavior,
      trigger: 'blur'
    }
  ],
  actualBehavior: [
    {
      required: true,
      message: texts.value.validation.actualBehavior,
      trigger: 'blur'
    }
  ]
}));

const categoryColor = computed(() => getColor(form.category));
const categoryBgColor = computed(() => getBgColor(form.category));
const categoryBorderColor = computed(() => getBorderColor(form.category));

const truncatedTitle = computed(() => {
  if (form.title.length > 12) {
    return `${form.title.slice(0, 12)}...`;
  }
  return form.title;
});

const showTitleTooltip = computed(() => form.title.length > 12);

function resetForm() {
  formRef.value?.resetFields();
}

async function preview() {
  if (!formRef.value) return;
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      markdown.value = generateIssueBody(form, locale.value);
      IsPreview.value = true;
    }
  });
}

async function submitForm() {
  if (!formRef.value) return;

  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      const url = generateGitHubIssueUrl(form, locale.value);

      window.open(url, '_blank');

      ElMessage.success(texts.value.messages.submitSuccess);
    }
  });
}

onMounted(async () => {
  const { MarkdownRenderer: MarkdownRendererComponent } = await import(
    'x-markdown-vue'
  );
  MarkdownRenderer.value = MarkdownRendererComponent;

  loading.value = true;
  try {
    const tags = await fetchGitHubTags();
    versions.push(...tags);
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    ElMessage.warning(texts.value.messages.loadVersionFailed);
  } finally {
    loading.value = false;
  }

  // 从 URL 参数中读取 component 值并预填充表单
  const urlParams = new URLSearchParams(window.location.search);
  const componentParam = urlParams.get('component');
  if (componentParam && components.includes(componentParam)) {
    form.componentName = componentParam;
  }
});
</script>

<template>
  <div class="issue-page">
    <div class="issue-container">
      <div class="page-header">
        <div class="header-content">
          <h1>{{ texts.pageTitle }}</h1>
          <p class="description">
            {{ texts.pageDescription }}
          </p>
        </div>
      </div>

      <div class="form-card">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          class="issue-form"
        >
          <div class="form-section">
            <div class="section-title">
              {{ texts.sections.basicInformation }}
            </div>

            <div class="form-row">
              <div class="form-col">
                <ElFormItem :label="texts.labels.category" prop="category">
                  <el-select
                    v-model="form.category"
                    :placeholder="texts.placeholders.category"
                    style="width: 100%"
                    :disabled="loading"
                  >
                    <el-option
                      v-for="item in categoryOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </ElFormItem>
              </div>
              <div class="form-col">
                <ElFormItem :label="texts.labels.title" prop="title">
                  <el-input
                    v-model="form.title"
                    :placeholder="texts.placeholders.title"
                    maxlength="100"
                  />
                </ElFormItem>
              </div>
            </div>

            <div class="form-row">
              <div class="form-col">
                <ElFormItem :label="texts.labels.version" prop="version">
                  <el-select
                    v-model="form.version"
                    :placeholder="texts.placeholders.version"
                    style="width: 100%"
                    :disabled="loading"
                  >
                    <el-option
                      v-for="version in versions"
                      :key="version"
                      :label="version"
                      :value="version"
                    />
                  </el-select>
                </ElFormItem>
              </div>
              <div class="form-col">
                <ElFormItem
                  :label="texts.labels.componentName"
                  prop="componentName"
                >
                  <el-select
                    v-model="form.componentName"
                    :placeholder="texts.placeholders.componentName"
                    style="width: 100%"
                    clearable
                    :disabled="loading"
                  >
                    <el-option
                      v-for="component in components"
                      :key="component"
                      :label="component"
                      :value="component"
                    />
                  </el-select>
                </ElFormItem>
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="section-title">
              {{ texts.sections.issueDetails }}
            </div>

            <ElFormItem :label="texts.labels.description" prop="description">
              <el-input
                v-model="form.description"
                type="textarea"
                :placeholder="texts.placeholders.description"
                :rows="4"
              />
            </ElFormItem>

            <ElFormItem
              :label="texts.labels.reproductionSteps"
              prop="reproductionSteps"
            >
              <el-input
                v-model="form.reproductionSteps"
                type="textarea"
                :placeholder="texts.placeholders.reproductionSteps"
                :rows="4"
              />
            </ElFormItem>
          </div>

          <div class="form-section">
            <div class="section-title">
              {{ texts.sections.expectedVsActual }}
            </div>

            <div class="form-row">
              <div class="form-col">
                <ElFormItem
                  :label="texts.labels.expectedBehavior"
                  prop="expectedBehavior"
                >
                  <el-input
                    v-model="form.expectedBehavior"
                    type="textarea"
                    :placeholder="texts.placeholders.expectedBehavior"
                    :rows="3"
                  />
                </ElFormItem>
              </div>
              <div class="form-col">
                <ElFormItem
                  :label="texts.labels.actualBehavior"
                  prop="actualBehavior"
                >
                  <el-input
                    v-model="form.actualBehavior"
                    type="textarea"
                    :placeholder="texts.placeholders.actualBehavior"
                    :rows="3"
                  />
                </ElFormItem>
              </div>
            </div>

            <ElFormItem
              :label="texts.labels.reproductionLink"
              prop="reproductionLink"
            >
              <el-input
                v-model="form.reproductionLink"
                :placeholder="texts.placeholders.reproductionLink"
              />
            </ElFormItem>
          </div>

          <div class="form-actions">
            <el-button :disabled="loading" @click="resetForm">
              {{ texts.buttons.reset }}
            </el-button>
            <el-button type="default" :disabled="loading" @click="preview">
              {{ texts.buttons.preview }}
            </el-button>
            <el-button type="primary" :disabled="loading" @click="submitForm">
              {{ texts.buttons.submitIssue }}
            </el-button>
          </div>
        </el-form>
      </div>

      <el-dialog
        v-model="IsPreview"
        width="720px"
        :close-on-click-modal="false"
        destroy-on-close
        :show-close="true"
        class="issue-preview-dialog"
      >
        <template #header>
          <div class="preview-dialog-header">
            <div class="preview-header-left">
              <span
                class="category-tag"
                :style="{
                  color: categoryColor,
                  backgroundColor: categoryBgColor,
                  borderColor: categoryBorderColor
                }"
              >
                {{ form.category }}
              </span>
              <span v-if="form.componentName" class="component-name">{{
                form.componentName
              }}</span>
              <el-tag size="small" effect="plain">
                {{ form.version }}
              </el-tag>
              <el-tooltip
                v-if="showTitleTooltip"
                :content="form.title"
                placement="top"
              >
                <span class="issue-title-text">{{ truncatedTitle }}</span>
              </el-tooltip>
              <span v-else class="issue-title-text">{{ form.title }}</span>
            </div>
          </div>
        </template>
        <div class="preview-dialog-content">
          <div class="gh-section">
            <h3 class="gh-heading">
              {{ texts.preview.description }}
            </h3>
            <div class="gh-content">
              <component
                :is="MarkdownRenderer"
                v-if="MarkdownRenderer"
                :markdown="form.description || texts.preview.noDescription"
              />
            </div>
          </div>

          <div class="gh-section">
            <h3 class="gh-heading">
              {{ texts.preview.reproductionSteps }}
            </h3>
            <div class="gh-content">
              <component
                :is="MarkdownRenderer"
                v-if="MarkdownRenderer"
                :markdown="form.reproductionSteps"
              />
            </div>
          </div>

          <div class="gh-columns">
            <div class="gh-section gh-half">
              <h3 class="gh-heading">
                {{ texts.preview.expectedBehavior }}
              </h3>
              <div class="gh-content">
                <component
                  :is="MarkdownRenderer"
                  v-if="MarkdownRenderer"
                  :markdown="form.expectedBehavior"
                />
              </div>
            </div>

            <div class="gh-section gh-half">
              <h3 class="gh-heading">
                {{ texts.preview.actualBehavior }}
              </h3>
              <div class="gh-content">
                <component
                  :is="MarkdownRenderer"
                  v-if="MarkdownRenderer"
                  :markdown="form.actualBehavior"
                />
              </div>
            </div>
          </div>

          <div v-if="form.reproductionLink" class="gh-section">
            <h3 class="gh-heading">
              {{ texts.preview.reproductionLink }}
            </h3>
            <div class="gh-content">
              <a
                :href="form.reproductionLink"
                target="_blank"
                class="gh-link"
                >{{ form.reproductionLink }}</a
              >
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped>
.issue-page {
  padding: 40px 20px;
}

html.dark .issue-page {
  background: transparent;
}

.issue-container {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
  padding: 24px 32px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(64, 158, 255, 0.25);
}

.header-content h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #fff;
}

.header-content .description {
  margin: 0;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
}

.form-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  padding: 32px;
  margin-bottom: 24px;
}

html.dark .form-card {
  background: var(--vp-c-bg);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}

.issue-form {
  width: 100%;
}

.form-section {
  padding-bottom: 24px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
  padding-left: 12px;
  border-left: 3px solid #409eff;
}

html.dark .section-title {
  color: var(--vp-c-text-1);
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 0;
}

.form-col {
  flex: 1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  margin-top: 8px;
  border-top: 1px solid #ebeef5;
}

html.dark .form-actions {
  border-top-color: var(--vp-c-divider);
}

.form-actions .el-button {
  min-width: 100px;
}

.preview-dialog-content {
  max-height: 60vh;
  overflow-y: auto;
  font-size: 14px;
  color: #24292f;
  line-height: 1.6;
}

html.dark .preview-dialog-content {
  color: var(--vp-c-text-1);
}

.preview-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.preview-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.category-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  border: 1px solid;
}

.component-name {
  font-size: 13px;
  color: #57606a;
}

html.dark .component-name {
  color: var(--vp-c-text-2);
}

.issue-title-text {
  font-size: 14px;
  font-weight: 600;
  color: #24292f;
  cursor: default;
}

html.dark .issue-title-text {
  color: var(--vp-c-text-1);
}

.gh-section {
  margin-bottom: 20px;
}

.gh-section:last-child {
  margin-bottom: 0;
}

.gh-heading {
  font-size: 14px;
  font-weight: 600;
  color: #24292f;
  margin: 0 0 10px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #d0d7de;
}

html.dark .gh-heading {
  color: var(--vp-c-text-1);
  border-bottom-color: var(--vp-c-divider);
}

.gh-content {
  color: #57606a;
  line-height: 1.6;
}

html.dark .gh-content {
  color: var(--vp-c-text-2);
}

.gh-content:deep(p) {
  margin: 0 0 12px 0;
}

.gh-content:deep(p:last-child) {
  margin-bottom: 0;
}

.gh-content:deep(code) {
  background: rgba(175, 184, 193, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}

.gh-content:deep(pre) {
  background: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
}

html.dark .gh-content:deep(pre) {
  background: rgba(255, 255, 255, 0.05);
}

.gh-columns {
  display: flex;
  gap: 24px;
}

.gh-half {
  flex: 1;
}

.gh-link {
  color: #0969da;
  text-decoration: none;
  word-break: break-all;
}

.gh-link:hover {
  text-decoration: underline;
}

html.dark .gh-link {
  color: #58a6ff;
}

@media (max-width: 768px) {
  .issue-page {
    padding: 20px 16px;
  }

  .page-header {
    text-align: center;
    padding: 20px;
  }

  .header-content h1 {
    font-size: 24px;
  }

  .form-card {
    padding: 20px;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .form-actions {
    flex-wrap: wrap;
  }

  .form-actions .el-button {
    flex: 1;
    min-width: auto;
  }
}
</style>
