<script setup lang="ts">
import { onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const userInfo = store.state.user

onMounted(async () => {
  try {
    // 获取用户信息
    await store.dispatch('fetchUserInfo')
  } catch (error) {
    // 如果请求失败，API 拦截器会自动处理 401 错误并跳转到登录页面
    console.error('获取用户信息失败:', error)
  }
})
</script>

<template>
  <div class="user-info-view">
    <div class="page-header">
      <button @click="$router.push('/')" class="btn btn-outline btn-rounded">
        <span class="icon">🏠</span>
        返回首页
      </button>
      <h1>👤 个人信息</h1>
      <div></div> <!-- 占位元素，保持布局平衡 -->
    </div>
    
    <div v-if="store.state.user" class="profile-card">
      <div class="profile-avatar">
        <div class="avatar-circle">
          {{ store.state.user.name.charAt(0).toUpperCase() }}
        </div>
      </div>
      
      <div class="profile-info">
        <div class="info-item">
          <div class="info-label">
            <span class="icon">🆔</span>
            用户ID
          </div>
          <div class="info-value">{{ store.state.user.id }}</div>
        </div>
        
        <div class="info-item">
          <div class="info-label">
            <span class="icon">👤</span>
            用户名
          </div>
          <div class="info-value">{{ store.state.user.name }}</div>
        </div>
      </div>
      
      <div class="profile-actions">
        <button @click="$router.push('/')" class="btn btn-primary btn-lg btn-rounded">
          <span class="icon">📝</span>
          管理备忘录
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.user-info-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
  
  h1 {
    color: white;
    font-size: 2.5rem;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

.profile-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-width: 600px;
  margin: 0 auto;
  overflow: hidden;
  animation: slideUp 0.6s ease;
  
  .profile-avatar {
    background: linear-gradient(135deg, $primary-color, $secondary-color);
    padding: 3rem 2rem 2rem 2rem;
    text-align: center;
    
    .avatar-circle {
      width: 120px;
      height: 120px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: 700;
      color: $primary-color;
      margin: 0 auto;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
  }
  
  .profile-info {
    padding: 2rem;
    
    .info-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      margin-bottom: 1rem;
      background: #f8f9fa;
      border-radius: 16px;
      border-left: 4px solid $primary-color;
      transition: all 0.3s ease;
      
      &:hover {
        background: #e9ecef;
        transform: translateX(4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .info-label {
        font-weight: 600;
        color: #495057;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.1rem;
        
        .icon {
          font-size: 1.2rem;
        }
      }
      
      .info-value {
        font-size: 1.1rem;
        color: $primary-color;
        font-weight: 700;
        padding: 8px 16px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    }
  }
  
  .profile-actions {
    padding: 2rem;
    border-top: 1px solid #e9ecef;
    text-align: center;
    
    button {
      min-width: 200px;
    }
  }
}

@keyframes slideUp {
  from {
    transform: translateY(40px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>