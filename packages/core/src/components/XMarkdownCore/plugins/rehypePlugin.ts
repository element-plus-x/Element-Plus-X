// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT
import type { Element, ElementContent, Root } from 'hast';
import type { BuildVisitor } from 'unist-util-visit';
import { visit } from 'unist-util-visit';

export function rehypeAnimatedPlugin() {
  return (tree: Root) => {
    visit(tree, 'element', ((node: Element) => {
      if (
        [
          'p',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'li',
          'strong',
          'th',
          'td'
        ].includes(node.tagName) &&
        node.children
      ) {
        const newChildren: Array<ElementContent> = [];
        for (const child of node.children) {
          if (child.type === 'text') {
            // @ts-expect-error Segmenter is not available in all environments
            const segmenter = new Intl.Segmenter('zh', { granularity: 'word' });
            const segments = segmenter.segment(child.value);
            const words = [...segments]
              .map(segment => segment.segment)
              .filter(Boolean);
            words.forEach((word: string) => {
              newChildren.push({
                children: [{ type: 'text', value: word }],
                properties: {
                  className: 'x-markdown-animated-word'
                },
                tagName: 'span',
                type: 'element'
              });
            });
          } else {
            newChildren.push(child);
          }
        }
        node.children = newChildren;
      }
    }) as BuildVisitor<Root, 'element'>);
  };
}
