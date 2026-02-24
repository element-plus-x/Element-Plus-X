import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { chromium } from 'playwright'

const [, , url, selectorArg, outArg] = process.argv

if (!url) {
  console.error('Usage: node scripts/screenshot-docs.mjs <url> [selector] [outFile]')
  process.exit(1)
}

const selector = selectorArg || '.elx-x-sender'
const outFile =
  outArg ||
  path.resolve(process.cwd(), '.tmp', `docs-screenshot-${Date.now()}.png`)

await fs.mkdir(path.dirname(outFile), { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 2
})

try {
  await page.goto(url, { waitUntil: 'networkidle' })
  const locator = page.locator(selector).first()
  await locator.waitFor({ state: 'visible', timeout: 15000 })
  await locator.scrollIntoViewIfNeeded()
  const debug = process.env.DUMP === '1'
  if (debug) {
    const result = await page.evaluate(sel => {
      const pick = q => document.querySelector(q)
      const box = el => {
        if (!el) return null
        const r = el.getBoundingClientRect()
        const cs = getComputedStyle(el)
        return {
          x: r.x,
          y: r.y,
          width: r.width,
          height: r.height,
          display: cs.display,
          alignItems: cs.alignItems,
          heightCss: cs.height,
          minHeightCss: cs.minHeight,
          paddingCss: cs.padding
        }
      }
      const root = document.querySelector(sel)
      const richText = root?.querySelector('.chat-rich-text')
      const richTextStyle = richText ? getComputedStyle(richText) : null
      const richTextFirst = richText?.firstElementChild
      const richTextFirstStyle = richTextFirst ? getComputedStyle(richTextFirst) : null
      const grid = root?.querySelector('.chat-grid-wrap')
      const gridStyle = grid ? getComputedStyle(grid) : null
      return {
        root: box(root),
        content: box(root?.querySelector('.elx-x-sender__content')),
        chatRoom: box(root?.querySelector('.elx-x-sender__chat-room')),
        chatContainer: box(root?.querySelector('.elx-x-sender__chat')),
        richText: box(richText),
        richTextText: richText?.textContent ?? null,
        richTextHtml: richText?.innerHTML?.slice(0, 400) ?? null,
        richTextComputed: richTextStyle
          ? { fontSize: richTextStyle.fontSize, lineHeight: richTextStyle.lineHeight }
          : null,
        richTextFirst: box(richTextFirst),
        richTextFirstComputed: richTextFirstStyle
          ? { fontSize: richTextFirstStyle.fontSize, lineHeight: richTextFirstStyle.lineHeight }
          : null,
        grid: box(grid),
        gridComputed: gridStyle
          ? {
              margin: gridStyle.margin,
              marginTop: gridStyle.marginTop,
              marginBottom: gridStyle.marginBottom,
              padding: gridStyle.padding,
              lineHeight: gridStyle.lineHeight,
              display: gridStyle.display
            }
          : null,
        placeholder: box(root?.querySelector('.chat-placeholder-wrap')),
        demoWrapper: box(root?.closest('.code-box-demo'))
      }
    }, selector)
    console.log(JSON.stringify(result, null, 2))
  }
  await locator.screenshot({ path: outFile })
  console.log(outFile)
} finally {
  await browser.close()
}
