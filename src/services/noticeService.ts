/* eslint-disable sort-keys */
import { Wechaty, log } from 'wechaty'
import type { TaskConfig } from '../api/base-config.js'
import schedule from 'node-schedule'
import { delay, logger } from '../utils/mod.js'
import type { BusinessRoom, BusinessUser } from '../plugins/mod.js'
import {
  getContact,
  getRoom,
} from '../plugins/mod.js'
import { sendMsg } from './configService.js'
import { ChatFlowCore } from '../api/base-config.js'
import {
  ServeGetNoticesTask,
} from '../api/notice.js'

// const noticeData = ChatFlowCore.tables.notice

function getRemainingTime (taskTime: number): string {
  const time = taskTime - new Date().getTime()
  const seconds = Math.floor((time / 1000) % 60)
  const minutes = Math.floor((time / (1000 * 60)) % 60)
  const hours = Math.floor((time / (1000 * 60 * 60)) % 24)
  const days = Math.floor(time / (1000 * 60 * 60 * 24))
  return `${days}天${hours}小时${minutes}分钟${seconds}秒`
}

// 服务类
export class NoticeChat {

  static roomWhiteList: any
  static contactWhiteList: any
  static jobs: { [key: string]: any }
  static bot: Wechaty

  private constructor () {}

  // 初始化
  static async init () {
    this.bot = ChatFlowCore.bot
    log.info('初始化 NoticeChat 成功...')
  }

  // 更新任务
  static async updateJobs () {
    const that = this
    try {
      // 结束所有任务
      await schedule.gracefulShutdown()
      // logger.info('结束所有任务成功...')
    } catch (e) {
      log.error('结束所有任务失败：' + e)
    }
    try {
      const res = await ServeGetNoticesTask()
      const tasks: TaskConfig[] = res.data.items
      log.info('获取到的定时提醒任务：' + tasks.length || '0')
      logger.info('获取到的定时提醒任务：\n' + JSON.stringify(tasks))

      this.jobs = {}
      for (let i = 0; i < tasks.length; i++) {
        const task: TaskConfig = tasks[i] as TaskConfig
        if (task.active) {
          // logger.info(`任务${i}原始信息:` + JSON.stringify(task))
          // logger.info('转换信息：' + curRule)

          try {
            await schedule.scheduleJob(task.id, task.rule, async () => {
              let text = task.msg
              // 如果task.msg中包含“d%”将其替换为task.time减去当前时间得到的剩余时间（精确到秒）赋值给task.msg，示例消息：距离高考还有：d%
              if (task.msg.includes('d%')) {
                text = task.msg.replace(/d%/g, getRemainingTime(task.time))
              }

              try {
                if (task.targetType === 'contact') {
                  try {
                    const contact = await getContact(this.bot, task.target as BusinessUser)
                    if (contact) {
                      await sendMsg(contact, text)
                      await delay(200)
                    } else {
                      logger.info('当前好友不存在:' + JSON.stringify(task.target))
                    }
                  } catch (e) {
                    logger.error('发送好友定时任务失败:' + e)
                  }
                }

                if (task.targetType === 'room') {
                  try {
                    const room = await getRoom(this.bot, task.target as BusinessRoom)
                    if (room) {
                      await sendMsg(room, text)
                      await delay(200)
                    } else {
                      logger.info('当前群不存在:' + JSON.stringify(task.target))
                    }
                  } catch (e) {
                    logger.error('发送群定时任务失败:' + e)
                  }
                }
              } catch (err) {
                logger.error('定时任务执行失败:' + err)
              }
            })
            that.jobs[task.id] = task
          } catch (e) {
            logger.error('创建定时任务失败:' + e)
          }
        }
      }
      log.info('定时提醒任务初始化完成，创建任务数量:\n', Object.keys(this.jobs).length || '0')

    } catch (err: any) {
      log.error('更新定时提醒列表任务失败:\n' + err)
    }
  }

}
