<!-- TODO: 修改数据计算, 添加数据计算缓存 -->

<script setup lang="ts" generic="T extends AnyObject = AnyObject">
import type { ElScrollbar } from 'element-plus';
import type { AnyObject } from 'typescript-api-pro';
import type { ComponentPublicInstance } from 'vue';
import type {
  Conversation,
  ConversationItem,
  ConversationItemUseOptions,
  ConversationMenuCommand,
  GroupableOptions,
  GroupItem
} from './types';
import type { ConversationsEmits } from './types.d.ts';
import { Delete, Edit, Loading, Top } from '@element-plus/icons-vue';
import { get } from 'radash';
import Item from './components/item.vue';

const props = withDefaults(defineProps<Conversation<T>>(), {
  active: undefined,
  items: () => [],
  itemsStyle: () => ({}),
  itemsHoverStyle: () => ({}),
  itemsActiveStyle: () => ({}),
  itemsMenuOpenedStyle: () => ({}),
  style: () => ({}),
  showTooltip: () => false,
  groupable: () => false,
  labelMaxWidth: undefined,
  labelHeight: 20,
  showBuiltInMenu: false,
  showBuiltInMenuType: 'hover',
  menu: () => [
    {
      label: '重命名',
      key: 'rename',
      icon: markRaw(Edit),
      command: 'rename'
    },
    {
      label: '删除',
      key: 'delete',
      icon: markRaw(Delete),
      command: 'delete',
      menuItemHoverStyle: {
        color: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.1)'
      }
    }
  ],
  ungroupedTitle: '未分组',
  tooltipPlacement: 'top',
  tooltipOffset: 12,
  menuPlacement: 'bottom-start',
  menuOffset: 50,
  menuShowArrow: false,
  menuClassName: '',
  menuTeleported: true,
  menuStyle: () => ({}),
  loadMoreLoading: false,
  showToTopBtn: false,
  labelKey: 'label',
  rowKey: 'id'
});

const emits = defineEmits<ConversationsEmits>();

// const activeKey = defineModel<V>('active', { required: false });
const activeKey = computed({
  get() {
    return props.active; // 读取 props 中的值
  },
  set(value) {
    emits('update:active', value); // 更新时触发 emit 通知父组件
  }
});

// 是否总是显示内置菜单按钮
const alwaysShowBuiltInMenu = computed(
  () => props.showBuiltInMenuType === 'always' && props.showBuiltInMenu
);

// const getKey = (item: ConversationItem<T>, index: number) => {
//   return props.rowKey ? get(item, props.rowKey as string) as string : index.toString()
// }

const itemsUse = computed<ConversationItemUseOptions<T>[]>(() => {
  return props.items.map((item, index) => ({
    ...item,
    uniqueKey: props.rowKey
      ? (get(item, props.rowKey as string) as string)
      : index.toString(),
    label: get(item, props.labelKey as string)
  }));
});

// const key = computed(() => {
//   return (item: ConversationItem<T>, index: number) => {
//     return props.rowKey ? get(item, props.rowKey as string) as string : index.toString()
//   }
// })

// 将传入的样式与默认样式合并
const mergedStyle = computed(() => {
  const defaultStyle = {
    padding: '10px 0 10px 10px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    width: '280px',
    height: '0'
  };
  return { ...defaultStyle, ...props.style };
});

// const activeKey = computed<V>({
//   get(){
//     return props.active as V
//   },
//   set(v){
//     console.log(v);
//     emits('update:active', v)
//   }
// })

// 获取第一个非disabled的item的key，作为备选值
// const firstAvailableKey = computed(() => {
//   const firstAvailableItem = props.items.find(item => !item.disabled)
//   if (!firstAvailableItem) return ''
//   return getKey(firstAvailableItem, 0)
// })

// 如果没有绑定activeKey或绑定的是disabled项，则使用initialKey
// watchEffect(() => {
//   if (!activeKey.value || props.items.find((item, index) => getKey(item, index) === activeKey.value)?.disabled) {
//     activeKey.value = firstAvailableKey.value as V
//   }
// })

function handleClick(item: ConversationItemUseOptions<T>) {
  // 如果是disabled状态，则不允许选中
  if (item.disabled)
    return;
  emits('change', item);
  activeKey.value = item.uniqueKey as string | number;
}

