<script setup lang="ts">
import { onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const userInfo = store.state.user

onMounted(async () => {
  try {
    await store.dispatch('fetchUser')
  } catch (error) {
    console.error('Failed to fetch user info')
  }
})
</script>

<template>
  <div class="user-info-view">
    <h1>User Profile</h1>
    <div v-if="store.state.user" class="profile-card">
      <div class="info-item">
        <span class="label">id:</span>
        <span class="value">{{ userInfo.id }}</span>
      </div>
      <div class="info-item">
        <span class="label">name:</span>
        <span class="value">{{ userInfo.name }}</span>
      </div>
      <!-- <div class="info-item">
        <span class="label">Registration:</span>
        <span class="value">{{ userInfo.registerTime }}</span>
      </div>
      <div class="info-item">
        <span class="label">Last Login:</span>
        <span class="value">{{ userInfo.lastLogin }}</span>
      </div> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
.profile-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  max-width: 500px;
  margin: 2rem auto;
  
  .info-item {
    display: flex;
    justify-content: space-between;
    margin: 1rem 0;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    
    .label {
      font-weight: 600;
      color: $primary-color;
    }
  }
}
</style>