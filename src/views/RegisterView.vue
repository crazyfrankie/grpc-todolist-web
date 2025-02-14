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

const handleRegister = async () => {
  if (!validateForm()) return
  
  try {
    await store.dispatch('register', {
      name: form.value.name,
      password: form.value.password
    })
    router.push('/')
  } catch (error) {
    errorMessage.value = '注册失败'
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>用户注册</h2>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>用户名</label>
          <input v-model="form.name" type="text">
        </div>
        
        <div class="form-group">
          <label>密码</label>
          <input v-model="form.password" type="password">
        </div>
        
        <button type="submit" class="btn btn-primary">注册</button>
      </form>
      
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
  padding: $spacing-lg;
}

.auth-card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: $box-shadow-md;
  width: 100%;
  max-width: 480px;
  animation: slideUp 0.5s ease;

  h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: $primary-color;
    font-size: 28px;
    font-weight: 600;
  }

  .form-group {
    position: relative;
    margin-bottom: 1.5rem;

    label {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }

    input {
      font-size: 16px;
      
      &:focus + label {
        animation: floatLabel 0.3s ease forwards;
      }
    }
  }

  .btn-primary {
    width: 100%;
    height: $input-height;
    font-size: 18px;
    font-weight: 500;
    margin-top: $spacing-lg;
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $box-shadow-sm;
    }
  }
}
</style>