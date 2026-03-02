<script setup lang="ts">
import { ElFormItem, ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { MarkdownRenderer } from 'x-markdown-vue';
// import { useRouter } from 'vue-router';
import changelog from '../../.vitepress/data/changelog.json';
import { createIssues, generateIssueMarkdown, getLatestVersion } from './api.js';

console.log('changelog:', changelog);

const loading = ref(false);
const IsPreview = ref(false);
const formRef = ref();
const issuesUrl = ref('');
const isExampleType = ref('code');
const components = reactive<string[]>([]);
const versions = reactive<string[]>([]);
const markdown = ref(`### 问题描述`);

const form = reactive({
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

const categoryOptions = [
  { label: '✨ feat: 新增功能', value: 'feat' },
  { label: '🐛 fix: 修复缺陷', value: 'fix' },
  { label: '📚 docs: 文档更新', value: 'docs' },
  { label: '🎨 style: 代码格式', value: 'style' },
  { label: '🔨 refactor: 代码重构', value: 'refactor' },
  { label: '⚡ perf: 性能提升', value: 'perf' },
  { label: '🧪 test: 测试相关', value: 'test' },
  { label: '🏗️ build: 构建相关', value: 'build' },
  { label: '🔄 ci: 持续集成', value: 'ci' },
  { label: '⏪ revert: 回退代码', value: 'revert' },
  { label: '🔧 chore: 其他修改', value: 'chore' }
];

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入 Issue 标题', trigger: 'blur' },
    { min: 5, message: '标题长度至少为 5 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择类别', trigger: 'change' }
  ],
  version: [
    { required: true, message: '请选择仓库版本', trigger: 'change' }
  ],
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

onMounted(async () => {
  Object.keys(changelog).forEach(component => {
    components.push(component);
  });
  getLatestVersion().then((res: any) => {
    versions.push(...res?.map((item: any) => item.name) || []);
  });
});

// 格式化Issue标题的方法
function formatIssueTitle() {
  // 基础格式: [Component] [select] el-select 远程搜索 options 变更，已选中项展示 label 错误
  const { componentName, category, title } = form;
  return `[${componentName}] [${category}] ${title}`;
}

// 表单提交方法
async function submitForm() {
  if (!formRef.value)
    return;

  try {
    await formRef.value.validate();
    loading.value = true;

    // Prepare issue data from form
    const issueData = {
      title: formatIssueTitle(),
      bugType: form.category,
      elementPlusVersion: form.version,
      browserOS: form.environment,
      relatedComponents: form.componentName ? [form.componentName] : [],
      reproductionLink: form.reproductionLink,
      reproductionType: isExampleType.value,
      stepsToReproduce: form.reproductionSteps,
      expectedBehavior: form.expectedBehavior,
      actualBehavior: form.actualBehavior
    };

    createIssues(issueData).then((res: any) => {
      if (res.url) {
        ElMessage.success('Issue 创建成功！');
        issuesUrl.value = res.html_url;
      }
    }).finally(() => {
      loading.value = false;
    });
  }
  catch (error: any) {
    // ElMessage.error(error?.message || '请完善必填项后再提交');
  }
}

async function preview() {
  if (!formRef.value)
    return;

  try {
    await formRef.value.validate();
    // Generate markdown content from form data using the shared function
    const issueData = {
      bugType: form.category,
      elementPlusVersion: form.version,
      browserOS: form.environment,
      relatedComponents: form.componentName ? [form.componentName] : [],
      reproductionLink: form.reproductionLink,
      reproductionType: isExampleType.value,
      stepsToReproduce: form.reproductionSteps,
      expectedBehavior: form.expectedBehavior,
      actualBehavior: form.actualBehavior
    };
    markdown.value = generateIssueMarkdown(issueData);
    IsPreview.value = true;
  }
  catch (error) {
    // ElMessage.error('请先完善必填项再进行预览');
  }
}

function getEnvInfo() {
  // 获取操作系统版本和浏览器版本
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  form.environment = `平台: ${platform}, 浏览器: ${userAgent}`;
}
</script>

<template>
  <div v-loading="loading" class="home">
    <!-- <transition name="fade" mode="out-in"> -->
    <div :key="IsPreview ? 'preview' : 'form'">
      <el-form v-show="!IsPreview" ref="formRef" :model="form" :rules="rules" label-position="top">
        <div style="margin-bottom: 20px;">
          <!-- <h2>欢迎使用 Issue 提交模板</h2> -->
          <p>请按照以下步骤填写表单，帮助我们更快地定位和解决问题：</p>
          <h4 style="margin-bottom: 20px;">
            在提交 issue 前，请先进行搜索来保证没有类似的 issue。先去看看
            <a href="https://github.com/element-plus-x/Element-Plus-X/issues">issue</a>
          </h4>
          <el-alert :closable="false" type="warning">
            <template #default>
              在保证表达无误的情况下，我们建议你使用 英语 来描述碰到的问题。如果你对你的英语不自信，可以同时有英语和中文两种语言。
              但如果你真的不会英语，那么中文也是可以接受的。
              社区也有一些非中文母语者，如果你希望尽可能多的人能够看懂你的 issue，就请尽量用英文。
            </template>
          </el-alert>
          <p />
        </div>

        <ElFormItem label="Issue 标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入 Issue 简单描述">
            <template #prepend>
              <el-select v-model="form.category" style="width: 205px" placeholder="请选择类别">
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-input>
        </ElFormItem>

        <el-row :gutter="20">
          <el-col :span="12">
            <ElFormItem label="仓库版本" prop="version">
              <el-select v-model="form.version" placeholder="请选择版本">
                <el-option
                  v-for="version in versions"
                  :key="version"
                  :label="version"
                  :value="version"
                />
              </el-select>
            </ElFormItem>
          </el-col>
          <el-col :span="12">
            <ElFormItem label="问题组件" prop="componentName">
              <el-select v-model="form.componentName" placeholder="请选择组件" clearable>
                <el-option
                  v-for="component in components"
                  :key="component"
                  :label="component"
                  :value="component"
                />
              </el-select>
            </ElFormItem>
          </el-col>
        </el-row>

        <ElFormItem>
          <template #label>
            <span style="margin-right: 20px;">操作系统版本 / 浏览器版本</span>
            <el-button type="primary" bg text @click="getEnvInfo()">
              获取当前环境信息
            </el-button>
          </template>
          <el-input
            v-model="form.environment"
            placeholder="请输入操作系统版本和浏览器版本，例如：Windows 10 + Chrome 90"
          />
        </ElFormItem>

        <ElFormItem>
          <template #label>
            <el-button text :bg="isExampleType === 'code'" type="primary" @click="isExampleType = 'code'">
              重现代码
            </el-button>
            <span style="margin: 0 5px;">or</span>
            <el-button text :bg="isExampleType === 'link'" type="primary" @click="isExampleType = 'link'">
              重现链接
            </el-button>
          </template>
          <el-input
            v-model="form.reproductionLink"
            :type="isExampleType === 'code' ? 'textarea' : 'text'"
            placeholder="请输入"
          />
        </ElFormItem>

        <!-- 支持 Markdown -->
        <div style="margin: 40px 0 20px 0;">
          <el-alert title="支持 Markdown格式输入" type="warning" />
        </div>

        <ElFormItem label="重现步骤" prop="reproductionSteps">
          <el-input
            v-model="form.reproductionSteps"
            type="textarea"
            placeholder="请详细描述重现步骤，可以填写多个步骤，请用英文分号隔开"
            :rows="4"
          />
        </ElFormItem>

        <el-row :gutter="20">
          <el-col :span="12">
            <ElFormItem label="期待的行为" prop="expectedBehavior">
              <el-input
                v-model="form.expectedBehavior"
                type="textarea"
                placeholder="请描述你期待的行为是什么"
                :rows="3"
              />
            </ElFormItem>
          </el-col>
          <el-col :span="12">
            <ElFormItem label="实际的行为" prop="actualBehavior">
              <el-input
                v-model="form.actualBehavior"
                type="textarea"
                placeholder="请描述实际的行为是什么"
                :rows="3"
              />
            </ElFormItem>
          </el-col>
        </el-row>

        <ElFormItem style="padding-top: 20px;">
          <el-button type="primary" @click="preview">
            预览
          </el-button>
          <el-button type="primary" @click="submitForm">
            提交 Issue
          </el-button>
        </ElFormItem>

        <el-alert v-if="!!issuesUrl" type="success" :closable="false" title="Issue 创建成功！">
          <template #title>
            已成功创建，请前往 <a :href="issuesUrl" target="_blank">GitHub Issue 页面</a> 查看详情。
          </template>
        </el-alert>
      </el-form>

      <div v-show="IsPreview" class="preview-container">
        <div class="preview-header">
          <h3>Issue 预览</h3>
          <el-button type="primary" plain @click="IsPreview = false">
            返回编辑
          </el-button>
        </div>
        <div class="preview-content">
          <el-card class="preview-card">
            <template #header>
              <div class="card-header">
                <span class="issue-title">{{ formatIssueTitle() }}</span>
                <el-tag>{{ form.version }}</el-tag>
              </div>
            </template>

            <div class="preview-fields">
              <MarkdownRenderer :markdown="markdown" />
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <!-- </transition> -->
  </div>
</template>

<style scoped>
.home {
  margin: 0 auto;
  /* padding: 40px; */
  /* font-family:
    Inter, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial,
    sans-serif; */
  background-color: #fff;
  width: 800px;
  min-height: 600px;
}

.preview-container {
  padding: 20px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.preview-content {
  margin-top: 20px;
}

.preview-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-fields {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.preview-field {
  padding: 15px;
}

.preview-field p {
  color: #303133;
  margin-right: 8px;
  font-weight: 600;
}
</style>
