---
title: 'XMarkdown'
---

## 介绍

`XMarkdown` 这个组件内置了**行内代码**、**代码块**、**数学公式函数（行/块）**、**mermaid 图表**等基础样式。

:::info

⚠️ 在这个开发文档中，有一些样式的演示可能不是很好，但是应该不会影响集成的使用。如果有集成或一些使用问题，可以进 👉[交流群](https://element-plus-x.com/en/introduce.html#%F0%9F%91%A5-%E7%A4%BE%E5%8C%BA%E6%94%AF%E6%8C%81) 获取最新的技术支持。

:::

:::warning

文档中所有 demo 案例中 `h函数` 的演示，意味着你可以使用 `h` 函数进行组件的渲染，也可以使用 `自定义Vue组件` 渲染。

**比如说：**

```vue
<!-- 这里是文档中 h 函数的演示 -->
(props:any) => {return h('div', props, {default: () => '测试'})}
```

**🙊 其实是可以写成 自定义的组件：**

```vue
<!-- 从外部引入你的Vue组件 -->
import SelfButton from './SelfButton.vue'

<!-- 自定义组件渲染 -->
<!-- SelfButton 是上面你自定义的 Vue 组件 -->
<!-- selfProps 是自定义的属性，接收 props -->
(props:any) => {return h(SelfButton, { selfProps: props })}
```

**💟 在你自定的组件中可以这样获取到 props：**

```vue
<!-- SelfButton.vue -->

<script setup lang="ts">
const props = defineProps({
  selfProps: { type: Object, default: () => ({}) }
});

conslog(props.selfProps); // 控制台查看你获取到的 props
</script>

<template>
  <!-- 通过你可以拿到 props 属性进行一些自定义渲染 -->
  <button>{{ selfProps.text }}</button>
</template>
```

:::

## 代码演示

### 基本使用

<demo src="./demos/base.vue"></demo>

### 设置默认 高亮/暗黑

<demo src="./demos/default-theme-mode.vue"></demo>

### 内置 shiki 主题

代码块高亮内置了多套主题供选择。

<demo src="./demos/shiki-style.vue"></demo>

### 单独定义代码块高亮样式

<demo src="./demos/color-replacements.vue"></demo>

### 统一覆盖样式

<demo src="./demos/base-style.vue"></demo>

下面使用 `github` 样式文件统一覆盖样式做一个示例

### github 样式

<demo src="./demos/github-style.vue"></demo>

如果你想单独控制代码块高亮的样式，可以这样：

### allowHtml

<demo src="./demos/allow-html.vue"></demo>

### enableLatex

<demo src="./demos/enable-latex.vue"></demo>

### enableBreaks

<demo src="./demos/enable-breaks.vue"></demo>

### 预览 html 代码块

<demo src="./demos/view-html.vue"></demo>

### 自定义代码块渲染

<demo src="./demos/code-x-render.vue"></demo>

实例代码中引入的 echarts 组件。源码放在这里方便大家理解。如何自定义组件，这里 echarts 组件实现仅供示例。实际使用中，请请更据自己的后端数据和需求进行封装。

::: details 💝查看 `echarts` 组件 代码示例

```vue
<!-- echarts.vue -->

<script setup lang="ts">
import * as echarts from 'echarts';

// 保留原有props.code逻辑，同时添加可选配置
const props = defineProps<{
  code: string; // 原始JSON字符串配置
  width?: string; // 可选：图表宽度
  height?: string; // 可选：图表高度
  theme?: string; // 可选：图表主题
}>();

const refEle = ref<HTMLElement>();
let myChart: echarts.ECharts | null = null; // 图表实例引用

function parseEChartsOption(str: string): any {
  try {
    let cleanedStr = str.replace(/^option\s*=\s*/, '').replace(/;\s*$/, '');
    cleanedStr = cleanedStr.replace(/'/g, '"');
    cleanedStr = cleanedStr.replace(/(\w+)\s*:/g, '"$1":');
    return JSON.parse(cleanedStr);
  }
  catch (error) {
    console.error('Failed to parse ECharts option:', error);
    return null;
  }
}

// 核心渲染逻辑（保留原始解析流程）
function renderChart() {
  if (!refEle.value)
    return;

  try {
    // 解析JSON配置（保留原有逻辑）
    const cleanedStr = parseEChartsOption(props.code);

    // 初始化/更新图表
    if (!myChart) {
      myChart = echarts.init(refEle.value, props.theme);
    }
    myChart.setOption(cleanedStr);
  }
  catch (error) {
    console.error('图表配置解析失败:', error);
  }
}

// 窗口resize处理
function handleResize() {
  myChart?.resize();
}

// 销毁逻辑
function destroyChart() {
  if (myChart) {
    myChart.dispose(); // 释放ECharts实例
    myChart = null;
  }
  window.removeEventListener('resize', handleResize);
}

// 初始化渲染
onMounted(() => {
  renderChart();
  window.addEventListener('resize', handleResize); // 添加resize监听
});

// 监听code变化自动更新（关键优化）
watch(
  () => props.code,
  () => {
    renderChart(); // 配置变化时重新渲染
  }
);

// 卸载时清理资源
onUnmounted(() => {
  destroyChart();
});
</script>

<template>
  <div class="echarts-wrap">
    <span class="echarts-titlt">这是我自己定义的 echarts 组件</span>
    <div
      ref="refEle"
      :style="{
        height: height || '400px', // 可选高度，默认400px
        width: width || '100%' // 可选宽度，默认100%
      }"
    />
  </div>
</template>

<style scoped lang="less">
.echarts-wrap {
  position: relative;

  .echarts-titlt {
    position: absolute;
    width: fit-content;
    margin-left: 20px;
    color: blue;
    font-size: 20px;
    font-weight: bold;
  }
}
</style>
```

:::

### 自定义代码块顶部渲染

如果你仅仅想修改我们内置的代码块顶部的内容，你可以使用 `codeXSlot`。并且我们暴露出来了内置的 `折叠`、`主题切换` 、`复制` 方法。你可以在仅改变样式的同时，保留默认功能。

<demo src="./demos/code-x-slot.vue"></demo>

### 自定义属性

<demo src="./demos/custom-attrs.vue"></demo>

### mermaid 操作栏配置

<demo src="./demos/mermaid-config.vue"></demo>

### 插槽 标签拦截

<demo src="./demos/slot.vue"></demo>

### 内置的代码块语言

<demo src="./demos/lang.vue"></demo>

## 属性

| 属性名          | 类型   | 是否必填 | 默认值   | 描述                     |
| --------------- | ------ | -------- | -------- | ------------------------ |
| `markdown`      | string | 是       | ''       | markdown 内容            |
| `allowHtml`     | bool   | 否       | `false`  | 是否渲染 html            |
| `enableLatex`   | bool   | 否       | `true`   | 是否渲染 latex           |
| `enableBreaks`  | bool   | 否       | `true`   | 是否渲染 breaks          |
| `codeXRender`   | Object | 否       | `()=>{}` | 自定义代码块渲染         |
| `codeXSlot`     | Object | 否       | `()=>{}` | 自定义代码块顶部插槽渲染 |
| `customAttrs`   | Object | 否       | `()=>{}` | 自定义属性               |
| `mermaidConfig` | Object | 否       | `()=>{}` | mermaid 配置             |

## 功能特性

- 支持增量渲染，极致的性能
- 支持自定义插槽，可以是 h 函数的组件，也可以是 template 模版组件。上手更简单
- 内置丰富的基础样式数学公式，mermaid图表，减少开发者负担
- 支持多种拦截，和自定义渲染，上限拉满
