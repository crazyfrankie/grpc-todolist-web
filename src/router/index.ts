import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from 'vuex'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import UserInfo from '@/views/UserInfo.vue'
import RecycleBin from '@/views/RecycleBin.vue'

const router = createRouter({
  history: createWebHistory('/vue/'),
  routes: [
    { path: '/', component: HomeView },
    { path: '/login', component: LoginView },
    { path: '/register', component: RegisterView },
    { path: '/user-info', component: UserInfo },
    { path: '/recycle-bin', component: RecycleBin }
  ]
})

router.beforeEach((to, from, next) => {
  const store = useStore()
  const isAuthenticated = !!store.state.user?.id

  if (to.meta.guestOnly && isAuthenticated) {
    next('/vue/')
    return
  }

  // Redirect unauthenticated users to login
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/vue/login')
    return
  }

  next()
})

export default router