import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000,
})

export const taskApi = {
  addTask: (data: {title: string, content: string}) => api.post(`/tasks/add`, data),
  updateTask: (data: {id: number, title: string, content: string}) => api.post(`/tasks/update`, data),
  deleteTask: (data: {id: number}) => api.post(`/tasks/delete`, data),
  restoreTask: (data: {id: number}) => api.post(`/tasks/restore`, data),
  fetchTasks: () => api.get(`/tasks`),
  recycleBin: () => api.get(`/tasks/recycle`),
}

export const authApi = {
  login: (data: { name: string; password: string }) => 
    api.post('/user/login', data),
  register: (data: { name: string; password: string }) => 
    api.post('/user/register', data),
  getUserInfo: () => api.get(`/user`)
}

// 请求拦截器
api.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => response,
  error => {
    console.log('API拦截器：收到错误响应', error.response?.status, error.response?.data)
    
    // 只有在收到明确的401状态码时才处理为认证失败
    if (error.response && error.response.status === 401) {
      console.log('API拦截器：检测到401错误，清除用户状态并跳转登录页面')
      
      // 清除用户状态
      const store = (window as any).__store__
      if (store) {
        store.commit('CLEAR_USER')
      }
      
      // 使用 Vue Router 进行导航，而不是强制刷新页面
      const router = (window as any).__router__
      if (router && !window.location.pathname.includes('/login')) {
        console.log('API拦截器：使用路由跳转到登录页面')
        router.push('/vue/login')
      } else if (!router && !window.location.pathname.includes('/login')) {
        console.log('API拦截器：使用window.location跳转到登录页面')
        // 如果 router 不可用，回退到 location.href
        window.location.href = '/vue/login'
      }
    } else {
      console.log('API拦截器：非401错误，不进行登录跳转')
    }
    
    return Promise.reject(error)
  }
)