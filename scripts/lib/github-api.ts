import process from 'node:process';

export interface GitHubApiOptions {
  owner?: string;
  repo?: string;
  token?: string;
}

export interface CommitContributor {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface RepoContributor extends CommitContributor {
  contributions: number;
}

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

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class GitHubApiClient {
  private owner: string;
  private repo: string;
  private token: string;

  constructor(options?: GitHubApiOptions) {
    this.owner =
      options?.owner || process.env.ELX_GITHUB_OWNER || 'element-plus-x';
    this.repo =
      options?.repo || process.env.ELX_GITHUB_REPO || 'Element-Plus-X';
    this.token =
      options?.token || process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'element-plus-x-scripts'
    };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    return headers;
  }

  async fetchWithRetry(
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

  async verifyToken(): Promise<{
    success: boolean;
    login?: string;
    error?: string;
  }> {
    if (!this.token) {
      return { success: false, error: 'GITHUB_TOKEN/GH_TOKEN 未设置' };
    }

    try {
      const res = await fetch('https://api.github.com/user', {
        headers: this.getHeaders()
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        return {
          success: false,
          error: `GitHub Token 验证失败: ${res.status} ${res.statusText}${text ? ` - ${text.slice(0, 200)}` : ''}`
        };
      }

      const data = (await res.json()) as { login?: string };
      return { success: true, login: data.login };
    } catch (error) {
      return { success: false, error: `验证异常: ${error}` };
    }
  }

  async getRepoContributors(): Promise<RepoContributor[]> {
    let page = 1;
    const contributors: RepoContributor[] = [];

    while (true) {
      try {
        const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contributors?per_page=100&page=${page}`;
        const res = await this.fetchWithRetry(url, {
          headers: this.getHeaders()
        });
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(
            `GitHub API 请求失败: ${res.status} ${res.statusText} ${JSON.stringify(data)}`
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

  async getCommits(subPath: string): Promise<CommitContributor[]> {
    let page = 1;
    const contributors: CommitContributor[] = [];

    while (true) {
      try {
        const url = `https://api.github.com/repos/${this.owner}/${this.repo}/commits?path=${encodeURIComponent(subPath)}&per_page=100&page=${page}`;
        const res = await this.fetchWithRetry(url, {
          headers: this.getHeaders()
        });
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(
            `GitHub API 请求失败: ${res.status} ${res.statusText} ${JSON.stringify(data)}`
          );
        }

        if (!Array.isArray(data) || data.length === 0) break;

        contributors.push(
          ...data
            .map(
              (c: any) =>
                c.author &&
                c.author.login && {
                  login: c.author.login,
                  avatar_url: c.author.avatar_url,
                  html_url: c.author.html_url
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

  async getComponentContributors(
    component: string
  ): Promise<CommitContributor[]> {
    const componentName = this.transformName(component);
    const paths = [
      `packages/core/src/components/${component}`,
      `apps/docs/en/components/${componentName}`,
      `apps/docs/zh/components/${componentName}`
    ];

    const allContributors: CommitContributor[] = [];
    for (const p of paths) {
      const contributors = await this.getCommits(p);
      allContributors.push(...contributors);
    }

    const unique: Record<string, CommitContributor> = {};
    allContributors.forEach(c => {
      if (c && c.login) unique[c.login] = c;
    });
    return Object.values(unique);
  }

  async getHookContributors(hook: string): Promise<CommitContributor[]> {
    const hookName = this.transformName(hook);
    const paths = [
      `packages/core/src/hooks/${hook}.ts`,
      `apps/docs/en/components/${hookName}`,
      `apps/docs/zh/components/${hookName}`
    ];

    const allContributors: CommitContributor[] = [];
    for (const p of paths) {
      const contributors = await this.getCommits(p);
      allContributors.push(...contributors);
    }

    const unique: Record<string, CommitContributor> = {};
    allContributors.forEach(c => {
      if (c && c.login) unique[c.login] = c;
    });
    return Object.values(unique);
  }

  private transformName(name: string): string {
    let transformedName = name.replace(/-/g, '');
    if (/^X[A-Z]/.test(transformedName)) {
      transformedName = `x${transformedName.slice(1)}`;
      if (transformedName.length > 1) {
        transformedName =
          transformedName[0] +
          transformedName[1].toLowerCase() +
          transformedName.slice(2);
      }
    } else {
      transformedName =
        transformedName.charAt(0).toLowerCase() + transformedName.slice(1);
    }
    return transformedName;
  }

  getOwner(): string {
    return this.owner;
  }

  getRepo(): string {
    return this.repo;
  }
}

export function createGitHubClient(
  options?: GitHubApiOptions
): GitHubApiClient {
  return new GitHubApiClient(options);
}
