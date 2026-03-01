import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import {
  COMMIT_TO_CHANGELOG_MAP,
  COMPONENT_SCOPES,
  VALID_COMMIT_TYPES
} from '../.vitepress/config/changelog-types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..', '..');

const OUTPUT_PATH = path.join(
  rootDir,
  'apps',
  'docs',
  '.vitepress',
  'data',
  'git-commits.json'
);

export interface ParsedCommit {
  hash: string;
  shortHash: string;
  type: string;
  scope: string;
  subject: string;
  body?: string;
  breaking: boolean;
  issues: string[];
  author: string;
  authorEmail: string;
  date: string;
  tags: string[];
}

export interface VersionCommits {
  version: string;
  date: string;
  commits: ParsedCommit[];
}

const GIT_FORMAT =
  '%H%n%h%n%s%n%b%n---BODY_END---%n%an%n%ae%n%ai%n%D%n---COMMIT_END---';

function parseCommitMessage(message: string): {
  type: string;
  scope: string;
  subject: string;
  body: string;
  breaking: boolean;
  issues: string[];
} {
  const lines = message.split('\n');
  const firstLine = lines[0] || '';

  const conventionalRegex =
    /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert|breaking)(?:\(([^)]+)\))?\s*:\s*(\S.*)$/i;
  const match = firstLine.match(conventionalRegex);

  let type = 'chore';
  let scope = '';
  let subject = firstLine;
  let breaking = false;
  const issues: string[] = [];

  if (match) {
    type = match[1].toLowerCase();
    scope = match[2] || '';
    subject = match[3] || '';
  }

  const bodyLines = lines.slice(1);
  const body = bodyLines.join('\n').trim();

  if (
    body.includes('BREAKING CHANGE:') ||
    body.includes('BREAKING-CHANGE:') ||
    type === 'breaking'
  ) {
    breaking = true;
  }

  const issueRegex =
    /(?:close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved|#)\s*#?(\d+)/gi;
  const bodyMatches = body.matchAll(issueRegex);
  const subjectMatches = subject.matchAll(issueRegex);

  for (const m of [...bodyMatches, ...subjectMatches]) {
    if (m[1] && !issues.includes(m[1])) {
      issues.push(m[1]);
    }
  }

  return { type, scope, subject, body, breaking, issues };
}

