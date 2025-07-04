import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'animate.css'

const app = createApp(App)

app.use(store)
app.use(router)

// 将 store 和 router 实例绑定到 window 对象，供 API 拦截器使用
;(window as any).__store__ = store
;(window as any).__router__ = router

console.log('Main.ts: 应用初始化完成')
console.log('Main.ts: 路由器基础路径:', router.options.history.base)
console.log('Main.ts: 当前路径:', window.location.pathname)

// 直接挂载应用，不做任何预先的用户信息获取
app.mount('#app')