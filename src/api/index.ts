import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 5000
})

export const taskApi = {
  addTask: (data: {title: string, content: string,user_id: number}) => api.post(`/tasks/add`, data),
  updateTask: (data: {id: number, title: string, content: string,user_id: number}) => api.post(`/tasks/update`, data),
  deleteTask: (data: {id: number,user_id: number}) => api.post(`/tasks/delete`, data),
  restoreTask: (data: {id: number,user_id: number}) => api.post(`/tasks/restore`, data),
  fetchTasks: (params) => api.get(`/tasks/${params.user_id}`),
  recycleBin: (params) => api.get(`/tasks/recycle/${params.user_id}`),
}

export const authApi = {
  login: (data: { name: string; password: string }) => 
    api.post('/user/login', data),
  register: (data: { name: string; password: string }) => 
    api.post('/user/register', data),
  getUserInfo: (params) => api.get(`/user/${params.user_id}`)
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