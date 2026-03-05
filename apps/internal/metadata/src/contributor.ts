import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import {
  createGitHubClient,
  createLogger
} from '../../../../scripts/lib/index';

const logger = createLogger({ prefix: 'Contributors' });

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

async function main() {
  const client = createGitHubClient();
  const result: Record<string, any[]> = {};

  logger.info(`仓库: ${client.getOwner()}/${client.getRepo()}`);

  for (const component of componentNames) {
    try {
      logger.info(`正在获取 ${component} 的贡献者...`);
      result[component.toLowerCase()] =
        await client.getComponentContributors(component);
      logger.success(
        `${component} 贡献者: ${result[component.toLowerCase()].length} 人`
      );
    } catch (error) {
      logger.error(`获取 ${component} 的贡献者失败: ${error}`);
      result[component.toLowerCase()] = [];
    }
  }

  for (const hook of hooksNames) {
    try {
      logger.info(`正在获取 ${hook} 的贡献者...`);
      result[hook.toLowerCase()] = await client.getHookContributors(hook);
      logger.success(`${hook} 贡献者: ${result[hook.toLowerCase()].length} 人`);
    } catch (error) {
      logger.error(`获取 ${hook} 的贡献者失败: ${error}`);
      result[hook.toLowerCase()] = [];
    }
  }

  try {
    logger.info(`正在获取仓库贡献者...`);
    const repoContributors = await client.getRepoContributors();
    result['Element-Plus-X'] = repoContributors;
    logger.success(`仓库贡献者: ${repoContributors.length} 人`);
  } catch (error) {
    logger.error(`获取仓库贡献者失败: ${error}`);
    result['Element-Plus-X'] = [];
  }

  const distDir = path.resolve(__dirname, '../dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  fs.writeFileSync(
    path.resolve(distDir, 'component-contributors.json'),
    JSON.stringify(result, null, 2)
  );

  logger.success('生成成功');
}

main().catch(error => {
  logger.error(`执行失败: ${error}`);
  process.exit(1);
});
