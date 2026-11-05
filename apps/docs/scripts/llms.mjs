import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const docsRoot = path.resolve(scriptDir, '..')
const siteRoot = path.join(docsRoot, '.vitepress', 'dist')

const baseUrl = (
  process.env.DOCS_PUBLIC_ORIGIN
  || process.env.PUBLIC_ORIGIN
  || 'https://element-plus-x.com'
).replace(/\/+$/, '')

const DEMO_SECTION_RE = {
  en: /^##\s*Code\s+(Examples?|Demo(?:nstration)?)\s*$/i,
  zh: /^##\s*(代码演示|代码示例)\s*$/,
}

const DEMO_TAG_RE = /^\s*<demo\b/i

function walk(dir) {
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory())
      files.push(...walk(full))
    else if (entry.name.endsWith('.md'))
      files.push(full)
  }
  return files
}

function stripFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match)
    return { title: null, content }
  const titleMatch = match[1].match(/^title:\s*['"]?(.+?)['"]?\s*$/m)
  return {
    title: titleMatch ? titleMatch[1].trim() : null,
    content: content.slice(match[0].length).trim(),
  }
}

function stripDemoSection(content, locale) {
  const lines = content.split(/\r?\n/)
  const result = []
  let skipping = false
  for (const line of lines) {
    if (!skipping && DEMO_SECTION_RE[locale].test(line)) {
      skipping = true
      continue
    }
    if (skipping) {
      if (/^##\s+/.test(line))
        skipping = false
      else
        continue
    }
    result.push(line)
  }
  return result.join('\n').trim()
}

function cleanupDemoArtifacts(content) {
  const lines = content.split(/\r?\n/).filter(line => !DEMO_TAG_RE.test(line))
  const result = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (/^###\s+/.test(line)) {
      let j = i + 1
      while (j < lines.length && lines[j].trim() === '')
        j++
      if (j >= lines.length || /^#+\s+/.test(lines[j]))
        continue
    }
    result.push(line)
  }
  return result.join('\n').trim()
}

function parseDoc(filePath, locale) {
  const localeRoot = path.join(docsRoot, locale)
  const rel = path.relative(localeRoot, filePath).replace(/\\/g, '/')

  const raw = fs.readFileSync(filePath, 'utf-8').trim()
  if (!raw)
    return null

  const { title: fmTitle, content } = stripFrontmatter(raw)

  const isComponent = /^components\/[^/]+\/index\.md$/.test(rel)
  let title = fmTitle
  if (!title) {
    const h1 = content.match(/^#\s+(.+)$/m)
    title = h1 ? h1[1].trim() : path.basename(rel, '.md')
  }
  if (isComponent)
    title = rel.split('/')[1]

  const urlPath = rel.replace(/\.md$/, '').replace(/(^|\/)index$/, '$1')
  return {
    title,
    category: isComponent ? 'component' : 'docs',
    url: `${baseUrl}/${locale}/${urlPath}`,
    content,
    semanticContent: isComponent ? cleanupDemoArtifacts(stripDemoSection(content, locale)) : null,
  }
}

function collect(locale) {
  const items = []
  for (const file of walk(path.join(docsRoot, locale))) {
    try {
      const doc = parseDoc(file, locale)
      if (doc)
        items.push(doc)
    }
    catch (error) {
      console.warn(`Error processing ${file}:`, error)
    }
  }
  return {
    docs: items.filter(item => item.category === 'docs'),
    components: items.filter(item => item.category === 'component'),
  }
}

function byTitle(a, b) {
  return a.title.localeCompare(b.title)
}

function generate() {
  if (!fs.existsSync(siteRoot)) {
    console.error('Error: Output directory does not exist. Please run build first.')
    process.exit(1)
  }

  const en = collect('en')
  const zh = collect('zh')

  en.docs.sort(byTitle)
  en.components.sort(byTitle)
  zh.docs.sort(byTitle)
  zh.components.sort(byTitle)

  const semantics = en.components.map(component => ({
    ...component,
    content: component.semanticContent,
  }))
  const semanticsCn = zh.components.map(component => ({
    ...component,
    content: component.semanticContent,
  }))

  const semanticContent = [
    '# Element-Plus-X Semantic Documentation',
    '',
    'This file contains aggregated semantic descriptions for all components (component docs with demo sections removed).',
    '',
    `> Total ${semantics.length} components contain semantic descriptions`,
    '',
    ...semantics.flatMap((semantic) => {
      return [
        `# ${semantic.title}`,
        '',
        `Source: ${semantic.url}`,
        '',
        semantic.content || '',
        '',
        '---',
        '',
      ]
    }),
  ].join('\n')

  const semanticContentCn = [
    '# Element-Plus-X 组件语义化描述',
    '',
    '本文档包含所有组件的语义化描述（去除代码演示章节后的组件文档）。',
    '',
    `> 总计 ${semanticsCn.length} 个组件包含语义化描述`,
    '',
    ...semanticsCn.flatMap((semantic) => {
      return [
        `# ${semantic.title}`,
        '',
        `Source: ${semantic.url}`,
        '',
        semantic.content || '',
        '',
        '---',
        '',
      ]
    }),
  ].join('\n')

  const fullContent = [
    '# Element-Plus-X Component Documentation',
    '',
    'This file contains aggregated content from all component docs.',
    '',
    `> Total ${en.components.length} components`,
    '',
    ...en.components.flatMap((component) => {
      return [
        `## ${component.title}`,
        '',
        `Source: ${component.url}`,
        '',
        component.content || '',
        '',
        '---',
        '',
      ]
    }),
  ].join('\n')

  const fullContentCn = [
    '# Element-Plus-X 组件文档',
    '',
    '本文件包含所有组件文档的聚合内容。',
    '',
    `> 总计 ${zh.components.length} 个组件`,
    '',
    ...zh.components.flatMap((component) => {
      return [
        `## ${component.title}`,
        '',
        `Source: ${component.url}`,
        '',
        component.content || '',
        '',
        '---',
        '',
      ]
    }),
  ].join('\n')

  const llmsNavContent = [
    '# Element-Plus-X - Vue3 AI Experience Component Library',
    '',
    '- Element-Plus-X is a Vue 3 + Element Plus AI experience component library, providing chat-scenario components such as Bubble, Sender, XMarkdown, Thinking, and request hooks such as useXStream and useSend.',
    '',
    '## Navigation',
    '',
    '- [Full Documentation (EN)](./llms-full.txt)',
    '- [Full Documentation (CN)](./llms-full-cn.txt)',
    '- [Semantic Documentation (EN)](./llms-semantic.md)',
    '- [Semantic Documentation (CN)](./llms-semantic-cn.md)',
    '',
    '## Docs (EN)',
    '',
    ...en.docs.map(({ title, url }) => `- [${title}](${url})`),
    '',
    '## Docs (CN)',
    '',
    ...zh.docs.map(({ title, url }) => `- [${title}](${url})`),
    '',
    '## Component Docs (EN)',
    '',
    ...en.components.map(({ title, url }) => `- [${title}](${url})`),
    '',
    '## Component Docs (CN)',
    '',
    ...zh.components.map(({ title, url }) => `- [${title}](${url})`),
    '',
    '## Semantic (EN)',
    '',
    ...semantics.map(({ title, url }) => `- [${title}](${url})`),
    '',
    '## Semantic (CN)',
    '',
    ...semanticsCn.map(({ title, url }) => `- [${title}](${url})`),
    '',
  ].join('\n')

  fs.writeFileSync(path.join(siteRoot, 'llms-semantic.md'), semanticContent)
  fs.writeFileSync(path.join(siteRoot, 'llms-semantic-cn.md'), semanticContentCn)
  fs.writeFileSync(path.join(siteRoot, 'llms-full.txt'), fullContent)
  fs.writeFileSync(path.join(siteRoot, 'llms-full-cn.txt'), fullContentCn)
  fs.writeFileSync(path.join(siteRoot, 'llms.txt'), llmsNavContent)

  console.log(
    `Generated llms.txt (navigation), llms-full.txt (${en.components.length} components), `
    + `llms-full-cn.txt (${zh.components.length} components), `
    + `llms-semantic.md (${semantics.length} semantics), `
    + `llms-semantic-cn.md (${semanticsCn.length} semantics)`,
  )
}

generate()
