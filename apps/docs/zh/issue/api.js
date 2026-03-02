const warehouseName = 'element-plus-x/Element-Plus-X';
const githubToken = import.meta.env.VITE_GITHUB_TOKEN || '';

console.log('githubToken:', githubToken);

// 获取最新版本信息
export async function getLatestVersion() {
  const headers = {
    'X-GitHub-Api-Version': '2022-11-28',
    'accept': 'application/json'
  };

  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`;
  }

  const response = await fetch(`https://api.github.com/repos/${warehouseName}/tags`, {
    headers
  });
  return await response.json();
}

export async function getRepoContent(path) {
  const headers = {
    'X-GitHub-Api-Version': '2022-11-28',
    'accept': 'application/json'
  };

  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`;
  }

  const response = await fetch(`https://api.github.com/repos/${warehouseName}/contents/${path}`, {
    headers
  });
  console.log('获取仓库内容响应:', response);
  return await response.json();
}

// Generate issue markdown template
export function generateIssueMarkdown(issueData = {
  title: '',
  bugType: '',
  vueVersion: '',
  elementPlusVersion: '',
  browserOS: '',
  buildTool: '',
  relatedComponents: [],
  reproductionLink: '',
  reproductionType: 'link',
  stepsToReproduce: '',
  expectedBehavior: '',
  actualBehavior: '',
  additionalComments: ''
}) {
  const reproductionContent = issueData.reproductionType === 'code'
    ? `\n\`\`\`vue\n${issueData.reproductionLink || ''}\n\`\`\``
    : issueData.reproductionLink || '_(empty)_';

  return `Bug Type: **\`${issueData.bugType || 'Style'}\`**
            
## Environment
* Vue Version: \`${issueData.vueVersion || ''}\`
* Element-Plus-X Version: \`${issueData.elementPlusVersion || ''}\`
* Browser / OS: \`${issueData.browserOS || ''}\`
* Build Tool: \`${issueData.buildTool || ''}\`

## Reproduction
### Related Component
* \`${issueData.relatedComponents?.join('`\n* `') || 'el-date-picker'}\`

### Reproduction Link
${reproductionContent}
### Steps to reproduce
${issueData.stepsToReproduce || ''}

### What is Expected?
${issueData.expectedBehavior || ''}

### What is actually happening?
${issueData.actualBehavior || ''}

### Additional comments
${issueData.additionalComments || '_(empty)_'}
            `;
}

// 创建新的 Issue
export async function createIssues(issueData = {
  title: '',
  bugType: '',
  vueVersion: '',
  elementPlusVersion: '',
  browserOS: '',
  buildTool: '',
  relatedComponents: [],
  reproductionLink: '',
  reproductionType: 'link',
  stepsToReproduce: '',
  expectedBehavior: '',
  actualBehavior: '',
  additionalComments: ''
}) {
  const headers = {
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json'
  };

  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`;
  }

  const response = await fetch(`https://api.github.com/repos/${warehouseName}/issues`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title: issueData.title,
      body: generateIssueMarkdown(issueData)
    })
  });
  console.log('Create issue response:', response);
  return await response.json();
}
