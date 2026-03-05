import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CHANGELOG_TYPE_CONFIG,
  COMPONENT_SCOPES
} from '../.vitepress/config/changelog-types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..', '..');

const CHANGELOG_PATH = path.join(rootDir, 'packages', 'core', 'CHANGELOG.md');
const OUTPUT_PATH = path.join(
  rootDir,
  'apps',
  'docs',
  '.vitepress',
  'data',
  'changelog.json'
);
const COMPONENTS_DIR = path.join(
  rootDir,
  'packages',
  'core',
  'src',
  'components'
);

const EMOJI_TO_TYPE_MAP: Record<string, string> = {};
for (const [changelogType, config] of Object.entries(CHANGELOG_TYPE_CONFIG)) {
  EMOJI_TO_TYPE_MAP[config.emoji] = changelogType;
}

function getKnownComponents() {
  if (!fs.existsSync(COMPONENTS_DIR)) return [];
  return fs.readdirSync(COMPONENTS_DIR).filter(file => {
    return (
      fs.statSync(path.join(COMPONENTS_DIR, file)).isDirectory() &&
      !['utils', 'index.ts', 'node_modules'].includes(file)
    );
  });
}

const KNOWN_COMPONENTS = getKnownComponents();
KNOWN_COMPONENTS.push(
  ...COMPONENT_SCOPES.filter(c => !KNOWN_COMPONENTS.includes(c))
);

interface ChangeItem {
  type: string;
  content: string;
  emoji?: string;
  issues?: string[];
  pr?: string;
  author?: string;
}

interface VersionEntry {
  version: string;
  date: string;
  changes: ChangeItem[];
}

type ComponentChangelog = Record<string, VersionEntry[]>;

function normalizeComponentName(rawName: string): string | null {
  if (!rawName) return null;
  if (KNOWN_COMPONENTS.includes(rawName)) return rawName;

  const sortedComponents = [...KNOWN_COMPONENTS].sort(
    (a, b) => b.length - a.length
  );

  for (const comp of sortedComponents) {
    if (rawName.includes(comp)) return comp;
  }

  return null;
}

