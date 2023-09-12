/* eslint-disable sort-keys */

/*
定义一个定时提醒任务管理接口，至少包含以下几个动作，给出ts示例代码：
获取任务列表
获取任务详情
发布提醒任务
删除提醒任务
启用提醒任务
禁用提醒任务
更新提醒任务
*/

interface Task {
    id: number;
    title: string;
    description: string;
    type: '好友' | '群';
    friendName?: string;
    friendId?: string;
    time?: Date;
    recurring?: '每天' | '每周' | '每月' | '每年';
    enabled: boolean;
  }

interface TaskManager {
    getTaskList(): Task[];
    getTaskDetails(id: number): Task | undefined;
    createTask(task: Task): void;
    deleteTask(id: number): void;
    enableTask(id: number): void;
    disableTask(id: number): void;
    updateTask(id: number, task: Task): void;
  }

class TaskManagerImpl implements TaskManager {

  private tasks: Task[] = []

  getTaskList (): Task[] {
    return this.tasks
  }

  getTaskDetails (id: number): Task | undefined {
    return this.tasks.find(task => task.id === id)
  }

  createTask (task: Task): void {
    this.tasks.push(task)
  }

  deleteTask (id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id)
  }

  enableTask (id: number): void {
    const task = this.getTaskDetails(id)
    if (task) {
      task.enabled = true
    }
  }

  disableTask (id: number): void {
    const task = this.getTaskDetails(id)
    if (task) {
      task.enabled = false
    }
  }

  updateTask (id: number, updatedTask: Task): void {
    const taskIndex = this.tasks.findIndex(task => task.id === id)
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = updatedTask
    }
  }

}

// 示例用法
const taskManager = new TaskManagerImpl()

// 获取任务列表
export const tasks = taskManager.getTaskList()

// 获取任务详情
const taskId = 1
export const taskDetails = taskManager.getTaskDetails(taskId)

// 发布提醒任务
const newTask: Task = {
  id: 2,
  title: 'New Task',
  description: 'This is a new task',
  enabled: true,
  type: '群',
  time: undefined,
}
taskManager.createTask(newTask)

// 删除提醒任务
const taskIdToDelete = 2
taskManager.deleteTask(taskIdToDelete)

// 启用提醒任务
const taskIdToEnable = 1
taskManager.enableTask(taskIdToEnable)

// 禁用提醒任务
const taskIdToDisable = 1
taskManager.disableTask(taskIdToDisable)

// 更新提醒任务
const taskIdToUpdate = 1
const updatedTask: Task = {
  id: 1,
  title: 'Updated Task',
  description: 'This task has been updated',
  enabled: true,
  type: '群',
  time: undefined,
}

taskManager.updateTask(taskIdToUpdate, updatedTask)

export {}
