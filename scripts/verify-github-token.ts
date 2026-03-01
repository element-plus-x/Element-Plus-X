import process from 'node:process';

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

const headers: Record<string, string> = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28'
};

if (token) headers.Authorization = `Bearer ${token}`;

async function main() {
  const target = token ? 'token' : 'no-token';
  const res = await fetch('https://api.github.com/user', { headers });

  if (!token) {
    console.log('GITHUB_TOKEN/GH_TOKEN 未设置，无法验证');
    process.exit(1);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.log(`GitHub Token 验证失败: ${res.status} ${res.statusText}`);
    if (text) console.log(text.slice(0, 400));
    process.exit(1);
  }

  const data = (await res.json()) as { login?: string };
  console.log(`GitHub Token 验证成功 (${target})`);
  console.log(`登录用户: ${data.login || 'unknown'}`);
}

main().catch(() => {
  console.log('GitHub Token 验证失败: 运行异常');
  process.exit(1);
});
