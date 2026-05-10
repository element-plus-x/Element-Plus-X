import type BubbleListSource from '@components/BubbleList/index.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { messageArr } from '@assets/mock';
import AutoScroll from './AutoScroll.vue';
import BidirectionalLoading from './BidirectionalLoading.vue';
import BottomStatusRegression from './BottomStatusRegression.vue';
import CustomSolt from './CustomSolt.vue';
import BubbleList from './index.vue';
import MixedNodes from './MixedNodes.vue';
import OverviewDemo from './OverviewDemo.vue';
import StreamingFollow from './StreamingFollow.vue';
import StreamingMarkdown from './StreamingMarkdown.vue';
import StreamingReplaceSSE from './StreamingReplaceSSE.vue';
import VirtualSmallList from './VirtualSmallList.vue';
import WithMarkdown from './WithMarkdown.vue';

const meta = {
  title: 'Example/BubbleList 气泡列表',
  component: BubbleList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  },
  argTypes: {
    autoScroll: { control: 'boolean' },
    maxHeight: { control: 'text' },
    alwaysShowScrollbar: { control: 'boolean' },
    showBackButton: { control: 'boolean' },
    backButtonPosition: { control: 'object' },
    backButtonThreshold: { control: 'number' },
    backButtonSmoothScroll: { control: 'boolean' },
    virtual: { control: 'boolean' },
    smoothScroll: { control: 'boolean' },
    itemKey: { control: 'text' },
    itemType: { control: 'text' },
    loadMoreTopThreshold: { control: 'number' },
    loadMoreBottomThreshold: { control: 'number' },
    topStatus: { control: 'object' },
    bottomStatus: { control: 'object' },
    btnLoading: { control: 'boolean' },
    btnColor: { control: 'color' },
    btnIconSize: { control: 'number' }
  },
  args: {
    list: messageArr,
    autoScroll: true,
    maxHeight: '100%',
    alwaysShowScrollbar: true,
    showBackButton: true,
    backButtonPosition: {
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)'
    },
    backButtonThreshold: 80,
    backButtonSmoothScroll: false,
    virtual: true,
    smoothScroll: true,
    itemKey: 'key',
    loadMoreTopThreshold: 80,
    loadMoreBottomThreshold: 80,
    btnLoading: true,
    btnColor: '#409EFF',
    btnIconSize: 24
  }
} satisfies Meta<typeof BubbleListSource>;

export default meta;

type Story = StoryObj<typeof meta>;

function renderDemo(component: any) {
  return (args: any) => ({
    components: {
      Demo: component
    },
    setup() {
      return {
        args
      };
    },
    template: `<Demo v-bind="args" />`
  });
}

export const BubbleListDemo: Story = {
  name: '基础消息流 / 滚动方法',
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          '基础消息流验收页，用于观察追加消息、未读计数和滚动方法（scrollToTop / scrollToBottom / scrollToBubble）的行为。\n\n**默认行为（autoScroll: true）：** 所有新增内容仅当用户处于底部时自动滚动到底部。用户上滑后自动中断，回到底部后恢复。\n\n关闭 `autoScroll` 后，任何新内容都不会触发自动滚动，改为累计未读计数并显示回底按鈕。'
      }
    }
  }
};

export const AutoScrollDemo: Story = {
  name: '自动触底 / 未读计数 (autoScroll)',
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          '演示 `autoScroll` 属性对新消息自动触底和未读计数的影响。\n\n- **开启 autoScroll（默认）**：追加消息自动滚到底部，未读计数始终为 0。\n- **关闭 autoScroll**：新消息不自动触底，累计未读计数，回底按钮显示红色角标。\n\n⚠️ **重要**：未读角标依赖关闭 `autoScroll`，否则新消息总是自动触底，无法产生未读。'
      }
    }
  },
  render: renderDemo(AutoScroll)
};

