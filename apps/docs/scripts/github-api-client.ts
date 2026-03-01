import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..', '..');

const OUTPUT_PATH = path.join(
  rootDir,
  'apps',
  'docs',
  '.vitepress',
  'data',
  'github-prs.json'
);

const GITHUB_OWNER = process.env.ELX_GITHUB_OWNER || 'element-plus-x';
const GITHUB_REPO = process.env.ELX_GITHUB_REPO || 'Element-Plus-X';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

export interface PullRequestInfo {
  number: number;
  title: string;
  body?: string;
  state: 'open' | 'closed' | 'merged';
  author: string;
  authorUrl: string;
  labels: string[];
  linkedIssues: number[];
  changedFiles: string[];
  additions: number;
  deletions: number;
  mergeCommitSha?: string;
  mergedAt?: string;
  createdAt: string;
  updatedAt: string;
  url: string;
}

export interface GitHubCommitInfo {
  sha: string;
  message: string;
  author: string;
  authorEmail: string;
  date: string;
  associatedPrs: PullRequestInfo[];
}

interface GraphQLPRResponse {
  repository: {
    pullRequests: {
      nodes: Array<{
        number: number;
        title: string;
        body?: string;
        state: string;
        author?: { login: string; url: string };
        labels: { nodes: Array<{ name: string }> };
        mergedAt?: string;
        merged?: boolean;
        mergeCommit?: { oid: string };
        createdAt: string;
        updatedAt: string;
        url: string;
        additions: number;
        deletions: number;
        files: { nodes: Array<{ path: string }> };
        closingIssuesReferences?: { nodes: Array<{ number: number }> };
      }>;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    };
  };
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (
        response.status === 403 &&
        response.headers.get('x-ratelimit-remaining') === '0'
      ) {
        const resetTime =
          Number.parseInt(
            response.headers.get('x-ratelimit-reset') || '0',
            10
          ) * 1000;
        const waitTime = resetTime - Date.now() + 1000;
        console.log(
          `Rate limit exceeded. Waiting ${Math.round(waitTime / 1000)} seconds...`
        );
        await sleep(waitTime);
        continue;
      }
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await sleep(1000 * (i + 1));
    }
  }
  throw new Error('Max retries exceeded');
}

function getGraphQLClient() {
  if (!GITHUB_TOKEN) {
    console.warn(
      'Warning: GITHUB_TOKEN not set. API requests may be rate-limited.'
    );
    return null;
  }

  return async <T>(
    query: string,
    variables: Record<string, unknown> = {}
  ): Promise<T | null> => {
    try {
      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, variables })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`GraphQL error: ${response.status} ${errorText}`);
        return null;
      }

      const data = await response.json();
      if (data.errors) {
        console.error('GraphQL errors:', data.errors);
        return null;
      }

      return data.data as T;
    } catch (error) {
      console.error('GraphQL request failed:', error);
      return null;
    }
  };
}

async function fetchPRsGraphQL(
  limit = 100,
  after?: string
): Promise<{
  prs: PullRequestInfo[];
  hasNextPage: boolean;
  endCursor: string | null;
}> {
  const client = getGraphQLClient();
  if (!client) {
    console.log('Falling back to REST API...');
    return fetchPRsREST(limit);
  }

  const query = `
    query($owner: String!, $repo: String!, $limit: Int!, $after: String) {
      repository(owner: $owner, name: $repo) {
        pullRequests(first: $limit, after: $after, states: [MERGED], orderBy: {field: UPDATED_AT, direction: DESC}) {
          nodes {
            number
            title
            body
            state
            author { login url }
            labels(first: 20) { nodes { name } }
            mergedAt
            merged
            mergeCommit { oid }
            createdAt
            updatedAt
            url
            additions
            deletions
            files(first: 100) { nodes { path } }
            closingIssuesReferences(first: 10) { nodes { number } }
          }
          pageInfo { hasNextPage endCursor }
        }
      }
    }
  `;

  const data = await client<GraphQLPRResponse>(query, {
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    limit,
    after
  });

  if (!data?.repository?.pullRequests) {
    return { prs: [], hasNextPage: false, endCursor: null };
  }

  const prs: PullRequestInfo[] = data.repository.pullRequests.nodes.map(pr => ({
    number: pr.number,
    title: pr.title,
    body: pr.body || undefined,
    state: pr.merged ? 'merged' : (pr.state.toLowerCase() as 'merged'),
    author: pr.author?.login || 'unknown',
    authorUrl: pr.author?.url || '',
    labels: pr.labels.nodes.map(l => l.name),
    linkedIssues: pr.closingIssuesReferences?.nodes.map(i => i.number) || [],
    changedFiles: pr.files.nodes.map(f => f.path),
    additions: pr.additions,
    deletions: pr.deletions,
    mergeCommitSha: pr.mergeCommit?.oid,
    mergedAt: pr.mergedAt,
    createdAt: pr.createdAt,
    updatedAt: pr.updatedAt,
    url: pr.url
  }));

  return {
    prs,
    hasNextPage: data.repository.pullRequests.pageInfo.hasNextPage,
    endCursor: data.repository.pullRequests.pageInfo.endCursor
  };
}

