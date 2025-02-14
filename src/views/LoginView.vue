<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const form = ref({
  name: '',
  password: ''
})
const errorMessage = ref('')

const validateForm = () => {
  if (form.value.name.length < 4) {
    errorMessage.value = '用户名至少4个字符'
    return false
  }
  if (form.value.password.length < 6) {
    errorMessage.value = '密码至少6个字符'
    return false
  }
  return true
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  try {
    await store.dispatch('login', {
      name: form.value.name,
      password: form.value.password
    })
    router.push('/')
  } catch (error) {
    errorMessage.value = '登录失败，请检查凭证'
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>用户登录</h2>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>用户名</label>
          <input v-model="form.name" type="text">
        </div>
        
        <div class="form-group">
          <label>密码</label>
          <input v-model="form.password" type="password">
        </div>
        
        <button type="submit" class="btn btn-primary">登录</button>
      </form>
      
      <div class="auth-footer">
        <span>没有账号？</span>
        <router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, $primary-color, $secondary-color);
}

.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  width: 100%;
  max-width: 400px;
  animation: slideUp 0.5s ease;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: $primary-color;
  }

  .error-message {
    color: $danger-color;
    margin-bottom: 1rem;
    text-align: center;
  }

  .auth-footer {
    margin-top: 1rem;
    text-align: center;
    a {
      color: $primary-color;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>