export const OverviewPlaygroundDemo: Story = {
  name: '复杂时间线 / 流式、分页、特殊节点',
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          '集中验收流式续写、特殊节点、顶部/底部分页和回底协同。兼容模式不再单独拆 story，直接在 Controls 里把 virtual 关掉即可。'
      }
    }
  },
  render: renderDemo(OverviewDemo)
};

export const MixedNodesDemo: Story = {
  name: '混合节点 / 统一 item 插槽',
  args: {},
  render: renderDemo(MixedNodes)
};

export const BidirectionalPaginationDemo: Story = {
  name: '双向加载 / 状态区域 / 历史消息',
  args: {},
  render: renderDemo(BidirectionalLoading)
};

export const BottomStatusRegressionDemo: Story = {
  name: '触底边界回归 / 底部状态区 + 流式输出',
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          '聚焦组合回归点：当 bottomStatus 正在渲染较高的底部插槽时，最后一条 AI 消息继续流式变高，BubbleList 仍然需要稳定贴底。这个 story 同时提供固定高度和自适应高度两种底部状态区模式。'
      }
    }
  },
  render: renderDemo(BottomStatusRegression)
};

export const StreamingFollowDemo: Story = {
  name: '流式跟随 / 自动追底',
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          '演示流式输出场景下的默认自动跟随行为：处于底部时跟随流式内容，上滑后中断，回到底部后自动恢复。无需任何额外配置。\n\n如需强制始终追底（如日志查看器），可使用 `shouldFollowContent` 回调并返回 `context.autoScroll` 覆盖默认行为。'
      }
    }
  },
  render: renderDemo(StreamingFollow)
};

export const StreamingMarkdownDemo: Story = {
  name: '流式输出 / Markdown 渲染',
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          '模拟 AI 按 chunk 逐段输出 Markdown，实时观察 BubbleList 的自动跟随与 Markdown 渲染效果。'
      }
    }
  },
  render: renderDemo(StreamingMarkdown)
};

export const StreamingReplaceSSEDemo: Story = {
  name: 'SSE 全量替换 / 自动触底失效复现',
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          '复现真实场景：后端 SSE 每次推送的是「已拼接好的累计 content」，前端只取最后一次 content 并整体赋值（`item.content = e.content`）到 AI 气泡，而不是按 delta 追加。此模式下 BubbleList 的流式自动触底可能失效。Story 内提供「全量替换 / 增量追加」切换以便对照。'
      }
    }
  },
  render: renderDemo(StreamingReplaceSSE)
};

export const VirtualSmallListDemo: Story = {
  name: '虚拟列表 / 小数据首屏对齐 (回归)',
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          '复现 2.0 升级后用户反馈：当 `virtual=true` 且消息条数较少（容器高度足以容纳全部消息）时，首屏挂载后视口可能停在错误位置（内容下方的空白处），需要先往上滑一下再往下滑动，才能看见最初渲染的消息。\n\n**根因**：首屏 watch(latestItemSignal) 只在 `nextTick` 调用了一次 `scrollToBottom`，但 virtua 在第一帧用估算高度定位，真实高度测出来后并未做二次校正；watch(virtualEnabled) 里的 double rAF 修正没有 `immediate`，初始挂载根本不触发。'
      }
    }
  },
  render: renderDemo(VirtualSmallList)
};

export const SoltDemo: Story = {
  name: '局部插槽 / 自定义气泡内容',
  args: {
    ...BubbleListDemo.args,
    content: '欢迎使用 Element Plus X',
    list: messageArr?.map(item => ({
      ...item,
      noStyle: true
    }))
  } as Story['args'],
  render: (args: any) => ({
    components: {
      CustomSolt
    },
    setup() {
      return {
        attrs: args
      };
    },
    template: `<CustomSolt v-bind="attrs" />`
  })
};

export const WithMarkdownDemo: Story = {
  name: '与 x-markdown-vue 结合使用',
  render: () => ({
    components: {
      WithMarkdown
    },
    template: `<WithMarkdown />`
  })
};
