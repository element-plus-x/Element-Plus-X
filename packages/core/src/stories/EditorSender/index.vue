<script setup lang="ts">
import type { EditorProps } from '@components/EditorSender/types.d.ts';
import { computed, onMounted, ref } from 'vue';
import { EditorSender } from '../../components';

const props = withDefaults(defineProps<EditorProps>(), {});
const emits = defineEmits(['update:loading']);

const editorRef = ref<InstanceType<typeof EditorSender>>();
const elBtnRef = ref();

const _loading = computed<boolean>({
  get() {
    return props.loading;
  },
  set(val) {
    emits('update:loading', val);
  }
});

function change() {
  console.log('sender-change-ing~');
}

function submit() {
  _loading.value = true;
}

function cancel() {
  _loading.value = false;
}

const showHeaderFlog = ref(false);
function closeHeader() {
  showHeaderFlog.value = false;
}
function switchHeader() {
  showHeaderFlog.value = !showHeaderFlog.value;
}
function setChatNode() {
  editorRef.value?.setChatNode(
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
          html: '<img width="auto" height="22px" style="vertical-align: bottom;" src="https://cdn.element-plus-x.com/element-plus-x.png" alt="">'
        },
        {
          type: 'Write',
          text: 'LOGO所表达的意思。'
        }
      ]
    ]
  );
}
function setHtml() {
  editorRef.value?.setHtml(
    `<img class="img-tag" src="https://cdn.element-plus-x.com/element-plus-x.png" alt="">`
  );
}
function openSelectDialog() {
  editorRef.value?.showSelect('style-single', document.getElementById('dialogBtn')!);
}

function pasteFile(firstFile: File, fileList: FileList) {
  console.log(firstFile, fileList);
}

onMounted(() => {
  showHeaderFlog.value = true;
});
</script>

<template>
  <div class="sender-wrapper">
    <div style="display: flex; margin-bottom: 20px">
      <el-button
        ref="elBtnRef"
        dark
        type="success"
        plain
        @click="editorRef?.focus('first')"
      >
        文本最前方
      </el-button>
      <el-button dark type="success" plain @click="editorRef?.focus('mark')">
        文本最后一次位置
      </el-button>
      <el-button dark type="success" plain @click="editorRef?.focus('last')">
        文本最后方
      </el-button>
      <el-button dark type="success" plain @click="editorRef?.selectAll()">
        内容全选
      </el-button>
      <el-button dark type="success" plain @click="editorRef?.blur()">
        失去焦点
      </el-button>
      <el-button dark type="success" plain @click="editorRef?.clear()">
        清空内容
      </el-button>
    </div>

    <EditorSender
      ref="editorRef"
      v-bind="props"
      @change="change"
      @submit="submit"
      @cancel="cancel"
      @paste-file="pasteFile"
    >
      <template #prefix>
        <el-button dark>
          <span>自定义前缀</span>
        </el-button>

        <el-button color="#626aef" :dark="true" @click="switchHeader">
          打开/关闭头部
        </el-button>
      </template>

      <!-- 自定义头部 -->
      <template v-if="showHeaderFlog" #header>
        <div class="header-self-wrap">
          <div class="header-self-title">
            <div class="header-left">
              💯 欢迎使用 Element Plus X
            </div>
            <div class="header-right">
              <el-button @click.stop="closeHeader">
                <span>关闭头部</span>
              </el-button>
            </div>
          </div>
          <div class="header-self-content">
            <el-button
              dark
              type="primary"
              plain
              @click="editorRef?.setText('1024')"
            >
              插入text内容
            </el-button>
            <el-button dark type="primary" plain @click="setHtml">
              插入html片段
            </el-button>
            <el-button
              dark
              type="primary"
              plain
              @click="editorRef?.setSelect('style-single', '1')"
            >
              插入单选选择标签
            </el-button>
            <el-button
              dark
              type="primary"
              plain
              @click="editorRef?.setSelect('style-multiple', '1')"
            >
              插入多选选择标签
            </el-button>
            <el-button
              dark
              type="primary"
              plain
              @click="editorRef?.setInput('job', '请输入你的职业')"
            >
              插入输入标签
            </el-button>
            <el-button
              dark
              type="primary"
              plain
              @click="editorRef?.setInput('job', '请输入你的职业', '开发者')"
            >
              插入一个默认值的输入标签
            </el-button>
            <el-button
              dark
              type="primary"
              plain
              @click="editorRef?.setMention('5')"
            >
              插入@提及标签
            </el-button>
            <el-button
              dark
              type="primary"
              plain
              @click="editorRef?.setTrigger('#', '1')"
            >
              插入自定义标签
            </el-button>
            <el-button dark type="primary" plain @click="setChatNode">
              混合标签覆盖写入
            </el-button>
            <el-button
              id="dialogBtn"
              dark
              type="primary"
              plain
              @click="openSelectDialog"
            >
              外部调用选择标签弹窗
            </el-button>
            <el-button
              dark
              type="primary"
              plain
              @click="
                editorRef?.showTip({
                  text: '图像生成',
                  dialogText: '点击退出技能'
                })
              "
            >
              打开前置提示标签
            </el-button>
            <el-button
              dark
              type="primary"
              plain
              @click="editorRef?.closeTip()"
            >
              关闭前置提示标签
            </el-button>
            <el-button
              dark
              type="primary"
              plain
              @click="console.log(editorRef?.getModelValue())"
            >
              打印标签数据
            </el-button>
          </div>
        </div>
      </template>

      <!-- 自定义 底部插槽 -->
      <template #footer>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 12px;
          "
        >
          默认变体 自定义底部
        </div>
      </template>
    </EditorSender>
  </div>
</template>

<style scoped>
.sender-wrapper {
  width: 100%;
  height: 95vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .header-self-wrap {
    display: flex;
    flex-direction: column;
    padding: 16px;
    height: 300px;
    .header-self-title {
      width: 100%;
      display: flex;
      height: 30px;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 8px;
    }
    .header-self-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      font-size: 20px;
      color: #626aef;
      font-weight: 600;
    }
  }

  :deep(.img-tag) {
    width: auto;
    height: 24px;
    vertical-align: bottom;
  }
}
</style>
