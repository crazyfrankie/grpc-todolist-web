<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import type { Task } from '@/types/task'
import { useStore } from 'vuex'

const props = defineProps<{ task: Task }>()
const emit = defineEmits(['refresh'])
const store = useStore()

const isEditing = ref(false)
const showDeleteConfirm = ref(false)
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
  try {
    await store.dispatch('deleteTask', props.task.id)
    emit('refresh')
    showDeleteConfirm.value = false
  } catch (error) {
    alert('删除失败')
  }
}
</script>

<template>
  <div class="task-item">
    <div v-if="!isEditing" class="task-content">
      <div class="task-header">
        <div class="task-title">{{ task.title }}</div>
        <div class="task-actions">
          <button @click="isEditing = !isEditing" class="action-btn">✏️</button>
          <button @click="showDeleteConfirm = true" class="action-btn">🗑️</button>
        </div>
      </div>
      <div class="task-body">{{ task.content }}</div>
      <div class="task-time">{{ new Date(task.utime).toLocaleString() }}</div>
    </div>
    
    <div v-else class="edit-form">
      <div class="form-group">
        <label>标题</label>
        <input v-model="editedTask.title" class="edit-input" placeholder="请输入标题">
      </div>
      <div class="form-group">
        <label>内容</label>
        <textarea v-model="editedTask.content" class="edit-textarea" placeholder="请输入内容"></textarea>
      </div>
      <div class="edit-actions">
        <button @click="isEditing = false" class="btn btn-secondary">取消</button>
        <button @click="saveEdit" class="btn btn-primary">保存</button>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div v-if="showDeleteConfirm" class="modal-overlay">
      <div class="confirm-modal">
        <h3>确认删除</h3>
        <p>确定要删除这条备忘录吗？</p>
        <div class="modal-actions">
          <button @click="showDeleteConfirm = false" class="btn btn-secondary">取消</button>
          <button @click="deleteTask" class="btn btn-danger">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.task-item {
  background: white;
  border-radius: 8px;
  padding: $spacing-lg;
  margin-bottom: $spacing-md;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }

  .task-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-lg;

    .task-header {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      
      .task-title {
        font-size: 1.2em;
        font-weight: 600;
        color: $primary-color;
        text-align: center;
      }
    }
    
    .task-body {
      display: none; // 默认隐藏内容
    }
    
    .task-time {
      font-size: 0.9em;
      color: #999;
      min-width: 150px;
      text-align: right;
    }

    &:hover {
      .task-body {
        display: block; // 悬停时显示内容
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        padding: $spacing-md;
        border-radius: 8px;
        box-shadow: $box-shadow-md;
        z-index: 1;
        margin-top: $spacing-sm;
      }
    }
  }

  .task-actions {
    display: flex;
    gap: $spacing-sm;
    min-width: 100px;
    justify-content: flex-end;
    
    .action-btn {
      background: none;
      border: none;
      font-size: 1.2em;
      cursor: pointer;
      padding: $spacing-sm;
      border-radius: 50%;
      transition: all 0.2s ease;
      
      &:hover {
        background: rgba($primary-color, 0.1);
        transform: scale(1.1);
      }
    }
  }

  .edit-form {
    .form-group {
      margin-bottom: $spacing-md;
      
      label {
        display: block;
        margin-bottom: $spacing-sm;
        color: #666;
        font-weight: 500;
      }

      .edit-input {
        width: 100%;
        padding: $spacing-sm;
        border: 2px solid #eee;
        border-radius: 6px;
        font-size: 1em;
        
        &:focus {
          border-color: $primary-color;
          outline: none;
        }
      }
      
      .edit-textarea {
        width: 100%;
        min-height: 120px;
        padding: $spacing-sm;
        border: 2px solid #eee;
        border-radius: 6px;
        font-size: 1em;
        resize: vertical;
        
        &:focus {
          border-color: $primary-color;
          outline: none;
        }
      }
    }

    .edit-actions {
      display: flex;
      justify-content: flex-end;
      gap: $spacing-md;
      
      button {
        min-width: 100px;
      }
    }
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .confirm-modal {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    width: 90%;
    max-width: 400px;
    box-shadow: $box-shadow-md;
    animation: scaleIn 0.2s ease;

    h3 {
      color: $danger-color;
      margin-bottom: 1rem;
      font-size: 1.25rem;
    }

    p {
      color: #666;
      margin-bottom: 1.5rem;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: $spacing-md;

      button {
        min-width: 100px;
      }
    }
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>