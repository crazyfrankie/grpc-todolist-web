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
      await authApi.login({ name, password })
      await this.dispatch('fetchUserInfo')
    },

    async register({ commit }, { name, password }) {
      await authApi.register({ name, password })
      await this.dispatch('fetchUserInfo')
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
        // 清除可能存在的用户状态
        commit('CLEAR_USER')
        throw error
      }
    },

    async fetchTasks({ commit }) {
      const response = await taskApi.fetchTasks()
      const tasks = response.data.tasks.map((task: any) => ({
        id: task.id,
        title: task.title,
        content: task.content,
        status: task.status,
        utime: task.utime
      }))
      commit('SET_TASKS', tasks)
    },

    async fetchRecycledTasks({ commit }) {
      const response = await taskApi.recycleBin()
      const tasks = response.data.tasks.map((task: any) => ({
        id: task.id,
        title: task.title,
        content: task.content,
        status: task.status,
        utime: task.utime
      }))
      commit('SET_RECYCLED_TASKS', tasks)
    },

    async createTask({ dispatch }, taskData) {
      await taskApi.addTask({title:taskData.title, content:taskData.content})
      await dispatch('fetchTasks')
    },

    async updateTask({ dispatch }, { id, newData }) {
      await taskApi.updateTask({ id: id, ...newData })
      await dispatch('fetchTasks')
    },

    async deleteTask({ dispatch }, id: number) {
      await taskApi.deleteTask({ id: id })
      await dispatch('fetchTasks')
    },

    async restoreTask({ dispatch }, id: number) {
      await taskApi.restoreTask({ id: id })
      await dispatch('fetchRecycledTasks')
    },
  }
})