import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const owner = process.env.ELX_GITHUB_OWNER || 'element-plus-x';
const repo = process.env.ELX_GITHUB_REPO || 'Element-Plus-X';
const githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || ''; // 推荐设置token防止被限流

const githubHeaders: Record<string, string> = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'element-plus-x-metadata'
};
if (githubToken) githubHeaders.Authorization = `Bearer ${githubToken}`;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const componentsDir = path.resolve(
  __dirname,
  '../../../../packages/core/src/components'
);
const hooksDir = path.resolve(__dirname, '../../../../packages/core/src/hooks');
const componentNames = fs
  .readdirSync(componentsDir)
  .filter(name => fs.statSync(path.join(componentsDir, name)).isDirectory());
const hooksNames = fs
  .readdirSync(hooksDir)
  .filter(name => fs.statSync(path.join(hooksDir, name)))
  .map(name => name.replace('.ts', ''))
  .filter(name => name !== 'index');

interface CommitContributor {
  login: string; // 贡献者name
  avatar_url: string; // 贡献者头像
  html_url: string; // 贡献者主页
}

interface RepoContributor {
  login: string; // 贡献者name
  avatar_url: string; // 贡献者头像
  html_url: string; // 贡献者主页
  contributions: number; // 贡献者贡献数
}

// 获取整个仓库贡献者
async function getRepoContributors(): Promise<RepoContributor[]> {
  let page = 1;
  const contributors: RepoContributor[] = [];

  while (true) {
    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100&page=${page}`;
      const res = await fetch(url, {
        headers: githubHeaders
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          `GitHub API 请求失败: ${res.status} ${res.statusText} ${JSON.stringify(
            data
          )}`
        );
      }
      if (!Array.isArray(data) || data.length === 0) break;
      contributors.push(
        ...data.map((c: any) => ({
          login: c.login,
          avatar_url: c.avatar_url,
          html_url: c.html_url,
          contributions: c.contributions
        }))
      );
      page++;
    } catch (error) {
      console.error(error);
      break;
    }
  }
  return contributors;
}

async function getCommits(subPath: string): Promise<CommitContributor[]> {
  let page = 1;
  const contributors: CommitContributor[] = [];
  while (true) {
    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(subPath)}&per_page=100&page=${page}`;
      const res = await fetch(url, {
        headers: githubHeaders
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          `GitHub API 请求失败: ${res.status} ${res.statusText} ${JSON.stringify(
            data
          )}`
        );
      }
      if (!Array.isArray(data) || data.length === 0) break;
      contributors.push(
        ...data
          .map(
            (c: any) =>
              c.author &&
              c.author.login && {
                login: c.author.login, // 贡献者name
                avatar_url: c.author.avatar_url, // 贡献者头像
                html_url: c.author.html_url // 贡献者主页
              }
          )
          .filter(Boolean)
      );
      page++;
    } catch (error) {
      console.error(error);
      break;
    }
  }
  return contributors;
}

function transformName(name: string) {
  // 首字母小写，如果遇到类似XMarkdown则前边的X和首字母都小写，且X后边的第一个单词的首字母也要小写
  // 例如：XMarkdown -> xMarkdown -> xmarkdown，XFooBar -> xFooBar -> xfooBar
  let transformName = name.replace(/-/g, '');
  if (/^X[A-Z]/.test(transformName)) {
    // 以X开头且第二个字母大写
    transformName = `x${transformName.slice(1)}`;
    // X后边的第一个单词的首字母也要小写
    if (transformName.length > 1) {
      transformName =
        transformName[0] +
        transformName[1].toLowerCase() +
        transformName.slice(2);
    }
  } else {
    transformName =
      transformName.charAt(0).toLowerCase() + transformName.slice(1);
  }
  return transformName;
}

async function getComponentContributors(
  component: string
): Promise<CommitContributor[]> {
  const componentName = transformName(component);
  const paths = [
    `packages/core/src/components/${component}`,
    `apps/docs/en/components/${componentName}`,
    `apps/docs/zh/components/${componentName}`
  ];

  const allContributors: CommitContributor[] = [];
  for (const p of paths) {
    const contributors = await getCommits(p);
    allContributors.push(...contributors);
  }
  // 去重（按 login）
  const unique: Record<string, CommitContributor> = {};
  allContributors.forEach(c => {
    if (c && c.login) unique[c.login] = c;
  });
  return Object.values(unique);
}
async function getHookContributors(hook: string): Promise<CommitContributor[]> {
  const hookName = transformName(hook);
  const paths = [
    `packages/core/src/hooks/${hook}.ts`,
    `apps/docs/en/components/${hookName}`,
    `apps/docs/zh/components/${hookName}`
  ];
  const allContributors: CommitContributor[] = [];
  for (const p of paths) {
    const contributors = await getCommits(p);
    allContributors.push(...contributors);
  }
  // 去重（按 login）
  const unique: Record<string, CommitContributor> = {};
  allContributors.forEach(c => {
    if (c && c.login) unique[c.login] = c;
  });
  return Object.values(unique);
}

async function main() {
  const result: Record<string, any[]> = {};
  for (const component of componentNames) {
    try {
      console.log(`正在获取 ${component} 的贡献者...`);
      result[component.toLowerCase()] =
        await getComponentContributors(component);
      console.log(`${component} 贡献者:`, result[component.toLowerCase()]);
    } catch (error) {
      console.error(`获取 ${component} 的贡献者失败:`, error);
      result[component.toLowerCase()] = [];
    }
  }
  for (const hook of hooksNames) {
    try {
      console.log(`正在获取 ${hook} 的贡献者...`);
      result[hook.toLowerCase()] = await getHookContributors(hook);
      console.log(`${hook} 贡献者:`, result[hook.toLowerCase()]);
    } catch (error) {
      console.error(`获取 ${hook} 的贡献者失败:`, error);
      result[hook.toLowerCase()] = [];
    }
  }
  // 获取整个仓库贡献者
  try {
    console.log(`正在获取 ${repo}仓库 贡献者...`);
    const repoContributors = await getRepoContributors();
    result[repo] = repoContributors;
    console.log(`${repo}仓库 贡献者:`, result[repo]);
  } catch (error) {
    console.error(`获取 ${repo}仓库 的贡献者失败:`, error);
    result[repo] = [];
  }

  // 创建文件夹
  const distDir = path.resolve(__dirname, '../dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  // 写入文件
  fs.writeFileSync(
    path.resolve(distDir, 'component-contributors.json'),
    JSON.stringify(result, null, 2)
  );
  console.log('生成成功');
}

main();
