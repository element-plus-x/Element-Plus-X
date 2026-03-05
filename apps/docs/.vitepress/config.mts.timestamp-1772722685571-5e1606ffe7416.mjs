// .vitepress/config.mts
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import Unocss from "file:///C:/Users/%E5%98%89%E6%82%A6/Desktop/elx_hotfix/Element-Plus-X/node_modules/unocss/dist/vite.mjs";
import AutoImport from "file:///C:/Users/%E5%98%89%E6%82%A6/Desktop/elx_hotfix/Element-Plus-X/node_modules/unplugin-auto-import/dist/vite.js";
import { ElementPlusResolver } from "file:///C:/Users/%E5%98%89%E6%82%A6/Desktop/elx_hotfix/Element-Plus-X/node_modules/unplugin-vue-components/dist/resolvers.js";
import Components from "file:///C:/Users/%E5%98%89%E6%82%A6/Desktop/elx_hotfix/Element-Plus-X/node_modules/unplugin-vue-components/dist/vite.js";
import { defineConfig } from "file:///C:/Users/%E5%98%89%E6%82%A6/Desktop/elx_hotfix/Element-Plus-X/node_modules/vitepress/dist/node/index.js";
import { groupIconMdPlugin, groupIconVitePlugin } from "file:///C:/Users/%E5%98%89%E6%82%A6/Desktop/elx_hotfix/Element-Plus-X/node_modules/vitepress-plugin-group-icons/dist/index.js";

// ../../configs/commit-types.ts
var COMMIT_TYPES = [
  {
    type: "feat",
    emoji: "\u{1F680}",
    zhLabel: "\u65B0\u589E",
    enLabel: "Feature",
    color: "#1890ff",
    bgColor: "#e6f4ff",
    borderColor: "#91caff",
    description: "A new feature",
    descriptionZh: "\u65B0\u589E\u529F\u80FD",
    aliases: ["feature"],
    issueLabel: "\u{1F680} feat: \u65B0\u589E\u529F\u80FD"
  },
  {
    type: "fix",
    emoji: "\u{1F41B}",
    zhLabel: "\u4FEE\u590D",
    enLabel: "Fix",
    color: "#52c41a",
    bgColor: "#f6ffed",
    borderColor: "#b7eb8f",
    description: "A bug fix",
    descriptionZh: "\u4FEE\u590D\u7F3A\u9677",
    issueLabel: "\u{1F41B} fix: \u4FEE\u590D\u7F3A\u9677"
  },
  {
    type: "docs",
    emoji: "\u{1F4DA}",
    zhLabel: "\u6587\u6863",
    enLabel: "Docs",
    color: "#722ed1",
    bgColor: "#f9f0ff",
    borderColor: "#d3adf7",
    description: "Documentation only changes",
    descriptionZh: "\u6587\u6863\u66F4\u65B0",
    issueLabel: "\u{1F4DA} docs: \u6587\u6863\u66F4\u65B0"
  },
  {
    type: "style",
    emoji: "\u{1F484}",
    zhLabel: "\u6837\u5F0F",
    enLabel: "Style",
    color: "#eb2f96",
    bgColor: "#fff0f6",
    borderColor: "#ffadd2",
    description: "Code style changes (formatting, semicolons, etc)",
    descriptionZh: "\u4EE3\u7801\u683C\u5F0F\uFF08\u4E0D\u5F71\u54CD\u903B\u8F91\uFF09",
    issueLabel: "\u{1F484} style: \u4EE3\u7801\u683C\u5F0F"
  },
  {
    type: "refactor",
    emoji: "\u267B\uFE0F",
    zhLabel: "\u91CD\u6784",
    enLabel: "Refactor",
    color: "#fa8c16",
    bgColor: "#fff7e6",
    borderColor: "#ffd591",
    description: "Code refactoring",
    descriptionZh: "\u4EE3\u7801\u91CD\u6784",
    issueLabel: "\u267B\uFE0F refactor: \u4EE3\u7801\u91CD\u6784"
  },
  {
    type: "perf",
    emoji: "\u26A1",
    zhLabel: "\u6027\u80FD",
    enLabel: "Perf",
    color: "#13c2c2",
    bgColor: "#e6fffb",
    borderColor: "#87e8de",
    description: "Performance improvements",
    descriptionZh: "\u6027\u80FD\u4F18\u5316",
    issueLabel: "\u26A1 perf: \u6027\u80FD\u4F18\u5316"
  },
  {
    type: "test",
    emoji: "\u2705",
    zhLabel: "\u6D4B\u8BD5",
    enLabel: "Test",
    color: "#2f54eb",
    bgColor: "#f0f5ff",
    borderColor: "#adc6ff",
    description: "Adding or updating tests",
    descriptionZh: "\u6D4B\u8BD5\u76F8\u5173",
    issueLabel: "\u2705 test: \u6D4B\u8BD5\u76F8\u5173"
  },
  {
    type: "build",
    emoji: "\u{1F4E6}",
    zhLabel: "\u6784\u5EFA",
    enLabel: "Build",
    color: "#595959",
    bgColor: "#fafafa",
    borderColor: "#d9d9d9",
    description: "Build system changes",
    descriptionZh: "\u6784\u5EFA\u76F8\u5173",
    issueLabel: "\u{1F4E6} build: \u6784\u5EFA\u76F8\u5173"
  },
  {
    type: "ci",
    emoji: "\u{1F477}",
    zhLabel: "CI",
    enLabel: "CI",
    color: "#434958",
    bgColor: "#f3f4f6",
    borderColor: "#c4c7cc",
    description: "CI configuration changes",
    descriptionZh: "CI \u914D\u7F6E",
    issueLabel: "\u{1F477} ci: \u6301\u7EED\u96C6\u6210"
  },
  {
    type: "chore",
    emoji: "\u{1F527}",
    zhLabel: "\u6742\u9879",
    enLabel: "Chore",
    color: "#8c8c8c",
    bgColor: "#fafafa",
    borderColor: "#d9d9d9",
    description: "Other changes that do not modify src or test files",
    descriptionZh: "\u5176\u4ED6\u4FEE\u6539",
    issueLabel: "\u{1F527} chore: \u5176\u4ED6\u4FEE\u6539"
  },
  {
    type: "revert",
    emoji: "\u23EA",
    zhLabel: "\u56DE\u9000",
    enLabel: "Revert",
    color: "#f5222d",
    bgColor: "#fff1f0",
    borderColor: "#ffa39e",
    description: "Revert changes",
    descriptionZh: "\u56DE\u9000\u4EE3\u7801",
    issueLabel: "\u23EA revert: \u56DE\u9000\u4EE3\u7801"
  },
  {
    type: "breaking",
    emoji: "\u{1F4A5}",
    zhLabel: "\u7834\u574F\u6027",
    enLabel: "Breaking",
    color: "#f5222d",
    bgColor: "#fff1f0",
    borderColor: "#ff4d4f",
    description: "Breaking changes",
    descriptionZh: "\u7834\u574F\u6027\u53D8\u66F4",
    issueLabel: "\u{1F4A5} breaking: \u7834\u574F\u6027\u53D8\u66F4"
  }
];
var TYPE_ENUM = COMMIT_TYPES.map((t) => t.type);
var TYPE_ALIAS_MAP = {};
for (const config2 of COMMIT_TYPES) {
  TYPE_ALIAS_MAP[config2.type] = config2.type;
  if (config2.aliases) {
    for (const alias of config2.aliases) {
      TYPE_ALIAS_MAP[alias] = config2.type;
    }
  }
}
var COMMIT_TYPE_MAP = Object.fromEntries(
  COMMIT_TYPES.map((t) => [t.type, t])
);

// ../../configs/components.ts
var COMPONENT_CATEGORIES = {
  new: { zhLabel: "\u4E0A\u65B0", enLabel: "New" },
  config: { zhLabel: "\u914D\u7F6E", enLabel: "Configuration" },
  general: { zhLabel: "\u901A\u7528", enLabel: "General" },
  awakening: { zhLabel: "\u5524\u9192", enLabel: "Awakening" },
  expression: { zhLabel: "\u8868\u8FBE", enLabel: "Expression" },
  confirmation: { zhLabel: "\u786E\u8BA4", enLabel: "Confirmation" },
  tools: { zhLabel: "\u5DE5\u5177", enLabel: "Tools" }
};
var COMPONENTS = [
  {
    name: "XSender",
    nameLower: "xsender",
    zhTitle: "XSender \u8F93\u5165\u6846",
    enTitle: "XSender Input",
    category: "new",
    badge: { type: "new", text: "2.0.0" }
  },
  {
    name: "XMarkdown",
    nameLower: "xMarkdown",
    zhTitle: "XMarkdown\uFF08\u72EC\u7ACB\u5305\uFF09",
    enTitle: "XMarkdown (External)",
    category: "new",
    badge: { type: "beta", text: "Beta" },
    external: {
      package: "x-markdown-vue",
      npmLink: "https://www.npmjs.com/package/x-markdown-vue",
      sourceLink: "https://github.com/element-plus-x/x-markdown",
      importStatement: "import { MarkdownRenderer } from 'x-markdown-vue'",
      styleStatement: "import 'x-markdown-vue/style'"
    }
  },
  {
    name: "ConfigProvider",
    nameLower: "configProvider",
    zhTitle: "ConfigProvider \u5168\u5C40\u914D\u7F6E",
    enTitle: "ConfigProvider",
    category: "config",
    badge: { type: "beta", text: "Beta" }
  },
  {
    name: "Bubble",
    nameLower: "bubble",
    zhTitle: "Bubble \u5BF9\u8BDD\u6C14\u6CE1",
    enTitle: "Bubble",
    category: "general"
  },
  {
    name: "BubbleList",
    nameLower: "bubbleList",
    zhTitle: "BubbleList \u6C14\u6CE1\u5217\u8868",
    enTitle: "BubbleList",
    category: "general"
  },
  {
    name: "Conversations",
    nameLower: "conversations",
    zhTitle: "Conversations \u4F1A\u8BDD\u7BA1\u7406",
    enTitle: "Conversations",
    category: "general"
  },
  {
    name: "Welcome",
    nameLower: "welcome",
    zhTitle: "Welcome \u6B22\u8FCE",
    enTitle: "Welcome",
    category: "awakening"
  },
  {
    name: "Prompts",
    nameLower: "prompts",
    zhTitle: "Prompts \u63D0\u793A\u96C6",
    enTitle: "Prompts",
    category: "awakening"
  },
  {
    name: "FilesCard",
    nameLower: "filesCard",
    zhTitle: "FilesCard \u6587\u4EF6\u5361\u7247",
    enTitle: "FilesCard",
    category: "expression"
  },
  {
    name: "Attachments",
    nameLower: "attachments",
    zhTitle: "Attachments \u8F93\u5165\u9644\u4EF6",
    enTitle: "Attachments",
    category: "expression"
  },
  {
    name: "Thinking",
    nameLower: "thinking",
    zhTitle: "Thinking \u601D\u8003\u4E2D",
    enTitle: "Thinking",
    category: "confirmation"
  },
  {
    name: "ThoughtChain",
    nameLower: "thoughtChain",
    zhTitle: "ThoughtChain \u601D\u7EF4\u94FE",
    enTitle: "ThoughtChain",
    category: "confirmation"
  },
  {
    name: "useRecord",
    nameLower: "useRecord",
    zhTitle: "useRecord",
    enTitle: "useRecord",
    category: "tools",
    isHook: true
  },
  {
    name: "useXStream",
    nameLower: "useXStream",
    zhTitle: "useXStream",
    enTitle: "useXStream",
    category: "tools",
    isHook: true
  },
  {
    name: "useSend",
    nameLower: "useSend",
    zhTitle: "useSend & XRequest",
    enTitle: "useSend & XRequest",
    category: "tools",
    isHook: true
  }
];
var COMPONENT_NAMES = COMPONENTS.map((c) => c.name);
var COMPONENT_NAMES_LOWER = COMPONENTS.map((c) => c.nameLower);
function getComponentsByCategory(category) {
  return COMPONENTS.filter((c) => c.category === category);
}
function getSidebarConfig(lang) {
  const sidebar = [];
  const categories = ["new", "config", "general", "awakening", "expression", "confirmation", "tools"];
  for (const category of categories) {
    const comps = getComponentsByCategory(category);
    if (comps.length === 0) continue;
    const categoryLabel = COMPONENT_CATEGORIES[category];
    sidebar.push({
      text: lang === "zh" ? categoryLabel.zhLabel : categoryLabel.enLabel,
      items: comps.map((comp) => ({
        text: lang === "zh" ? comp.zhTitle : comp.enTitle,
        link: `/${lang}/components/${comp.nameLower}/`,
        badge: comp.badge
      }))
    });
  }
  return sidebar;
}
var NAV_ECOSYSTEM_ITEMS = [
  {
    text: "\u751F\u6001",
    items: [
      { text: "ruoyi-element-ai (\u6A21\u677F\u9879\u76EE)", link: "https://chat-docs.element-plus-x.com/" },
      { text: "element-ui-x (vue2\u7248\u672C)", link: "https://element-ui-x.com/" },
      { text: "hook-fetch (\u4F18\u96C5\u8BF7\u6C42\u5E93)", link: "https://jsonlee12138.github.io/hook-fetch/" },
      { text: "ChatArea (\u8F7B\u91CF\u7EA7\u804A\u5929\u6846)", link: "https://jianfv.top/ChatAreaDoc/home" }
    ]
  },
  {
    text: "v1.x (\u5F53\u524D)",
    items: [
      { text: "v1.x (\u5F53\u524D)", link: "https://v1.element-plus-x.com/zh/" },
      { text: "v2.x (Beta)", link: "https://v2.element-plus-x.com/zh/" }
    ]
  }
];
function getNavConfig(lang) {
  const ecosystemItems = NAV_ECOSYSTEM_ITEMS.map((item) => ({
    ...item,
    text: lang === "zh" ? item.text === "\u751F\u6001" ? "\u751F\u6001" : item.text : item.text === "\u751F\u6001" ? "Ecosystem" : item.text,
    items: item.items?.map((sub) => ({
      ...sub,
      text: lang === "zh" ? sub.text : sub.text.replace("\u6A21\u677F\u9879\u76EE", "Template").replace("\u4F18\u96C5\u8BF7\u6C42\u5E93", "Request Lib").replace("\u8F7B\u91CF\u7EA7\u804A\u5929\u6846", "Chat Box")
    }))
  }));
  return [
    ecosystemItems[0],
    ecosystemItems[1],
    { text: lang === "zh" ? "\u6307\u5357" : "Guide", link: `/${lang}/guide/install` },
    { text: lang === "zh" ? "\u7EC4\u4EF6" : "Components", link: `/${lang}/components/xsender/` }
  ];
}
var GUIDE_SIDEBAR_ZH = [
  {
    text: "\u57FA\u7840",
    items: [
      { text: "\u5B89\u88C5\u6307\u5357", link: "/zh/guide/install" },
      { text: "\u5F00\u53D1\u6307\u5357", link: "/zh/guide/develop" }
    ]
  },
  {
    text: "\u793E\u533A",
    items: [{ text: "\u4EA4\u6D41\u9080\u8BF7", link: "/zh/guide/introduce" }]
  },
  {
    text: "\u53D8\u66F4",
    items: [{ text: "\u66F4\u65B0\u65E5\u5FD7", link: "/zh/guide/update-log" }]
  },
  {
    text: "\u53CD\u9988",
    items: [{ text: "\u95EE\u9898\u53CD\u9988", link: "/zh/guide/issue" }]
  },
  {
    text: "\u8D21\u732E",
    items: [{ text: "\u8D21\u732E\u6307\u5357", link: "/zh/guide/contribution" }]
  }
];
var GUIDE_SIDEBAR_EN = [
  {
    text: "Basic",
    items: [
      { text: "Installation", link: "/en/guide/install" },
      { text: "Development", link: "/en/guide/develop" }
    ]
  },
  {
    text: "Community",
    items: [{ text: "Invitation", link: "/en/guide/introduce" }]
  },
  {
    text: "Changelog",
    items: [{ text: "Changelog", link: "/en/guide/update-log" }]
  },
  {
    text: "Feedback",
    items: [{ text: "Issue Feedback", link: "/en/guide/issue" }]
  },
  {
    text: "Contribution",
    items: [{ text: "Contribution Guide", link: "/en/guide/contribution" }]
  }
];

