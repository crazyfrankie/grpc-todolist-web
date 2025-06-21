<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import TaskItem from '@/components/TaskItem.vue'

const store = useStore()
const router = useRouter()
const isLoggedIn = computed(() => !!store.state.user?.id)
const showCreateModal = ref(false)
const newTask = ref({
  title: '',
  content: ''
})

onMounted(async () => {
  try {
    console.log('HomeView: 开始获取数据...')
    
    // 先获取用户信息，如果失败就不要继续获取任务列表
    await store.dispatch('fetchUserInfo')
    console.log('HomeView: 用户信息获取成功，开始获取任务列表')
    
    // 用户信息获取成功后再获取任务列表
    await store.dispatch('fetchTasks')
    
    console.log('HomeView: 数据获取成功')
  } catch (error) {
    console.error('HomeView: 获取数据失败:', error)
    
    // 只有在确实是 401 错误时才让 API 拦截器处理跳转
    // 其他错误（网络错误、服务器错误等）不应该跳转到登录页面
    if (error.response?.status === 401) {
      console.log('HomeView: 检测到 401 错误，用户未登录，停止后续请求')
      return // 立即返回，不执行后续代码
    } else {
      console.log('HomeView: 非认证错误，继续停留在当前页面')
    }
  }
})

const handleLogout = async () => {
  try {
    // 只调用store的logout action，让后端清除cookie
    await store.dispatch('logout')
    console.log('登出成功，跳转到登录页面')
    // 跳转到登录页面，页面刷新会触发重新获取用户信息
    window.location.href = '/login'
  } catch (error) {
    console.error('登出失败:', error)
    // 即使登出失败，也跳转到登录页面
    window.location.href = '/login'
  }
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
        <button class="btn btn-outline btn-rounded" @click="$router.push('/recycle-bin')">
          <span class="icon">🗑️</span>
          回收站
        </button>
        <div class="user-section">
          <span class="username" @click="$router.push('/user-info')">
            <span class="icon">👤</span>
            {{ store.state.user?.name }}
          </span>
          <button class="btn btn-danger btn-rounded" @click="handleLogout">
            <span class="icon">🚪</span>
            退出
          </button>
        </div>
      </div>
      <div v-else class="auth-buttons">
        <button @click="$router.push('/login')" class="btn btn-primary btn-rounded">
          <span class="icon">🔑</span>
          登录
        </button>
        <button @click="$router.push('/register')" class="btn btn-outline btn-rounded">
          <span class="icon">📝</span>
          注册
        </button>
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
            <button @click="showCreateModal = true" class="btn btn-success btn-rounded">
              <span class="icon">✚</span>
              新建备忘录
            </button>
            <button @click="store.dispatch('fetchTasks')" class="btn btn-outline btn-rounded">
              <span class="icon">🔄</span>
              刷新列表
            </button>
          </div>
        </div>
        
        <div v-if="showCreateModal" class="modal-overlay">
          <div class="modal-content">
            <div class="modal-header">
              <h3>✨ 新建备忘录</h3>
              <button @click="showCreateModal = false" class="btn btn-icon btn-secondary">
                <span class="icon">✕</span>
              </button>
            </div>
            
            <div class="modal-body">
              <div class="form-group">
                <label>📝 标题</label>
                <input 
                  v-model="newTask.title" 
                  type="text" 
                  placeholder="请输入一个简洁的标题..."
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label>📄 内容</label>
                <textarea 
                  v-model="newTask.content" 
                  placeholder="在这里详细描述你的备忘录内容..."
                  class="form-textarea"
                  rows="6"
                ></textarea>
              </div>
            </div>
            
            <div class="modal-actions">
              <button @click="showCreateModal = false" class="btn btn-secondary btn-rounded">
                <span class="icon">❌</span>
                取消
              </button>
              <button @click="handleCreateTask" class="btn btn-primary btn-rounded">
                <span class="icon">💾</span>
                创建备忘录
              </button>
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
        font-weight: 600;
        padding: 12px 16px;
        border-radius: 12px;
        transition: all 0.3s ease;
        background: rgba($primary-color, 0.1);
        border: 2px solid transparent;
        display: flex;
        align-items: center;
        gap: 8px;

        &:hover {
          background: rgba($primary-color, 0.15);
          border-color: rgba($primary-color, 0.3);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba($primary-color, 0.2);
        }

        .icon {
          font-size: 14px;
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
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $spacing-lg;
  backdrop-filter: blur(4px);

  .modal-content {
    background: white;
    border-radius: 20px;
    width: 100%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    animation: modalSlideIn 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.2);

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2rem 2rem 1rem 2rem;
      border-bottom: 1px solid #f0f0f0;

      h3 {
        margin: 0;
        color: $primary-color;
        font-size: 24px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    .modal-body {
      padding: 2rem;

      .form-group {
        margin-bottom: 2rem;

        label {
          display: block;
          margin-bottom: 12px;
          color: #333;
          font-weight: 600;
          font-size: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 16px 20px;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: #f8f9fa;

          &:focus {
            outline: none;
            border-color: $primary-color;
            background: white;
            box-shadow: 0 0 0 3px rgba($primary-color, 0.1);
            transform: translateY(-1px);
          }

          &::placeholder {
            color: #adb5bd;
            font-style: italic;
          }
        }

        .form-textarea {
          min-height: 140px;
          resize: vertical;
          line-height: 1.6;
          font-family: inherit;
        }
      }
    }

    .modal-actions {
      display: flex;
      gap: $spacing-md;
      justify-content: flex-end;
      padding: 1rem 2rem 2rem 2rem;
      border-top: 1px solid #f0f0f0;

      button {
        min-width: 140px;
        font-weight: 600;
      }
    }
  }
}

@keyframes modalSlideIn {
  from {
    transform: scale(0.9) translateY(-20px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}
</style>