function extractComponent(text: string): {
  name: string | null;
  cleanText: string;
  rawName: string | null;
} {
  let name: string | null = null;
  let rawName: string | null = null;
  let cleanText = text;

  let match = text.match(/^\[([^\]]+)\]\s*(.*)/);
  if (match) {
    name = match[1];
    rawName = match[1];
    cleanText = match[2];
  } else {
    match = text.match(/^\*\*([^*]+)\*\*\s*(.*)/);
    if (match) {
      name = match[1];
      rawName = match[1];
      cleanText = match[2];
    } else {
      match = text.match(/^`([^`]+)`\s*(.*)/);
      if (match) {
        name = match[1];
        rawName = match[1];
        cleanText = match[2];
      }
    }
  }

  if (name) {
    const normalized = normalizeComponentName(name);
    if (normalized) {
      name = normalized;
    } else {
      const looseMatch = normalizeComponentName(name);
      if (looseMatch) name = looseMatch;
      else name = null;
    }
  }

  return { name, cleanText, rawName };
}

function extractIssues(text: string): { issues: string[]; cleanText: string } {
  const issues: string[] = [];
  let cleanText = text;

  const issueLinkRegex = /\*\*\[issue\s*#(\d+)\]\([^)]+\)\*\*/gi;
  let match = issueLinkRegex.exec(text);
  while (match !== null) {
    issues.push(match[1]);
    match = issueLinkRegex.exec(text);
  }
  if (issues.length > 0) {
    cleanText = cleanText.replace(issueLinkRegex, '').trim();
  }

  const plainIssueRegex = /#(\d+)/g;
  match = plainIssueRegex.exec(text);
  while (match !== null) {
    if (!issues.includes(match[1])) {
      issues.push(match[1]);
    }
    match = plainIssueRegex.exec(text);
  }

  const closesRegex = /(?:closes|fixes|resolves)\s*#(\d+)/gi;
  match = closesRegex.exec(text);
  while (match !== null) {
    if (!issues.includes(match[1])) {
      issues.push(match[1]);
    }
    match = closesRegex.exec(text);
  }

  return { issues, cleanText };
}

function parseMetadata(text: string): {
  text: string;
  pr?: string;
  author?: string;
  issues?: string[];
} {
  let pr: string | undefined;
  let author: string | undefined;
  let cleanText = text;

  const { issues, cleanText: textAfterIssues } = extractIssues(cleanText);
  cleanText = textAfterIssues;

  const prMatch = text.match(/\(#(\d+)\)/);
  if (prMatch) {
    pr = prMatch[1];
    cleanText = cleanText.replace(prMatch[0], '').trim();
  } else {
    const linkMatch = text.match(/\[#(\d+)\]\([^)]+\)/);
    if (linkMatch) {
      pr = linkMatch[1];
    }
  }

  const authorMatch = text.match(/@([a-z0-9-]+)/i);
  if (authorMatch) {
    author = authorMatch[1];
    cleanText = cleanText.replace(authorMatch[0], '').trim();
    cleanText = cleanText.replace(/\s+by\s*$/, '');
  }

  return {
    text: cleanText,
    pr,
    author,
    issues: issues.length > 0 ? issues : undefined
  };
}

function detectTypeFromHeader(headerText: string): string {
  const lowerText = headerText.toLowerCase();

  for (const [emoji, changelogType] of Object.entries(EMOJI_TO_TYPE_MAP)) {
    if (headerText.includes(emoji)) {
      return changelogType;
    }
  }

  if (lowerText.includes('fix') || lowerText.includes('修复')) return 'fix';
  if (lowerText.includes('feat') || lowerText.includes('新增'))
    return 'feature';
  if (lowerText.includes('break') || lowerText.includes('破坏'))
    return 'breaking';
  if (lowerText.includes('docs') || lowerText.includes('文档')) return 'docs';
  if (
    lowerText.includes('improve') ||
    lowerText.includes('改进') ||
    lowerText.includes('优化')
  ) {
    return 'refactor';
  }
  if (lowerText.includes('perf') || lowerText.includes('性能')) return 'perf';
  if (lowerText.includes('style') || lowerText.includes('样式')) return 'style';
  if (lowerText.includes('test') || lowerText.includes('测试')) return 'test';
  if (lowerText.includes('build') || lowerText.includes('构建')) return 'build';
  if (lowerText.includes('ci')) return 'ci';
  if (lowerText.includes('chore') || lowerText.includes('杂项')) return 'chore';
  if (lowerText.includes('revert') || lowerText.includes('回退'))
    return 'revert';
  if (lowerText.includes('theme') || lowerText.includes('主题')) return 'style';

  return 'chore';
}

function getTypeEmoji(type: string): string {
  return (
    CHANGELOG_TYPE_CONFIG[type]?.emoji || CHANGELOG_TYPE_CONFIG.chore.emoji
  );
}

function parseMarkdown(content: string, isLegacy: boolean): ComponentChangelog {
  const result: ComponentChangelog = {};

  if (!content) return result;

  const lines = content.split('\n');
  let currentVersion = '';
  let currentDate = '';
  let currentType = 'chore';
  let lastComponent: string | null = null;
  let lastChange: ChangeItem | null = null;

  const versionRegex =
    /^##\s+\[?v?([\w.-]+)\]?\s*(?:-|\()\s*(\d{4}-\d{2}-\d{2})/;
  const versionCounter: Record<string, number> = {};

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmedLine = rawLine.trim();

    const vMatch = trimmedLine.match(versionRegex);
    if (vMatch) {
      const baseVersion = vMatch[1];
      const date = vMatch[2];
      versionCounter[baseVersion] = (versionCounter[baseVersion] || 0) + 1;
      if (versionCounter[baseVersion] > 1) {
        currentVersion = `${baseVersion}-${date}`;
      } else {
        currentVersion = baseVersion;
      }
      currentDate = date;
      lastComponent = null;
      lastChange = null;
      continue;
    }

    if (trimmedLine.startsWith('### ')) {
      const typeText = trimmedLine.replace('### ', '');
      currentType = detectTypeFromHeader(typeText);
      lastComponent = null;
      lastChange = null;
      continue;
    }

    const leadingSpaces = rawLine.match(/^(\s*)/)?.[1]?.length || 0;
    const isTopLevelList = trimmedLine.startsWith('- ') && leadingSpaces < 2;
    const isSubLevelList = trimmedLine.startsWith('- ') && leadingSpaces >= 2;
    const isContinuation =
      !trimmedLine.startsWith('- ') &&
      !trimmedLine.startsWith('#') &&
      trimmedLine.length > 0 &&
      lastComponent &&
      lastChange;

    if (isContinuation) {
      lastChange.content += `\n${trimmedLine}`;
      continue;
    }

    if (isSubLevelList && lastComponent && lastChange) {
      const contentText = trimmedLine.substring(2).trim();
      lastChange.content += `\n- ${contentText}`;
      continue;
    }

    if (isTopLevelList) {
      const contentText = trimmedLine.substring(2).trim();

      const { name, cleanText, rawName } = extractComponent(contentText);

      let componentName = name;
      let finalContent = cleanText.replace(/^[:：]\s*/, '').trim();

      if (!componentName) {
        const patterns = [
          /(?:新增|上新)\s+\*\*`?([a-zA-Z0-9]+)`?\*\*\s*(组件|hooks?|指令)/,
          /(?:新增|上新)\s+`?([a-zA-Z0-9]+)`?\s*(组件|hooks?|指令)/,
          /完善\s+`([a-z0-9]+)`/i,
          /修复\s+\*\*`?([a-z0-9]+)`?\*\*\s*/i,
          /修复\s+`?([a-z0-9]+)`?\s*/i,
          /`([a-z0-9]+)`\s*(组件|输入框组件|气泡组件|气泡列表组件)/i,
          /\*\*`?([a-z0-9]+)`?\*\*\s*(组件|输入框组件|气泡组件|气泡列表组件)/i,
          /^`([a-z0-9]+)`\s*(?:(组件)\s*)?[：:]/i,
          /^\*\*`?([a-z0-9]+)`?\*\*\s*(?:(组件)\s*)?[：:]/i,
          /^`([a-z0-9]+)`\s*$/i
        ];

        for (const pattern of patterns) {
          const match = contentText.match(pattern);
          if (match) {
            const normalized = normalizeComponentName(match[1]);
            if (normalized) {
              componentName = normalized;
              break;
            }
          }
        }
      }

      if (!componentName && isLegacy) {
        const generalPatterns = [
          { pattern: /types\s*(?:\S.*)?TS类型/, name: 'Types' },
          { pattern: /自动引入/, name: 'AutoImport' },
          { pattern: /主题|theme/i, name: 'ConfigProvider' },
          {
            pattern:
              /开发文档|文档更新|指南文档|在线预览|playground|中.*英文文档/,
            name: 'Docs'
          },
          { pattern: /ESLint|Oxlint|打包配置/, name: 'Build' },
          {
            pattern: /useRecord|useXStream|useSend|XRequest|钩子函数|hooks/i,
            name: 'Hooks'
          },
          { pattern: /迁移指南/, name: 'Migration' },
          { pattern: /Thinking.*思考中/, name: 'Thinking' },
          { pattern: /ThoughtChain.*思维链/, name: 'ThoughtChain' },
          { pattern: /Welcom.*欢迎组件/, name: 'Welcome' },
          {
            pattern: /Typography.*打字器|Typography.*打字/,
            name: 'Typography'
          },
          { pattern: /Mermaid|mdPlugins|prismjs|代码高亮/, name: 'Typewriter' },
          { pattern: /storybook/i, name: 'Docs' }
        ];

        for (const { pattern, name } of generalPatterns) {
          if (pattern.test(contentText)) {
            componentName = name;
            break;
          }
        }
      }

      if (!componentName) {
        const slashMatch = contentText.match(
          /\*\*`?([a-z0-9]+)`?\s*\/\s*`?([a-z0-9]+)`?\*\*\s*(组件)?/i
        );
        if (slashMatch) {
          const normalized1 = normalizeComponentName(slashMatch[1]);
          if (normalized1) componentName = normalized1;
        }
      }

      if (componentName) {
        if (!finalContent || finalContent === '：' || finalContent === ':') {
          finalContent = rawName || contentText;
        }

        const { text, pr, author, issues } = parseMetadata(finalContent);

        if (!result[componentName]) result[componentName] = [];

        let versionEntry = result[componentName].find(
          v => v.version === currentVersion
        );
        if (!versionEntry) {
          versionEntry = {
            version: currentVersion,
            date: currentDate,
            changes: []
          };
          result[componentName].push(versionEntry);
        }

        const emoji = getTypeEmoji(currentType);

        lastChange = {
          type: currentType,
          content: text,
          emoji,
          issues,
          pr,
          author
        };
        versionEntry.changes.push(lastChange);
        lastComponent = componentName;
      } else {
        lastComponent = null;
        lastChange = null;
      }
    }
  }

  return result;
}

const AUTO_CHANGELOG_PATH = path.join(
  rootDir,
  'apps',
  'docs',
  '.vitepress',
  'data',
  'auto-changelog.json'
);

const LEGACY_CHANGELOG_ZH_PATH = path.join(
  rootDir,
  'apps',
  'docs',
  '.vitepress',
  'data',
  'legacy-changelog-zh.json'
);

const LEGACY_CHANGELOG_EN_PATH = path.join(
  rootDir,
  'apps',
  'docs',
  '.vitepress',
  'data',
  'legacy-changelog-en.json'
);

interface AutoChangelogData {
  generatedAt: string;
  sources: {
    changesets: boolean;
    gitCommits: number;
    githubPRs: number;
  };
  components: ComponentChangelog;
}

function mergeChangelogs(
  target: ComponentChangelog,
  source: ComponentChangelog
) {
  for (const [component, versions] of Object.entries(source)) {
    if (!target[component]) {
      target[component] = versions;
    } else {
      for (const ver of versions) {
        const existingVer = target[component].find(
          v => v.version === ver.version
        );
        if (!existingVer) {
          target[component].push(ver);
        } else {
          for (const change of ver.changes) {
            const exists = existingVer.changes.some(
              c => c.content === change.content
            );
            if (!exists) {
              existingVer.changes.push(change);
            }
          }
        }
      }
    }
  }
}

function main() {
  console.log('🔄 Generating component changelogs...');

  let changesetData: ComponentChangelog = {};
  let autoData: ComponentChangelog = {};
  let legacyDataZh: ComponentChangelog = {};
  let legacyDataEn: ComponentChangelog = {};

  if (fs.existsSync(CHANGELOG_PATH)) {
    console.log('  Reading changeset log (CHANGELOG.md)...');
    changesetData = parseMarkdown(
      fs.readFileSync(CHANGELOG_PATH, 'utf-8'),
      false
    );
  }

  if (fs.existsSync(AUTO_CHANGELOG_PATH)) {
    console.log('  Reading auto-generated log (auto-changelog.json)...');
    try {
      const autoChangelog: AutoChangelogData = JSON.parse(
        fs.readFileSync(AUTO_CHANGELOG_PATH, 'utf-8')
      );
      autoData = autoChangelog.components || {};
      console.log(
        `    Sources: changesets=${autoChangelog.sources?.changesets || false}, commits=${autoChangelog.sources?.gitCommits || 0}, PRs=${autoChangelog.sources?.githubPRs || 0}`
      );
    } catch (e) {
      console.warn('    Failed to parse auto-changelog.json:', e);
    }
  }

  if (fs.existsSync(LEGACY_CHANGELOG_ZH_PATH)) {
    console.log('  Reading legacy changelog (legacy-changelog-zh.json)...');
    try {
      legacyDataZh = JSON.parse(
        fs.readFileSync(LEGACY_CHANGELOG_ZH_PATH, 'utf-8')
      );
    } catch (e) {
      console.warn('    Failed to parse legacy-changelog-zh.json:', e);
    }
  }

  if (fs.existsSync(LEGACY_CHANGELOG_EN_PATH)) {
    console.log('  Reading legacy changelog (legacy-changelog-en.json)...');
    try {
      legacyDataEn = JSON.parse(
        fs.readFileSync(LEGACY_CHANGELOG_EN_PATH, 'utf-8')
      );
    } catch (e) {
      console.warn('    Failed to parse legacy-changelog-en.json:', e);
    }
  }

  const finalData: ComponentChangelog = {};

  mergeChangelogs(finalData, legacyDataZh);
  mergeChangelogs(finalData, legacyDataEn);
  mergeChangelogs(finalData, autoData);
  mergeChangelogs(finalData, changesetData);

  for (const comp in finalData) {
    finalData[comp].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (const version of finalData[comp]) {
      const typeOrder: Record<string, number> = {
        breaking: 1,
        feature: 2,
        fix: 3,
        refactor: 4,
        perf: 5,
        docs: 6,
        test: 7,
        build: 8,
        ci: 9,
        chore: 10
      };
      version.changes.sort((a, b) => {
        return (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99);
      });
    }
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(finalData, null, 2));

  const componentCount = Object.keys(finalData).length;
  const versionCount = new Set(
    Object.values(finalData)
      .flat()
      .map(v => v.version)
  ).size;
  const changeCount = Object.values(finalData).reduce(
    (sum, versions) => sum + versions.reduce((s, v) => s + v.changes.length, 0),
    0
  );

  console.log(`✅ Generated changelog.json at ${OUTPUT_PATH}`);
  console.log(
    `📊 Summary: ${componentCount} components, ${versionCount} versions, ${changeCount} changes`
  );
}

main();
