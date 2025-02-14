export interface Task {
    id: number
    title: string
    content: string
    status: number
    utime: string
  }
  
  export interface TaskForm {
    title: string
    content: string
    uid: number
  }