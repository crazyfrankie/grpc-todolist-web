import axios from 'axios'
import { clearAllCookies } from '@/utils/auth'

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
  getUserInfo: () => api.get(`/user`),
  logout: () => api.get('/user/logout')
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

// 防止重复跳转的标志
let isRedirecting = false

// 响应拦截器
api.interceptors.response.use(
  response => response,
  error => {
    console.log('API拦截器:收到错误响应', error.response?.status, error.response?.data)
    
    // 只有在收到明确的401状态码时才处理为认证失败
    if (error.response && error.response.status === 401) {
      console.log('API拦截器:检测到401错误，跳转登录页面')
      
      // 防止重复跳转
      if (isRedirecting) {
        console.log('API拦截器：已经在跳转中，忽略此次401错误')
        return Promise.reject(error)
      }
      
      isRedirecting = true
      
      console.log('当前路径:', window.location.pathname)
      
      // 直接跳转到登录页面，不清理本地状态
      if (!window.location.pathname.includes('/login')) {
        console.log('API拦截器：跳转到登录页面')
        window.location.href = '/login'
      } else {
        console.log('API拦截器：已经在登录页面，不进行跳转')
        isRedirecting = false
      }
    } else {
      console.log('API拦截器：非401错误，不进行登录跳转')
    }
    
    return Promise.reject(error)
  }
)