import type { Element, ElementContent } from 'hast'
import type { BundledLanguage, BundledTheme, LanguageInput, StringLiteralUnion, ThemeRegistrationAny } from 'shiki'
import type { Ref } from 'vue'
import Shiki from '@shikijs/markdown-it'
import { ElMessage } from 'element-plus'
import MarkdownIt from 'markdown-it'
import { onBeforeUnmount, ref, watch } from 'vue'
import '../assets/style/shiki.css'

// #region 类型定义

// 初始化Shiki配置
interface InitShikiOptions {
  // 语言列表
  langs: (LanguageInput | BundledLanguage)[] | undefined
  // 主题列表
  themes: Partial<
    Record<
      string,
      ThemeRegistrationAny | StringLiteralUnion<BundledTheme, string>
    >
  >
  languageClassHeader?: string
  showLanguageHeader?: boolean
  showLanguage?: boolean
  showCopyButton?: boolean
  copyButtonClass?: string
  copyButtonText?: string
  customHeader?: (node: Element) => void
}

interface ShikiRenderRes {
  shikiMd: Ref<MarkdownIt | null>
  isReady: Ref<boolean>
  initMarkdownIt: (options: InitShikiOptions) => Promise<void>
  destroy: () => void
}

// #endregion

// #region 工具
/**
 * @description 用于获取代码块的内容
 * @date 2025-03-28 14:00:54
 * @author tingfeng
 *
 * @param lines
 * @returns string
 */
function getCodeFromLines(lines: any[]) {
  return lines
    .map(line =>
      line.children
        .map((child: any) =>
          child.type === 'element' && child.children?.[0]?.type === 'text'
            ? child.children[0].value
            : '',
        )
        .join(''),
    )
    .join('\n') // 每行代码用 `\n` 连接
}

/**
 * @description 返回代码块的代码语言
 * @date 2025-03-28 14:38:28
 * @author tingfeng
 *
 * @param _options
 * @param node
 * @returns ElementContent
 */
function languageEle(_options: InitShikiOptions, node: Element): ElementContent {
  return {
    type: 'element',
    tagName: 'span',
    properties: {
      class: 'markdown-language-header-span el-card.is-always-shadow',
    },
    children: [
      {
        type: 'text',
        // 从node中获取当前标签class中拿到当前代码块语言
        value:
          String(
            // eslint-disable-next-line ts/ban-ts-comment
            // @ts-expect-error
            node.children[0]?.properties?.class,
          ).split('-')[1] || '',
      },
    ],
  } satisfies ElementContent
}

/**
 * @description 创建代码的复制按钮
 * @date 2025-03-28 14:38:44
 * @author tingfeng
 *
 * @param _options
 * @param codeText
 * @returns ElementContent
 */
function copyBtnEle(_options: InitShikiOptions, codeText: string): ElementContent {
  return {
    type: 'element',
    tagName: 'button',
    properties: {
      class:
        `markdown-language-header-button el-button el-button--primary is-text`
        + ` ${_options.copyButtonClass}`,
      dataCode: codeText,
      type: 'button',
    },
    children: [
      {
        type: 'text',
        value: _options.copyButtonText ?? '复制',
      },
    ],
  } satisfies ElementContent
}

/**
 * @description 创建header下的头部div
 * @date 2025-03-28 14:39:05
 * @author tingfeng
 *
 * @param options
 * @param node
 * @param codeText
 */
function getHeaderEle(options: InitShikiOptions, node: Element, codeText: string) {
  const { showLanguage, showCopyButton } = options
  if (showLanguage === undefined && showCopyButton === undefined) {
    return [languageEle(options, node), copyBtnEle(options, codeText)]
  }
  if (!showLanguage && !showCopyButton)
    return []

  // 返回全部或单个
  return [
    ...((showLanguage ?? !showCopyButton) ? [languageEle(options, node)] : []),
    ...((showCopyButton ?? !showLanguage)
      ? [copyBtnEle(options, codeText)]
      : []),
  ]
}

// #endregion

// #region useShikiRender
/**
 * @description 使用 markdown-it-shiki 插件渲染代码块
 * @date 2025-03-28 14:06:43
 * @author tingfeng
 *
 * @export
 * @returns
 *  {
    shikiMd,
    isReady,
    initMarkdownIt,
    destroy,
  }
 */
