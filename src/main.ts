import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' // 需要创建 store/index.ts
import 'animate.css'

const app = createApp(App)

app.use(store) // 使用 Vuex 而不是 Pinia
app.use(router)

app.mount('#app')