// 判断是否需要使用分组
const shouldUseGrouping = computed(() => {
  // groupable为true/对象/空字符串时启用分组
  return !!props.groupable;
});

// 根据搜索值过滤项目
const filteredItems = computed(() => {
  return itemsUse.value;
});

// 根据分组方式进行分组
const groups = computed(() => {
  // 如果不需要分组，则返回空数组
  if (!shouldUseGrouping.value)
    return [];

  // 检查filteredItems是否有值
  if (!filteredItems.value || filteredItems.value.length === 0) {
    return [];
  }

  // 用于存储每个组的项目
  const groupMap: Record<string, GroupItem> = {};

  // 使用过滤后的项目进行分组
  filteredItems.value.forEach(item => {
    let groupName: string | null = null;

    // 优先使用item中的group字段
    if (item.group) {
      groupName = item.group;
    }
    // 如果没有找到分组，使用未分组
    const finalGroupName = groupName || props.ungroupedTitle;

    // 若该组尚未创建，则创建一个新组
    if (!groupMap[finalGroupName]) {
      groupMap[finalGroupName] = {
        title: finalGroupName,
        key: finalGroupName,
        children: [],
        isUngrouped: !groupName // 如果没有找到组名，则标记为未分组
      };
    }

    // 将项目添加到相应的组中
    groupMap[finalGroupName].children.push(item);
  });

  // 将分组转换为数组
  const groupArray = Object.values(groupMap);

  // 如果有自定义排序函数，使用它排序
  if (typeof props.groupable === 'object' && props.groupable.sort) {
    return groupArray.sort((a, b) => {
      // 确保未分组总是在最后
      if (a.isUngrouped)
        return 1;
      if (b.isUngrouped)
        return -1;

      const sortFn = (props.groupable as GroupableOptions).sort;
      return sortFn ? sortFn(a.key, b.key) : 0;
    });
  }

  // 否则只确保未分组在最后，不做其他排序
  return groupArray.sort((a, b) => {
    // 确保未分组总是在最后
    if (a.isUngrouped)
      return 1;
    if (b.isUngrouped)
      return -1;

    // 不做其他排序
    return 0;
  });
});

// 添加滚动相关的状态
const scrollbarRef = ref<InstanceType<typeof ElScrollbar> | null>(null);
const showScrollTop = ref(false);
const groupRefs = ref<Record<string, HTMLDivElement>>({});

// 记录吸顶状态的组
const stickyGroupKeys = ref<Set<string>>(new Set());

// 监听滚动事件
function handleScroll(e: any) {
  // 显示/隐藏回到顶部按钮
  const scrollTop = e.scrollTop;
  showScrollTop.value = scrollTop > 200;

  // 获取当前滚动容器
  const scrollbar = scrollbarRef.value;
  if (!scrollbar)
    return;

  // 使用scrollbar的wrapRef获取真实DOM以获取正确的尺寸
  const wrap = scrollbar.wrapRef;
  if (!wrap)
    return;

  // 检查是否需要加载更多
  // 当滚动到距离底部20px时触发加载
  const bottomOffset = 20;
  const scrollHeight = wrap.scrollHeight;
  const clientHeight = wrap.clientHeight;

  // 计算是否接近底部
  const isNearBottom = scrollHeight - scrollTop - clientHeight < bottomOffset;

  if (isNearBottom) {
    loadMoreData();
  }

  // 更新吸顶状态
  updateStickyStatus(e);
}