async function fetchPRsREST(
  limit = 100
): Promise<{
  prs: PullRequestInfo[];
  hasNextPage: boolean;
  endCursor: string | null;
}> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json'
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls?state=closed&sort=updated&direction=desc&per_page=${limit}`;

  const response = await fetchWithRetry(url, { headers });
  if (!response.ok) {
    console.error(`REST API error: ${response.status}`);
    return { prs: [], hasNextPage: false, endCursor: null };
  }

  const prsData = (await response.json()) as Array<{
    number: number;
    title: string;
    body?: string;
    state: string;
    merged_at?: string;
    merge_commit_sha?: string;
    user: { login: string; html_url: string };
    labels: Array<{ name: string }>;
    created_at: string;
    updated_at: string;
    html_url: string;
    additions: number;
    deletions: number;
    changed_files: number;
  }>;

  const prs: PullRequestInfo[] = await Promise.all(
    prsData
      .filter(pr => pr.merged_at)
      .map(async pr => {
        let changedFiles: string[] = [];
        const linkedIssues: number[] = [];

        try {
          const detailUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls/${pr.number}`;
          const detailResponse = await fetchWithRetry(detailUrl, { headers });
          if (detailResponse.ok) {
            const detail = (await detailResponse.json()) as {
              files?: Array<{ filename: string }>;
            };
            changedFiles = detail.files?.map(f => f.filename) || [];
          }
        } catch {
          // Ignore errors fetching PR details
        }

        const issueRegex =
          /(?:close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved)\s*#(\d+)/gi;
        const bodyMatches = pr.body?.matchAll(issueRegex) || [];
        for (const match of bodyMatches) {
          if (
            match[1] &&
            !linkedIssues.includes(Number.parseInt(match[1], 10))
          ) {
            linkedIssues.push(Number.parseInt(match[1], 10));
          }
        }

        return {
          number: pr.number,
          title: pr.title,
          body: pr.body,
          state: 'merged' as const,
          author: pr.user.login,
          authorUrl: pr.user.html_url,
          labels: pr.labels.map(l => l.name),
          linkedIssues,
          changedFiles,
          additions: pr.additions,
          deletions: pr.deletions,
          mergeCommitSha: pr.merge_commit_sha,
          mergedAt: pr.merged_at,
          createdAt: pr.created_at,
          updatedAt: pr.updated_at,
          url: pr.html_url
        };
      })
  );

  return { prs, hasNextPage: false, endCursor: null };
}

async function fetchAllPRs(maxPRs = 500): Promise<PullRequestInfo[]> {
  console.log(`Fetching PRs from ${GITHUB_OWNER}/${GITHUB_REPO}...`);

  const allPRs: PullRequestInfo[] = [];
  let hasNextPage = true;
  let endCursor: string | null = null;
  const batchSize = 100;

  while (hasNextPage && allPRs.length < maxPRs) {
    console.log(
      `Fetching batch ${Math.floor(allPRs.length / batchSize) + 1}...`
    );
    const {
      prs,
      hasNextPage: more,
      endCursor: cursor
    } = await fetchPRsGraphQL(batchSize, endCursor || undefined);

    allPRs.push(...prs);
    hasNextPage = more;
    endCursor = cursor;

    if (prs.length === 0) break;

    await sleep(100);
  }

  console.log(`Fetched ${allPRs.length} PRs`);
  return allPRs.slice(0, maxPRs);
}

