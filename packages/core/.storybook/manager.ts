import type { State } from 'storybook/manager-api';
import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const theme = create({
  base: 'light',
  brandTitle: 'vue-element-plus-x',
  brandUrl: 'https://element-plus-x.com',
  brandImage: '/logo.svg'
});

const darkTheme = create({
  base: 'dark',
  brandTitle: 'vue-element-plus-x',
  brandUrl: 'https://element-plus-x.com',
  brandImage: '/logo.svg'
});

addons.setConfig({
  // 自定义主题（undefined 表示使用默认主题）
  theme,
  darkTheme,
  // 侧边栏宽度（像素）
  navSize: 310,
  // 底部面板高度（像素）
  bottomPanelHeight: 200,
  // 右侧面板宽度（像素）
  rightPanelWidth: 520,
  // 控制面板位置：'bottom' 或 'right'
  panelPosition: 'right',
  // 是否启用快捷键
  enableShortcuts: false,
  // 是否显示顶部工具栏
  showToolbar: true,
  // 初始选中的面板（undefined 表示不强制选中）
  selectedPanel: undefined,
  // 初始激活的界面元素：'sidebar' 或 'panel'
  initialActive: 'sidebar',

  // 自定义布局逻辑
  layoutCustomisations: {
    // 根据当前故事动态显示/隐藏侧边栏
    // state: 当前 Storybook 状态，包含故事ID、视图模式等信息
    // defaultValue: 默认显示状态
    showSidebar(state: State, defaultValue: boolean) {
      // 当故事ID为'landing'时隐藏侧边栏，其他情况使用默认设置
      return state.storyId === 'landing' ? false : defaultValue;
    },

    // 根据视图模式动态显示/隐藏工具栏
    showToolbar(state: State, defaultValue: boolean) {
      // 当视图模式为'docs'时隐藏工具栏，其他情况使用默认设置
      return state.viewMode === 'docs' ? false : defaultValue;
    }
  },

  // 侧边栏配置
  sidebar: {
    // 是否显示根目录节点
    showRoots: false,
    // 默认折叠的根目录（数组中的名称对应故事分类）
    collapsedRoots: ['other']
  },

  // 顶部工具栏配置
  toolbar: {
    // 故事标题控件
    title: { hidden: true },
    // 缩放控件
    zoom: { hidden: true },
    // 弹出到新窗口控件
    eject: { hidden: true },
    // 复制控件
    copy: { hidden: false },
    // 全屏控件
    fullscreen: { hidden: false },
    // 刷新控件
    remount: { hidden: false }
  }
});
