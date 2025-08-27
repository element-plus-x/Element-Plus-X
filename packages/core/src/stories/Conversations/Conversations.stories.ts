import type ConversationsSource from '@components/Conversations/index.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ElMessage } from 'element-plus';
import CustomStyleSolt from './CustomStyleSolt.vue';
import Conversations from './index.vue';

const meta: Meta<typeof ConversationsSource> = {
  title: 'Example/Conversations 会话管理组件',
  component: Conversations,
  argTypes: {
    items: {
      description: '会话项数据列表，包含 label、group、disabled 等字段',
      control: 'object',
      defaultValue: []
    },
    groupable: {
      description: '是否启用分组功能，传入对象可自定义分组排序',
      defaultValue: false
    },
    showBuiltInMenu: {
      description: '是否显示内置菜单（重命名、删除）',
      control: 'boolean',
      defaultValue: false
    },
    loadMore: {
      control: 'object',
      description: '懒加载回调函数，滚动至底部时触发'
    },
    loadMoreLoading: {
      description: '加载更多状态，控制加载动画显示',
      control: 'boolean',
      defaultValue: false
    },
    showToTopBtn: {
      description: '是否显示返回顶部按钮',
      control: 'boolean',
      defaultValue: false
    },
    labelKey: {
      description: '会话项标签字段名',
      control: 'text',
      defaultValue: 'label'
    },
    rowKey: {
      description: '会话项唯一标识字段名',
      control: 'text',
      defaultValue: 'id'
    },
    itemsStyle: {
      description: '会话项默认样式',
      control: 'object',
      defaultValue: {}
    },
    itemsHoverStyle: {
      description: '会话项悬停样式',
      control: 'object',
      defaultValue: {}
    },
    itemsActiveStyle: {
      description: '会话项激活样式',
      control: 'object',
      defaultValue: {}
    },
    itemsMenuOpenedStyle: {
      description: '会话项菜单打开时样式',
      control: 'object',
      defaultValue: {}
    }
  }
} satisfies Meta<typeof ConversationsSource>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ConversationsDemo: Story = {
  args: {
    items: [
      {
        id: '1',
        label: '今天的会话111111111111111111111111111',
        group: 'today'
      },
      {
        id: '2',
        group: 'today',
        label: '今天的会话2',
        disabled: true
      },
      {
        id: '3',
        group: 'yesterday',
        label: '昨天的会话1'
      },
      {
        id: '4',
        label: '昨天的会话2'
      },
      {
        id: '5',
        label: '一周前的会话'
      },
      {
        id: '6',
        label: '一个月前的会话'
      },
      {
        id: '7',
        label: '很久以前的会话'
      },
      {
        id: '8',
        label: '一个星期前的会话'
      },
      {
        id: '9',
        label: '一个月前的会话'
      },
      {
        id: '10',
        label: '一个月前的会话'
      },
      {
        id: '11',
        label: '一个月前的会话'
      },
      {
        id: '12',
        label: '一个月前的会话'
      },
      {
        id: '13',
        label: '一个月前的会话'
      }
    ],
    groupable: true,
    showBuiltInMenu: true,
    loadMore: () => {
      ElMessage.success(`加载更多`);
    },
    loadMoreLoading: true,
    showToTopBtn: true,
    labelKey: 'label',
    rowKey: 'id',
    itemsStyle: {
      backgroundColor: '#f0f0f0',
      padding: '8px'
    },
    itemsHoverStyle: {
      backgroundColor: '#e0e0e0'
    },
    itemsActiveStyle: {
      backgroundColor: '#d0d0d0',
      fontWeight: 'bold'
    },
    itemsMenuOpenedStyle: {
      backgroundColor: '#c0c0c0',
      border: '1px solid #aaa'
    }
  }
};

export const StyleSoltDemo: Story = {
  args: {
    ...ConversationsDemo.args,
    items: [
      {
        key: 'g1',
        label: '工作文档1',
        group: '工作'
      },
      {
        key: 'g2',
        label: '工作文档11111111111111111111111111111111111111111',
        group: '工作'
      },
      {
        key: 'g3',
        label: '工作文档3',
        group: '工作'
      },
      {
        key: 'g4',
        label: '工作文档4',
        group: '工作'
      },
      {
        key: 'g5',
        label: '工作文档5',
        group: '工作'
      },
      {
        key: 'g6',
        label: '工作文档6',
        group: '工作'
      },
      {
        key: 'g7',
        label: '学习笔记1',
        group: '学习'
      },
      {
        key: 'g8',
        label: '学习笔记2',
        group: '学习'
      },
      {
        key: 'g9',
        label: '个人文档1',
        group: '个人'
      },
      {
        key: 'g10',
        label: '未分组项目'
      }
    ],
    loadMore: () => {},
    rowKey: 'key',
    groupable: {
      // 自定义分组排序，学习 > 工作 > 个人 > 未分组
      sort: (a, b) => {
        const order: Record<string, number> = {
          学习: 0,
          工作: 1,
          个人: 2,
          未分组: 3
        };
        const orderA = order[a] !== undefined ? order[a] : 999;
        const orderB = order[b] !== undefined ? order[b] : 999;
        return orderA - orderB;
      }
    },
    itemsStyle: {
      padding: '10px 20px',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: 'bold',
      textAlign: 'center',
      boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s',
      marginBottom: '20px',
      border: '2px dashed transparent'
    },
    itemsHoverStyle: {
      background: '#FAFAD2',
      border: '2px dashed #006400'
    },
    itemsActiveStyle: {
      background: '#006400',
      color: '#FFFAFA',
      border: '2px dashed transparent'
    },
    itemsMenuOpenedStyle: {
      border: '2px dashed transparent'
    },
    menuStyle: {
      backgroundColor: 'red',
      boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
      padding: '10px 20px',
      height: '200px'
    }
  },
  render: (args: any) => ({
    components: {
      CustomStyleSolt
    },
    setup() {
      return { attrs: args };
    },
    template: `<CustomStyleSolt v-bind="attrs" />`
  })
};
