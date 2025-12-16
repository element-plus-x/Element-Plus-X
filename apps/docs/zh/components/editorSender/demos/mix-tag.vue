<docs>
---
title: 混合标签覆盖写入
---

通过 组件 Ref 实例的 `setChatNode` 方法设置混合标签，混合标签会覆盖写入已有的内容。
</docs>

<script setup lang="ts">
import { reactive } from 'vue';

const senderRef = ref();

const selectTagsArr = reactive([
  {
    dialogTitle: '风格单选',
    key: 'style-single',
    options: [
      { id: '1', name: '人像摄影', preview: 'https://jianfv.top/style/style1.webp' },
      { id: '2', name: '电影写真', preview: 'https://jianfv.top/style/style2.webp' },
      { id: '3', name: '中国风', preview: 'https://jianfv.top/style/style3.webp' }
    ]
  },
]);

function setMixTags() {
  senderRef.value.setChatNode(
    [
      [
        {
          type: 'Write',
          text: '用户'
        },
        {
          type: 'Mention',
          id: '5',
          name: '张三丰'
        },
        {
          type: 'Write',
          text: '选择了'
        },
        {
          type: 'Trigger',
          key: '/',
          id: 'draw',
          name: '绘图'
        },
        {
          type: 'Write',
          text: '指令'
        }
      ],
      [
        {
          type: 'Write',
          text: '请根据以下文案内容绘制一张图片'
        },
        {
          type: 'Input',
          key: 'content',
          placeholder: '文案内容',
          text: '太阳由那扇大玻璃窗透入屋内，先是落在墙上，接着映照到桌上，最终，也照到了我那可爱的小床上来咯'
        },
        {
          type: 'Write',
          text: '。风格是'
        },
        {
          type: 'Select',
          key: 'style-single',
          id: '3',
          name: '中国风'
        },
        {
          type: 'Write',
          text: '，画面内是'
        },
        {
          type: 'Input',
          key: 'content',
          placeholder: '画面内容',
          text: '光从大落地窗照进房间内，照在墙面、地板、桌子、床上'
        },
        {
          type: 'Write',
          text: '。画面主体要突出，画面的色彩搭配和整体氛围要贴合文案所围绕的主题。'
        },
      ],
      [
        {
          type: 'Write',
          text: '输出的图片尺寸大小'
        },
        {
          type: 'Input',
          key: 'size',
          placeholder: '512x512',
          text: ''
        }
      ],
      [
        {
          type: 'Write',
          text: '输出的图片格式'
        },
        {
          type: 'Input',
          key: 'format',
          placeholder: 'png',
          text: ''
        }
      ],
      [
        {
          type: 'Write',
          text: '最后再顺便帮我解释一下这个'
        },
        {
          type: 'Custom',
          html: '<img style="vertical-align: bottom; height: 22px; width: auto;display: inline;" src="https://cdn.element-plus-x.com/element-plus-x.png" alt="">'
        },
        {
          type: 'Write',
          text: 'LOGO所表达的意思。'
        }
      ]
    ]
  );
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <div style="display: flex">
      <el-button dark type="primary" plain @click="setMixTags">
        混合标签覆盖写入
      </el-button>
    </div>

    <EditorSender ref="senderRef" clearable :select-config="selectTagsArr" />
  </div>
</template>

<style scoped lang="less">

</style>
