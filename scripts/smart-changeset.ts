import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline';

// Configuration
const PACKAGES_DIR = 'packages/core/src/components';
const PACKAGE_NAME = 'vue-element-plus-x';
const CHANGESET_DIR = '.changeset';

// Colors for console output
const colors = {
  reset: '\x1B[0m',
  green: '\x1B[32m',
  yellow: '\x1B[33m',
  cyan: '\x1B[36m',
  red: '\x1B[31m',
  dim: '\x1B[2m'
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

// 1. Get changed files
function getChangedFiles() {
  try {
    const output = execSync('git status --porcelain', { encoding: 'utf-8' });
    return output
      .split('\n')
      .filter(Boolean)
      .map(line => line.substring(3).trim()); // Remove status code (e.g. "M  ")
  } catch {
    console.error(`${colors.red}Error running git status${colors.reset}`);
    return [];
  }
}

// 2. Detect components from file paths
function detectComponents(files: string[]) {
  const components = new Set<string>();
  files.forEach(file => {
    if (file.startsWith(PACKAGES_DIR)) {
      // Extract component name: packages/core/src/components/Bubble/index.vue -> Bubble
      const relativePath = file.substring(PACKAGES_DIR.length + 1);
      const componentName = relativePath.split('/')[0];
      if (
        componentName &&
        componentName !== 'index.ts' &&
        componentName !== 'utils'
      ) {
        components.add(componentName);
      }
    }
  });
  return Array.from(components);
}

// 3. Generate random file name for changeset
function generateFileName() {
  const words = [
    'cool',
    'hot',
    'fast',
    'slow',
    'big',
    'small',
    'red',
    'blue',
    'green',
    'cat',
    'dog',
    'bird',
    'fish',
    'lion',
    'tiger',
    'bear',
    'wolf',
    'sing',
    'dance',
    'run',
    'jump',
    'walk',
    'fly',
    'swim',
    'sleep'
  ];
  const randomWord = () => words[Math.floor(Math.random() * words.length)];
  return `${randomWord()}-${randomWord()}-${randomWord()}.md`;
}

async function main() {
  console.log(`${colors.cyan}\n🚀 Smart Changeset Generator\n${colors.reset}`);

  const changedFiles = getChangedFiles();
  const detectedComponents = detectComponents(changedFiles);

  let selectedComponent = '';

  if (detectedComponents.length === 0) {
    console.log(
      `${colors.yellow}No component changes detected.${colors.reset}`
    );
    const manualComponent = await question(
      'Enter component name (or press enter to skip): '
    );
    if (manualComponent) selectedComponent = manualComponent.trim();
  } else if (detectedComponents.length === 1) {
    console.log(
      `Detected change in component: ${colors.green}${detectedComponents[0]}${colors.reset}`
    );
    const confirm = await question(`Use this component? (Y/n) `);
    if (!confirm || confirm.toLowerCase() === 'y') {
      selectedComponent = detectedComponents[0];
    } else {
      selectedComponent = await question('Enter component name: ');
    }
  } else {
    console.log('Detected changes in multiple components:');
    detectedComponents.forEach((c, i) => console.log(`${i + 1}. ${c}`));
    const index = await question(
      `Select component (1-${detectedComponents.length}) or type name: `
    );
    const num = Number.parseInt(index);
    if (!Number.isNaN(num) && num > 0 && num <= detectedComponents.length) {
      selectedComponent = detectedComponents[num - 1];
    } else {
      selectedComponent = index;
    }
  }

  const type = await question('\nChange type (major/minor/patch) [patch]: ');
  const finalType = type.trim() || 'patch';

  const summary = await question('Change description: ');
  if (!summary) {
    console.log(`${colors.red}Description is required!${colors.reset}`);
    rl.close();
    return;
  }

  const componentPrefix = selectedComponent ? `[${selectedComponent}] ` : '';
  const finalSummary = `${componentPrefix}${summary.trim()}`;

  const changesetContent = `---
"${PACKAGE_NAME}": ${finalType}
---

${finalSummary}
`;

  const fileName = generateFileName();
  const filePath = path.join(CHANGESET_DIR, fileName);

  fs.writeFileSync(filePath, changesetContent);

  console.log(
    `${colors.green}\n✨ Changeset created at ${filePath}${colors.reset}`
  );
  console.log(colors.dim + changesetContent + colors.reset);

  rl.close();
}

main().catch(err => {
  console.error(err);
  rl.close();
});
