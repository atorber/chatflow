/* eslint-disable sort-keys */
import { log, Message, type Wechaty } from 'wechaty'
import type { VikaBot, TaskConfig } from '../db/vika-bot.js'
import { VikaSheet, IRecord } from '../db/vika.js'
import schedule from 'node-schedule'
import { getRule, wait } from '../utils/mod.js'
import type { BusinessRoom, BusinessUser } from '../plugins/mod.js'
import {
  getContact,
  getRoom,
} from '../plugins/mod.js'
import { sendMsg } from './configService.js'

// import { db } from '../db/tables.js'
// const noticeData = db.notice

type TaskFields = {
  '内容|desc'?: string;
  '时间|time'?: string;
  '周期|cycle'?: string;
  '通知目标类型|type'?: string;
  '昵称/群名称|name'?: string;
  '好友ID/群ID(选填)|id'?: string;
  '好友备注(选填)|alias'?: string;
  '启用状态|state'?: string;
};

// 服务类
export class NoticeChat {

  private db:VikaSheet
  vikaBot: VikaBot
  envsOnVika: any
  roomWhiteList: any
  contactWhiteList: any
  reminderList: TaskConfig[] = []
  jobs!: {[key:string]:any}

  constructor (vikaBot:VikaBot) {
    this.vikaBot = vikaBot
    this.db = new VikaSheet(vikaBot.vika, vikaBot.dataBaseIds.noticeSheet)
    void this.init()
  }

  // 初始化
  async init () {
    await this.getRecords()
  }

  async getRecords () {
    const records = await this.db.findAll()
    // log.info('维格表中的记录：', JSON.stringify(records))
    return records
  }

  // 获取定时提醒
  async getTimedTask (): Promise<TaskConfig[]> {
    const taskRecords: IRecord[] = await this.db.findAll()

    const timedTasks: TaskConfig[] = taskRecords
      .map((task: IRecord) => {
        const {
          '内容|desc': desc,
          '时间|time': time,
          '周期|cycle': cycle,
          '通知目标类型|type': type,
          '昵称/群名称|name': name,
          '好友ID/群ID(选填)|id': id,
          '好友备注(选填)|alias': alias,
          '启用状态|state': state,
        } = task.fields as TaskFields

        const isActive = state === '开启'
        const isContact = type === '好友'
        const target = isContact
          ? { name: name || '', id: id || '', alias: alias || '' }
          : { topic: name || '', id: id || '' }

        const taskConfig: TaskConfig = {
          id: task.recordId,
          msg: desc || '',
          time: time || '',
          cycle: cycle || '无重复',
          targetType: isContact ? 'contact' : 'room',
          target,
          active: isActive,
        }

        return isActive && desc && time && cycle && (name || id || alias) ? taskConfig : null
      })
      .filter(Boolean) as TaskConfig[]

    this.reminderList = timedTasks
    return this.reminderList
  }

  // 更新任务
  async updateJobs (bot: Wechaty, isVikaOk: any, messageService: { onMessage: (arg0: Message) => any }) {
    const that = this
    try {
    // 结束所有任务
      await schedule.gracefulShutdown()
      // log.info('结束所有任务成功...')
    } catch (e) {
      log.error('结束所有任务失败：', e)
    }
    try {
      const tasks = await this.getTimedTask()
      log.info('获取到的定时提醒任务：', tasks.length || '0')
      // log.info('获取到的定时提醒任务：\n', JSON.stringify(tasks))
      this.jobs = {}
      for (let i = 0; i < tasks.length; i++) {
        const task: TaskConfig = tasks[i] as TaskConfig
        if (task.active) {
        // 格式化任务
          const curRule = getRule(task)
          // log.info(`任务${i}原始信息:`, JSON.stringify(task))
          // log.info('转换信息：', curRule)

          try {
            await schedule.scheduleJob(task.id, curRule, async () => {
              try {
                if (task.targetType === 'contact') {
                  try {
                    const contact = await getContact(bot, task.target as BusinessUser)
                    if (contact) {
                      await sendMsg(contact, task.msg, isVikaOk, messageService)
                      await wait(200)
                    } else {
                      log.info('当前好友不存在:', JSON.stringify(task.target))
                    }
                  } catch (e) {
                    log.error('发送好友定时任务失败:', e)
                  }
                }

                if (task.targetType === 'room') {
                  try {
                    const room = await getRoom(bot, task.target as BusinessRoom)
                    if (room) {
                      await sendMsg(room, task.msg, isVikaOk, messageService)
                      await wait(200)
                    } else {
                      log.info('当前群不存在:', JSON.stringify(task.target))
                    }
                  } catch (e) {
                    log.error('发送群定时任务失败:', e)
                  }
                }
              } catch (err) {
                log.error('定时任务执行失败:', err)
              }
            })
            that.jobs[task.id] = task
          } catch (e) {
            log.error('创建定时任务失败:', e)
          }
        }
      }
      // log.info('定时提醒任务初始化完成，创建任务数量:\n', Object.keys(this.jobs).length)

    } catch (err: any) {
      log.error('更新定时提醒列表任务失败:\n', err)
    }
  }

}