// 更新标题吸顶状态
function updateStickyStatus(_e: any) {
  if (!shouldUseGrouping.value || groups.value.length === 0)
    return;

  // 先清空当前的吸顶组
  stickyGroupKeys.value.clear();

  // 获取滚动容器
  const scrollContainer = scrollbarRef.value?.wrapRef;
  if (!scrollContainer)
    return;

  // 如果只有一个分组，直接设置为吸顶状态
  if (groups.value.length === 1) {
    stickyGroupKeys.value.add(groups.value[0].key);
    return;
  }

  const scrollContainerTop = scrollContainer.getBoundingClientRect().top;
  const containerHeight = scrollContainer.clientHeight;
  const scrollHeight = scrollContainer.scrollHeight;
  const scrollTop = scrollContainer.scrollTop;

  // 判断是否已经滚动到底部
  const isNearBottom = scrollHeight - scrollTop - containerHeight < 20;

  // 如果已接近底部，直接使最后一个分组吸顶
  if (isNearBottom && groups.value.length > 0) {
    stickyGroupKeys.value.add(groups.value[groups.value.length - 1].key);
    return;
  }

  // 检查每个分组的位置
  const visibleGroups = [];

  // 收集所有可见的分组
  for (const group of groups.value) {
    const groupElement = groupRefs.value[group.key];
    if (groupElement) {
      const groupRect = groupElement.getBoundingClientRect();
      const relativeTop = groupRect.top - scrollContainerTop;

      // 分组至少部分可见
      if (relativeTop < containerHeight && relativeTop + groupRect.height > 0) {
        visibleGroups.push({
          group,
          relativeTop,
          height: groupRect.height
        });
      }
    }
  }

  // 对可见分组按相对位置排序
  visibleGroups.sort((a, b) => a.relativeTop - b.relativeTop);

  // 如果有可见分组
  if (visibleGroups.length > 0) {
    // 寻找第一个完全进入视口的分组
    const fullyVisibleGroup = visibleGroups.find(g => g.relativeTop >= 0);

    if (fullyVisibleGroup) {
      // 如果有完全进入视口的分组，选择它
      stickyGroupKeys.value.add(fullyVisibleGroup.group.key);
    } else {
      // 否则选择第一个部分可见的分组（通常是标题已经滚出但内容还可见的）
      stickyGroupKeys.value.add(visibleGroups[0].group.key);
    }
  } else if (groups.value.length > 0) {
    // 如果没有可见分组，则选择第一个分组
    stickyGroupKeys.value.add(groups.value[0].key);
  }
}

// 加载更多数据
function loadMoreData() {
  if (!props.loadMore)
    return;
  props.loadMore();
}

// 滚动到顶部
function scrollToTop() {
  scrollbarRef.value?.setScrollTop(0);
}

// 菜单 item 点击事件
function handleMenuItemClick(
  command: ConversationMenuCommand,
  item: ConversationItem<T>
) {
  emits('menuCommand', command, item);
}

function bindGroupRef(
  el: Element | ComponentPublicInstance | null,
  item: GroupItem
) {
  if (el) {
    groupRefs.value[item.key] = el as HTMLDivElement;
  }
}

// 组件挂载后初始化第一个标题为吸顶状态
onMounted(() => {
  // 如果有分组，默认将第一个分组设置为吸顶状态
  if (shouldUseGrouping.value && groups.value.length > 0) {
    // 添加第一个组的key到吸顶状态集合中
    stickyGroupKeys.value.add(groups.value[0].key);
  }
});
</script>

