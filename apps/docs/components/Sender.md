# Sender 输入框

## 一、概述

智能输入框组件（`Sender`）是基于 Vue 3 和 ElementPlus 开发的一个输入框组件，具备丰富的交互功能和自定义特性。它支持语音输入、清空输入内容、多种提交方式，并且允许用户自定义头部、前缀和操作列表等内容。同时，组件提供了焦点控制、提交回调等功能，可满足多样化的输入场景需求。

## 二、功能特性

1. **焦点控制**：支持将焦点设置到文本最前方、最后方或选中整个文本，也可取消焦点。
2. **自定义内容**：提供头部、前缀、操作列表等插槽，允许用户自定义这些部分的内容。
3. **提交功能**：支持按 `Shift + Enter` 提交输入内容，提交后可执行自定义操作。
4. **加载状态**：可显示加载状态，模拟提交处理过程。
5. **语音输入**：支持语音输入功能，提升输入的便捷性。
6. **清空功能**：输入框可清空内容，方便用户重新输入。

## 三、安装与使用

### 安装依赖

```bash
npm i vue-element-plus-x
```

### 引入组件

在你的 Vue 3 项目中引入 `Sender` 组件：

```vue
<script setup>
import { ref } from 'vue'
import { Sender } from 'vue-element-plus-x'

const inputValue = ref('')
const isLoading = ref(false)

function handleSubmit() {
  console.log('提交的内容：', inputValue.value)
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    inputValue.value = '自定义提交后的操作===> 提交成功'
  }, 2000)
}
</script>

<template>
  <Sender
    v-model:value="inputValue"
    allow-speech
    clearable
    submit-type="shiftEnter"
    placeholder="自定义 placeholder"
    :loading="isLoading"
    @submit="handleSubmit"
  >
    <!-- 自定义头部 -->
    <template #header>
      <div>自定义头部内容</div>
    </template>
    <!-- 自定义前缀 -->
    <template #prefix>
      <div>自定义前缀内容</div>
    </template>
  </Sender>
</template>
```

## 四、组件属性

| 属性名        | 类型    | 默认值       | 说明                                                             |
| ------------- | ------- | ------------ | ---------------------------------------------------------------- |
| `allowSpeech` | Boolean | false        | 是否允许语音输入。                                               |
| `clearable`   | Boolean | false        | 输入框是否可清空内容。                                           |
| `submitType`  | String  | 'shiftEnter' | 提交方式，目前仅支持 `'shiftEnter'`（按 `Shift + Enter` 提交）。 |
| `value`       | String  | ''           | 输入框的绑定值，使用 `v-model:value` 进行双向绑定。              |
| `placeholder` | String  | ''           | 输入框的占位符文本。                                             |
| `loading`     | Boolean | false        | 是否显示加载状态。为 `true` 时，输入框会显示加载动画。           |

## 五、组件事件

| 事件名   | 说明                       | 回调参数 |
| -------- | -------------------------- | -------- |
| `submit` | 输入内容提交时触发的事件。 | 无       |

## 六、插槽

### 1. `header`

用于自定义输入框的头部内容。

```vue
<template>
  <Sender>
    <template #header>
      <div class="header-self-wrap">
        <div class="header-self-title">
          <div class="header-left">
            自定义头部标题
          </div>
          <div class="header-right">
            <el-button @click.stop="closeHeader">
              <el-icon><CircleClose /></el-icon>
              <span>关闭头部</span>
            </el-button>
          </div>
        </div>
        <div class="header-self-content">
          自定义头部内容
        </div>
      </div>
    </template>
  </Sender>
</template>
```

### 2. `prefix`

用于自定义输入框的前缀内容。

```vue
<template>
  <Sender>
    <template #prefix>
      <div class="prefix-self-wrap">
        <el-button dark>
          <el-icon><Link /></el-icon>
          <span>自定义前缀</span>
        </el-button>
        <el-button color="#626aef" :dark="true" @click="openCloseHeader">
          打开/关闭头部
        </el-button>
      </div>
    </template>
  </Sender>
</template>
```

### 3. `action-list`（注释部分，可按需启用）

用于自定义输入框的操作列表内容。

```vue
<template>
  <Sender>
    <template #action-list>
      <div class="action-list-self-wrap">
        <span>自定义操作列表</span>
        <el-button dark type="success" plain @click="focus('start')">
          文本最前方
        </el-button>
        <el-button dark type="success" plain @click="focus('end')">
          文本最后方
        </el-button>
        <el-button dark type="success" plain @click="focus('all')">
          整个文本
        </el-button>
        <el-button dark type="success" plain @click="blur">
          取消焦点
        </el-button>
      </div>
    </template>
  </Sender>
</template>
```

## 七、组件方法

### 1. `focus(type = 'all')`

设置输入框的焦点位置。

- `type`：可选值为 `'start'`（文本最前方）、`'end'`（文本最后方）、`'all'`（选中整个文本）。

### 2. `blur()`

取消输入框的焦点。

### 3. `openHeader()`

打开输入框的自定义头部。

### 4. `closeHeader()`

关闭输入框的自定义头部。

## 八、功能详细介绍

### 1. 焦点控制

通过调用 `focus` 方法可以控制输入框的焦点位置，调用 `blur` 方法可以取消焦点。

```vue
<script setup>
import { ref } from 'vue'
import { Sender } from 'vue-element-plus-x'

const senderRef = ref(null)

function focus(type) {
  senderRef.value.focus(type)
}

function blur() {
  senderRef.value.blur()
}
</script>

<template>
  <div>
    <el-button @click="focus('start')">
      文本最前方
    </el-button>
    <el-button @click="focus('end')">
      文本最后方
    </el-button>
    <el-button @click="focus('all')">
      整个文本
    </el-button>
    <el-button @click="blur">
      取消焦点
    </el-button>
    <Sender ref="senderRef" />
  </div>
</template>
```

### 2. 自定义内容

通过 `header`、`prefix` 和 `action-list` 插槽可以自定义输入框的头部、前缀和操作列表内容。

```vue
<template>
  <Sender>
    <template #header>
      <div>自定义头部内容</div>
    </template>
    <template #prefix>
      <div>自定义前缀内容</div>
    </template>
    <template #action-list>
      <div>自定义操作列表内容</div>
    </template>
  </Sender>
</template>
```

### 3. 提交功能

输入框支持按 `Shift + Enter` 提交内容，提交时会触发 `submit` 事件。

```vue
<script setup>
import { ref } from 'vue'
import { Sender } from 'vue-element-plus-x'

const inputValue = ref('')

function handleSubmit() {
  console.log('提交的内容：', inputValue.value)
}
</script>

<template>
  <Sender v-model:value="inputValue" @submit="handleSubmit" />
</template>
```

### 4. 加载状态

通过设置 `loading` 属性为 `true` 可以显示加载状态，模拟提交处理过程。

```vue
<script setup>
import { ref } from 'vue'
import { Sender } from 'vue-element-plus-x'

const isLoading = ref(false)

function startLoading() {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}
</script>

<template>
  <Sender :loading="isLoading" />
  <el-button @click="startLoading">
    开始加载
  </el-button>
</template>
```

## 九、注意事项

- 确保 `vue-element-plus-x` 库已正确安装和引入。
- 自定义内容插槽中的事件处理函数需要在组件的 `setup` 函数中定义。
- 语音输入功能依赖于浏览器的支持，不同浏览器可能存在兼容性问题。
- 加载状态下输入框可能会有交互限制，具体表现取决于组件的样式和逻辑。
