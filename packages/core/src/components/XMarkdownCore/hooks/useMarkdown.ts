import { flow } from 'lodash-es';

export function useProcessMarkdown(markdown: string) {
  return preprocessLaTeX(markdown);
}

export function preprocessLaTeX(markdown: string) {
  if (typeof markdown !== 'string') return markdown;

  const codeBlockRegex = /```[\s\S]*?```/g;
  const codeBlocks = markdown.match(codeBlockRegex) || [];
  const escapeReplacement = (str: string) => str.replace(/\$/g, '_ELX_DOLLAR_');
  let processedMarkdown = markdown.replace(
    codeBlockRegex,
    'ELX_CODE_BLOCK_PLACEHOLDER'
  );

  processedMarkdown = flow([
    (str: string) =>
      str.replace(/\\\[(.*?)\\\]/g, (_, equation) => `$$${equation}$$`),
    (str: string) =>
      str.replace(/\\\[([\s\S]*?)\\\]/g, (_, equation) => `$$${equation}$$`),
    (str: string) =>
      str.replace(/\\\((.*?)\\\)/g, (_, equation) => `$$${equation}$$`),
    (str: string) =>
      str.replace(
        /(^|[^\\])\$(.+?)\$/g,
        (_, prefix, equation) => `${prefix}$${equation}$`
      )
  ])(processedMarkdown);

  codeBlocks.forEach(block => {
    processedMarkdown = processedMarkdown.replace(
      'ELX_CODE_BLOCK_PLACEHOLDER',
      escapeReplacement(block)
    );
  });

  processedMarkdown = processedMarkdown.replace(/_ELX_DOLLAR_/g, '$');

  return processedMarkdown;
}
