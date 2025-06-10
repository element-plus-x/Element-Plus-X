<template>
  <el-card>
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column label="Date" width="120">
        <template #default="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column property="name" label="Name" width="120" />
      <el-table-column property="address" label="tooltip" width="100" show-overflow-tooltip />
      <el-table-column property="address" label="address" />
    </el-table>
  </el-card>
</template>

<script lang="ts" setup>
const props = defineProps({
  codeKey: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    required: true,
  },
  lang: {
    type: String,
    default: '',
  },
  codeData: {
    type: Object,
    default: () => ({}),
  },
})
const tableData = ref([])

const loading = ref(true)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const renderTable = async () => {
  try {
    tableData.value = JSON.parse(props.content)
    loading.value = false
  } catch (err) {
    console.warn('Table parse error:', err)
    tableData.value = []
    loading.value = false
  }
}

const scheduleRender = () => {
  loading.value = true
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    loading.value = false
    renderTable()
  }, 300)
}

watch(
  () => props.content,
  () => {
    scheduleRender()
  }
)

onMounted(() => {
  scheduleRender()
})
</script>