// .vitepress/locales.mts
var config = {
  root: {
    label: "\u7B80\u4F53\u4E2D\u6587",
    lang: "zh-CN",
    link: "/zh/",
    themeConfig: {
      lastUpdated: {
        text: "\u6700\u540E\u66F4\u65B0\u4E8E",
        formatOptions: {
          dateStyle: "medium",
          timeStyle: "short"
        }
      },
      editLink: {
        pattern: "https://github.com/HeJiaYue520/Element-Plus-X/edit/main/apps/docs/:path",
        text: "\u5728 GitHub \u4E0A\u7F16\u8F91\u6B64\u9875\u9762"
      },
      nav: getNavConfig("zh"),
      sidebar: {
        "/zh/components/": getSidebarConfig("zh"),
        "/zh/guide/": GUIDE_SIDEBAR_ZH
      },
      search: {
        provider: "local",
        options: {
          translations: {
            button: {
              buttonText: "\u641C\u7D22\u6587\u6863",
              buttonAriaLabel: "\u641C\u7D22\u6587\u6863"
            },
            modal: {
              noResultsText: "\u65E0\u6CD5\u627E\u5230\u76F8\u5173\u7ED3\u679C",
              resetButtonTitle: "\u6E05\u9664\u67E5\u8BE2\u6761\u4EF6",
              footer: {
                selectText: "\u9009\u62E9",
                navigateText: "\u5207\u6362",
                closeText: "\u5173\u95ED"
              }
            }
          }
        }
      },
      docFooter: {
        prev: "\u4E0A\u4E00\u7BC7",
        next: "\u4E0B\u4E00\u7BC7"
      },
      sidebarMenuLabel: "\u83DC\u5355",
      returnToTopLabel: "\u8FD4\u56DE\u9876\u90E8",
      darkModeSwitchLabel: "\u6DF1\u8272\u6A21\u5F0F",
      outline: {
        label: "\u76EE\u5F55",
        level: [2, 6]
      }
    }
  },
  en: {
    label: "English",
    lang: "en-US",
    link: "/en/",
    themeConfig: {
      lastUpdated: {
        text: "Last updated",
        formatOptions: {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        }
      },
      editLink: {
        pattern: "https://github.com/HeJiaYue520/Element-Plus-X/edit/main/apps/docs/:path",
        text: "Edit this page on GitHub"
      },
      nav: getNavConfig("en"),
      sidebar: {
        "/en/components/": getSidebarConfig("en"),
        "/en/guide/": GUIDE_SIDEBAR_EN
      },
      search: {
        provider: "local",
        options: {
          translations: {
            button: {
              buttonText: "Search",
              buttonAriaLabel: "Search"
            },
            modal: {
              noResultsText: "No results found",
              resetButtonTitle: "Clear query",
              footer: {
                selectText: "Select",
                navigateText: "Navigate",
                closeText: "Close"
              }
            }
          }
        }
      },
      docFooter: {
        prev: "Previous",
        next: "Next"
      },
      sidebarMenuLabel: "Menu",
      returnToTopLabel: "Back to top",
      darkModeSwitchLabel: "Dark mode",
      outline: {
        label: "\u{1F4D6} Table of Contents",
        level: [2, 6]
      }
    }
  }
};
var locales_default = config;

// scripts/vue-element-plus-x-resolver.ts
function tovUIResolver() {
  return {
    type: "component",
    resolve(name) {
      if (name.startsWith("El") || name.startsWith("el")) {
        return {
          name,
          from: "element-plus"
        };
      }
      if (name === "ClientOnly") {
        return null;
      }
      return {
        name,
        from: "vue-element-plus-x"
      };
    }
  };
}

