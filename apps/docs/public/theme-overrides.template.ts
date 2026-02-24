export const themeOverridesLight = {
  common: {
    'color-primary': '#409eff',
    'color-success': '#67c23a',
    'color-warning': '#e6a23c',
    'color-danger': '#f56c6c',
    'color-info': '#909399',
    'text-color-primary': '#303133',
    'text-color-regular': '#606266',
    'text-color-secondary': '#909399',
    'text-color-placeholder': '#a8abb2',
    'bg-page': '#f5f7fa',
    'bg-surface': '#ffffff',
    'border-color': '#dcdfe6',
    'border-radius-base': '4px',
    'border-radius-small': '2px',
    'border-radius-round': '20px',
    'fill-color': '#f0f2f5',
    'fill-color-light': '#f5f7fa',
    'padding-xs': '4px',
    'padding-sm': '8px',
    'padding-md': '12px',
    'padding-lg': '16px',
    'padding-xl': '20px',
    'box-shadow': '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
    'box-shadow-light': '0 2px 8px 0 rgba(0, 0, 0, 0.06)'
  },
  components: {
    Attachments: {
      'attachments-fade-rgb': '255, 255, 255',
      'attachments-nav-bg': 'rgba(0, 0, 0, 0.3)',
      'attachments-nav-bg-hover': 'rgba(0, 0, 0, 0.5)',
      'attachments-nav-bg-active': 'rgba(0, 0, 0, 0.7)',
      'attachments-nav-color': '#ffffff',
      'attachments-drop-bg': 'rgba(225, 225, 225, 0.3)',
      'attachments-upload-icon-color': 'var(--elx-text-color-placeholder)',
      'attachments-upload-icon-size': '64px'
    },
    Bubble: {
      'bubble-content-max-width': '500px',
      'bubble-bg': 'var(--el-fill-color)',
      'bubble-border-color': 'var(--el-border-color)',
      'bubble-text-color': 'var(--el-text-color-primary)',
      'bubble-radius': 'calc(var(--el-border-radius-base) + 4px)',
      'bubble-padding-y': 'var(--el-padding-sm, 12px)',
      'bubble-padding-x': 'calc(var(--el-padding-sm, 12px) + 4px)',
      'bubble-shadow': 'var(--el-box-shadow)',
      'bubble-dot-color': 'var(--el-color-primary)'
    },
    BubbleList: {
      'bubble-list-max-height': '100%',
      'bubble-list-btn-size': '24px'
    },
    Conversations: {
      'conversations-list-auto-bg-color': '#fff',
      'conversations-label-height': '20px'
    },
    FilesCard: {
      'files-card-bg': 'rgba(0, 0, 0, 0.04)',
      'files-card-border-color': 'rgba(0, 0, 0, 0.1)',
      'files-card-progress-bg': 'rgba(0, 0, 0, 0.06)',
      'files-card-delete-bg': 'rgba(255, 255, 255, 0.9)',
      'files-card-delete-border-color': 'var(--elx-border-color)',
      'files-card-delete-color': 'var(--elx-text-color-secondary)',
      'files-card-delete-shadow': '0 2px 8px rgba(0, 0, 0, 0.12)',
      'files-card-icon-size': '42px',
      'files-card-max-width': '236px'
    },
    Thinking: {
      'thinking-button-width': '160px',
      'thinking-animation-duration': '0.2s',
      'thinking-content-wrapper-width': '500px',
      'thinking-content-wrapper-background-color': 'rgba(0, 0, 0, 0.02)',
      'thinking-content-wrapper-color': 'var(--elx-text-color-regular)',
      'thinking-trigger-bg': '#fff',
      'thinking-trigger-bg-hover': 'rgba(0, 0, 0, 0.03)',
      'thinking-trigger-border-color': 'var(--elx-border-color)',
      'thinking-content-bg': 'rgba(0, 0, 0, 0.02)',
      'thinking-content-color': 'var(--elx-text-color-regular)'
    },
    Welcome: {
      'welcome-border-radius': '8px',
      'welcome-icon-size': '64px',
      'welcome-icon-size-small': '48px',
      'welcome-gap': '16px',
      'welcome-gap-small': '8px',
      'welcome-padding': '24px',
      'welcome-filled-bg': '#e6f4ff',
      'welcome-filled-border': '#91caff',
      'welcome-title-color': 'rgba(0, 0, 0, 0.88)',
      'welcome-description-color': 'rgba(0, 0, 0, 0.65)'
    },
    XSender: {
      'x-sender-header-duration': '300ms'
    }
  }
} as const;

export const themeOverridesDark = {
  common: {
    'color-primary': '#409eff',
    'text-color-primary': '#e5eaf3',
    'text-color-regular': '#cfd3dc',
    'text-color-secondary': '#a3a6ad',
    'text-color-placeholder': '#8d9095',
    'bg-page': '#1b1b1f',
    'bg-surface': '#141414',
    'border-color': '#4c4d4f',
    'fill-color': '#303030',
    'fill-color-light': '#262727',
    'box-shadow': '0 2px 12px 0 rgba(0, 0, 0, 0.3)'
  },
  components: {
    Attachments: {
      'attachments-fade-rgb': '20, 20, 20',
      'attachments-nav-bg': 'rgba(255, 255, 255, 0.12)',
      'attachments-nav-bg-hover': 'rgba(255, 255, 255, 0.18)',
      'attachments-nav-bg-active': 'rgba(255, 255, 255, 0.25)',
      'attachments-nav-color': '#ffffff',
      'attachments-drop-bg': 'rgba(255, 255, 255, 0.08)',
      'attachments-upload-icon-color': 'var(--elx-text-color-secondary)',
      'attachments-upload-icon-size': '64px'
    },
    Bubble: {
      'bubble-content-max-width': '500px',
      'bubble-bg': 'var(--el-fill-color)',
      'bubble-border-color': 'var(--el-border-color)',
      'bubble-text-color': 'var(--el-text-color-primary)',
      'bubble-radius': 'calc(var(--el-border-radius-base) + 4px)',
      'bubble-padding-y': 'var(--el-padding-sm, 12px)',
      'bubble-padding-x': 'calc(var(--el-padding-sm, 12px) + 4px)',
      'bubble-shadow': 'var(--el-box-shadow)',
      'bubble-dot-color': 'var(--el-color-primary)'
    },
    FilesCard: {
      'files-card-bg': 'rgba(255, 255, 255, 0.06)',
      'files-card-border-color': 'rgba(255, 255, 255, 0.12)',
      'files-card-progress-bg': 'rgba(255, 255, 255, 0.06)',
      'files-card-delete-bg': 'rgba(0, 0, 0, 0.55)',
      'files-card-delete-border-color': 'rgba(255, 255, 255, 0.12)',
      'files-card-delete-color': 'rgba(255, 255, 255, 0.72)',
      'files-card-delete-shadow': '0 4px 12px rgba(0, 0, 0, 0.35)',
      'files-card-icon-size': '42px',
      'files-card-max-width': '236px'
    },
    Thinking: {
      'thinking-trigger-bg': 'rgba(255, 255, 255, 0.06)',
      'thinking-trigger-bg-hover': 'rgba(255, 255, 255, 0.08)',
      'thinking-trigger-border-color': 'rgba(255, 255, 255, 0.12)',
      'thinking-content-bg': 'rgba(255, 255, 255, 0.04)',
      'thinking-content-color': 'var(--elx-text-color-regular)',
      'thinking-content-wrapper-background-color': 'rgba(255, 255, 255, 0.04)',
      'thinking-content-wrapper-color': 'var(--elx-text-color-regular)'
    }
  }
} as const;
