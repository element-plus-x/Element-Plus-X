import type { Component } from 'vue'

/**
 * 思考节点的id类型
 */
type ThinkingItemId = string | number

/**
 * 思考节点的基础类型
 */
export interface ThinkingItemBase {
  /**
   * 唯一标识
   */
  id: ThinkingItemId
  /**
   * 思考的内容
   */
  content: string
  /**
   * 节点的图标
   */
  dotIcon: Component
  /**
   * 节点类型
   */
  type?: 'info' | 'success' | 'warning' | 'danger' | 'primary'
  /**
   * footer对齐位置
   */
  placement?: 'top' | 'bottom'
  /**
   * 是否可以展开
   */
  isCanExpand?: boolean
  /**
   * 是否默认展开
   */
  isDefaultExpand?: boolean
  /**
   * 展开思考的详细内容
   */
  expandContent?: string
  /**
   * 节点是否正在加载
   */
  isLoading?: boolean
  /**
   * 节点标题
   */
  title?: string
  /**
   * 是否节点标题内容
   */
  hideTitle?: boolean
  /**
   * 节点的加载图标
   */
  loadingIcon?: Component
}

/**
 * 思考节点的类型
 */
export type ThinkingItem =
  | ThinkingItemBase & { isCanExpand?: false }
  | ThinkingItemBase & { isCanExpand: true, expandContent: string }

/**
 * 思考组件的属性
 */
export interface ThinkingProps {
  /**
   * 显示的节点列表
   */
  thinkingItems: ThinkingItem[]
  /**
   * 节点图标大小
   */
  dotSize?: 'large' | 'default' | 'small'

}

export interface ThinkingInstance {
  /**
   * 展开的节点的id
   * @param id 节点的id
   */
  expandKeys: string[]
}
