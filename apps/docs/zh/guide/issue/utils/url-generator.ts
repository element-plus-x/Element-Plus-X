import type { IssueForm } from '../types';

const i18nIssueBodyTexts = {
  zh: {
    description: '问题描述',
    environment: '环境信息',
    libraryVersion: '组件库版本',
    component: '组件名称',
    reproductionSteps: '复现步骤',
    expectedBehavior: '期望行为',
    actualBehavior: '实际行为',
    reproductionLink: '复现链接'
  },
  en: {
    description: 'Description',
    environment: 'Environment',
    libraryVersion: 'Library version',
    component: 'Component',
    reproductionSteps: 'Reproduction Steps',
    expectedBehavior: 'Expected Behavior',
    actualBehavior: 'Actual Behavior',
    reproductionLink: 'Reproduction Link'
  }
} as const;

/**
 * 生成 GitHub Issue URL
 * 使用预填充方式，而不是直接调用 API，避免暴露 Token
 */
export function generateGitHubIssueUrl(
  formData: IssueForm,
  locale: 'zh' | 'en' = 'zh'
): string {
  const baseUrl = 'https://github.com/element-plus-x/Element-Plus-X/issues/new';
  const params = new URLSearchParams();

  // 设置标题格式：[bug] 具体标题
  params.set('title', `[${formData.category}] ${formData.title}`);

  // 设置 Issue Body（Markdown 格式）
  params.set('body', generateIssueBody(formData, locale));

  // 如果有相关组件，设置标签
  if (formData.componentName) {
    params.set('labels', formData.componentName);
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * 生成 Issue Body 内容
 */
export function generateIssueBody(
  formData: IssueForm,
  locale: 'zh' | 'en' = 'zh'
): string {
  const localeTexts = i18nIssueBodyTexts[locale];
  const sections: string[] = [];

  // 问题描述
  sections.push(`## ${localeTexts.description}
${formData.description}`);

  // 环境信息
  const envItems = [`${localeTexts.libraryVersion}: \`${formData.version}\``];
  if (formData.componentName) {
    envItems.push(`${localeTexts.component}: ${formData.componentName}`);
  }
  sections.push(`## ${localeTexts.environment}
${envItems.map(item => `- ${item}`).join('\n')}`);

  // 复现步骤
  sections.push(`## ${localeTexts.reproductionSteps}
${formData.reproductionSteps}`);

  // 期望行为
  sections.push(`## ${localeTexts.expectedBehavior}
${formData.expectedBehavior}`);

  // 实际行为
  sections.push(`## ${localeTexts.actualBehavior}
${formData.actualBehavior}`);

  // 复现链接（如果有）
  if (formData.reproductionLink) {
    sections.push(`## ${localeTexts.reproductionLink}
${formData.reproductionLink}`);
  }

  return sections.join('\n\n');
}
