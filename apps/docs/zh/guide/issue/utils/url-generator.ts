import type { IssueForm } from '../types';

/**
 * 生成 GitHub Issue URL
 * 使用预填充方式，而不是直接调用 API，避免暴露 Token
 */
export function generateGitHubIssueUrl(formData: IssueForm): string {
  const baseUrl = 'https://github.com/element-plus-x/Element-Plus-X/issues/new';
  const params = new URLSearchParams();

  // 设置标题格式：[bug] 具体标题
  params.set('title', `[${formData.category}] ${formData.title}`);

  // 设置 Issue Body（Markdown 格式）
  params.set('body', generateIssueBody(formData));

  // 如果有相关组件，设置标签
  if (formData.componentName) {
    params.set('labels', formData.componentName);
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * 生成 Issue Body 内容
 */
export function generateIssueBody(formData: IssueForm): string {
  const sections: string[] = [];

  // 问题描述
  sections.push(`## 问题描述
${formData.description}`);

  // 环境信息
  sections.push(`## 环境信息
- 组件库版本: \`${formData.version}\`
- 组件名称: ${formData.componentName || 'N/A'}
- 运行环境: ${formData.environment || 'N/A'}`);

  // 复现步骤
  sections.push(`## 复现步骤
${formData.reproductionSteps}`);

  // 期望行为
  sections.push(`## 期望行为
${formData.expectedBehavior}`);

  // 实际行为
  sections.push(`## 实际行为
${formData.actualBehavior}`);

  // 复现链接（如果有）
  if (formData.reproductionLink) {
    sections.push(`## 复现链接
${formData.reproductionLink}`);
  }

  return sections.join('\n\n');
}
