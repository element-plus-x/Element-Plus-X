import type { Meta, StoryObj } from '@storybook/vue3';
import {
  animateTestMdContent,
  customAttrContent,
  highlightMdContent,
  mathMdContent,
  mdContent,
  mermaidMdContent
} from '@assets/mock';
import { shikiThemeDefault } from '@components/XMarkdownCore/shared';
import CustomAttrs from './customAttrs.vue';
import HighlightCodeDemo from './highlight-code-demo.vue';
import XMarkdown from './index.vue';
import MermaidSlot from './mermaid-slot.vue';

const meta = {
  title: 'Example/XMarkdown 渲染组件',
  component: XMarkdown,
  tags: ['autodocs'],
  argTypes: {
    markdown: { control: 'text' },
    themes: {
      control: 'object',
      defaultValue: {
        ...shikiThemeDefault
      }
    },
    needViewCodeBtn: { control: 'boolean', defaultValue: true },
    secureViewCode: { control: 'boolean', defaultValue: false },
    defaultThemeMode: { control: 'select', options: ['light', 'dark'] },
    viewCodeModalOptions: { control: 'object' },
    colorReplacements: { control: 'object' },
    mermaidConfig: { control: 'object' }
  },
  args: {
    markdown: mdContent,
    themes: {
      ...shikiThemeDefault
    },
    needViewCodeBtn: true,
    secureViewCode: false,
    viewCodeModalOptions: {
      mode: 'drawer',
      customClass: '',
      dialogOptions: {
        closeOnClickModal: true,
        closeOnPressEscape: true
      },
      drawerOptions: {
        closeOnClickModal: true,
        closeOnPressEscape: true
      }
    },
    defaultThemeMode: 'light',
    colorReplacements: {
      'vitesse-light': {
        '#ab5959': '#ff66ff',
        '#1e754f': '#029c99'
      },
      'vitesse-dark': {
        '#cb7676': '#ff0066',
        '#4d9375': '#952189'
      }
    },
    mermaidConfig: {
      showToolbar: true,
      showFullscreen: true,
      showZoomIn: true,
      showZoomOut: true,
      showReset: true,
      showDownload: true,
      toolbarStyle: {},
      toolbarClass: 'mermaid-config-toolbar'
    }
  }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;
export const MarkdownDemo: Story = {
  args: {
    markdown: mdContent
  } as Story['args']
};

export const highlightMdContentDemo: Story = {
  argTypes: {
    codeXProps: {
      control: 'object',
      defaultValue: {}
    }
  } as any,
  args: {
    markdown: highlightMdContent,
    codeXProps: {
      enableCodeLineNumber: true
    }
  } as any,
  render: args => ({
    components: { HighlightCodeDemo },
    setup() {
      return { attrs: args };
    },
    template: `<HighlightCodeDemo v-bind="attrs"  />`
  })
};

export const PieRenderDemo: Story = {
  args: {
    markdown: mermaidMdContent
  } as Story['args']
};

export const MathRenderDemo: Story = {
  args: {
    markdown: mathMdContent
  } as Story['args']
};

// Mermaid 插槽功能演示
export const MermaidSlotDemo: Story = {
  args: {
    markdown: mermaidMdContent,
    mermaidConfig: {
      showToolbar: true,
      showFullscreen: true,
      showZoomIn: true,
      showZoomOut: true,
      showReset: true,
      showDownload: true,
      toolbarStyle: {
        background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
        boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
        borderRadius: '8px'
      },
      iconColor: '#FFFFFF',
      tabTextColor: '#FFFFFF'
    }
  } as Story['args'],

  render: args => ({
    components: {
      MermaidSlot
    },
    setup() {
      return { attrs: args };
    },
    template: `<MermaidSlot v-bind="attrs"  />`
  })
  // render: () => MermaidSlot
};

export const CustomAttrsDemo: Story = {
  args: {
    markdown: customAttrContent,
    customAttrs: {
      a: () => ({
        target: '_blank',
        rel: 'noopener noreferrer'
      }),
      h1: {
        style: {
          color: 'red',
          fontSize: '24px'
        }
      },
      h2: {
        style: {
          color: 'blue',
          fontSize: '20px'
        }
      }
    }
  } as Story['args'],
  render: args => ({
    components: {
      CustomAttrs
    },
    setup() {
      return { attrs: args };
    },
    template: `<CustomAttrs v-bind="attrs" />`
  })
};

export const AnimateTestDemo: Story = {
  args: {
    markdown: animateTestMdContent,
    enableAnimate: true,
    allowHtml: true
  } as Story['args']
};
