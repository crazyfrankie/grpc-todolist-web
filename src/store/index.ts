import { createStore } from 'vuex'
import type { Task } from '@/types/task'
import { authApi, taskApi } from '@/api'

interface User {
  id: number
  name: string
}

interface State {
  user: User | null
  tasks: Task[]
  recycledTasks: Task[]
}

export default createStore<State>({
  state: {
    user: null,
    tasks: [],
    recycledTasks: []
  },
  mutations: {
    SET_USER(state, user: User) {
      state.user = user
    },
    CLEAR_USER(state) {
      state.user = null
      localStorage.removeItem('user')
    },
    SET_TASKS(state, tasks: Task[]) {
      state.tasks = tasks
    },
    SET_RECYCLED_TASKS(state, tasks: Task[]) {
      state.recycledTasks = tasks
    }
  },
  actions: {
    async login({ commit }, { name, password }) {
      const loginResponse = await authApi.login({ name, password })
      if (loginResponse.data.code === 200) {
        // 登录成功后立即获取用户信息
        await this.dispatch('fetchUserInfo')
        return true
      }
    },

    async register({ dispatch }, { name, password }) {
      try {
        await authApi.register({ name, password })
        await this.dispatch('fetchUserInfo')
      } catch (error) {
        throw new Error('注册失败')
      }
    },

    async fetchUserInfo({ commit, state }) {
      try {
          const response = await authApi.getUserInfo()
          const userData = {
            id: response.data.user.id,
            name: response.data.user.name
          }
          commit('SET_USER', userData)
          return userData
      } catch (error) {
        throw new Error('获取用户信息失败')
      }
    },

    async fetchTasks({ commit, state }) {
      if (state.user?.id) {
        const response = await taskApi.fetchTasks({user_id: state.user?.id})
        const tasks = response.data.tasks.map((task: any) => ({
          id: task.id,
          title: task.title,
          content: task.content,
          status: task.status,
          utime: task.utime
        }))
        commit('SET_TASKS', tasks)
      }
    },

    async fetchRecycledTasks({ commit, state }) {
      if (state.user?.id) {
        const response = await taskApi.recycleBin({user_id: state.user?.id})
        const tasks = response.data.tasks.map((task: any) => ({
          id: task.id,
          title: task.title,
          content: task.content,
          status: task.status,
          utime: task.utime
        }))
        commit('SET_RECYCLED_TASKS', tasks)
      }
    },

    async createTask({ dispatch, state }, taskData) {
      if (state.user?.id) {
        await taskApi.addTask({title:taskData.title, content:taskData.content, user_id: state.user?.id})
        await dispatch('fetchTasks')
      }
    },

    async updateTask({ dispatch, state }, { id, newData }) {
      if (state.user?.id) {
        await taskApi.updateTask({ id: id, ...newData, user_id: state.user?.id })
        await dispatch('fetchTasks')
      }
    },

    async deleteTask({ dispatch, state }, id: number) {
      if (state.user?.id) {
        await taskApi.deleteTask({ id: id, user_id: state.user?.id })
        await dispatch('fetchTasks')
      }
    },

    async restoreTask({ dispatch, state }, id: number) {
      if (state.user?.id) {
        await taskApi.restoreTask({ id: id, user_id: state.user?.id})
        await dispatch('fetchRecycledTasks')
      }
    },
  }
})