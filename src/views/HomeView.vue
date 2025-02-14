<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import TaskItem from '@/components/TaskItem.vue'

const store = useStore()
const isLoggedIn = computed(() => !!store.state.user?.id)
const showCreateModal = ref(false)
const newTask = ref({
  title: '',
  content: ''
})

onMounted(async () => {
  if (isLoggedIn.value) {
    await store.dispatch('fetchTasks')
  }
})

const handleLogout = () => {
  localStorage.removeItem('token')
  store.commit('SET_USER', null)
  location.reload()
}

const handleCreateTask = async () => {
  if (!newTask.value.title || !newTask.value.content) {
    alert('标题和内容不能为空')
    return
  }

  try {
    await store.dispatch('createTask', newTask.value)
    showCreateModal.value = false
    newTask.value = { title: '', content: '' }
    await store.dispatch('fetchTasks')
  } catch (error) {
    alert('创建失败')
  }
}
</script>

<template>
  <div class="home-view">
    <header class="app-header">
      <div v-if="isLoggedIn" class="header-content">
        <button class="btn btn-primary" @click="$router.push('/recycle-bin')">
          回收站
        </button>
        <div class="user-section">
          <span class="username" @click="$router.push('/user-info')">
            {{ store.state.user?.name }}
          </span>
          <button class="btn btn-danger" @click="handleLogout">退出</button>
        </div>
      </div>
      <div v-else class="auth-buttons">
        <button @click="$router.push('/login')" class="btn btn-primary">登录</button>
        <button @click="$router.push('/register')" class="btn btn-primary">注册</button>
      </div>
    </header>

    <main class="main-content">
      <div v-if="!isLoggedIn" class="login-prompt">
        <h2>请先登录</h2>
      </div>

      <div v-else>
        <div class="task-header">
          <h2>我的备忘录</h2>
          <div class="task-actions">
            <button @click="showCreateModal = true" class="btn btn-success">
              ✚ 新建备忘录
            </button>
            <button @click="store.dispatch('fetchTasks')" class="btn btn-primary">
              刷新列表
            </button>
          </div>
        </div>
        
        <div v-if="showCreateModal" class="modal-overlay">
          <div class="modal-content">
            <h3>新建备忘录</h3>
            <div class="form-group">
              <label>标题</label>
              <input v-model="newTask.title" type="text" placeholder="请输入标题">
            </div>
            <div class="form-group">
              <label>内容</label>
              <textarea v-model="newTask.content" placeholder="请输入内容"></textarea>
            </div>
            <div class="modal-actions">
              <button @click="showCreateModal = false" class="btn btn-secondary">取消</button>
              <button @click="handleCreateTask" class="btn btn-primary">创建</button>
            </div>
          </div>
        </div>

        <div class="task-list">
          <TaskItem 
            v-for="task in store.state.tasks"
            :key="task.id"
            :task="task"
            @refresh="store.dispatch('fetchTasks')"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

// Add these new styles at the top of your style section
.app-header {
  background: white;
  padding: $spacing-md $spacing-lg;
  box-shadow: $box-shadow-sm;
  margin-bottom: $spacing-lg;

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .user-section {
      display: flex;
      align-items: center;
      gap: $spacing-md;

      .username {
        cursor: pointer;
        color: $primary-color;
        font-weight: 500;
        padding: $spacing-sm;
        border-radius: $input-radius;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: rgba($primary-color, 0.1);
        }
      }
    }
  }

  .auth-buttons {
    display: flex;
    gap: $spacing-md;
    justify-content: center;

    button {
      min-width: 100px;
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
  padding: $spacing-lg;

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    width: 100%;
    max-width: 600px;
    box-shadow: $box-shadow-md;
    animation: slideDown 0.3s ease;

    h3 {
      margin-bottom: 1.5rem;
      color: $primary-color;
      font-size: 24px;
    }

    .form-group {
      margin-bottom: 1.5rem;

      input, textarea {
        background: #f8f9fa;
        
        &:focus {
          background: #fff;
        }
      }
    }

    .modal-actions {
      display: flex;
      gap: $spacing-md;
      justify-content: flex-end;
      margin-top: $spacing-lg;

      button {
        min-width: 120px;
        height: 44px;
      }
    }
  }
}

@keyframes slideDown {
  from { transform: translateY(-50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>