// .vitepress/config.mts
var __vite_injected_original_import_meta_url = "file:///C:/Users/%E5%98%89%E6%82%A6/Desktop/elx_hotfix/Element-Plus-X/apps/docs/.vitepress/config.mts";
function getGitBranch() {
  try {
    return execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf-8" }).trim();
  } catch {
    return "main";
  }
}
var gitBranch = getGitBranch();
var cacheDir = process.env.NODE_ENV === "development" ? `node_modules/.vitepress-cache-${process.pid}` : "node_modules/.vitepress-cache";
var docsUseSource = process.env.DOCS_USE_SOURCE === "true" || process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
var config_default = defineConfig({
  title: "Element-Plus-X",
  description: "A Vue3 + Element-Plus AI Experience Component Library",
  locales: locales_default,
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }]
  ],
  lastUpdated: true,
  // 全局主题配置（会被 locales 中的配置覆盖）
  themeConfig: {
    logo: "/logo.png",
    logoLink: "/zh/",
    socialLinks: [
      { icon: "github", link: `https://github.com/element-plus-x/Element-Plus-X` },
      {
        icon: {
          svg: '<svg t="1741408990097" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1514" width="200" height="200"><path d="M64 960V128h832v832z" fill="#CB3837" p-id="1515"></path><path d="M192 320h576v512h-128V448H448v384H192z" fill="#FFFFFF" p-id="1516"></path></svg>'
        },
        link: "https://www.npmjs.com/package/vue-element-plus-x"
      }
    ],
    search: {
      provider: "local"
    }
  },
  // markdown 配置
  markdown: {
    // 显示代码行数
    lineNumbers: true,
    container: {
      tipLabel: "\u{1F4A1} Tip",
      warningLabel: "\u{1F4CC} Warning",
      dangerLabel: "\u{1F494} Danger",
      infoLabel: "\u{1F48C} Info",
      detailsLabel: "\u{1F3A8} Details"
    },
    config(md) {
      md.use(groupIconMdPlugin);
    }
  },
  vite: {
    cacheDir,
    define: {
      __VITE_GITHUB_BRANCH__: JSON.stringify(gitBranch)
    },
    resolve: {
      alias: docsUseSource ? [
        {
          find: /^vue-element-plus-x$/,
          replacement: fileURLToPath(
            new URL("../../../packages/core/src/index.ts", __vite_injected_original_import_meta_url)
          )
        },
        {
          find: /^vue-element-plus-x\/styles\/index\.css$/,
          replacement: fileURLToPath(
            new URL("../../../packages/core/src/styles/index.scss", __vite_injected_original_import_meta_url)
          )
        },
        {
          find: "@configs",
          replacement: fileURLToPath(
            new URL("../../../configs", __vite_injected_original_import_meta_url)
          )
        },
        {
          find: "@components",
          replacement: fileURLToPath(
            new URL("../../../packages/core/src/components", __vite_injected_original_import_meta_url)
          )
        }
      ] : [
        {
          find: "@configs",
          replacement: fileURLToPath(
            new URL("../../../configs", __vite_injected_original_import_meta_url)
          )
        }
      ]
    },
    plugins: [
      // 配置vitepress的插件
      // https://github.com/antfu/vite-plugin-inspect
      // 插件调试
      // inspect(),
      // https://github.com/antfu/vite-plugin-pages
      // 页面路由
      // prismjsPlugin({
      //   languages: 'all', // 语言
      //   theme: 'default', // 主题
      // }) as Plugin,
      AutoImport({
        imports: ["vue"],
        ignore: ["h", "ClientOnly"],
        dts: fileURLToPath(new URL("../auto-imports.d.ts", __vite_injected_original_import_meta_url)),
        resolvers: [
          ElementPlusResolver({
            exclude: /ElButtonGroup/
          })
        ]
      }),
      Components({
        dts: fileURLToPath(new URL("../components.d.ts", __vite_injected_original_import_meta_url)),
        dirs: [fileURLToPath(new URL("./components", __vite_injected_original_import_meta_url))],
        resolvers: [tovUIResolver(), ElementPlusResolver({ importStyle: false })]
      }),
      groupIconVitePlugin(),
      Unocss()
    ],
    ssr: {
      noExternal: ["element-plus", "gsap", "vue-element-plus-x", "x-markdown-vue"]
    }
  }
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLnZpdGVwcmVzcy9jb25maWcubXRzIiwgIi4uLy4uL2NvbmZpZ3MvY29tbWl0LXR5cGVzLnRzIiwgIi4uLy4uL2NvbmZpZ3MvY29tcG9uZW50cy50cyIsICIudml0ZXByZXNzL2xvY2FsZXMubXRzIiwgInNjcmlwdHMvdnVlLWVsZW1lbnQtcGx1cy14LXJlc29sdmVyLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcXHU1NjA5XHU2MEE2XFxcXERlc2t0b3BcXFxcZWx4X2hvdGZpeFxcXFxFbGVtZW50LVBsdXMtWFxcXFxhcHBzXFxcXGRvY3NcXFxcLnZpdGVwcmVzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcXHU1NjA5XHU2MEE2XFxcXERlc2t0b3BcXFxcZWx4X2hvdGZpeFxcXFxFbGVtZW50LVBsdXMtWFxcXFxhcHBzXFxcXGRvY3NcXFxcLnZpdGVwcmVzc1xcXFxjb25maWcubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy8lRTUlOTglODklRTYlODIlQTYvRGVza3RvcC9lbHhfaG90Zml4L0VsZW1lbnQtUGx1cy1YL2FwcHMvZG9jcy8udml0ZXByZXNzL2NvbmZpZy5tdHNcIjtpbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ25vZGU6Y2hpbGRfcHJvY2Vzcyc7XHJcbmltcG9ydCB0eXBlIHsgUGx1Z2luIH0gZnJvbSAndml0ZXByZXNzJztcclxuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ25vZGU6dXJsJztcclxuaW1wb3J0IFVub2NzcyBmcm9tICd1bm9jc3Mvdml0ZSc7XHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnO1xyXG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJztcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSc7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGVwcmVzcyc7XHJcblxyXG4vLyBcdTUzRTZcdTRFMDBcdTc5Q0QgZGVtbyBcdTYzRDJcdTRFRjZcclxuLy8gaW1wb3J0IHsgdml0ZXByZXNzRGVtb1BsdWdpbiB9IGZyb20gJ3ZpdGVwcmVzcy1kZW1vLXBsdWdpbidcclxuaW1wb3J0IHsgZ3JvdXBJY29uTWRQbHVnaW4sIGdyb3VwSWNvblZpdGVQbHVnaW4gfSBmcm9tICd2aXRlcHJlc3MtcGx1Z2luLWdyb3VwLWljb25zJztcclxuaW1wb3J0IGxvY2FsZXMgZnJvbSAnLi9sb2NhbGVzLm10cyc7XHJcbmltcG9ydCB7IHRvdlVJUmVzb2x2ZXIgfSBmcm9tICcuLi9zY3JpcHRzL3Z1ZS1lbGVtZW50LXBsdXMteC1yZXNvbHZlcic7XHJcblxyXG5mdW5jdGlvbiBnZXRHaXRCcmFuY2goKTogc3RyaW5nIHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGV4ZWNTeW5jKCdnaXQgcmV2LXBhcnNlIC0tYWJicmV2LXJlZiBIRUFEJywgeyBlbmNvZGluZzogJ3V0Zi04JyB9KS50cmltKCk7XHJcbiAgfSBjYXRjaCB7XHJcbiAgICByZXR1cm4gJ21haW4nO1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgZ2l0QnJhbmNoID0gZ2V0R2l0QnJhbmNoKCk7XHJcblxyXG5jb25zdCBjYWNoZURpciA9XHJcbiAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCdcclxuICAgID8gYG5vZGVfbW9kdWxlcy8udml0ZXByZXNzLWNhY2hlLSR7cHJvY2Vzcy5waWR9YFxyXG4gICAgOiAnbm9kZV9tb2R1bGVzLy52aXRlcHJlc3MtY2FjaGUnO1xyXG5cclxuY29uc3QgZG9jc1VzZVNvdXJjZSA9XHJcbiAgcHJvY2Vzcy5lbnYuRE9DU19VU0VfU09VUkNFID09PSAndHJ1ZScgfHxcclxuICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyB8fFxyXG4gICFwcm9jZXNzLmVudi5OT0RFX0VOVjtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZXByZXNzLmRldi9yZWZlcmVuY2Uvc2l0ZS1jb25maWdcclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICB0aXRsZTogJ0VsZW1lbnQtUGx1cy1YJyxcclxuICBkZXNjcmlwdGlvbjogJ0EgVnVlMyArIEVsZW1lbnQtUGx1cyBBSSBFeHBlcmllbmNlIENvbXBvbmVudCBMaWJyYXJ5JyxcclxuICBsb2NhbGVzLFxyXG4gIGhlYWQ6IFtcclxuICAgIFsnbGluaycsIHsgcmVsOiAnaWNvbicsIGhyZWY6ICcvZmF2aWNvbi5pY28nIH1dLFxyXG4gIF0sXHJcbiAgbGFzdFVwZGF0ZWQ6IHRydWUsXHJcbiAgLy8gXHU1MTY4XHU1QzQwXHU0RTNCXHU5ODk4XHU5MTREXHU3RjZFXHVGRjA4XHU0RjFBXHU4OEFCIGxvY2FsZXMgXHU0RTJEXHU3Njg0XHU5MTREXHU3RjZFXHU4OTg2XHU3NkQ2XHVGRjA5XHJcbiAgdGhlbWVDb25maWc6IHtcclxuICAgIGxvZ286ICcvbG9nby5wbmcnLFxyXG4gICAgbG9nb0xpbms6ICcvemgvJyxcclxuICAgIHNvY2lhbExpbmtzOiBbXHJcbiAgICAgIHsgaWNvbjogJ2dpdGh1YicsIGxpbms6IGBodHRwczovL2dpdGh1Yi5jb20vZWxlbWVudC1wbHVzLXgvRWxlbWVudC1QbHVzLVhgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBpY29uOiB7XHJcbiAgICAgICAgICBzdmc6ICc8c3ZnIHQ9XCIxNzQxNDA4OTkwMDk3XCIgY2xhc3M9XCJpY29uXCIgdmlld0JveD1cIjAgMCAxMDI0IDEwMjRcIiB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHAtaWQ9XCIxNTE0XCIgd2lkdGg9XCIyMDBcIiBoZWlnaHQ9XCIyMDBcIj48cGF0aCBkPVwiTTY0IDk2MFYxMjhoODMydjgzMnpcIiBmaWxsPVwiI0NCMzgzN1wiIHAtaWQ9XCIxNTE1XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTkyIDMyMGg1NzZ2NTEyaC0xMjhWNDQ4SDQ0OHYzODRIMTkyelwiIGZpbGw9XCIjRkZGRkZGXCIgcC1pZD1cIjE1MTZcIj48L3BhdGg+PC9zdmc+JyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxpbms6ICdodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS92dWUtZWxlbWVudC1wbHVzLXgnLFxyXG4gICAgICB9LFxyXG4gICAgXSxcclxuICAgIHNlYXJjaDoge1xyXG4gICAgICBwcm92aWRlcjogJ2xvY2FsJyxcclxuICAgIH0sXHJcbiAgfSxcclxuICAvLyBtYXJrZG93biBcdTkxNERcdTdGNkVcclxuICBtYXJrZG93bjoge1xyXG4gICAgLy8gXHU2NjNFXHU3OTNBXHU0RUUzXHU3ODAxXHU4ODRDXHU2NTcwXHJcbiAgICBsaW5lTnVtYmVyczogdHJ1ZSxcclxuICAgIGNvbnRhaW5lcjoge1xyXG4gICAgICB0aXBMYWJlbDogJ1x1RDgzRFx1RENBMSBUaXAnLFxyXG4gICAgICB3YXJuaW5nTGFiZWw6ICdcdUQ4M0RcdURDQ0MgV2FybmluZycsXHJcbiAgICAgIGRhbmdlckxhYmVsOiAnXHVEODNEXHVEQzk0IERhbmdlcicsXHJcbiAgICAgIGluZm9MYWJlbDogJ1x1RDgzRFx1REM4QyBJbmZvJyxcclxuICAgICAgZGV0YWlsc0xhYmVsOiAnXHVEODNDXHVERkE4IERldGFpbHMnLFxyXG4gICAgfSxcclxuICAgIGNvbmZpZyhtZCkge1xyXG4gICAgICAvLyBtZC51c2Uodml0ZXByZXNzRGVtb1BsdWdpbilcclxuICAgICAgbWQudXNlKGdyb3VwSWNvbk1kUGx1Z2luKTtcclxuICAgIH0sXHJcbiAgfSxcclxuICB2aXRlOiB7XHJcbiAgICBjYWNoZURpcixcclxuICAgIGRlZmluZToge1xyXG4gICAgICBfX1ZJVEVfR0lUSFVCX0JSQU5DSF9fOiBKU09OLnN0cmluZ2lmeShnaXRCcmFuY2gpLFxyXG4gICAgfSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IGRvY3NVc2VTb3VyY2VcclxuICAgICAgICA/IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGZpbmQ6IC9ednVlLWVsZW1lbnQtcGx1cy14JC8sXHJcbiAgICAgICAgICAgICAgcmVwbGFjZW1lbnQ6IGZpbGVVUkxUb1BhdGgoXHJcbiAgICAgICAgICAgICAgICBuZXcgVVJMKCcuLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9pbmRleC50cycsIGltcG9ydC5tZXRhLnVybClcclxuICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBmaW5kOiAvXnZ1ZS1lbGVtZW50LXBsdXMteFxcL3N0eWxlc1xcL2luZGV4XFwuY3NzJC8sXHJcbiAgICAgICAgICAgICAgcmVwbGFjZW1lbnQ6IGZpbGVVUkxUb1BhdGgoXHJcbiAgICAgICAgICAgICAgICBuZXcgVVJMKCcuLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9zdHlsZXMvaW5kZXguc2NzcycsIGltcG9ydC5tZXRhLnVybClcclxuICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBmaW5kOiAnQGNvbmZpZ3MnLFxyXG4gICAgICAgICAgICAgIHJlcGxhY2VtZW50OiBmaWxlVVJMVG9QYXRoKFxyXG4gICAgICAgICAgICAgICAgbmV3IFVSTCgnLi4vLi4vLi4vY29uZmlncycsIGltcG9ydC5tZXRhLnVybClcclxuICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBmaW5kOiAnQGNvbXBvbmVudHMnLFxyXG4gICAgICAgICAgICAgIHJlcGxhY2VtZW50OiBmaWxlVVJMVG9QYXRoKFxyXG4gICAgICAgICAgICAgICAgbmV3IFVSTCgnLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvY29tcG9uZW50cycsIGltcG9ydC5tZXRhLnVybClcclxuICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICA6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGZpbmQ6ICdAY29uZmlncycsXHJcbiAgICAgICAgICAgICAgcmVwbGFjZW1lbnQ6IGZpbGVVUkxUb1BhdGgoXHJcbiAgICAgICAgICAgICAgICBuZXcgVVJMKCcuLi8uLi8uLi9jb25maWdzJywgaW1wb3J0Lm1ldGEudXJsKVxyXG4gICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXSxcclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIC8vIFx1OTE0RFx1N0Y2RXZpdGVwcmVzc1x1NzY4NFx1NjNEMlx1NEVGNlxyXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdml0ZS1wbHVnaW4taW5zcGVjdFxyXG4gICAgICAvLyBcdTYzRDJcdTRFRjZcdThDMDNcdThCRDVcclxuICAgICAgLy8gaW5zcGVjdCgpLFxyXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdml0ZS1wbHVnaW4tcGFnZXNcclxuICAgICAgLy8gXHU5ODc1XHU5NzYyXHU4REVGXHU3NTMxXHJcbiAgICAgIC8vIHByaXNtanNQbHVnaW4oe1xyXG4gICAgICAvLyAgIGxhbmd1YWdlczogJ2FsbCcsIC8vIFx1OEJFRFx1OEEwMFxyXG4gICAgICAvLyAgIHRoZW1lOiAnZGVmYXVsdCcsIC8vIFx1NEUzQlx1OTg5OFxyXG4gICAgICAvLyB9KSBhcyBQbHVnaW4sXHJcbiAgICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICAgIGltcG9ydHM6IFsndnVlJ10sXHJcbiAgICAgICAgaWdub3JlOiBbJ2gnLCAnQ2xpZW50T25seSddLFxyXG4gICAgICAgIGR0czogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuLi9hdXRvLWltcG9ydHMuZC50cycsIGltcG9ydC5tZXRhLnVybCkpLFxyXG4gICAgICAgIHJlc29sdmVyczogW1xyXG4gICAgICAgICAgRWxlbWVudFBsdXNSZXNvbHZlcih7XHJcbiAgICAgICAgICAgIGV4Y2x1ZGU6IC9FbEJ1dHRvbkdyb3VwL1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICBdXHJcbiAgICAgIH0pIGFzIHVua25vd24gYXMgUGx1Z2luLFxyXG4gICAgICBDb21wb25lbnRzKHtcclxuICAgICAgICBkdHM6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi4vY29tcG9uZW50cy5kLnRzJywgaW1wb3J0Lm1ldGEudXJsKSksXHJcbiAgICAgICAgZGlyczogW2ZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9jb21wb25lbnRzJywgaW1wb3J0Lm1ldGEudXJsKSldLFxyXG4gICAgICAgIHJlc29sdmVyczogW3RvdlVJUmVzb2x2ZXIoKSwgRWxlbWVudFBsdXNSZXNvbHZlcih7IGltcG9ydFN0eWxlOiBmYWxzZSB9KV1cclxuICAgICAgfSkgYXMgdW5rbm93biBhcyBQbHVnaW4sXHJcbiAgICAgIGdyb3VwSWNvblZpdGVQbHVnaW4oKSBhcyBQbHVnaW4sXHJcbiAgICAgIFVub2NzcygpIGFzIHVua25vd24gYXMgUGx1Z2luLFxyXG4gICAgXSxcclxuICAgIHNzcjoge1xyXG4gICAgICBub0V4dGVybmFsOiBbJ2VsZW1lbnQtcGx1cycsICdnc2FwJywgJ3Z1ZS1lbGVtZW50LXBsdXMteCcsICd4LW1hcmtkb3duLXZ1ZSddLFxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxcdTU2MDlcdTYwQTZcXFxcRGVza3RvcFxcXFxlbHhfaG90Zml4XFxcXEVsZW1lbnQtUGx1cy1YXFxcXGNvbmZpZ3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFx1NTYwOVx1NjBBNlxcXFxEZXNrdG9wXFxcXGVseF9ob3RmaXhcXFxcRWxlbWVudC1QbHVzLVhcXFxcY29uZmlnc1xcXFxjb21taXQtdHlwZXMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzLyVFNSU5OCU4OSVFNiU4MiVBNi9EZXNrdG9wL2VseF9ob3RmaXgvRWxlbWVudC1QbHVzLVgvY29uZmlncy9jb21taXQtdHlwZXMudHNcIjtpbXBvcnQgdHlwZSB7IENvbW1pdFR5cGVDb25maWcgfSBmcm9tICcuL3R5cGVzJztcclxuXHJcbmV4cG9ydCBjb25zdCBDT01NSVRfVFlQRVM6IENvbW1pdFR5cGVDb25maWdbXSA9IFtcclxuICB7XHJcbiAgICB0eXBlOiAnZmVhdCcsXHJcbiAgICBlbW9qaTogJ1x1RDgzRFx1REU4MCcsXHJcbiAgICB6aExhYmVsOiAnXHU2NUIwXHU1ODlFJyxcclxuICAgIGVuTGFiZWw6ICdGZWF0dXJlJyxcclxuICAgIGNvbG9yOiAnIzE4OTBmZicsXHJcbiAgICBiZ0NvbG9yOiAnI2U2ZjRmZicsXHJcbiAgICBib3JkZXJDb2xvcjogJyM5MWNhZmYnLFxyXG4gICAgZGVzY3JpcHRpb246ICdBIG5ldyBmZWF0dXJlJyxcclxuICAgIGRlc2NyaXB0aW9uWmg6ICdcdTY1QjBcdTU4OUVcdTUyOUZcdTgwRkQnLFxyXG4gICAgYWxpYXNlczogWydmZWF0dXJlJ10sXHJcbiAgICBpc3N1ZUxhYmVsOiAnXHVEODNEXHVERTgwIGZlYXQ6IFx1NjVCMFx1NTg5RVx1NTI5Rlx1ODBGRCdcclxuICB9LFxyXG4gIHtcclxuICAgIHR5cGU6ICdmaXgnLFxyXG4gICAgZW1vamk6ICdcdUQ4M0RcdURDMUInLFxyXG4gICAgemhMYWJlbDogJ1x1NEZFRVx1NTkwRCcsXHJcbiAgICBlbkxhYmVsOiAnRml4JyxcclxuICAgIGNvbG9yOiAnIzUyYzQxYScsXHJcbiAgICBiZ0NvbG9yOiAnI2Y2ZmZlZCcsXHJcbiAgICBib3JkZXJDb2xvcjogJyNiN2ViOGYnLFxyXG4gICAgZGVzY3JpcHRpb246ICdBIGJ1ZyBmaXgnLFxyXG4gICAgZGVzY3JpcHRpb25aaDogJ1x1NEZFRVx1NTkwRFx1N0YzQVx1OTY3NycsXHJcbiAgICBpc3N1ZUxhYmVsOiAnXHVEODNEXHVEQzFCIGZpeDogXHU0RkVFXHU1OTBEXHU3RjNBXHU5Njc3J1xyXG4gIH0sXHJcbiAge1xyXG4gICAgdHlwZTogJ2RvY3MnLFxyXG4gICAgZW1vamk6ICdcdUQ4M0RcdURDREEnLFxyXG4gICAgemhMYWJlbDogJ1x1NjU4N1x1Njg2MycsXHJcbiAgICBlbkxhYmVsOiAnRG9jcycsXHJcbiAgICBjb2xvcjogJyM3MjJlZDEnLFxyXG4gICAgYmdDb2xvcjogJyNmOWYwZmYnLFxyXG4gICAgYm9yZGVyQ29sb3I6ICcjZDNhZGY3JyxcclxuICAgIGRlc2NyaXB0aW9uOiAnRG9jdW1lbnRhdGlvbiBvbmx5IGNoYW5nZXMnLFxyXG4gICAgZGVzY3JpcHRpb25aaDogJ1x1NjU4N1x1Njg2M1x1NjZGNFx1NjVCMCcsXHJcbiAgICBpc3N1ZUxhYmVsOiAnXHVEODNEXHVEQ0RBIGRvY3M6IFx1NjU4N1x1Njg2M1x1NjZGNFx1NjVCMCdcclxuICB9LFxyXG4gIHtcclxuICAgIHR5cGU6ICdzdHlsZScsXHJcbiAgICBlbW9qaTogJ1x1RDgzRFx1REM4NCcsXHJcbiAgICB6aExhYmVsOiAnXHU2ODM3XHU1RjBGJyxcclxuICAgIGVuTGFiZWw6ICdTdHlsZScsXHJcbiAgICBjb2xvcjogJyNlYjJmOTYnLFxyXG4gICAgYmdDb2xvcjogJyNmZmYwZjYnLFxyXG4gICAgYm9yZGVyQ29sb3I6ICcjZmZhZGQyJyxcclxuICAgIGRlc2NyaXB0aW9uOiAnQ29kZSBzdHlsZSBjaGFuZ2VzIChmb3JtYXR0aW5nLCBzZW1pY29sb25zLCBldGMpJyxcclxuICAgIGRlc2NyaXB0aW9uWmg6ICdcdTRFRTNcdTc4MDFcdTY4M0NcdTVGMEZcdUZGMDhcdTRFMERcdTVGNzFcdTU0Q0RcdTkwM0JcdThGOTFcdUZGMDknLFxyXG4gICAgaXNzdWVMYWJlbDogJ1x1RDgzRFx1REM4NCBzdHlsZTogXHU0RUUzXHU3ODAxXHU2ODNDXHU1RjBGJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgdHlwZTogJ3JlZmFjdG9yJyxcclxuICAgIGVtb2ppOiAnXHUyNjdCXHVGRTBGJyxcclxuICAgIHpoTGFiZWw6ICdcdTkxQ0RcdTY3ODQnLFxyXG4gICAgZW5MYWJlbDogJ1JlZmFjdG9yJyxcclxuICAgIGNvbG9yOiAnI2ZhOGMxNicsXHJcbiAgICBiZ0NvbG9yOiAnI2ZmZjdlNicsXHJcbiAgICBib3JkZXJDb2xvcjogJyNmZmQ1OTEnLFxyXG4gICAgZGVzY3JpcHRpb246ICdDb2RlIHJlZmFjdG9yaW5nJyxcclxuICAgIGRlc2NyaXB0aW9uWmg6ICdcdTRFRTNcdTc4MDFcdTkxQ0RcdTY3ODQnLFxyXG4gICAgaXNzdWVMYWJlbDogJ1x1MjY3Qlx1RkUwRiByZWZhY3RvcjogXHU0RUUzXHU3ODAxXHU5MUNEXHU2Nzg0J1xyXG4gIH0sXHJcbiAge1xyXG4gICAgdHlwZTogJ3BlcmYnLFxyXG4gICAgZW1vamk6ICdcdTI2QTEnLFxyXG4gICAgemhMYWJlbDogJ1x1NjAyN1x1ODBGRCcsXHJcbiAgICBlbkxhYmVsOiAnUGVyZicsXHJcbiAgICBjb2xvcjogJyMxM2MyYzInLFxyXG4gICAgYmdDb2xvcjogJyNlNmZmZmInLFxyXG4gICAgYm9yZGVyQ29sb3I6ICcjODdlOGRlJyxcclxuICAgIGRlc2NyaXB0aW9uOiAnUGVyZm9ybWFuY2UgaW1wcm92ZW1lbnRzJyxcclxuICAgIGRlc2NyaXB0aW9uWmg6ICdcdTYwMjdcdTgwRkRcdTRGMThcdTUzMTYnLFxyXG4gICAgaXNzdWVMYWJlbDogJ1x1MjZBMSBwZXJmOiBcdTYwMjdcdTgwRkRcdTRGMThcdTUzMTYnXHJcbiAgfSxcclxuICB7XHJcbiAgICB0eXBlOiAndGVzdCcsXHJcbiAgICBlbW9qaTogJ1x1MjcwNScsXHJcbiAgICB6aExhYmVsOiAnXHU2RDRCXHU4QkQ1JyxcclxuICAgIGVuTGFiZWw6ICdUZXN0JyxcclxuICAgIGNvbG9yOiAnIzJmNTRlYicsXHJcbiAgICBiZ0NvbG9yOiAnI2YwZjVmZicsXHJcbiAgICBib3JkZXJDb2xvcjogJyNhZGM2ZmYnLFxyXG4gICAgZGVzY3JpcHRpb246ICdBZGRpbmcgb3IgdXBkYXRpbmcgdGVzdHMnLFxyXG4gICAgZGVzY3JpcHRpb25aaDogJ1x1NkQ0Qlx1OEJENVx1NzZGOFx1NTE3MycsXHJcbiAgICBpc3N1ZUxhYmVsOiAnXHUyNzA1IHRlc3Q6IFx1NkQ0Qlx1OEJENVx1NzZGOFx1NTE3MydcclxuICB9LFxyXG4gIHtcclxuICAgIHR5cGU6ICdidWlsZCcsXHJcbiAgICBlbW9qaTogJ1x1RDgzRFx1RENFNicsXHJcbiAgICB6aExhYmVsOiAnXHU2Nzg0XHU1RUZBJyxcclxuICAgIGVuTGFiZWw6ICdCdWlsZCcsXHJcbiAgICBjb2xvcjogJyM1OTU5NTknLFxyXG4gICAgYmdDb2xvcjogJyNmYWZhZmEnLFxyXG4gICAgYm9yZGVyQ29sb3I6ICcjZDlkOWQ5JyxcclxuICAgIGRlc2NyaXB0aW9uOiAnQnVpbGQgc3lzdGVtIGNoYW5nZXMnLFxyXG4gICAgZGVzY3JpcHRpb25aaDogJ1x1Njc4NFx1NUVGQVx1NzZGOFx1NTE3MycsXHJcbiAgICBpc3N1ZUxhYmVsOiAnXHVEODNEXHVEQ0U2IGJ1aWxkOiBcdTY3ODRcdTVFRkFcdTc2RjhcdTUxNzMnXHJcbiAgfSxcclxuICB7XHJcbiAgICB0eXBlOiAnY2knLFxyXG4gICAgZW1vamk6ICdcdUQ4M0RcdURDNzcnLFxyXG4gICAgemhMYWJlbDogJ0NJJyxcclxuICAgIGVuTGFiZWw6ICdDSScsXHJcbiAgICBjb2xvcjogJyM0MzQ5NTgnLFxyXG4gICAgYmdDb2xvcjogJyNmM2Y0ZjYnLFxyXG4gICAgYm9yZGVyQ29sb3I6ICcjYzRjN2NjJyxcclxuICAgIGRlc2NyaXB0aW9uOiAnQ0kgY29uZmlndXJhdGlvbiBjaGFuZ2VzJyxcclxuICAgIGRlc2NyaXB0aW9uWmg6ICdDSSBcdTkxNERcdTdGNkUnLFxyXG4gICAgaXNzdWVMYWJlbDogJ1x1RDgzRFx1REM3NyBjaTogXHU2MzAxXHU3RUVEXHU5NkM2XHU2MjEwJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgdHlwZTogJ2Nob3JlJyxcclxuICAgIGVtb2ppOiAnXHVEODNEXHVERDI3JyxcclxuICAgIHpoTGFiZWw6ICdcdTY3NDJcdTk4NzknLFxyXG4gICAgZW5MYWJlbDogJ0Nob3JlJyxcclxuICAgIGNvbG9yOiAnIzhjOGM4YycsXHJcbiAgICBiZ0NvbG9yOiAnI2ZhZmFmYScsXHJcbiAgICBib3JkZXJDb2xvcjogJyNkOWQ5ZDknLFxyXG4gICAgZGVzY3JpcHRpb246ICdPdGhlciBjaGFuZ2VzIHRoYXQgZG8gbm90IG1vZGlmeSBzcmMgb3IgdGVzdCBmaWxlcycsXHJcbiAgICBkZXNjcmlwdGlvblpoOiAnXHU1MTc2XHU0RUQ2XHU0RkVFXHU2NTM5JyxcclxuICAgIGlzc3VlTGFiZWw6ICdcdUQ4M0RcdUREMjcgY2hvcmU6IFx1NTE3Nlx1NEVENlx1NEZFRVx1NjUzOSdcclxuICB9LFxyXG4gIHtcclxuICAgIHR5cGU6ICdyZXZlcnQnLFxyXG4gICAgZW1vamk6ICdcdTIzRUEnLFxyXG4gICAgemhMYWJlbDogJ1x1NTZERVx1OTAwMCcsXHJcbiAgICBlbkxhYmVsOiAnUmV2ZXJ0JyxcclxuICAgIGNvbG9yOiAnI2Y1MjIyZCcsXHJcbiAgICBiZ0NvbG9yOiAnI2ZmZjFmMCcsXHJcbiAgICBib3JkZXJDb2xvcjogJyNmZmEzOWUnLFxyXG4gICAgZGVzY3JpcHRpb246ICdSZXZlcnQgY2hhbmdlcycsXHJcbiAgICBkZXNjcmlwdGlvblpoOiAnXHU1NkRFXHU5MDAwXHU0RUUzXHU3ODAxJyxcclxuICAgIGlzc3VlTGFiZWw6ICdcdTIzRUEgcmV2ZXJ0OiBcdTU2REVcdTkwMDBcdTRFRTNcdTc4MDEnXHJcbiAgfSxcclxuICB7XHJcbiAgICB0eXBlOiAnYnJlYWtpbmcnLFxyXG4gICAgZW1vamk6ICdcdUQ4M0RcdURDQTUnLFxyXG4gICAgemhMYWJlbDogJ1x1NzgzNFx1NTc0Rlx1NjAyNycsXHJcbiAgICBlbkxhYmVsOiAnQnJlYWtpbmcnLFxyXG4gICAgY29sb3I6ICcjZjUyMjJkJyxcclxuICAgIGJnQ29sb3I6ICcjZmZmMWYwJyxcclxuICAgIGJvcmRlckNvbG9yOiAnI2ZmNGQ0ZicsXHJcbiAgICBkZXNjcmlwdGlvbjogJ0JyZWFraW5nIGNoYW5nZXMnLFxyXG4gICAgZGVzY3JpcHRpb25aaDogJ1x1NzgzNFx1NTc0Rlx1NjAyN1x1NTNEOFx1NjZGNCcsXHJcbiAgICBpc3N1ZUxhYmVsOiAnXHVEODNEXHVEQ0E1IGJyZWFraW5nOiBcdTc4MzRcdTU3NEZcdTYwMjdcdTUzRDhcdTY2RjQnXHJcbiAgfVxyXG5dO1xyXG5cclxuZXhwb3J0IGNvbnN0IFRZUEVfRU5VTSA9IENPTU1JVF9UWVBFUy5tYXAodCA9PiB0LnR5cGUpO1xyXG5cclxuY29uc3QgVFlQRV9BTElBU19NQVA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcclxuZm9yIChjb25zdCBjb25maWcgb2YgQ09NTUlUX1RZUEVTKSB7XHJcbiAgVFlQRV9BTElBU19NQVBbY29uZmlnLnR5cGVdID0gY29uZmlnLnR5cGU7XHJcbiAgaWYgKGNvbmZpZy5hbGlhc2VzKSB7XHJcbiAgICBmb3IgKGNvbnN0IGFsaWFzIG9mIGNvbmZpZy5hbGlhc2VzKSB7XHJcbiAgICAgIFRZUEVfQUxJQVNfTUFQW2FsaWFzXSA9IGNvbmZpZy50eXBlO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IENPTU1JVF9UWVBFX01BUCA9IE9iamVjdC5mcm9tRW50cmllcyhcclxuICBDT01NSVRfVFlQRVMubWFwKHQgPT4gW3QudHlwZSwgdF0pXHJcbik7XHJcblxyXG5mdW5jdGlvbiBub3JtYWxpemVUeXBlKHR5cGU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgY29uc3QgbG93ZXJUeXBlID0gdHlwZS50b0xvd2VyQ2FzZSgpO1xyXG4gIHJldHVybiBUWVBFX0FMSUFTX01BUFtsb3dlclR5cGVdIHx8IFRZUEVfQUxJQVNfTUFQW3R5cGVdIHx8ICdjaG9yZSc7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21taXRUeXBlQ29uZmlnKHR5cGU6IHN0cmluZyk6IENvbW1pdFR5cGVDb25maWcge1xyXG4gIGNvbnN0IG5vcm1hbGl6ZWRUeXBlID0gbm9ybWFsaXplVHlwZSh0eXBlKTtcclxuICByZXR1cm4gKFxyXG4gICAgQ09NTUlUX1RZUEVfTUFQW25vcm1hbGl6ZWRUeXBlXSB8fCB7XHJcbiAgICAgIHR5cGU6ICdjaG9yZScsXHJcbiAgICAgIGVtb2ppOiAnXHVEODNEXHVERDI3JyxcclxuICAgICAgemhMYWJlbDogJ1x1Njc0Mlx1OTg3OScsXHJcbiAgICAgIGVuTGFiZWw6ICdDaG9yZScsXHJcbiAgICAgIGNvbG9yOiAnIzhjOGM4YycsXHJcbiAgICAgIGJnQ29sb3I6ICcjZmFmYWZhJyxcclxuICAgICAgYm9yZGVyQ29sb3I6ICcjZDlkOWQ5JyxcclxuICAgICAgZGVzY3JpcHRpb246ICdPdGhlciBjaGFuZ2VzJyxcclxuICAgICAgZGVzY3JpcHRpb25aaDogJ1x1NTE3Nlx1NEVENlx1NEZFRVx1NjUzOScsXHJcbiAgICAgIGlzc3VlTGFiZWw6ICdcdUQ4M0RcdUREMjcgY2hvcmU6IFx1NTE3Nlx1NEVENlx1NEZFRVx1NjUzOSdcclxuICAgIH1cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW1vamkodHlwZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICBjb25zdCBjb25maWcgPSBnZXRDb21taXRUeXBlQ29uZmlnKHR5cGUpO1xyXG4gIHJldHVybiBjb25maWcuZW1vamk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDb2xvcih0eXBlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIGNvbnN0IGNvbmZpZyA9IGdldENvbW1pdFR5cGVDb25maWcodHlwZSk7XHJcbiAgcmV0dXJuIGNvbmZpZy5jb2xvcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEJnQ29sb3IodHlwZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICBjb25zdCBjb25maWcgPSBnZXRDb21taXRUeXBlQ29uZmlnKHR5cGUpO1xyXG4gIHJldHVybiBjb25maWcuYmdDb2xvcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEJvcmRlckNvbG9yKHR5cGU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgY29uc3QgY29uZmlnID0gZ2V0Q29tbWl0VHlwZUNvbmZpZyh0eXBlKTtcclxuICByZXR1cm4gY29uZmlnLmJvcmRlckNvbG9yO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGFiZWwodHlwZTogc3RyaW5nLCBsYW5nOiAnemgnIHwgJ2VuJyA9ICd6aCcpOiBzdHJpbmcge1xyXG4gIGNvbnN0IGNvbmZpZyA9IGdldENvbW1pdFR5cGVDb25maWcodHlwZSk7XHJcbiAgcmV0dXJuIGxhbmcgPT09ICd6aCcgPyBjb25maWcuemhMYWJlbCA6IGNvbmZpZy5lbkxhYmVsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0SXNzdWVDYXRlZ29yeU9wdGlvbnMoXHJcbiAgbGFuZzogJ3poJyB8ICdlbicgPSAnemgnXHJcbik6IHsgbGFiZWw6IHN0cmluZzsgdmFsdWU6IHN0cmluZyB9W10ge1xyXG4gIHJldHVybiBDT01NSVRfVFlQRVMubWFwKGNvbmZpZyA9PiAoe1xyXG4gICAgbGFiZWw6XHJcbiAgICAgIGxhbmcgPT09ICd6aCdcclxuICAgICAgICA/IGNvbmZpZy5pc3N1ZUxhYmVsXHJcbiAgICAgICAgOiBgJHtjb25maWcuZW1vaml9ICR7Y29uZmlnLnR5cGV9OiAke2NvbmZpZy5lbkxhYmVsfWAsXHJcbiAgICB2YWx1ZTogY29uZmlnLnR5cGVcclxuICB9KSk7XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxcdTU2MDlcdTYwQTZcXFxcRGVza3RvcFxcXFxlbHhfaG90Zml4XFxcXEVsZW1lbnQtUGx1cy1YXFxcXGNvbmZpZ3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFx1NTYwOVx1NjBBNlxcXFxEZXNrdG9wXFxcXGVseF9ob3RmaXhcXFxcRWxlbWVudC1QbHVzLVhcXFxcY29uZmlnc1xcXFxjb21wb25lbnRzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy8lRTUlOTglODklRTYlODIlQTYvRGVza3RvcC9lbHhfaG90Zml4L0VsZW1lbnQtUGx1cy1YL2NvbmZpZ3MvY29tcG9uZW50cy50c1wiO2ltcG9ydCB0eXBlIHtcclxuICBDb21wb25lbnRCYWRnZSxcclxuICBDb21wb25lbnRDYXRlZ29yeSxcclxuICBDb21wb25lbnRDb25maWcsXHJcbiAgTmF2SXRlbSxcclxuICBTaWRlYmFySXRlbVxyXG59IGZyb20gJy4vdHlwZXMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IENPTVBPTkVOVF9DQVRFR09SSUVTOiBSZWNvcmQ8Q29tcG9uZW50Q2F0ZWdvcnksIHsgemhMYWJlbDogc3RyaW5nOyBlbkxhYmVsOiBzdHJpbmcgfT4gPSB7XHJcbiAgbmV3OiB7IHpoTGFiZWw6ICdcdTRFMEFcdTY1QjAnLCBlbkxhYmVsOiAnTmV3JyB9LFxyXG4gIGNvbmZpZzogeyB6aExhYmVsOiAnXHU5MTREXHU3RjZFJywgZW5MYWJlbDogJ0NvbmZpZ3VyYXRpb24nIH0sXHJcbiAgZ2VuZXJhbDogeyB6aExhYmVsOiAnXHU5MDFBXHU3NTI4JywgZW5MYWJlbDogJ0dlbmVyYWwnIH0sXHJcbiAgYXdha2VuaW5nOiB7IHpoTGFiZWw6ICdcdTU1MjRcdTkxOTInLCBlbkxhYmVsOiAnQXdha2VuaW5nJyB9LFxyXG4gIGV4cHJlc3Npb246IHsgemhMYWJlbDogJ1x1ODg2OFx1OEZCRScsIGVuTGFiZWw6ICdFeHByZXNzaW9uJyB9LFxyXG4gIGNvbmZpcm1hdGlvbjogeyB6aExhYmVsOiAnXHU3ODZFXHU4QkE0JywgZW5MYWJlbDogJ0NvbmZpcm1hdGlvbicgfSxcclxuICB0b29sczogeyB6aExhYmVsOiAnXHU1REU1XHU1MTc3JywgZW5MYWJlbDogJ1Rvb2xzJyB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgQ09NUE9ORU5UUzogQ29tcG9uZW50Q29uZmlnW10gPSBbXHJcbiAge1xyXG4gICAgbmFtZTogJ1hTZW5kZXInLFxyXG4gICAgbmFtZUxvd2VyOiAneHNlbmRlcicsXHJcbiAgICB6aFRpdGxlOiAnWFNlbmRlciBcdThGOTNcdTUxNjVcdTY4NDYnLFxyXG4gICAgZW5UaXRsZTogJ1hTZW5kZXIgSW5wdXQnLFxyXG4gICAgY2F0ZWdvcnk6ICduZXcnLFxyXG4gICAgYmFkZ2U6IHsgdHlwZTogJ25ldycsIHRleHQ6ICcyLjAuMCcgfVxyXG4gIH0sXHJcbiAge1xyXG4gICAgbmFtZTogJ1hNYXJrZG93bicsXHJcbiAgICBuYW1lTG93ZXI6ICd4TWFya2Rvd24nLFxyXG4gICAgemhUaXRsZTogJ1hNYXJrZG93blx1RkYwOFx1NzJFQ1x1N0FDQlx1NTMwNVx1RkYwOScsXHJcbiAgICBlblRpdGxlOiAnWE1hcmtkb3duIChFeHRlcm5hbCknLFxyXG4gICAgY2F0ZWdvcnk6ICduZXcnLFxyXG4gICAgYmFkZ2U6IHsgdHlwZTogJ2JldGEnLCB0ZXh0OiAnQmV0YScgfSxcclxuICAgIGV4dGVybmFsOiB7XHJcbiAgICAgIHBhY2thZ2U6ICd4LW1hcmtkb3duLXZ1ZScsXHJcbiAgICAgIG5wbUxpbms6ICdodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS94LW1hcmtkb3duLXZ1ZScsXHJcbiAgICAgIHNvdXJjZUxpbms6ICdodHRwczovL2dpdGh1Yi5jb20vZWxlbWVudC1wbHVzLXgveC1tYXJrZG93bicsXHJcbiAgICAgIGltcG9ydFN0YXRlbWVudDogXCJpbXBvcnQgeyBNYXJrZG93blJlbmRlcmVyIH0gZnJvbSAneC1tYXJrZG93bi12dWUnXCIsXHJcbiAgICAgIHN0eWxlU3RhdGVtZW50OiBcImltcG9ydCAneC1tYXJrZG93bi12dWUvc3R5bGUnXCJcclxuICAgIH1cclxuICB9LFxyXG4gIHtcclxuICAgIG5hbWU6ICdDb25maWdQcm92aWRlcicsXHJcbiAgICBuYW1lTG93ZXI6ICdjb25maWdQcm92aWRlcicsXHJcbiAgICB6aFRpdGxlOiAnQ29uZmlnUHJvdmlkZXIgXHU1MTY4XHU1QzQwXHU5MTREXHU3RjZFJyxcclxuICAgIGVuVGl0bGU6ICdDb25maWdQcm92aWRlcicsXHJcbiAgICBjYXRlZ29yeTogJ2NvbmZpZycsXHJcbiAgICBiYWRnZTogeyB0eXBlOiAnYmV0YScsIHRleHQ6ICdCZXRhJyB9XHJcbiAgfSxcclxuICB7XHJcbiAgICBuYW1lOiAnQnViYmxlJyxcclxuICAgIG5hbWVMb3dlcjogJ2J1YmJsZScsXHJcbiAgICB6aFRpdGxlOiAnQnViYmxlIFx1NUJGOVx1OEJERFx1NkMxNFx1NkNFMScsXHJcbiAgICBlblRpdGxlOiAnQnViYmxlJyxcclxuICAgIGNhdGVnb3J5OiAnZ2VuZXJhbCdcclxuICB9LFxyXG4gIHtcclxuICAgIG5hbWU6ICdCdWJibGVMaXN0JyxcclxuICAgIG5hbWVMb3dlcjogJ2J1YmJsZUxpc3QnLFxyXG4gICAgemhUaXRsZTogJ0J1YmJsZUxpc3QgXHU2QzE0XHU2Q0UxXHU1MjE3XHU4ODY4JyxcclxuICAgIGVuVGl0bGU6ICdCdWJibGVMaXN0JyxcclxuICAgIGNhdGVnb3J5OiAnZ2VuZXJhbCdcclxuICB9LFxyXG4gIHtcclxuICAgIG5hbWU6ICdDb252ZXJzYXRpb25zJyxcclxuICAgIG5hbWVMb3dlcjogJ2NvbnZlcnNhdGlvbnMnLFxyXG4gICAgemhUaXRsZTogJ0NvbnZlcnNhdGlvbnMgXHU0RjFBXHU4QkREXHU3QkExXHU3NDA2JyxcclxuICAgIGVuVGl0bGU6ICdDb252ZXJzYXRpb25zJyxcclxuICAgIGNhdGVnb3J5OiAnZ2VuZXJhbCdcclxuICB9LFxyXG4gIHtcclxuICAgIG5hbWU6ICdXZWxjb21lJyxcclxuICAgIG5hbWVMb3dlcjogJ3dlbGNvbWUnLFxyXG4gICAgemhUaXRsZTogJ1dlbGNvbWUgXHU2QjIyXHU4RkNFJyxcclxuICAgIGVuVGl0bGU6ICdXZWxjb21lJyxcclxuICAgIGNhdGVnb3J5OiAnYXdha2VuaW5nJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgbmFtZTogJ1Byb21wdHMnLFxyXG4gICAgbmFtZUxvd2VyOiAncHJvbXB0cycsXHJcbiAgICB6aFRpdGxlOiAnUHJvbXB0cyBcdTYzRDBcdTc5M0FcdTk2QzYnLFxyXG4gICAgZW5UaXRsZTogJ1Byb21wdHMnLFxyXG4gICAgY2F0ZWdvcnk6ICdhd2FrZW5pbmcnXHJcbiAgfSxcclxuICB7XHJcbiAgICBuYW1lOiAnRmlsZXNDYXJkJyxcclxuICAgIG5hbWVMb3dlcjogJ2ZpbGVzQ2FyZCcsXHJcbiAgICB6aFRpdGxlOiAnRmlsZXNDYXJkIFx1NjU4N1x1NEVGNlx1NTM2MVx1NzI0NycsXHJcbiAgICBlblRpdGxlOiAnRmlsZXNDYXJkJyxcclxuICAgIGNhdGVnb3J5OiAnZXhwcmVzc2lvbidcclxuICB9LFxyXG4gIHtcclxuICAgIG5hbWU6ICdBdHRhY2htZW50cycsXHJcbiAgICBuYW1lTG93ZXI6ICdhdHRhY2htZW50cycsXHJcbiAgICB6aFRpdGxlOiAnQXR0YWNobWVudHMgXHU4RjkzXHU1MTY1XHU5NjQ0XHU0RUY2JyxcclxuICAgIGVuVGl0bGU6ICdBdHRhY2htZW50cycsXHJcbiAgICBjYXRlZ29yeTogJ2V4cHJlc3Npb24nXHJcbiAgfSxcclxuICB7XHJcbiAgICBuYW1lOiAnVGhpbmtpbmcnLFxyXG4gICAgbmFtZUxvd2VyOiAndGhpbmtpbmcnLFxyXG4gICAgemhUaXRsZTogJ1RoaW5raW5nIFx1NjAxRFx1ODAwM1x1NEUyRCcsXHJcbiAgICBlblRpdGxlOiAnVGhpbmtpbmcnLFxyXG4gICAgY2F0ZWdvcnk6ICdjb25maXJtYXRpb24nXHJcbiAgfSxcclxuICB7XHJcbiAgICBuYW1lOiAnVGhvdWdodENoYWluJyxcclxuICAgIG5hbWVMb3dlcjogJ3Rob3VnaHRDaGFpbicsXHJcbiAgICB6aFRpdGxlOiAnVGhvdWdodENoYWluIFx1NjAxRFx1N0VGNFx1OTRGRScsXHJcbiAgICBlblRpdGxlOiAnVGhvdWdodENoYWluJyxcclxuICAgIGNhdGVnb3J5OiAnY29uZmlybWF0aW9uJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgbmFtZTogJ3VzZVJlY29yZCcsXHJcbiAgICBuYW1lTG93ZXI6ICd1c2VSZWNvcmQnLFxyXG4gICAgemhUaXRsZTogJ3VzZVJlY29yZCcsXHJcbiAgICBlblRpdGxlOiAndXNlUmVjb3JkJyxcclxuICAgIGNhdGVnb3J5OiAndG9vbHMnLFxyXG4gICAgaXNIb29rOiB0cnVlXHJcbiAgfSxcclxuICB7XHJcbiAgICBuYW1lOiAndXNlWFN0cmVhbScsXHJcbiAgICBuYW1lTG93ZXI6ICd1c2VYU3RyZWFtJyxcclxuICAgIHpoVGl0bGU6ICd1c2VYU3RyZWFtJyxcclxuICAgIGVuVGl0bGU6ICd1c2VYU3RyZWFtJyxcclxuICAgIGNhdGVnb3J5OiAndG9vbHMnLFxyXG4gICAgaXNIb29rOiB0cnVlXHJcbiAgfSxcclxuICB7XHJcbiAgICBuYW1lOiAndXNlU2VuZCcsXHJcbiAgICBuYW1lTG93ZXI6ICd1c2VTZW5kJyxcclxuICAgIHpoVGl0bGU6ICd1c2VTZW5kICYgWFJlcXVlc3QnLFxyXG4gICAgZW5UaXRsZTogJ3VzZVNlbmQgJiBYUmVxdWVzdCcsXHJcbiAgICBjYXRlZ29yeTogJ3Rvb2xzJyxcclxuICAgIGlzSG9vazogdHJ1ZVxyXG4gIH1cclxuXTtcclxuXHJcbmV4cG9ydCBjb25zdCBDT01QT05FTlRfTkFNRVMgPSBDT01QT05FTlRTLm1hcChjID0+IGMubmFtZSk7XHJcbmV4cG9ydCBjb25zdCBDT01QT05FTlRfTkFNRVNfTE9XRVIgPSBDT01QT05FTlRTLm1hcChjID0+IGMubmFtZUxvd2VyKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21wb25lbnRCeU5hbWUobmFtZTogc3RyaW5nKTogQ29tcG9uZW50Q29uZmlnIHwgdW5kZWZpbmVkIHtcclxuICBjb25zdCBsb3dlck5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgcmV0dXJuIENPTVBPTkVOVFMuZmluZChcclxuICAgIGMgPT4gYy5uYW1lID09PSBuYW1lIHx8IGMubmFtZUxvd2VyID09PSBsb3dlck5hbWVcclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29tcG9uZW50c0J5Q2F0ZWdvcnkoY2F0ZWdvcnk6IENvbXBvbmVudENhdGVnb3J5KTogQ29tcG9uZW50Q29uZmlnW10ge1xyXG4gIHJldHVybiBDT01QT05FTlRTLmZpbHRlcihjID0+IGMuY2F0ZWdvcnkgPT09IGNhdGVnb3J5KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbXBvbmVudEJhZGdlcygpOiBSZWNvcmQ8c3RyaW5nLCBDb21wb25lbnRCYWRnZT4ge1xyXG4gIGNvbnN0IGJhZGdlczogUmVjb3JkPHN0cmluZywgQ29tcG9uZW50QmFkZ2U+ID0ge307XHJcbiAgZm9yIChjb25zdCBjb21wIG9mIENPTVBPTkVOVFMpIHtcclxuICAgIGlmIChjb21wLmJhZGdlKSB7XHJcbiAgICAgIGJhZGdlc1tgL3poL2NvbXBvbmVudHMvJHtjb21wLm5hbWVMb3dlcn0vYF0gPSBjb21wLmJhZGdlO1xyXG4gICAgICBiYWRnZXNbYC9lbi9jb21wb25lbnRzLyR7Y29tcC5uYW1lTG93ZXJ9L2BdID0gY29tcC5iYWRnZTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGJhZGdlcztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbXBvbmVudFRpdGxlcygpOiBSZWNvcmQ8c3RyaW5nLCB7IHpoOiBzdHJpbmc7IGVuOiBzdHJpbmcgfT4ge1xyXG4gIGNvbnN0IHRpdGxlczogUmVjb3JkPHN0cmluZywgeyB6aDogc3RyaW5nOyBlbjogc3RyaW5nIH0+ID0ge307XHJcbiAgZm9yIChjb25zdCBjb21wIG9mIENPTVBPTkVOVFMpIHtcclxuICAgIHRpdGxlc1tjb21wLm5hbWVdID0geyB6aDogY29tcC56aFRpdGxlLCBlbjogY29tcC5lblRpdGxlIH07XHJcbiAgfVxyXG4gIHJldHVybiB0aXRsZXM7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21wb25lbnRJbXBvcnRzKCk6IFJlY29yZDxzdHJpbmcsIHtcclxuICBpbXBvcnRTdGF0ZW1lbnQ6IHN0cmluZztcclxuICBzdHlsZVN0YXRlbWVudD86IHN0cmluZztcclxuICBleHRlcm5hbFNvdXJjZUxpbms/OiBzdHJpbmc7XHJcbiAgbnBtTGluaz86IHN0cmluZztcclxufT4ge1xyXG4gIGNvbnN0IGltcG9ydHM6IFJlY29yZDxzdHJpbmcsIHtcclxuICAgIGltcG9ydFN0YXRlbWVudDogc3RyaW5nO1xyXG4gICAgc3R5bGVTdGF0ZW1lbnQ/OiBzdHJpbmc7XHJcbiAgICBleHRlcm5hbFNvdXJjZUxpbms/OiBzdHJpbmc7XHJcbiAgICBucG1MaW5rPzogc3RyaW5nO1xyXG4gIH0+ID0ge307XHJcbiAgZm9yIChjb25zdCBjb21wIG9mIENPTVBPTkVOVFMpIHtcclxuICAgIGlmIChjb21wLmV4dGVybmFsKSB7XHJcbiAgICAgIGltcG9ydHNbY29tcC5uYW1lXSA9IHtcclxuICAgICAgICBpbXBvcnRTdGF0ZW1lbnQ6IGNvbXAuZXh0ZXJuYWwuaW1wb3J0U3RhdGVtZW50LFxyXG4gICAgICAgIHN0eWxlU3RhdGVtZW50OiBjb21wLmV4dGVybmFsLnN0eWxlU3RhdGVtZW50LFxyXG4gICAgICAgIGV4dGVybmFsU291cmNlTGluazogY29tcC5leHRlcm5hbC5zb3VyY2VMaW5rLFxyXG4gICAgICAgIG5wbUxpbms6IGNvbXAuZXh0ZXJuYWwubnBtTGlua1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gaW1wb3J0cztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbW1pdFNjb3BlcygpOiB7IHZhbHVlOiBzdHJpbmc7IG5hbWU6IHN0cmluZyB9W10ge1xyXG4gIGNvbnN0IHNjb3BlczogeyB2YWx1ZTogc3RyaW5nOyBuYW1lOiBzdHJpbmcgfVtdID0gQ09NUE9ORU5UUy5tYXAoY29tcCA9PiAoe1xyXG4gICAgdmFsdWU6IGNvbXAubmFtZSxcclxuICAgIG5hbWU6IGAke2NvbXAubmFtZX06ICR7Y29tcC5pc0hvb2sgPyAnXHU5NEE5XHU1QjUwXHU1MUZEXHU2NTcwJyA6ICdcdTdFQzRcdTRFRjYnfWBcclxuICB9KSk7XHJcbiAgc2NvcGVzLnB1c2goXHJcbiAgICB7IHZhbHVlOiAnZG9jcycsIG5hbWU6ICdkb2NzOiBcdTY1ODdcdTY4NjMnIH0sXHJcbiAgICB7IHZhbHVlOiAnY29yZScsIG5hbWU6ICdjb3JlOiBcdTY4MzhcdTVGQzNcdTUzMDUnIH1cclxuICApO1xyXG4gIHJldHVybiBzY29wZXM7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRTaWRlYmFyQ29uZmlnKGxhbmc6ICd6aCcgfCAnZW4nKTogU2lkZWJhckl0ZW1bXSB7XHJcbiAgY29uc3Qgc2lkZWJhcjogU2lkZWJhckl0ZW1bXSA9IFtdO1xyXG4gIGNvbnN0IGNhdGVnb3JpZXMgPSBbJ25ldycsICdjb25maWcnLCAnZ2VuZXJhbCcsICdhd2FrZW5pbmcnLCAnZXhwcmVzc2lvbicsICdjb25maXJtYXRpb24nLCAndG9vbHMnXSBhcyBDb21wb25lbnRDYXRlZ29yeVtdO1xyXG5cclxuICBmb3IgKGNvbnN0IGNhdGVnb3J5IG9mIGNhdGVnb3JpZXMpIHtcclxuICAgIGNvbnN0IGNvbXBzID0gZ2V0Q29tcG9uZW50c0J5Q2F0ZWdvcnkoY2F0ZWdvcnkpO1xyXG4gICAgaWYgKGNvbXBzLmxlbmd0aCA9PT0gMCkgY29udGludWU7XHJcblxyXG4gICAgY29uc3QgY2F0ZWdvcnlMYWJlbCA9IENPTVBPTkVOVF9DQVRFR09SSUVTW2NhdGVnb3J5XTtcclxuICAgIHNpZGViYXIucHVzaCh7XHJcbiAgICAgIHRleHQ6IGxhbmcgPT09ICd6aCcgPyBjYXRlZ29yeUxhYmVsLnpoTGFiZWwgOiBjYXRlZ29yeUxhYmVsLmVuTGFiZWwsXHJcbiAgICAgIGl0ZW1zOiBjb21wcy5tYXAoY29tcCA9PiAoe1xyXG4gICAgICAgIHRleHQ6IGxhbmcgPT09ICd6aCcgPyBjb21wLnpoVGl0bGUgOiBjb21wLmVuVGl0bGUsXHJcbiAgICAgICAgbGluazogYC8ke2xhbmd9L2NvbXBvbmVudHMvJHtjb21wLm5hbWVMb3dlcn0vYCxcclxuICAgICAgICBiYWRnZTogY29tcC5iYWRnZVxyXG4gICAgICB9KSlcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHNpZGViYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBOQVZfRUNPU1lTVEVNX0lURU1TOiBOYXZJdGVtW10gPSBbXHJcbiAge1xyXG4gICAgdGV4dDogJ1x1NzUxRlx1NjAwMScsXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHRleHQ6ICdydW95aS1lbGVtZW50LWFpIChcdTZBMjFcdTY3N0ZcdTk4NzlcdTc2RUUpJywgbGluazogJ2h0dHBzOi8vY2hhdC1kb2NzLmVsZW1lbnQtcGx1cy14LmNvbS8nIH0sXHJcbiAgICAgIHsgdGV4dDogJ2VsZW1lbnQtdWkteCAodnVlMlx1NzI0OFx1NjcyQyknLCBsaW5rOiAnaHR0cHM6Ly9lbGVtZW50LXVpLXguY29tLycgfSxcclxuICAgICAgeyB0ZXh0OiAnaG9vay1mZXRjaCAoXHU0RjE4XHU5NkM1XHU4QkY3XHU2QzQyXHU1RTkzKScsIGxpbms6ICdodHRwczovL2pzb25sZWUxMjEzOC5naXRodWIuaW8vaG9vay1mZXRjaC8nIH0sXHJcbiAgICAgIHsgdGV4dDogJ0NoYXRBcmVhIChcdThGN0JcdTkxQ0ZcdTdFQTdcdTgwNEFcdTU5MjlcdTY4NDYpJywgbGluazogJ2h0dHBzOi8vamlhbmZ2LnRvcC9DaGF0QXJlYURvYy9ob21lJyB9XHJcbiAgICBdXHJcbiAgfSxcclxuICB7XHJcbiAgICB0ZXh0OiAndjEueCAoXHU1RjUzXHU1MjREKScsXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHRleHQ6ICd2MS54IChcdTVGNTNcdTUyNEQpJywgbGluazogJ2h0dHBzOi8vdjEuZWxlbWVudC1wbHVzLXguY29tL3poLycgfSxcclxuICAgICAgeyB0ZXh0OiAndjIueCAoQmV0YSknLCBsaW5rOiAnaHR0cHM6Ly92Mi5lbGVtZW50LXBsdXMteC5jb20vemgvJyB9XHJcbiAgICBdXHJcbiAgfVxyXG5dO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE5hdkNvbmZpZyhsYW5nOiAnemgnIHwgJ2VuJyk6IE5hdkl0ZW1bXSB7XHJcbiAgY29uc3QgZWNvc3lzdGVtSXRlbXMgPSBOQVZfRUNPU1lTVEVNX0lURU1TLm1hcChpdGVtID0+ICh7XHJcbiAgICAuLi5pdGVtLFxyXG4gICAgdGV4dDogbGFuZyA9PT0gJ3poJ1xyXG4gICAgICA/IChpdGVtLnRleHQgPT09ICdcdTc1MUZcdTYwMDEnID8gJ1x1NzUxRlx1NjAwMScgOiBpdGVtLnRleHQpXHJcbiAgICAgIDogKGl0ZW0udGV4dCA9PT0gJ1x1NzUxRlx1NjAwMScgPyAnRWNvc3lzdGVtJyA6IGl0ZW0udGV4dCksXHJcbiAgICBpdGVtczogaXRlbS5pdGVtcz8ubWFwKHN1YiA9PiAoe1xyXG4gICAgICAuLi5zdWIsXHJcbiAgICAgIHRleHQ6IGxhbmcgPT09ICd6aCcgPyBzdWIudGV4dCA6IHN1Yi50ZXh0LnJlcGxhY2UoJ1x1NkEyMVx1Njc3Rlx1OTg3OVx1NzZFRScsICdUZW1wbGF0ZScpLnJlcGxhY2UoJ1x1NEYxOFx1OTZDNVx1OEJGN1x1NkM0Mlx1NUU5MycsICdSZXF1ZXN0IExpYicpLnJlcGxhY2UoJ1x1OEY3Qlx1OTFDRlx1N0VBN1x1ODA0QVx1NTkyOVx1Njg0NicsICdDaGF0IEJveCcpXHJcbiAgICB9KSlcclxuICB9KSk7XHJcblxyXG4gIHJldHVybiBbXHJcbiAgICBlY29zeXN0ZW1JdGVtc1swXSxcclxuICAgIGVjb3N5c3RlbUl0ZW1zWzFdLFxyXG4gICAgeyB0ZXh0OiBsYW5nID09PSAnemgnID8gJ1x1NjMwN1x1NTM1NycgOiAnR3VpZGUnLCBsaW5rOiBgLyR7bGFuZ30vZ3VpZGUvaW5zdGFsbGAgfSxcclxuICAgIHsgdGV4dDogbGFuZyA9PT0gJ3poJyA/ICdcdTdFQzRcdTRFRjYnIDogJ0NvbXBvbmVudHMnLCBsaW5rOiBgLyR7bGFuZ30vY29tcG9uZW50cy94c2VuZGVyL2AgfVxyXG4gIF07XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBHVUlERV9TSURFQkFSX1pIOiBTaWRlYmFySXRlbVtdID0gW1xyXG4gIHtcclxuICAgIHRleHQ6ICdcdTU3RkFcdTc4NDAnLFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyB0ZXh0OiAnXHU1Qjg5XHU4OEM1XHU2MzA3XHU1MzU3JywgbGluazogJy96aC9ndWlkZS9pbnN0YWxsJyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTVGMDBcdTUzRDFcdTYzMDdcdTUzNTcnLCBsaW5rOiAnL3poL2d1aWRlL2RldmVsb3AnIH1cclxuICAgIF1cclxuICB9LFxyXG4gIHtcclxuICAgIHRleHQ6ICdcdTc5M0VcdTUzM0EnLFxyXG4gICAgaXRlbXM6IFt7IHRleHQ6ICdcdTRFQTRcdTZENDFcdTkwODBcdThCRjcnLCBsaW5rOiAnL3poL2d1aWRlL2ludHJvZHVjZScgfV1cclxuICB9LFxyXG4gIHtcclxuICAgIHRleHQ6ICdcdTUzRDhcdTY2RjQnLFxyXG4gICAgaXRlbXM6IFt7IHRleHQ6ICdcdTY2RjRcdTY1QjBcdTY1RTVcdTVGRDcnLCBsaW5rOiAnL3poL2d1aWRlL3VwZGF0ZS1sb2cnIH1dXHJcbiAgfSxcclxuICB7XHJcbiAgICB0ZXh0OiAnXHU1M0NEXHU5OTg4JyxcclxuICAgIGl0ZW1zOiBbeyB0ZXh0OiAnXHU5NUVFXHU5ODk4XHU1M0NEXHU5OTg4JywgbGluazogJy96aC9ndWlkZS9pc3N1ZScgfV1cclxuICB9LFxyXG4gIHtcclxuICAgIHRleHQ6ICdcdThEMjFcdTczMkUnLFxyXG4gICAgaXRlbXM6IFt7IHRleHQ6ICdcdThEMjFcdTczMkVcdTYzMDdcdTUzNTcnLCBsaW5rOiAnL3poL2d1aWRlL2NvbnRyaWJ1dGlvbicgfV1cclxuICB9XHJcbl07XHJcblxyXG5leHBvcnQgY29uc3QgR1VJREVfU0lERUJBUl9FTjogU2lkZWJhckl0ZW1bXSA9IFtcclxuICB7XHJcbiAgICB0ZXh0OiAnQmFzaWMnLFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyB0ZXh0OiAnSW5zdGFsbGF0aW9uJywgbGluazogJy9lbi9ndWlkZS9pbnN0YWxsJyB9LFxyXG4gICAgICB7IHRleHQ6ICdEZXZlbG9wbWVudCcsIGxpbms6ICcvZW4vZ3VpZGUvZGV2ZWxvcCcgfVxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogJ0NvbW11bml0eScsXHJcbiAgICBpdGVtczogW3sgdGV4dDogJ0ludml0YXRpb24nLCBsaW5rOiAnL2VuL2d1aWRlL2ludHJvZHVjZScgfV1cclxuICB9LFxyXG4gIHtcclxuICAgIHRleHQ6ICdDaGFuZ2Vsb2cnLFxyXG4gICAgaXRlbXM6IFt7IHRleHQ6ICdDaGFuZ2Vsb2cnLCBsaW5rOiAnL2VuL2d1aWRlL3VwZGF0ZS1sb2cnIH1dXHJcbiAgfSxcclxuICB7XHJcbiAgICB0ZXh0OiAnRmVlZGJhY2snLFxyXG4gICAgaXRlbXM6IFt7IHRleHQ6ICdJc3N1ZSBGZWVkYmFjaycsIGxpbms6ICcvZW4vZ3VpZGUvaXNzdWUnIH1dXHJcbiAgfSxcclxuICB7XHJcbiAgICB0ZXh0OiAnQ29udHJpYnV0aW9uJyxcclxuICAgIGl0ZW1zOiBbeyB0ZXh0OiAnQ29udHJpYnV0aW9uIEd1aWRlJywgbGluazogJy9lbi9ndWlkZS9jb250cmlidXRpb24nIH1dXHJcbiAgfVxyXG5dOyIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcXHU1NjA5XHU2MEE2XFxcXERlc2t0b3BcXFxcZWx4X2hvdGZpeFxcXFxFbGVtZW50LVBsdXMtWFxcXFxhcHBzXFxcXGRvY3NcXFxcLnZpdGVwcmVzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcXHU1NjA5XHU2MEE2XFxcXERlc2t0b3BcXFxcZWx4X2hvdGZpeFxcXFxFbGVtZW50LVBsdXMtWFxcXFxhcHBzXFxcXGRvY3NcXFxcLnZpdGVwcmVzc1xcXFxsb2NhbGVzLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvJUU1JTk4JTg5JUU2JTgyJUE2L0Rlc2t0b3AvZWx4X2hvdGZpeC9FbGVtZW50LVBsdXMtWC9hcHBzL2RvY3MvLnZpdGVwcmVzcy9sb2NhbGVzLm10c1wiO2ltcG9ydCB0eXBlIHsgRGVmYXVsdFRoZW1lLCBMb2NhbGVDb25maWcgfSBmcm9tICd2aXRlcHJlc3MnO1xyXG5cclxuaW1wb3J0IHtcclxuICBHVUlERV9TSURFQkFSX0VOLFxyXG4gIEdVSURFX1NJREVCQVJfWkgsXHJcbiAgZ2V0TmF2Q29uZmlnLFxyXG4gIGdldFNpZGViYXJDb25maWdcclxufSBmcm9tICcuLi8uLi8uLi9jb25maWdzL2luZGV4JztcclxuXHJcbmNvbnN0IGNvbmZpZyA9IHtcclxuICByb290OiB7XHJcbiAgICBsYWJlbDogJ1x1N0I4MFx1NEY1M1x1NEUyRFx1NjU4NycsXHJcbiAgICBsYW5nOiAnemgtQ04nLFxyXG4gICAgbGluazogJy96aC8nLFxyXG4gICAgdGhlbWVDb25maWc6IHtcclxuICAgICAgbGFzdFVwZGF0ZWQ6IHtcclxuICAgICAgICB0ZXh0OiAnXHU2NzAwXHU1NDBFXHU2NkY0XHU2NUIwXHU0RThFJyxcclxuICAgICAgICBmb3JtYXRPcHRpb25zOiB7XHJcbiAgICAgICAgICBkYXRlU3R5bGU6ICdtZWRpdW0nLFxyXG4gICAgICAgICAgdGltZVN0eWxlOiAnc2hvcnQnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBlZGl0TGluazoge1xyXG4gICAgICAgIHBhdHRlcm46ICdodHRwczovL2dpdGh1Yi5jb20vSGVKaWFZdWU1MjAvRWxlbWVudC1QbHVzLVgvZWRpdC9tYWluL2FwcHMvZG9jcy86cGF0aCcsXHJcbiAgICAgICAgdGV4dDogJ1x1NTcyOCBHaXRIdWIgXHU0RTBBXHU3RjE2XHU4RjkxXHU2QjY0XHU5ODc1XHU5NzYyJ1xyXG4gICAgICB9LFxyXG4gICAgICBuYXY6IGdldE5hdkNvbmZpZygnemgnKSBhcyBEZWZhdWx0VGhlbWUuTmF2SXRlbVtdLFxyXG4gICAgICBzaWRlYmFyOiB7XHJcbiAgICAgICAgJy96aC9jb21wb25lbnRzLyc6IGdldFNpZGViYXJDb25maWcoJ3poJykgYXMgRGVmYXVsdFRoZW1lLlNpZGViYXJJdGVtW10sXHJcbiAgICAgICAgJy96aC9ndWlkZS8nOiBHVUlERV9TSURFQkFSX1pIIGFzIERlZmF1bHRUaGVtZS5TaWRlYmFySXRlbVtdXHJcbiAgICAgIH0sXHJcbiAgICAgIHNlYXJjaDoge1xyXG4gICAgICAgIHByb3ZpZGVyOiAnbG9jYWwnLFxyXG4gICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgIHRyYW5zbGF0aW9uczoge1xyXG4gICAgICAgICAgICBidXR0b246IHtcclxuICAgICAgICAgICAgICBidXR0b25UZXh0OiAnXHU2NDFDXHU3RDIyXHU2NTg3XHU2ODYzJyxcclxuICAgICAgICAgICAgICBidXR0b25BcmlhTGFiZWw6ICdcdTY0MUNcdTdEMjJcdTY1ODdcdTY4NjMnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG1vZGFsOiB7XHJcbiAgICAgICAgICAgICAgbm9SZXN1bHRzVGV4dDogJ1x1NjVFMFx1NkNENVx1NjI3RVx1NTIzMFx1NzZGOFx1NTE3M1x1N0VEM1x1Njc5QycsXHJcbiAgICAgICAgICAgICAgcmVzZXRCdXR0b25UaXRsZTogJ1x1NkUwNVx1OTY2NFx1NjdFNVx1OEJFMlx1Njc2MVx1NEVGNicsXHJcbiAgICAgICAgICAgICAgZm9vdGVyOiB7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RUZXh0OiAnXHU5MDA5XHU2MkU5JyxcclxuICAgICAgICAgICAgICAgIG5hdmlnYXRlVGV4dDogJ1x1NTIwN1x1NjM2MicsXHJcbiAgICAgICAgICAgICAgICBjbG9zZVRleHQ6ICdcdTUxNzNcdTk1RUQnXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBkb2NGb290ZXI6IHtcclxuICAgICAgICBwcmV2OiAnXHU0RTBBXHU0RTAwXHU3QkM3JyxcclxuICAgICAgICBuZXh0OiAnXHU0RTBCXHU0RTAwXHU3QkM3J1xyXG4gICAgICB9LFxyXG4gICAgICBzaWRlYmFyTWVudUxhYmVsOiAnXHU4M0RDXHU1MzU1JyxcclxuICAgICAgcmV0dXJuVG9Ub3BMYWJlbDogJ1x1OEZENFx1NTZERVx1OTg3Nlx1OTBFOCcsXHJcbiAgICAgIGRhcmtNb2RlU3dpdGNoTGFiZWw6ICdcdTZERjFcdTgyNzJcdTZBMjFcdTVGMEYnLFxyXG4gICAgICBvdXRsaW5lOiB7XHJcbiAgICAgICAgbGFiZWw6ICdcdTc2RUVcdTVGNTUnLFxyXG4gICAgICAgIGxldmVsOiBbMiwgNl1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgZW46IHtcclxuICAgIGxhYmVsOiAnRW5nbGlzaCcsXHJcbiAgICBsYW5nOiAnZW4tVVMnLFxyXG4gICAgbGluazogJy9lbi8nLFxyXG4gICAgdGhlbWVDb25maWc6IHtcclxuICAgICAgbGFzdFVwZGF0ZWQ6IHtcclxuICAgICAgICB0ZXh0OiAnTGFzdCB1cGRhdGVkJyxcclxuICAgICAgICBmb3JtYXRPcHRpb25zOiB7XHJcbiAgICAgICAgICB5ZWFyOiAnbnVtZXJpYycsXHJcbiAgICAgICAgICBtb250aDogJ251bWVyaWMnLFxyXG4gICAgICAgICAgZGF5OiAnbnVtZXJpYycsXHJcbiAgICAgICAgICBob3VyOiAnMi1kaWdpdCcsXHJcbiAgICAgICAgICBtaW51dGU6ICcyLWRpZ2l0JyxcclxuICAgICAgICAgIHNlY29uZDogJzItZGlnaXQnLFxyXG4gICAgICAgICAgaG91cjEyOiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgZWRpdExpbms6IHtcclxuICAgICAgICBwYXR0ZXJuOiAnaHR0cHM6Ly9naXRodWIuY29tL0hlSmlhWXVlNTIwL0VsZW1lbnQtUGx1cy1YL2VkaXQvbWFpbi9hcHBzL2RvY3MvOnBhdGgnLFxyXG4gICAgICAgIHRleHQ6ICdFZGl0IHRoaXMgcGFnZSBvbiBHaXRIdWInXHJcbiAgICAgIH0sXHJcbiAgICAgIG5hdjogZ2V0TmF2Q29uZmlnKCdlbicpIGFzIERlZmF1bHRUaGVtZS5OYXZJdGVtW10sXHJcbiAgICAgIHNpZGViYXI6IHtcclxuICAgICAgICAnL2VuL2NvbXBvbmVudHMvJzogZ2V0U2lkZWJhckNvbmZpZygnZW4nKSBhcyBEZWZhdWx0VGhlbWUuU2lkZWJhckl0ZW1bXSxcclxuICAgICAgICAnL2VuL2d1aWRlLyc6IEdVSURFX1NJREVCQVJfRU4gYXMgRGVmYXVsdFRoZW1lLlNpZGViYXJJdGVtW11cclxuICAgICAgfSxcclxuICAgICAgc2VhcmNoOiB7XHJcbiAgICAgICAgcHJvdmlkZXI6ICdsb2NhbCcsXHJcbiAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgdHJhbnNsYXRpb25zOiB7XHJcbiAgICAgICAgICAgIGJ1dHRvbjoge1xyXG4gICAgICAgICAgICAgIGJ1dHRvblRleHQ6ICdTZWFyY2gnLFxyXG4gICAgICAgICAgICAgIGJ1dHRvbkFyaWFMYWJlbDogJ1NlYXJjaCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbW9kYWw6IHtcclxuICAgICAgICAgICAgICBub1Jlc3VsdHNUZXh0OiAnTm8gcmVzdWx0cyBmb3VuZCcsXHJcbiAgICAgICAgICAgICAgcmVzZXRCdXR0b25UaXRsZTogJ0NsZWFyIHF1ZXJ5JyxcclxuICAgICAgICAgICAgICBmb290ZXI6IHtcclxuICAgICAgICAgICAgICAgIHNlbGVjdFRleHQ6ICdTZWxlY3QnLFxyXG4gICAgICAgICAgICAgICAgbmF2aWdhdGVUZXh0OiAnTmF2aWdhdGUnLFxyXG4gICAgICAgICAgICAgICAgY2xvc2VUZXh0OiAnQ2xvc2UnXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBkb2NGb290ZXI6IHtcclxuICAgICAgICBwcmV2OiAnUHJldmlvdXMnLFxyXG4gICAgICAgIG5leHQ6ICdOZXh0J1xyXG4gICAgICB9LFxyXG4gICAgICBzaWRlYmFyTWVudUxhYmVsOiAnTWVudScsXHJcbiAgICAgIHJldHVyblRvVG9wTGFiZWw6ICdCYWNrIHRvIHRvcCcsXHJcbiAgICAgIGRhcmtNb2RlU3dpdGNoTGFiZWw6ICdEYXJrIG1vZGUnLFxyXG4gICAgICBvdXRsaW5lOiB7XHJcbiAgICAgICAgbGFiZWw6ICdcdUQ4M0RcdURDRDYgVGFibGUgb2YgQ29udGVudHMnLFxyXG4gICAgICAgIGxldmVsOiBbMiwgNl1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSBzYXRpc2ZpZXMgTG9jYWxlQ29uZmlnPERlZmF1bHRUaGVtZS5Db25maWc+O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29uZmlnO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFx1NTYwOVx1NjBBNlxcXFxEZXNrdG9wXFxcXGVseF9ob3RmaXhcXFxcRWxlbWVudC1QbHVzLVhcXFxcYXBwc1xcXFxkb2NzXFxcXHNjcmlwdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFx1NTYwOVx1NjBBNlxcXFxEZXNrdG9wXFxcXGVseF9ob3RmaXhcXFxcRWxlbWVudC1QbHVzLVhcXFxcYXBwc1xcXFxkb2NzXFxcXHNjcmlwdHNcXFxcdnVlLWVsZW1lbnQtcGx1cy14LXJlc29sdmVyLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy8lRTUlOTglODklRTYlODIlQTYvRGVza3RvcC9lbHhfaG90Zml4L0VsZW1lbnQtUGx1cy1YL2FwcHMvZG9jcy9zY3JpcHRzL3Z1ZS1lbGVtZW50LXBsdXMteC1yZXNvbHZlci50c1wiO2ltcG9ydCB0eXBlIHsgQ29tcG9uZW50UmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdG92VUlSZXNvbHZlcigpOiBDb21wb25lbnRSZXNvbHZlciB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6ICdjb21wb25lbnQnLFxyXG4gICAgcmVzb2x2ZShuYW1lKSB7XHJcbiAgICAgIC8vIC8vIFx1NTkyN1x1NUJCNlx1NTNFRlx1NEVFNVx1NzcwQlx1NTIzMFx1NjIxMVx1NEVFQ1x1OEZEOVx1OTFDQ1x1NjI1M1x1NTM3MFx1NTFGQVx1Njc2NVx1NzY4NFx1NjYyRiBUQnV0dG9uXHVGRjBDXHU2MjQwXHU0RUU1XHU2MjExXHU0RUVDXHU1QzMxXHU1M0VGXHU0RUU1XHU1MjI0XHU2NUFEXHU0RTAwXHU0RTBCXHU2NjJGXHU0RTBEXHU2NjJGXHU2MjExXHU0RUVDXHU3Njg0XHU0RUU1VFx1NUYwMFx1NTkzNFx1NzY4NFx1N0VDNFx1NEVGNlxyXG4gICAgICAvLyBpZiAobmFtZSA9PT0gJ1RCdXR0b24nKSB7XHJcbiAgICAgIC8vICAgLy8gXHU1OTgyXHU2NzlDXHU2NjJGXHU0RUU1VFx1NUYwMFx1NTkzNFx1NzY4NFx1N0VDNFx1NEVGNlx1RkYwQ1x1NjIxMVx1NEVFQ1x1OTcwMFx1ODk4MVx1ODFFQVx1NTJBOFx1NTJBMFx1OEY3RFx1OEZEQlx1Njc2NVx1MzAwMlxyXG4gICAgICAvLyAgIHJldHVybiB7XHJcbiAgICAgIC8vICAgICAvLyBcdTU2RTBcdTRFM0FcdTYyMTFcdTRFRUNcdTUxOERcdTVCRkNcdTUxRkFcdTc2ODRcdTY1RjZcdTUwMTlcdTVFNzZcdTZDQTFcdTY3MDlcdTUyMzBcdTU5MDRcdTUyNERcdTdGMDBUXHU2MjQwXHU0RUU1XHU2MjExXHU0RUVDXHU4OTgxXHU1MjIwXHU5NjY0XHU2Mzg5XHU1MjREXHU3RjAwXHJcbiAgICAgIC8vICAgICBuYW1lOiBuYW1lLnNsaWNlKDEpLFxyXG4gICAgICAvLyAgICAgZnJvbTogJ2VsZW1lbnQtcGx1cy14JyxcclxuICAgICAgLy8gICB9XHJcbiAgICAgIC8vIH1cclxuXHJcbiAgICAgIGlmIChuYW1lLnN0YXJ0c1dpdGgoJ0VsJykgfHwgbmFtZS5zdGFydHNXaXRoKCdlbCcpKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIG5hbWUsXHJcbiAgICAgICAgICBmcm9tOiAnZWxlbWVudC1wbHVzJyxcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBcdTc5RkJcdTk2NjQgQ2xpZW50T25seSBcdTdFQzRcdTRFRjZcclxuICAgICAgaWYgKG5hbWUgPT09ICdDbGllbnRPbmx5Jykge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIG5hbWUsXHJcbiAgICAgICAgZnJvbTogJ3Z1ZS1lbGVtZW50LXBsdXMteCcsXHJcbiAgICAgIH07XHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFrWixTQUFTLGdCQUFnQjtBQUUzYSxTQUFTLHFCQUFxQjtBQUM5QixPQUFPLFlBQVk7QUFDbkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUywyQkFBMkI7QUFDcEMsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUyxvQkFBb0I7QUFJN0IsU0FBUyxtQkFBbUIsMkJBQTJCOzs7QUNUaEQsSUFBTSxlQUFtQztBQUFBLEVBQzlDO0FBQUEsSUFDRSxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsSUFDVCxPQUFPO0FBQUEsSUFDUCxTQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixhQUFhO0FBQUEsSUFDYixlQUFlO0FBQUEsSUFDZixTQUFTLENBQUMsU0FBUztBQUFBLElBQ25CLFlBQVk7QUFBQSxFQUNkO0FBQUEsRUFDQTtBQUFBLElBQ0UsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AsU0FBUztBQUFBLElBQ1QsU0FBUztBQUFBLElBQ1QsT0FBTztBQUFBLElBQ1AsU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsYUFBYTtBQUFBLElBQ2IsZUFBZTtBQUFBLElBQ2YsWUFBWTtBQUFBLEVBQ2Q7QUFBQSxFQUNBO0FBQUEsSUFDRSxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsSUFDVCxPQUFPO0FBQUEsSUFDUCxTQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixhQUFhO0FBQUEsSUFDYixlQUFlO0FBQUEsSUFDZixZQUFZO0FBQUEsRUFDZDtBQUFBLEVBQ0E7QUFBQSxJQUNFLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxJQUNQLFNBQVM7QUFBQSxJQUNULFNBQVM7QUFBQSxJQUNULE9BQU87QUFBQSxJQUNQLFNBQVM7QUFBQSxJQUNULGFBQWE7QUFBQSxJQUNiLGFBQWE7QUFBQSxJQUNiLGVBQWU7QUFBQSxJQUNmLFlBQVk7QUFBQSxFQUNkO0FBQUEsRUFDQTtBQUFBLElBQ0UsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AsU0FBUztBQUFBLElBQ1QsU0FBUztBQUFBLElBQ1QsT0FBTztBQUFBLElBQ1AsU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsYUFBYTtBQUFBLElBQ2IsZUFBZTtBQUFBLElBQ2YsWUFBWTtBQUFBLEVBQ2Q7QUFBQSxFQUNBO0FBQUEsSUFDRSxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsSUFDVCxPQUFPO0FBQUEsSUFDUCxTQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixhQUFhO0FBQUEsSUFDYixlQUFlO0FBQUEsSUFDZixZQUFZO0FBQUEsRUFDZDtBQUFBLEVBQ0E7QUFBQSxJQUNFLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxJQUNQLFNBQVM7QUFBQSxJQUNULFNBQVM7QUFBQSxJQUNULE9BQU87QUFBQSxJQUNQLFNBQVM7QUFBQSxJQUNULGFBQWE7QUFBQSxJQUNiLGFBQWE7QUFBQSxJQUNiLGVBQWU7QUFBQSxJQUNmLFlBQVk7QUFBQSxFQUNkO0FBQUEsRUFDQTtBQUFBLElBQ0UsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AsU0FBUztBQUFBLElBQ1QsU0FBUztBQUFBLElBQ1QsT0FBTztBQUFBLElBQ1AsU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsYUFBYTtBQUFBLElBQ2IsZUFBZTtBQUFBLElBQ2YsWUFBWTtBQUFBLEVBQ2Q7QUFBQSxFQUNBO0FBQUEsSUFDRSxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsSUFDVCxPQUFPO0FBQUEsSUFDUCxTQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixhQUFhO0FBQUEsSUFDYixlQUFlO0FBQUEsSUFDZixZQUFZO0FBQUEsRUFDZDtBQUFBLEVBQ0E7QUFBQSxJQUNFLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxJQUNQLFNBQVM7QUFBQSxJQUNULFNBQVM7QUFBQSxJQUNULE9BQU87QUFBQSxJQUNQLFNBQVM7QUFBQSxJQUNULGFBQWE7QUFBQSxJQUNiLGFBQWE7QUFBQSxJQUNiLGVBQWU7QUFBQSxJQUNmLFlBQVk7QUFBQSxFQUNkO0FBQUEsRUFDQTtBQUFBLElBQ0UsTUFBTTtBQUFBLElBQ04s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QUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsSUFDVCxVQUFVO0FBQUEsRUFDWjtBQUFBLEVBQ0E7QUFBQSxJQUNFLE1BQU07QUFBQSxJQUNOLFdBQVc7QUFBQSxJQUNYLFNBQVM7QUFBQSxJQUNULFNBQVM7QUFBQSxJQUNULFVBQVU7QUFBQSxFQUNaO0FBQUEsRUFDQTtBQUFBLElBQ0UsTUFBTTtBQUFBLElBQ04sV0FBVztBQUFBLElBQ1gsU0FBUztBQUFBLElBQ1QsU0FBUztBQUFBLElBQ1QsVUFBVTtBQUFBLEVBQ1o7QUFBQSxFQUNBO0FBQUEsSUFDRSxNQUFNO0FBQUEsSUFDTixXQUFXO0FBQUEsSUFDWCxTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsSUFDVCxVQUFVO0FBQUEsRUFDWjtBQUFBLEVBQ0E7QUFBQSxJQUNFLE1BQU07QUFBQSxJQUNOLFdBQVc7QUFBQSxJQUNYLFNBQVM7QUFBQSxJQUNULFNBQVM7QUFBQSxJQUNULFVBQVU7QUFBQSxFQUNaO0FBQUEsRUFDQTtBQUFBLElBQ0UsTUFBTTtBQUFBLElBQ04sV0FBVztBQUFBLElBQ1gsU0FBUztBQUFBLElBQ1QsU0FBUztBQUFBLElBQ1QsVUFBVTtBQUFBLEVBQ1o7QUFBQSxFQUNBO0FBQUEsSUFDRSxNQUFNO0FBQUEsSUFDTixXQUFXO0FBQUEsSUFDWCxTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsSUFDVCxVQUFVO0FBQUEsSUFDVixRQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0E7QUFBQSxJQUNFLE1BQU07QUFBQSxJQUNOLFdBQVc7QUFBQSxJQUNYLFNBQVM7QUFBQSxJQUNULFNBQVM7QUFBQSxJQUNULFVBQVU7QUFBQSxJQUNWLFFBQVE7QUFBQSxFQUNWO0FBQUEsRUFDQTtBQUFBLElBQ0UsTUFBTTtBQUFBLElBQ04sV0FBVztBQUFBLElBQ1gsU0FBUztBQUFBLElBQ1QsU0FBUztBQUFBLElBQ1QsVUFBVTtBQUFBLElBQ1YsUUFBUTtBQUFBLEVBQ1Y7QUFDRjtBQUVPLElBQU0sa0JBQWtCLFdBQVcsSUFBSSxPQUFLLEVBQUUsSUFBSTtBQUNs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