async function getPRByCommitSha(sha: string): Promise<PullRequestInfo | null> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json'
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits/${sha}/pulls`;

  try {
    const response = await fetchWithRetry(url, { headers });
    if (!response.ok) return null;

    const prs = (await response.json()) as Array<{
      number: number;
      title: string;
      body?: string;
      state: string;
      merged_at?: string;
      merge_commit_sha?: string;
      user: { login: string; html_url: string };
      labels: Array<{ name: string }>;
      created_at: string;
      updated_at: string;
      html_url: string;
    }>;

    if (prs.length === 0) return null;

    const pr = prs[0];
    return {
      number: pr.number,
      title: pr.title,
      body: pr.body,
      state: pr.merged_at ? 'merged' : (pr.state as 'open' | 'closed'),
      author: pr.user.login,
      authorUrl: pr.user.html_url,
      labels: pr.labels.map(l => l.name),
      linkedIssues: [],
      changedFiles: [],
      additions: 0,
      deletions: 0,
      mergeCommitSha: pr.merge_commit_sha,
      mergedAt: pr.merged_at,
      createdAt: pr.created_at,
      updatedAt: pr.updated_at,
      url: pr.html_url
    };
  } catch {
    return null;
  }
}

function inferComponentFromFiles(files: string[]): string[] {
  const components = new Set<string>();

  const componentPatterns: Array<{ pattern: RegExp; component: string }> = [
    { pattern: /packages\/core\/src\/components\/([^/]+)/, component: '' },
    { pattern: /Bubble/, component: 'Bubble' },
    { pattern: /BubbleList/, component: 'BubbleList' },
    { pattern: /Sender|XSender/, component: 'Sender' },
    { pattern: /MentionSender/, component: 'MentionSender' },
    { pattern: /Thinking/, component: 'Thinking' },
    { pattern: /ThoughtChain/, component: 'ThoughtChain' },
    { pattern: /Welcome/, component: 'Welcome' },
    { pattern: /Prompts/, component: 'Prompts' },
    { pattern: /Conversations/, component: 'Conversations' },
    { pattern: /FilesCard/, component: 'FilesCard' },
    { pattern: /Attachments/, component: 'Attachments' },
    { pattern: /ConfigProvider/, component: 'ConfigProvider' },
    { pattern: /Typewriter/, component: 'Typewriter' },
    { pattern: /XMarkdown/, component: 'XMarkdown' },
    { pattern: /use[A-Z]/, component: 'Hooks' },
    { pattern: /apps\/docs/, component: 'Docs' },
    { pattern: /\.md$/, component: 'Docs' },
    { pattern: /tsconfig|vite\.config|rollup/, component: 'Build' },
    { pattern: /\.github\/|\.changeset\//, component: 'CI' }
  ];

  for (const file of files) {
    for (const { pattern, component } of componentPatterns) {
      if (pattern.test(file)) {
        if (component) {
          components.add(component);
        } else {
          const match = file.match(pattern);
          if (match?.[1]) {
            components.add(match[1]);
          }
        }
        break;
      }
    }
  }

  return Array.from(components);
}

async function main() {
  const maxPRs = Number.parseInt(process.env.MAX_PRS || '500', 10);

  const prs = await fetchAllPRs(maxPRs);

  const result = {
    generatedAt: new Date().toISOString(),
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    totalPRs: prs.length,
    pullRequests: prs
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`GitHub PRs saved to ${OUTPUT_PATH}`);

  return result;
}

export {
  fetchAllPRs,
  fetchPRsGraphQL,
  fetchPRsREST,
  getPRByCommitSha,
  inferComponentFromFiles,
  main
};

if (
  import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` ||
  process.argv[1].endsWith('github-api-client.ts')
) {
  main().catch(console.error);
}
