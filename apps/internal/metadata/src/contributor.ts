import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const owner = 'element-plus-x' ;
const repo = 'Element-Plus-X';
const githubToken = ''; // 推荐设置token防止被限流


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const componentsDir = path.resolve(__dirname, '../../../../packages/core/src/components');
const hooksDir = path.resolve(__dirname, '../../../../packages/core/src/hooks');
const componentNames = fs.readdirSync(componentsDir).filter(name =>
  fs.statSync(path.join(componentsDir, name)).isDirectory()
);
const hooksNames = fs.readdirSync(hooksDir).filter(name =>
  fs.statSync(path.join(hooksDir, name))
).map(name => name.replace('.ts', '')).filter(name => name !== 'index');


interface Contributor {
  login: string;
  avatar: string;
}

const getCommits = async (subPath: string): Promise<Contributor[]> => {
  let page = 1;
  const contributors: Contributor[] = [];
  while (true) {
    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(subPath)}&per_page=100&page=${page}`
      const res = await fetch(url, {
        headers: githubToken ? { Authorization: `Bearer ${githubToken}` } : {}
    })
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    contributors.push(
      ...data
        .map((c: any) => c.author && c.author.login && {
          login: c.author.login, // 贡献者name
          avatar: c.author.avatar_url, // 贡献者头像
          homeUrl: c.author.html_url // 贡献者主页
        })
        .filter(Boolean)
    );
    page++;
    } catch (error) {
      break;
    }
  }
  return contributors;
}

const transformName = (name: string) => { 
  // 首字母小写，如果遇到类似XMarkdown则前边的X和首字母都小写，且X后边的第一个单词的首字母也要小写
  // 例如：XMarkdown -> xMarkdown -> xmarkdown，XFooBar -> xFooBar -> xfooBar
  let transformName = name.replace(/-/g, '');
  if (/^X[A-Z]/.test(transformName)) {
    // 以X开头且第二个字母大写
    transformName = 'x' + transformName.slice(1);
    // X后边的第一个单词的首字母也要小写
    if (transformName.length > 1) {
      transformName = transformName[0] + transformName[1].toLowerCase() + transformName.slice(2);
    }
  } else {
    transformName = transformName.charAt(0).toLowerCase() + transformName.slice(1);
  }
  return transformName;
}

const getComponentContributors = async (component: string): Promise<Contributor[]> => {
  const componentName = transformName(component);
  const paths = [
    `packages/core/src/components/${component}`,
    `apps/docs/en/components/${componentName}`,
    `apps/docs/zh/components/${componentName}`,
  ]
  
  const allContributors: Contributor[] = [];
  for (const p of paths) {
    const contributors = await getCommits(p);
    allContributors.push(...contributors);
  }
  // 去重（按 login）
  const unique: Record<string, Contributor> = {}
  allContributors.forEach(c => {
    if (c && c.login) unique[c.login] = c;
  })
  return Object.values(unique);
}
const getHookContributors = async (hook: string): Promise<Contributor[]> => {
    const hookName = transformName(hook);
    const paths = [
        `packages/core/src/hooks/${hook}.ts`,
        `apps/docs/en/components/${hookName}`,
        `apps/docs/zh/components/${hookName}`,
  ]
  const allContributors: Contributor[] = [];
  for (const p of paths) {
    const contributors = await getCommits(p);
    allContributors.push(...contributors);
  }
  // 去重（按 login）
  const unique: Record<string, Contributor> = {};
  allContributors.forEach(c => {
    if (c && c.login) unique[c.login] = c;
  })
  return Object.values(unique);
}

const main = async () => {
  const result: Record<string, Contributor[]> = {};
  for (const component of componentNames) {
    try {
      console.log(`正在获取 ${component} 的贡献者...`);
      result[component.toLowerCase()] = await getComponentContributors(component);
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
  
  // 创建文件夹
  const distDir = path.resolve(__dirname, '../dist')
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  // 写入文件
  fs.writeFileSync(
    path.resolve(distDir, 'component-contributors.json'),
    JSON.stringify(result, null, 2)
  )
  console.log('生成成功')
}

main();