export default function useShikiRender(): ShikiRenderRes {
  const shikiMd = ref<MarkdownIt | null>(null)
  const isReady = ref<boolean>(false)

  /**
   * @description  Shiki方式渲染初始化
   * @date 2025-03-28 14:32:12
   * @author tingfeng
   *
   * @async
   * @returns {Promise<void>}
   */
  async function initMarkdownIt(options: InitShikiOptions): Promise<void> {
    if (isReady.value)
      return // 避免重复初始化

    shikiMd.value = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      breaks: true,
    })

    try {
      shikiMd.value.use(
        await Shiki({
          langs: options.langs ? [...options.langs] : [],
          themes: { ...options.themes },
          transformers: options.showLanguageHeader
            ? [
                {
                  pre(node) {
                    if (options.customHeader) {
                      options.customHeader(node)
                      return
                    }

                    const codeText = getCodeFromLines(this.lines)
                    node.properties['data-code'] = codeText // 这里存储代码内容

                    options.showLanguageHeader
                    && node.children.unshift({
                      type: 'element',
                      tagName: 'div',
                      properties: {
                        class:
                          `markdown-language-header-div el-card is-always-shadow`
                          + ` ${options.languageClassHeader}`,
                      },
                      children: getHeaderEle(options, node, codeText),
                    })
                  },
                },
              ]
            : undefined,
        }),
      )
      isReady.value = true
      console.log('✅ Markdown-It & Shiki 初始化完成')
    }
    catch (error) {
      console.error('❌ Shiki 初始化失败:', error)
      throw error
    }
  }

  /**
   * @description 释放 Markdown-It & Shiki
   * @date 2025-03-28 15:38:31
   * @author tingfeng
   */
  function destroy() {
    if (shikiMd.value) {
      console.log('🔄 释放 Shiki 资源...')

      // 清理 MarkdownIt 实例的插件（避免内存泄漏）
      shikiMd.value = null

      // 释放 Vue 响应式变量
      isReady.value = false

      console.log('✅ Shiki 资源已释放')
    }
  }

  /**
   * @description 复制代码内容到剪贴板
   * @date 2025-03-28 14:03:22
   * @author tingfeng
   *
   * @async
   * @param v
   * @returns void
   */
  async function copy(v: string) {
    try {
      // 现代浏览器 Clipboard API
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(v)
        ElMessage({
          message: '复制成功',
          type: 'success',
        })
        return // 复制成功直接返回
      }

      // 兼容旧浏览器的 execCommand 方案
      const textarea = document.createElement('textarea')
      textarea.value = v.trim()
      textarea.style.position = 'fixed' // 避免滚动到文本框位置
      document.body.appendChild(textarea)
      textarea.select()

      // 执行复制命令
      const success = document.execCommand('copy')
      document.body.removeChild(textarea)
      if (success) {
        ElMessage({
          message: '复制成功',
          type: 'success',
        })
        return // 复制成功直接返回
      }
      if (!success) {
        throw new Error('复制失败，请检查浏览器权限')
      }
    }
    catch (err) {
      throw new Error(
        `复制失败: ${err instanceof Error ? err.message : String(err)}`,
      )
    }
  }

  /**
   * @description 处理复制事件
   * @date 2025-03-28 14:03:51
   * @author tingfeng
   *
   * @param event
   */
  function handleCopyClick(event: MouseEvent) {
    const target = event.target as HTMLElement
    if (target.classList.contains('markdown-language-header-button')) {
      const code = target.getAttribute('data-code')
      if (code) {
        copy(code)
      }
    }
  }

  /* ----------------------------------- 其他 ----------------------------------- */

  watch(
    () => isReady.value,
    (v) => {
      if (v) {
        document.addEventListener('click', handleCopyClick)
      }
    },
  )

  // 在组件卸载时自动释放资源
  onBeforeUnmount(() => {
    destroy()
    document.removeEventListener('click', handleCopyClick)
  })

  return {
    shikiMd,
    isReady,
    initMarkdownIt,
    destroy,
  }
}

// #endregion
