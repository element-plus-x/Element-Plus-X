---
pageClass: landing dark

layout: home
aside: false
editLink: false
markdownStyles: false
---

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

onBeforeMount(() => {
  // 由于vitepress无法自动将/重定向到任一子路径，所以只能手动跳转
  router.go('/zh/')
})
</script>
