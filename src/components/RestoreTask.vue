<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { Task } from '@/types/task'
import { useStore } from 'vuex'

const props = defineProps<{ task: Task }>()
const emit = defineEmits(['refresh'])
const store = useStore()

const handleRestore = async () => {
  try {
    await store.dispatch('restoreTask', props.task.id)
    emit('refresh')
  } catch (error) {
    alert('恢复失败')
  }
}
</script>

<template>
  <div class="task-item">
    <div class="task-content">
      <div class="task-title">{{ task.title }}</div>
      <div class="task-body">{{ task.content }}</div>
      <div class="task-time">{{ new Date(task.utime).toLocaleString() }}</div>
    </div>

    <div class="task-actions">
      <button @click="handleRestore" class="action-btn restore-btn">
        ↩️ 恢复
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
.task-item {
  background: white;
  border-radius: 8px;
  padding: $spacing-md;
  margin-bottom: $spacing-md;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }

  .task-content {
    flex: 1;
    .task-title {
      font-weight: bold;
      color: $primary-color;
      margin-bottom: $spacing-sm;
    }
    
    .task-body {
      color: #666;
      margin-bottom: $spacing-sm;
    }
    
    .task-time {
      font-size: 0.8em;
      color: #999;
    }
  }

  .task-actions {
    margin-left: $spacing-md;
    
    .action-btn {
      background: none;
      border: none;
      font-size: 1.1em;
      cursor: pointer;
      padding: $spacing-sm;
      
      &:hover {
        transform: scale(1.1);
      }

      &.restore-btn {
        color: $primary-color;
        font-weight: bold;
      }
    }
  }
}
</style>