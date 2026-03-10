import { getIssueCategoryOptions } from '@configs/commit-types';
import { COMPONENTS } from '@configs/components';

export { getIssueCategoryOptions };

const GITHUB_OWNER = 'element-plus-x';
const GITHUB_REPO = 'Element-Plus-X';

const fallbackTags = [
  '1.3.8',
  '1.3.7',
  '1.3.6',
  '1.3.5',
  '1.3.4',
  '1.3.3',
  '1.3.2',
  '1.3.1',
  '1.2.2',
  '1.2.1',
  '1.1.9',
  '1.1.8',
  '1.1.7',
  '1.1.6',
  '1.1.5',
  '1.1.4',
  '1.1.3',
  '1.1.2',
  '1.1.1',
  '1.0.0'
];

export async function fetchGitHubTags(): Promise<string[]> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/tags?per_page=50`,
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = (await response.json()) as Array<{ name: string }>;

    const tags = data
      .map(tag => tag.name.replace(/^v/, ''))
      .filter(version => /^\d+\.\d+\.\d+(?:-[a-z0-9.]+)?$/.test(version));

    return tags.sort((a, b) => {
      const partsA = a
        .split('.')
        .map(p => Number.parseInt(p.replace(/-.*/, ''), 10));
      const partsB = b
        .split('.')
        .map(p => Number.parseInt(p.replace(/-.*/, ''), 10));

      for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
        if (partsA[i] !== partsB[i]) {
          return partsB[i] - partsA[i];
        }
      }
      return b.localeCompare(a);
    });
  } catch (error) {
    console.warn('Failed to fetch GitHub tags, using fallback:', error);
    return fallbackTags;
  }
}

function getLocalComponents(): string[] {
  const components = COMPONENTS.filter(
    component => !component.isHook && !component.external
  ).map(component => component.name);

  return [...new Set(components)].sort();
}

export function getComponents(): string[] {
  return getLocalComponents();
}
