import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 5000
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
  getUserInfo: () => api.get('/user')
}

// 请求拦截器
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })
  
  // 响应拦截器
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )