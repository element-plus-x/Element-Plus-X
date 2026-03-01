import type { ParsedCommit } from './git-commit-parser';
import type { PullRequestInfo } from './github-api-client';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import {
  CHANGELOG_TYPE_CONFIG,
  COMMIT_TO_CHANGELOG_MAP,
  COMPONENT_SCOPES
} from '../.vitepress/config/changelog-types';
import {
  getTags,
  groupCommitsByVersion,
  normalizeScope
} from './git-commit-parser';
import { fetchAllPRs } from './github-api-client';

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
  'auto-changelog.json'
);

interface ChangeItem {
  type: string;
  content: string;
  emoji?: string;
  issues?: string[];
  pr?: string;
  author?: string;
  hash?: string;
  source: 'changeset' | 'commit' | 'pr';
}

interface VersionEntry {
  version: string;
  date: string;
  changes: ChangeItem[];
}

type ComponentChangelog = Record<string, VersionEntry[]>;

interface ChangesetChange {
  type: string;
  content: string;
  pr?: string;
  author?: string;
}

interface ChangesetVersion {
  version: string;
  date: string;
  changes: ChangesetChange[];
}

function parseChangesetChangelog(content: string): ChangesetVersion[] {
  if (!content || !fs.existsSync(CHANGELOG_PATH)) {
    return [];
  }

  const versions: ChangesetVersion[] = [];
  const lines = content.split('\n');
  let currentVersion: ChangesetVersion | null = null;

  const versionRegex =
    /^##\s+(\d+\.\d+\.\d+(?:-[a-z0-9.]+)?)\s*(?:\((\d{4}-\d{2}-\d{2})\))?/i;

  for (const line of lines) {
    const vMatch = line.match(versionRegex);
    if (vMatch) {
      if (currentVersion) {
        versions.push(currentVersion);
      }
      currentVersion = {
        version: vMatch[1],
        date: vMatch[2] || '',
        changes: []
      };
      continue;
    }

    if (!currentVersion) continue;

    if (line.startsWith('### ')) {
      continue;
    }

    if (line.startsWith('- ')) {
      const changeText = line.substring(2).trim();

      let type = 'chore';
      for (const [changelogType, config] of Object.entries(
        CHANGELOG_TYPE_CONFIG
      )) {
        if (
          config.commitTypes.some(ct => changeText.toLowerCase().includes(ct))
        ) {
          type = changelogType;
          break;
        }
      }

      const prMatch = changeText.match(/\(#(\d+)\)/);
      const authorMatch = changeText.match(/by\s+@([\w-]+)/);

      const cleanContent = changeText
        .replace(/\(#\d+\)/, '')
        .replace(/by\s+@[\w-]+/, '')
        .replace(/\s+/g, ' ')
        .trim();

      currentVersion.changes.push({
        type,
        content: cleanContent,
        pr: prMatch ? prMatch[1] : undefined,
        author: authorMatch ? authorMatch[1] : undefined
      });
    }
  }

  if (currentVersion) {
    versions.push(currentVersion);
  }

  return versions;
}

function getTypeEmoji(type: string): string {
  return (
    CHANGELOG_TYPE_CONFIG[type]?.emoji || CHANGELOG_TYPE_CONFIG.chore.emoji
  );
}

function getComponentFromCommit(commit: ParsedCommit): string {
  if (commit.scope) {
    const normalized = normalizeScope(commit.scope);
    if (COMPONENT_SCOPES.includes(normalized)) {
      return normalized;
    }
  }
  return 'Core';
}

function mapCommitTypeToChangelogType(commitType: string): string {
  return COMMIT_TO_CHANGELOG_MAP[commitType] || 'chore';
}

async function mergeDataSources(
  changesetVersions: ChangesetVersion[],
  gitCommits: ParsedCommit[],
  prs: PullRequestInfo[]
): Promise<ComponentChangelog> {
  const result: ComponentChangelog = {};

  const prByCommitSha = new Map<string, PullRequestInfo>();
  for (const pr of prs) {
    if (pr.mergeCommitSha) {
      prByCommitSha.set(pr.mergeCommitSha, pr);
    }
  }

  const versionCommits = groupCommitsByVersion(gitCommits, getTags());

  const allVersionDates: Record<string, string> = {};
  for (const v of changesetVersions) {
    allVersionDates[v.version] = v.date;
  }
  for (const v of versionCommits) {
    if (!allVersionDates[v.version]) {
      allVersionDates[v.version] = v.date;
    }
  }

  for (const version of changesetVersions) {
    for (const change of version.changes) {
      const component = 'Core';

      if (!result[component]) {
        result[component] = [];
      }

      let versionEntry = result[component].find(
        v => v.version === version.version
      );
      if (!versionEntry) {
        versionEntry = {
          version: version.version,
          date: version.date,
          changes: []
        };
        result[component].push(versionEntry);
      }

      versionEntry.changes.push({
        type: change.type,
        content: change.content,
        emoji: getTypeEmoji(change.type),
        pr: change.pr,
        author: change.author,
        source: 'changeset'
      });
    }
  }

  for (const versionCommit of versionCommits) {
    for (const commit of versionCommit.commits) {
      const pr = prByCommitSha.get(commit.hash);
      const changelogType = mapCommitTypeToChangelogType(commit.type);
      const component = getComponentFromCommit(commit);

      if (!result[component]) {
        result[component] = [];
      }

      let versionEntry = result[component].find(
        v => v.version === versionCommit.version
      );
      if (!versionEntry) {
        versionEntry = {
          version: versionCommit.version,
          date: versionCommit.date,
          changes: []
        };
        result[component].push(versionEntry);
      }

      const issues = commit.issues.length > 0 ? commit.issues : undefined;

      versionEntry.changes.push({
        type: changelogType,
        content: commit.subject,
        emoji: getTypeEmoji(changelogType),
        issues,
        pr: pr ? String(pr.number) : undefined,
        author: pr?.author || commit.author,
        hash: commit.shortHash,
        source: 'commit'
      });
    }
  }

  for (const versions of Object.values(result)) {
    versions.sort((a, b) => {
      const aParts = a.version.split('.').map(Number);
      const bParts = b.version.split('.').map(Number);
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aVal = aParts[i] || 0;
        const bVal = bParts[i] || 0;
        if (bVal !== aVal) return bVal - aVal;
      }
      return 0;
    });

    for (const version of versions) {
      version.changes.sort((a, b) => {
        const typeOrder = [
          'breaking',
          'feature',
          'fix',
          'refactor',
          'perf',
          'docs',
          'test',
          'build',
          'ci',
          'chore'
        ];
        const aIdx = typeOrder.indexOf(a.type);
        const bIdx = typeOrder.indexOf(b.type);
        return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
      });
    }
  }

  return result;
}

async function main() {
  console.log('Starting auto changelog generation...');
  console.log('='.repeat(50));

  console.log('\n[1/4] Loading Changesets CHANGELOG.md...');
  let changesetVersions: ChangesetVersion[] = [];
  if (fs.existsSync(CHANGELOG_PATH)) {
    const changelogContent = fs.readFileSync(CHANGELOG_PATH, 'utf-8');
    changesetVersions = parseChangesetChangelog(changelogContent);
    console.log(`  Found ${changesetVersions.length} versions from Changesets`);
  } else {
    console.log('  No Changesets CHANGELOG.md found, skipping...');
  }

  console.log('\n[2/4] Loading GitHub PRs...');
  let prs: PullRequestInfo[] = [];
  const gitCommitsPath = path.join(
    path.dirname(OUTPUT_PATH),
    'github-prs.json'
  );
  const hasGitHubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

  if (hasGitHubToken) {
    prs = await fetchAllPRs(Number.parseInt(process.env.MAX_PRS || '200', 10));
    console.log(`  Fetched ${prs.length} PRs from GitHub API`);
  } else if (fs.existsSync(gitCommitsPath)) {
    console.log('  No GITHUB_TOKEN set, loading cached PRs...');
    try {
      const cached = JSON.parse(fs.readFileSync(gitCommitsPath, 'utf-8'));
      prs = cached.pullRequests || [];
      console.log(`  Loaded ${prs.length} cached PRs`);
    } catch {
      console.log('  No cached PRs available, continuing without PR data');
    }
  } else {
    console.log(
      '  No GITHUB_TOKEN set and no cached PRs, skipping GitHub data'
    );
  }

  console.log('\n[3/4] Loading git commits...');
  let commits: ParsedCommit[] = [];
  const gitCommitsJsonPath = path.join(
    path.dirname(OUTPUT_PATH),
    'git-commits.json'
  );

  if (fs.existsSync(gitCommitsJsonPath)) {
    try {
      const cached = JSON.parse(fs.readFileSync(gitCommitsJsonPath, 'utf-8'));
      commits = cached.allCommits || [];
      console.log(`  Loaded ${commits.length} cached commits`);
    } catch {
      console.log('  Failed to load cached commits, parsing fresh...');
      const { parseGitLogs: parseLogs, getGitLogs } = await import(
        './git-commit-parser'
      );
      const logs = getGitLogs();
      commits = parseLogs(logs);
      console.log(`  Parsed ${commits.length} commits`);
    }
  } else {
    const { parseGitLogs: parseLogs, getGitLogs } = await import(
      './git-commit-parser'
    );
    const logs = getGitLogs();
    commits = parseLogs(logs);
    console.log(`  Parsed ${commits.length} commits`);
  }

  console.log('\n[4/4] Merging data sources...');
  const changelog = await mergeDataSources(changesetVersions, commits, prs);

  const result = {
    generatedAt: new Date().toISOString(),
    sources: {
      changesets: changesetVersions.length > 0,
      gitCommits: commits.length,
      githubPRs: prs.length
    },
    components: changelog
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`\n✅ Auto changelog saved to ${OUTPUT_PATH}`);

  console.log('\n📊 Summary:');
  console.log(`   - Components: ${Object.keys(changelog).length}`);
  console.log(
    `   - Versions: ${
      new Set(
        Object.values(changelog)
          .flat()
          .map(v => v.version)
      ).size
    }`
  );
  console.log(
    `   - Total changes: ${Object.values(changelog).reduce((sum, versions) => sum + versions.reduce((s, v) => s + v.changes.length, 0), 0)}`
  );

  return result;
}

export {
  getComponentFromCommit,
  main,
  mergeDataSources,
  parseChangesetChangelog
};

if (
  import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` ||
  process.argv[1].endsWith('gen-auto-changelog.ts')
) {
  main().catch(console.error);
}
