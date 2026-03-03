<script setup lang="ts">
import type { IssueForm } from './types';
import { getIssueCategoryOptions } from '@configs/commit-types';
import { ElFormItem, ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { MarkdownRenderer } from 'x-markdown-vue';
import { fetchGitHubTags, getComponents } from './utils/data-fetcher';
import {
  generateGitHubIssueUrl,
  generateIssueBody
} from './utils/url-generator';

const loading = ref(false);
const IsPreview = ref(false);
const formRef = ref();
const components = reactive<string[]>(getComponents());
const versions = reactive<string[]>([]);

const categoryOptions = getIssueCategoryOptions();

const markdown = ref(`### 问题描述`);

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

const rules = {
  title: [
    { required: true, message: '请输入 Issue 标题', trigger: 'blur' },
    { min: 5, message: '标题长度至少为 5 个字符', trigger: 'blur' }
  ],
  category: [{ required: true, message: '请选择类别', trigger: 'change' }],
  version: [{ required: true, message: '请选择仓库版本', trigger: 'change' }],
  reproductionSteps: [
    { required: true, message: '请描述重现步骤', trigger: 'blur' },
    { min: 10, message: '重现步骤描述至少需要 10 个字符', trigger: 'blur' }
  ],
  expectedBehavior: [
    { required: true, message: '请描述期待的行为', trigger: 'blur' },
    { min: 5, message: '期待行为描述至少需要 5 个字符', trigger: 'blur' }
  ],
  actualBehavior: [
    { required: true, message: '请描述实际的行为', trigger: 'blur' },
    { min: 5, message: '实际行为描述至少需要 5 个字符', trigger: 'blur' }
  ]
};

function formatIssueTitle() {
  return `[${form.category}] ${form.title}`;
}

function preview() {
  markdown.value = generateIssueBody(form);
  IsPreview.value = true;
}

async function submitForm() {
  if (!formRef.value) return;

  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      const url = generateGitHubIssueUrl(form);

      window.open(url, '_blank');

      ElMessage.success('正在跳转到 GitHub 创建 Issue...');
    }
  });
}

onMounted(async () => {
  loading.value = true;
  try {
    const tags = await fetchGitHubTags();
    versions.push(...tags);
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    ElMessage.warning('版本数据加载失败，请刷新页面重试');
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="issue-page">
    <div class="issue-container">
      <div class="page-header">
        <div class="header-content">
          <h1>Issue 反馈</h1>
          <p class="description">
            请详细描述您遇到的问题，帮助我们更好地理解和解决
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
            <div class="section-title">基本信息</div>

            <div class="form-row">
              <div class="form-col">
                <ElFormItem label="类别" prop="category">
                  <el-select
                    v-model="form.category"
                    placeholder="请选择类别"
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
                <ElFormItem label="标题" prop="title">
                  <el-input
                    v-model="form.title"
                    placeholder="简短描述问题"
                    maxlength="100"
                  />
                </ElFormItem>
              </div>
            </div>

            <div class="form-row">
              <div class="form-col">
                <ElFormItem label="组件库版本" prop="version">
                  <el-select
                    v-model="form.version"
                    placeholder="请选择版本"
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
                <ElFormItem label="相关组件">
                  <el-select
                    v-model="form.componentName"
                    placeholder="请选择相关组件（可选）"
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
            <div class="section-title">问题详情</div>

            <ElFormItem label="问题描述" prop="description">
              <el-input
                v-model="form.description"
                type="textarea"
                placeholder="请详细描述遇到的问题"
                :rows="4"
              />
            </ElFormItem>

            <ElFormItem label="复现步骤" prop="reproductionSteps">
              <el-input
                v-model="form.reproductionSteps"
                type="textarea"
                placeholder="1. 打开页面 '...'&#10;2. 点击按钮 '...'&#10;3. 观察到错误..."
                :rows="4"
              />
            </ElFormItem>
          </div>

          <div class="form-section">
            <div class="section-title">预期与实际</div>

            <div class="form-row">
              <div class="form-col">
                <ElFormItem label="期望行为" prop="expectedBehavior">
                  <el-input
                    v-model="form.expectedBehavior"
                    type="textarea"
                    placeholder="请描述期望的行为是什么"
                    :rows="3"
                  />
                </ElFormItem>
              </div>
              <div class="form-col">
                <ElFormItem label="实际行为" prop="actualBehavior">
                  <el-input
                    v-model="form.actualBehavior"
                    type="textarea"
                    placeholder="请描述实际的行为是什么"
                    :rows="3"
                  />
                </ElFormItem>
              </div>
            </div>

            <ElFormItem label="复现链接">
              <el-input
                v-model="form.reproductionLink"
                placeholder="提供复现问题的链接（可选）"
              />
            </ElFormItem>
          </div>

          <div class="form-actions">
            <el-button :disabled="loading" @click="IsPreview = false">
              重置
            </el-button>
            <el-button type="default" :disabled="loading" @click="preview">
              预览
            </el-button>
            <el-button type="primary" :disabled="loading" @click="submitForm">
              提交 Issue
            </el-button>
          </div>
        </el-form>
      </div>

      <Transition name="preview-fade">
        <div v-show="IsPreview" class="preview-container">
          <div class="preview-header">
            <h3>Issue 预览</h3>
            <el-button
              type="primary"
              plain
              size="small"
              @click="IsPreview = false"
            >
              返回编辑
            </el-button>
          </div>
          <div class="preview-content">
            <el-card class="preview-card">
              <template #header>
                <div class="card-header">
                  <span class="issue-title">{{ formatIssueTitle() }}</span>
                  <el-tag size="small">
                    {{ form.version }}
                  </el-tag>
                </div>
              </template>

              <div class="preview-fields">
                <MarkdownRenderer :markdown="markdown" />
              </div>
            </el-card>
          </div>
        </div>
      </Transition>
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

.preview-container {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  padding: 24px;
  margin-top: 24px;
}

html.dark .preview-container {
  background: var(--vp-c-bg);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

html.dark .preview-header {
  border-bottom-color: var(--vp-c-divider);
}

.preview-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

html.dark .preview-header h3 {
  color: var(--vp-c-text-1);
}

.preview-content {
  margin-top: 16px;
}

.preview-card {
  border: 1px solid #ebeef5;
  border-radius: 12px;
  box-shadow: none;
}

html.dark .preview-card {
  border-color: var(--vp-c-divider);
}

.preview-card :deep(.el-card__header) {
  padding: 16px 20px;
  background: #fafafa;
  border-bottom: 1px solid #ebeef5;
}

html.dark .preview-card :deep(.el-card__header) {
  background: var(--vp-c-bg-soft);
  border-bottom-color: var(--vp-c-divider);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.issue-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

html.dark .issue-title {
  color: var(--vp-c-text-1);
}

.preview-fields {
  padding: 4px 0;
}

.preview-fade-enter-active,
.preview-fade-leave-active {
  transition: all 0.3s ease;
}

.preview-fade-enter-from,
.preview-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
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
