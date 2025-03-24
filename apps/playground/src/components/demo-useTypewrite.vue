<script lang = 'ts' setup name = 'UseTypewriter'>
import {ref,watch} from 'vue'
import { Typewriter } from 'vue-element-plus-x';

    const content = ref(<string>'');
    const setStep = ref(<number>2);
    const setUnmounted = ref(<boolean>false);
    const markdownContent = ref(<string>'');
    const userSetContent = ref(<string>'');
    const userSetUnmounted = ref(<boolean>false)
    onMounted(() => {
        setTimeout(() => {
            content.value = 'Typewrite使用演示:hello Typewriter hello Typewriter  hello Typewriter  '
                }, 3000)
        })

        setTimeout(() => {
        markdownContent.value = `
# 标题
这是一个 Markdown 示例。
- 列表项 1
- 列表项 2
**粗体文本** 和 *斜体文本*
\`\`\`javascript
console.log('Hello, world!');
\`\`\`
`.trim()
        }, 3000)
        

    function AppendSpeed(){
        setStep.value--;
       
    }
    function reduceSpeed(){
       setStep.value++;
    }

    watch(setStep,()=>{   
            setUnmounted.value = true;
            setTimeout(()=>{
                setUnmounted.value = false;
            },1000)
        })

    watch(userSetContent,()=>{
        userSetUnmounted.value = true;
        setTimeout(()=>{
            userSetUnmounted.value = false;
            },2000)
    })

    const addSpeedBtnDisabled = computed(()=>{
        return setStep.value === 0? true:false;
    });

    const reduceSpeedBtnDisabled = computed(() =>{
        return setStep.value >= content.value.length? true:false;
    })
  
</script>

<template>
    <div class = 'demo1-container'>
        <el-button type="primary" @click = "AppendSpeed" :disabled = "addSpeedBtnDisabled">加速渲染</el-button>
        <el-button type="primary" @click = "reduceSpeed" :disabled = "reduceSpeedBtnDisabled">减速渲染</el-button>
        <Typewriter :content = "content" :typing = "true" :speed="setStep"
        v-if="!setUnmounted" />
    </div>
        <br />
        <br />
    <div class = 'demo2-container'>
        <Typewriter :content = "markdownContent"
        :isMarkdown="true"  :typing = "true" />
    </div>
        <br />
        <br />
    
    <div class = 'demo3-container'>
        <el-input v-model="userSetContent" style="width: 240px" placeholder="输入内容" />
        <Typewriter :content = "userSetContent"
        :isMarkdown="true"  :typing = "true" />

    </div>

</template>