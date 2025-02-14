<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import type { Task } from '@/types/task'
import { useStore } from 'vuex'

const props = defineProps<{ task: Task }>()
const emit = defineEmits(['refresh'])
const store = useStore()

const isEditing = ref(false)
const editedTask = ref({
  title: props.task.title,
  content: props.task.content
})

const saveEdit = async () => {
  try {
    const newData = {
      title: editedTask.value.title === props.task.title ? '' : editedTask.value.title,
      content: editedTask.value.content === props.task.content ? '' : editedTask.value.content
    }
    
    await store.dispatch('updateTask', {
      taskId: props.task.id,
      newData
    })
    isEditing.value = false
    emit('refresh')
  } catch (error) {
    alert('更新失败')
  }
}

const deleteTask = async () => {
  if (confirm('确定删除吗？')) {
    await store.dispatch('deleteTask', props.task.id)
    emit('refresh')
  }
}
</script>

<template>
  <div class="task-item">
    <div v-if="!isEditing" class="task-content">
      <div class="task-title">{{ task.title }}</div>
      <div class="task-body">{{ task.content }}</div>
      <div class="task-time">{{ new Date(task.utime).toLocaleString() }}</div>
    </div>
    
    <div v-else class="edit-form">
      <input v-model="editedTask.title" class="edit-input">
      <textarea v-model="editedTask.content" class="edit-textarea"></textarea>
      <button @click="saveEdit" class="btn btn-primary">保存</button>
    </div>

    <div class="task-actions">
      <button @click="isEditing = !isEditing" class="action-btn">✏️</button>
      <button @click="deleteTask" class="action-btn">🗑️</button>
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

  .edit-form {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    
    .edit-input {
      font-size: 1.1em;
      font-weight: bold;
    }
    
    .edit-textarea {
      min-height: 80px;
      resize: vertical;
    }
  }

  .task-actions {
    display: flex;
    gap: $spacing-sm;
    margin-left: $spacing-md;
    
    .action-btn {
      background: none;
      border: none;
      font-size: 1.2em;
      cursor: pointer;
      padding: $spacing-sm;
      
      &:hover {
        transform: scale(1.2);
      }
    }
  }
}
</style>