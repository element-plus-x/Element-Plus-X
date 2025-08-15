---
title: xmarkdown
---

# XMarkdown Rendering Component 📜

## Introduction

The `XMarkdown` component has built-in basic styles such as **inline code**, **code blocks**, **mathematical formula functions (inline/block)**, **mermaid charts**, etc.

:::info

⚠️ In this development documentation, some style demonstrations may not be very good, but it should not affect the integrated usage. If there are integration or usage issues, you can join 👉[Community Group](https://element-plus-x.com/en/introduce.html#%F0%9F%91%A5-%E7%A4%BE%E5%8C%BA%E6%94%AF%E6%8C%81) to get the latest technical support.

:::

:::warning

All `h function` demonstrations in the documentation demos mean you can use the `h` function for component rendering, or use `custom Vue components` for rendering.

**For example:**

```vue
<!-- This is the h function demonstration in the documentation -->
(props:any) => {return h('div', props, {default: () => 'Test'})}
```

**🙊 Actually it can be written as a custom component:**

```vue
<!-- Import your Vue component from external -->
import SelfButton from './SelfButton.vue'

<!-- Custom component rendering -->
<!-- SelfButton is your custom Vue component above -->
<!-- selfProps are custom properties, receiving props -->
(props:any) => {return h(SelfButton, { selfProps: props })}
```

**💟 In your custom component you can get props like this:**

```vue
<!-- SelfButton.vue -->

<script setup lang="ts">
const props = defineProps({
  selfProps: { type: Object, default: () => ({}) }
});

conslog(props.selfProps); // Check the props you get in console
</script>

<template>
  <!-- You can get props properties for some custom rendering -->
  <button>{{ selfProps.text }}</button>
</template>
```

:::

## Code Demo

### Basic Usage

<demo src="./demos/base.vue"></demo>

### Set Default Highlight/Dark Mode

<demo src="./demos/default-theme-mode.vue"></demo>

### Built-in Shiki Themes

Code block highlighting has multiple built-in themes to choose from.

<demo src="./demos/shiki-style.vue"></demo>

### Define Code Block Highlight Style Separately

<demo src="./demos/color-replacements.vue"></demo>

### Unified Style Override

<demo src="./demos/base-style.vue"></demo>

Below uses the `github` style file to uniformly override styles as an example

### Github Style

<demo src="./demos/github-style.vue"></demo>

If you want to control code block highlighting styles separately, you can do this:

### allowHtml

<demo src="./demos/allow-html.vue"></demo>

### enableLatex

<demo src="./demos/enable-latex.vue"></demo>

### enableBreaks

<demo src="./demos/enable-breaks.vue"></demo>

### Preview HTML Code Block

<demo src="./demos/view-html.vue"></demo>

### Custom Code Block Rendering

<demo src="./demos/code-x-render.vue"></demo>

The echarts component introduced in the example code. The source code is placed here for everyone's understanding. How to customize components, the echarts component implementation here is for example only. In actual use, please encapsulate according to your own backend data and requirements.

::: details 💝View `echarts` component code example

```vue
<!-- echarts.vue -->

<script setup lang="ts">
import * as echarts from 'echarts';

// Keep original props.code logic, while adding optional configuration
const props = defineProps<{
  code: string; // Original JSON string configuration
  width?: string; // Optional: chart width
  height?: string; // Optional: chart height
  theme?: string; // Optional: chart theme
}>();

const refEle = ref<HTMLElement>();
let myChart: echarts.ECharts | null = null; // Chart instance reference

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

// Core rendering logic (keep original parsing process)
function renderChart() {
  if (!refEle.value)
    return;

  try {
    // Parse JSON configuration (keep original logic)
    const cleanedStr = parseEChartsOption(props.code);

    // Initialize/update chart
    if (!myChart) {
      myChart = echarts.init(refEle.value, props.theme);
    }
    myChart.setOption(cleanedStr);
  }
  catch (error) {
    console.error('Chart configuration parsing failed:', error);
  }
}

// Window resize handling
function handleResize() {
  myChart?.resize();
}

// Destroy logic
function destroyChart() {
  if (myChart) {
    myChart.dispose(); // Release ECharts instance
    myChart = null;
  }
  window.removeEventListener('resize', handleResize);
}

// Initialize rendering
onMounted(() => {
  renderChart();
  window.addEventListener('resize', handleResize); // Add resize listener
});

// Listen to code changes for automatic updates (key optimization)
watch(
  () => props.code,
  () => {
    renderChart(); // Re-render when configuration changes
  }
);

// Clean up resources when unmounting
onUnmounted(() => {
  destroyChart();
});
</script>

<template>
  <div class="echarts-wrap">
    <span class="echarts-titlt">This is my custom echarts component</span>
    <div
      ref="refEle"
      :style="{
        height: height || '400px', // Optional height, default 400px
        width: width || '100%' // Optional width, default 100%
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

### Custom Code Block Top Rendering

If you just want to modify the content of our built-in code block top, you can use `codeXSlot`. And we expose the built-in `collapse`, `theme switch`, and `copy` methods. You can retain default functionality while only changing styles.

<demo src="./demos/code-x-slot.vue"></demo>

### Custom Attributes

<demo src="./demos/custom-attrs.vue"></demo>

### Mermaid Operation Bar Configuration

<demo src="./demos/mermaid-config.vue"></demo>

### Slot Tag Interception

<demo src="./demos/slot.vue"></demo>

### Built-in Code Block Languages

<demo src="./demos/lang.vue"></demo>

## Properties

| Property Name   | Type   | Required | Default  | Description                          |
| --------------- | ------ | -------- | -------- | ------------------------------------ |
| `markdown`      | string | Yes      | ''       | markdown content                     |
| `allowHtml`     | bool   | No       | `false`  | Whether to render html               |
| `enableLatex`   | bool   | No       | `true`   | Whether to render latex              |
| `enableBreaks`  | bool   | No       | `true`   | Whether to render breaks             |
| `codeXRender`   | Object | No       | `()=>{}` | Custom code block rendering          |
| `codeXSlot`     | Object | No       | `()=>{}` | Custom code block top slot rendering |
| `customAttrs`   | Object | No       | `()=>{}` | Custom attributes                    |
| `mermaidConfig` | Object | No       | `()=>{}` | mermaid configuration                |

## Features

- Supports incremental rendering, excellent performance
- Supports custom slots, which can be h function components or template components. Easier to get started
- Built-in rich basic styles for mathematical formulas, mermaid diagrams, reducing developer burden
- Supports multiple interceptions and custom rendering, reaching the upper limit
