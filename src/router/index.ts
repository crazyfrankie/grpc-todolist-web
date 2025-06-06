import { createRouter, createWebHistory, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useStore } from 'vuex'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import UserInfo from '@/views/UserInfo.vue'
import RecycleBin from '@/views/RecycleBin.vue'

const router = createRouter({
  history: createWebHistory('/vue/'),
  routes: [
    { path: '/', component: HomeView, meta: { requiresAuth: true } },
    { path: '/login', component: LoginView, name: 'LoginView', meta: { guestOnly: true } },
    { path: '/register', component: RegisterView, name: 'RegisterView', meta: { guestOnly: true } },
    { path: '/user-info', component: UserInfo, meta: { requiresAuth: true } },
    { path: '/recycle-bin', component: RecycleBin, meta: { requiresAuth: true } }
  ]
})

router.beforeEach((to, from, next) => {
  const store = useStore()
  const isAuthenticated = !!store.state.user?.id

  // 如果是访客专用页面（登录/注册）且用户已登录，重定向到首页
  if (to.meta.guestOnly && isAuthenticated) {
    next('/vue/')
    return
  }

  // 对于需要认证的页面，直接放行，让组件自己去请求数据
  // 如果请求失败（401），API 拦截器会处理跳转
  next()
})

export default router