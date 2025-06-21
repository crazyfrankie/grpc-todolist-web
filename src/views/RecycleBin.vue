<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import RestoreItem from '@/components/RestoreTask.vue'

const store = useStore()

onMounted(async () => {
  try {
    // 并行请求用户信息和回收站任务列表
    await Promise.all([
      store.dispatch('fetchUserInfo'),
      store.dispatch("fetchRecycledTasks")
    ])
  } catch (error) {
    // 如果请求失败，API 拦截器会自动处理 401 错误并跳转到登录页面
    console.error('获取数据失败:', error)
  }
})

const recycledTasks = computed(() => store.state.recycledTasks)

const handleRestore = async (taskId: number) => {
  await store.dispatch("restoreTask", taskId)
}

</script>

<template>
  <div class="recycle-bin-view">
    <header class="app-header">
      <h2>🗑️ 回收站</h2>
      <button @click="$router.push('/')" class="btn btn-primary btn-rounded">
        <span class="icon">🏠</span>
        返回首页
      </button>
    </header>

    <div class="task-list">
      <div class="task-header">
        <h2>已删除的备忘录</h2>
      </div>
      <RestoreItem 
        v-for="task in recycledTasks"
        :key="task.id"
        :task="task"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
.task-list {
  margin: 2rem auto;
  max-width: 800px;
}
</style>