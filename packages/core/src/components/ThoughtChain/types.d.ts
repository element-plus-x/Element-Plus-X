/**
 * 思考节点的id类型
 */
type ThoughtChainItemId = string | number;

type HexDigit =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F';

export type HexColor =
  `#${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}`;

export interface DefaultColor {
  loading: HexColor;
  success: HexColor;
  error: HexColor;
  [key: string]: HexColor;
}

/**
 * 思考节点的基础类型
 */
interface ThoughtChainItemBase {
  /**
   * 唯一标识
   */
  id: ThoughtChainItemId;
  /**
   * 节点标题
   */
  title?: string;
  /**
   * 思考的内容 没有展开选项时content会作为思维显示的内容
   * 当展开选项时content会作为展开选项的标题 `thinkTitle` 会作为展开选项后显示的思维内容
   */
  thinkTitle?: string;
  /**
   * 展开思考的详细内容
   */
  thinkContent?: string;
  /**
   * 节点的图标
   */
  status?: 'loading' | 'error' | 'success';
  /**
   * footer对齐位置
   */
  placement?: 'top' | 'bottom';
  /**
   * 是否可以展开
   */
  isCanExpand?: boolean | ((item: ThoughtChainItemBase) => boolean);
  /**
   * 是否默认展开
   */
  isDefaultExpand?: boolean | ((item: ThoughtChainItemBase) => boolean);
  /**
   * 是否隐藏节点标题内容
   */
  hideTitle?: boolean | ((item: ThoughtChainItemBase) => boolean);
}

/** 指定这两个字段为必填 */
type RequiredKeys = 'isCanExpand' | 'thinkContent';

export type DefaultThoughtChainItemProps = Required<
  Pick<ThoughtChainItemBase, RequiredKeys>
> &
  Omit<ThoughtChainItemBase, RequiredKeys>;

export type ThoughtChainItemProps<T> = DefaultThoughtChainItemProps & T;

/**
 * 思考组件的属性
 */
export interface ThoughtChainProps<T = ThoughtChainItemBase> {
  /**
   * 显示的节点列表
   */
  thinkingItems?: ThoughtChainItemProps<T>[];
  /**
   * 节点id的key
   */
  rowKey?: string;
  /**
   * 标题的key
   */
  titleKey?: string;
  /**
   * 思考内容标题的key
   */
  thinkTitleKey?: string;
  /**
   * 展开思考内容的key
   */
  thinkContentKey?: string;
  /**
   * 状态的key
   */
  statusKey?: string;
  /**
   * 节点状态颜色设置
   */
  dotBackgroundColor?: DefaultColor;
  /**
   * 节点图标大小
   */
  dotSize?: 'large' | 'default' | 'small';
  /**
   * 思维链最大宽度
   */
  maxWidth?: string;
  /**
   * 是否启用节点之间链接线的渐变颜色 false默认颜色
   */
  lineGradient?: boolean;
}

export interface ThoughtChainEmits<T> {
  (e: 'handleExpand', item: T): void;
}

export interface ThinkingInstance<T> {
  /**
   * 展开的节点
   */
  expandItem: T;
}
