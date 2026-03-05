import process from 'node:process';

import { createGitHubClient, createLogger } from './lib/index';

const logger = createLogger({ prefix: 'GitHub' });

async function main() {
  const client = createGitHubClient();
  const result = await client.verifyToken();

  if (result.success) {
    logger.success(`Token 验证成功`);
    logger.info(`登录用户: ${result.login || 'unknown'}`);
    process.exit(0);
  } else {
    logger.error(result.error || '验证失败');
    process.exit(1);
  }
}

main().catch(error => {
  logger.error(`验证异常: ${error}`);
  process.exit(1);
});