<template>
  <div
    class="conversations-container"
    :style="{
      '--conversation-label-height': `${props.labelHeight}px`,
      '--conversation-list-auto-bg-color': mergedStyle.backgroundColor
    }"
  >
    <slot name="header" />
    <ul class="conversations-list" :style="mergedStyle">
      <!-- 滚动区域容器 -->
      <li class="conversations-scroll-wrapper">
        <el-scrollbar
          ref="scrollbarRef"
          height="100%"
          class="custom-scrollbar"
          always
          @scroll="handleScroll"
        >
          <div class="scroll-content">
            <template v-if="shouldUseGrouping">
              <!-- 分组显示 -->
              <div
                v-for="group in groups"
                :key="group.key"
                :ref="el => bindGroupRef(el, group)"
                class="conversation-group"
              >
                <div
                  class="conversation-group-title sticky-title"
                  :class="{ 'active-sticky': stickyGroupKeys.has(group.key) }"
                >
                  <slot name="groupTitle" v-bind="{ group }">
                    {{ group.title }}
                  </slot>
                </div>
                <div class="conversation-group-items">
                  <Item
                    v-for="item in group.children"
                    :key="item.uniqueKey"
                    :item="item"
                    :active="item.uniqueKey === activeKey"
                    :items-style="props.itemsStyle"
                    :items-hover-style="props.itemsHoverStyle"
                    :items-active-style="props.itemsActiveStyle"
                    :items-menu-opened-style="props.itemsMenuOpenedStyle"
                    :prefix-icon="item.prefixIcon"
                    :show-tooltip="showTooltip"
                    :tooltip-placement="props.tooltipPlacement"
                    :tooltip-offset="props.tooltipOffset"
                    :suffix-icon="item.suffixIcon"
                    :active-key="activeKey || ''"
                    :label-max-width="labelMaxWidth"
                    :menu="menu"
                    :show-built-in-menu="props.showBuiltInMenu"
                    :always-show-built-in-menu="alwaysShowBuiltInMenu"
                    :menu-placement="props.menuPlacement"
                    :menu-offset="props.menuOffset"
                    :menu-max-height="props.menuMaxHeight"
                    :menu-style="props.menuStyle"
                    :menu-show-arrow="props.menuShowArrow"
                    :menu-class-name="props.menuClassName"
                    :menu-teleported="props.menuTeleported"
                    @click="handleClick(item)"
                    @menu-command="handleMenuItemClick"
                  >
                    <!-- 传递插槽 -->
                    <template v-if="$slots.label" #label>
                      <slot name="label" v-bind="{ item }" />
                    </template>

                    <template
                      v-if="$slots['more-filled']"
                      #more-filled="moreFilledSoltProps"
                    >
                      <slot name="more-filled" v-bind="moreFilledSoltProps" />
                    </template>

                    <template v-if="$slots.menu" #menu="{ handleOpen, handleClose }">
                      <slot name="menu" v-bind="{ item, handleOpen, handleClose }" />
                    </template>
                  </Item>
                </div>
              </div>
            </template>

            <template v-else>
              <Item
                v-for="item in filteredItems"
                :key="item.uniqueKey"
                :item="item"
                :items-style="props.itemsStyle"
                :items-hover-style="props.itemsHoverStyle"
                :items-active-style="props.itemsActiveStyle"
                :active="item.uniqueKey === activeKey"
                :items-menu-opened-style="props.itemsMenuOpenedStyle"
                :prefix-icon="item.prefixIcon"
                :show-tooltip="showTooltip"
                :tooltip-placement="props.tooltipPlacement"
                :tooltip-offset="props.tooltipOffset"
                :suffix-icon="item.suffixIcon"
                :active-key="activeKey || ''"
                :label-max-width="labelMaxWidth"
                :menu="menu"
                :show-built-in-menu="props.showBuiltInMenu"
                :always-show-built-in-menu="alwaysShowBuiltInMenu"
                :menu-placement="props.menuPlacement"
                :menu-offset="props.menuOffset"
                :menu-max-height="props.menuMaxHeight"
                :menu-style="props.menuStyle"
                :menu-show-arrow="props.menuShowArrow"
                :menu-class-name="props.menuClassName"
                :menu-teleported="props.menuTeleported"
                @click="handleClick(item)"
                @menu-command="handleMenuItemClick"
              >
                <!-- 传递插槽 -->
                <template v-if="$slots.label" #label>
                  <slot name="label" v-bind="{ item }" />
                </template>

                <template
                  v-if="$slots['more-filled']"
                  #more-filled="moreFilledSoltProps"
                >
                  <slot name="more-filled" v-bind="moreFilledSoltProps" />
                </template>

                <template v-if="$slots.menu" #menu="{ handleOpen, handleClose }">
                  <slot name="menu" v-bind="{ item, handleOpen, handleClose }" />
                </template>
              </Item>
            </template>
          </div>

          <!-- 加载更多 -->
          <div v-if="props.loadMoreLoading" class="conversations-load-more">
            <slot name="load-more">
              <el-icon class="conversations-load-more-is-loading">
                <Loading />
              </el-icon>
              <span>加载更多...</span>
            </slot>
          </div>
        </el-scrollbar>
      </li>
    </ul>
    <slot name="footer" />
    <!-- 滚动到顶部按钮 -->
    <el-button
      v-show="showScrollTop && props.showToTopBtn"
      class="scroll-to-top-btn"
      circle
      @click="scrollToTop"
    >
      <el-icon>
        <Top />
      </el-icon>
    </el-button>
  </div>
</template>

<style scoped lang="scss" src="./style.scss"></style>
