import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..', '..');
const docsThemePath = path.join(
  rootDir,
  'apps',
  'docs',
  '.vitepress',
  'theme',
  'index.ts'
);

interface BadgeConfig {
  type: 'beta' | 'new' | 'updated' | 'deprecated' | 'experimental';
  text?: string;
}

function getLastTag(): string | null {
  try {
    const tags = execSync('git tag --sort=-creatordate', { encoding: 'utf-8' })
      .trim()
      .split('\n');
    return tags.length > 0 ? tags[0] : null;
  } catch {
    return null;
  }
}

function getChangedComponentsSinceTag(tag: string | null): Set<string> {
  try {
    const cmd = tag
      ? `git diff --name-only ${tag}..HEAD -- "packages/core/src/components/*"`
      : `git ls-files "packages/core/src/components/*"`;

    const output = execSync(cmd, { encoding: 'utf-8' }).trim();
    if (!output) return new Set();

    const components = new Set<string>();
    output.split('\n').forEach(file => {
      const match = file.match(/packages\/core\/src\/components\/([^/]+)/);
      if (match) {
        components.add(match[1]);
      }
    });

    return components;
  } catch {
    return new Set();
  }
}

function getCurrentVersion(): string {
  const packageJsonPath = path.join(
    rootDir,
    'packages',
    'core',
    'package.json'
  );
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  return packageJson.version;
}

function componentToPath(componentName: string): string {
  const pathMap: Record<string, string> = {
    Attachments: 'attachments',
    Bubble: 'bubble',
    BubbleList: 'bubbleList',
    ConfigProvider: 'configProvider',
    Conversations: 'conversations',
    FilesCard: 'filesCard',
    Prompts: 'prompts',
    Thinking: 'thinking',
    ThoughtChain: 'thoughtChain',
    Welcome: 'welcome',
    XSender: 'xsender',
    XMarkdown: 'xMarkdown'
  };

  return pathMap[componentName] || componentName.toLowerCase();
}

function updateThemeIndex(badges: Map<string, BadgeConfig>) {
  let content = fs.readFileSync(docsThemePath, 'utf-8');

  const badgesObj: Record<string, BadgeConfig> = {};
  badges.forEach((config, component) => {
    const basePath = componentToPath(component);
    badgesObj[`/zh/components/${basePath}/`] = config;
    badgesObj[`/en/components/${basePath}/`] = config;
  });

  const badgesStr = JSON.stringify(badgesObj, null, 2)
    .split('\n')
    .map(line => `  ${line}`)
    .join('\n')
    .trim();

  const badgesRegex =
    /const componentBadges: Record<string, BadgeConfig> = \{[\s\S]*?\};/;

  if (badgesRegex.test(content)) {
    content = content.replace(
      badgesRegex,
      `const componentBadges: Record<string, BadgeConfig> = {\n${badgesStr}\n};`
    );

    fs.writeFileSync(docsThemePath, content, 'utf-8');
    console.log('✅ 已更新侧边栏徽标配置');
  }
}

function main() {
  console.log('🔍 扫描组件变更...');

  const lastTag = getLastTag();
  const changedComponents = getChangedComponentsSinceTag(lastTag);
  const version = getCurrentVersion();

  if (changedComponents.size === 0) {
    console.log('📝 未检测到组件变更');
    return;
  }

  console.log(`📦 检测到 ${changedComponents.size} 个组件:`);

  const badges = new Map<string, BadgeConfig>();

  for (const component of changedComponents) {
    console.log(`  - ${component}`);
    badges.set(component, {
      type: 'new',
      text: `${version.split('.')[0]}.${version.split('.')[1]}`
    });
  }

  updateThemeIndex(badges);

  console.log('\n✨ 扫描完成!');
}

main();
