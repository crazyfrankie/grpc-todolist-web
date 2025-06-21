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
      <button @click="handleRestore" class="action-btn restore-btn" title="恢复备忘录">
        <span class="icon">↩️</span>
        恢复
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
      background: white;
      border: 2px solid #e9ecef;
      font-size: 14px;
      cursor: pointer;
      padding: 12px 20px;
      border-radius: 12px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      &.restore-btn {
        color: $success-color;
        border-color: $success-color;
        
        &:hover {
          background: $success-color;
          color: white;
          box-shadow: 0 4px 12px rgba($success-color, 0.3);
        }
      }

      .icon {
        font-size: 16px;
      }
    }
  }
}
</style>