function normalizeScope(scope: string): string {
  if (!scope) return '';

  const trimmed = scope.trim();

  const pascalCase = trimmed
    .split(/[-_\s]+/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');

  if (COMPONENT_SCOPES.includes(pascalCase)) {
    return pascalCase;
  }

  return trimmed;
}

function mapCommitTypeToChangelog(commitType: string): string {
  return COMMIT_TO_CHANGELOG_MAP[commitType] || 'chore';
}

function getGitLogs(since?: string, until?: string): string {
  let cmd = `git log --format="${GIT_FORMAT}" --no-merges`;

  if (since) {
    cmd += ` --since="${since}"`;
  }
  if (until) {
    cmd += ` --until="${until}"`;
  }

  try {
    return execSync(cmd, {
      encoding: 'utf-8',
      cwd: rootDir,
      maxBuffer: 50 * 1024 * 1024
    });
  } catch (error) {
    console.error('Error executing git log:', error);
    return '';
  }
}

function getTags(): { name: string; date: string }[] {
  try {
    const tags = execSync('git tag -l "v*" --sort=-creatordate', {
      encoding: 'utf-8',
      cwd: rootDir
    })
      .trim()
      .split('\n')
      .filter(Boolean);

    return tags.map(tag => {
      const date = execSync(`git log -1 --format="%ai" ${tag}`, {
        encoding: 'utf-8',
        cwd: rootDir
      }).trim();
      return { name: tag, date };
    });
  } catch (error) {
    console.error('Error getting tags:', error);
    return [];
  }
}

function parseGitLogs(logs: string): ParsedCommit[] {
  const commits: ParsedCommit[] = [];
  const rawCommits = logs.split('---COMMIT_END---').filter(Boolean);

  for (const rawCommit of rawCommits) {
    const bodyEndIndex = rawCommit.indexOf('---BODY_END---');
    if (bodyEndIndex === -1) continue;

    const messagePart = rawCommit.substring(0, bodyEndIndex).trim();
    const metaPart = rawCommit.substring(bodyEndIndex + 14).trim();

    const messageLines = messagePart.split('\n');
    const metaLines = metaPart.split('\n');

    if (messageLines.length < 3 || metaLines.length < 4) continue;

    const hash = messageLines[0] || '';
    const shortHash = messageLines[1] || '';
    const subjectLine = messageLines[2] || '';
    const bodyLines = messageLines.slice(3);

    const author = metaLines[0] || '';
    const authorEmail = metaLines[1] || '';
    const dateLine = metaLines[2] || '';
    const tagsLine = metaLines[3] || '';

    const fullMessage = `${subjectLine}\n${bodyLines.join('\n')}`;
    const parsed = parseCommitMessage(fullMessage);

    const tags = tagsLine
      .split(',')
      .map(t => t.trim())
      .filter(t => t.startsWith('tag: '))
      .map(t => t.replace('tag: ', ''));

    const commit: ParsedCommit = {
      hash,
      shortHash,
      type: mapCommitTypeToChangelog(parsed.type),
      scope: normalizeScope(parsed.scope),
      subject: parsed.subject,
      body: parsed.body || undefined,
      breaking: parsed.breaking,
      issues: parsed.issues,
      author,
      authorEmail,
      date: dateLine.split(' ')[0] || '',
      tags
    };

    if (VALID_COMMIT_TYPES.includes(parsed.type) || parsed.scope) {
      commits.push(commit);
    }
  }

  return commits;
}

function groupCommitsByVersion(
  commits: ParsedCommit[],
  tags: { name: string; date: string }[]
): VersionCommits[] {
  const versions: VersionCommits[] = [];
  const sortedTags = [...tags].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  for (let i = 0; i < sortedTags.length; i++) {
    const tag = sortedTags[i];
    const nextTag = sortedTags[i + 1];
    const tagDate = new Date(tag.date);
    const nextTagDate = nextTag ? new Date(nextTag.date) : new Date(0);

    const versionCommits = commits.filter(c => {
      const commitDate = new Date(c.date);
      return commitDate <= tagDate && commitDate > nextTagDate;
    });

    if (versionCommits.length > 0) {
      versions.push({
        version: tag.name.replace(/^v/, ''),
        date: tag.date.split(' ')[0],
        commits: versionCommits
      });
    }
  }

  const latestTagDate = sortedTags[0]
    ? new Date(sortedTags[0].date)
    : new Date(0);
  const unreleasedCommits = commits.filter(
    c => new Date(c.date) > latestTagDate
  );

  if (unreleasedCommits.length > 0) {
    versions.unshift({
      version: 'unreleased',
      date: new Date().toISOString().split('T')[0],
      commits: unreleasedCommits
    });
  }

  return versions;
}

function filterCommitsByComponent(
  commits: ParsedCommit[],
  componentName: string
): ParsedCommit[] {
  const normalizedComponent = normalizeScope(componentName);
  return commits.filter(c => c.scope === normalizedComponent);
}

async function main() {
  console.log('Parsing git commits...');

  const since = process.env.SINCE_DATE || undefined;
  const until = process.env.UNTIL_DATE || undefined;

  const logs = getGitLogs(since, until);
  const commits = parseGitLogs(logs);

  console.log(`Parsed ${commits.length} commits`);

  const tags = getTags();
  console.log(`Found ${tags.length} version tags`);

  const versionCommits = groupCommitsByVersion(commits, tags);

  const result = {
    generatedAt: new Date().toISOString(),
    totalCommits: commits.length,
    versions: versionCommits,
    allCommits: commits
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`Git commits saved to ${OUTPUT_PATH}`);

  return result;
}

export {
  filterCommitsByComponent,
  getGitLogs,
  getTags,
  groupCommitsByVersion,
  main,
  mapCommitTypeToChangelog,
  normalizeScope,
  parseCommitMessage,
  parseGitLogs
};

if (
  import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` ||
  process.argv[1].endsWith('git-commit-parser.ts')
) {
  main().catch(console.error);
}
