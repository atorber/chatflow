/* eslint-disable sort-keys */
import { VikaSheet, IRecord } from '../db/vika.js'
import { log } from 'wechaty'
import { delay } from '../utils/utils.js'
import type { ProcessEnv } from '../types/env.js'
import { BaseEntity, MappingOptions } from '../db/vika-orm.js'
import { VikaDB } from '../db/vika-db.js'

// import { db } from '../db/tables.js'
// const envData = db.env
// log.info(JSON.stringify(envData))

const mappingOptions: MappingOptions = {  // 定义字段映射选项
  fieldMapping: {  // 字段映射
    name: '配置项|name',
    key: '标识|key',
    value: '值|value',
    desc: '说明|desc',
    syncStatus: '同步状态|syncStatus',
    lastOperationTime: '最后操作时间|lastOperationTime',
    action: '操作|action',
  },
  tableName: '环境变量|Env',  // 表名
}

// 服务类
export class EnvChat extends BaseEntity {

  db!:VikaSheet
  envIdMap: any
  records!: IRecord[]
  envData: ProcessEnv | undefined
  vikaIdMap: any
  vikaData: any

  protected static override mappingOptions: MappingOptions = mappingOptions  // 设置映射选项为上面定义的 mappingOptions

  protected static override getMappingOptions (): MappingOptions {  // 获取映射选项的方法
    return this.mappingOptions  // 返回当前类的映射选项
  }

  static override setMappingOptions (options: MappingOptions) {  // 设置映射选项的方法
    this.mappingOptions = options  // 更新当前类的映射选项
  }

  // 初始化
  async init () {
    const token = VikaDB.token || ''
    const baseId = VikaDB.dataBaseIds.envSheet
    this.db = new VikaSheet(VikaDB.vika, baseId)
    EnvChat.setVikaOptions({
      apiKey: token,
      baseId: VikaDB.dataBaseIds.envSheet, // 设置 base ID
    })
    this.getConfigFromEnv()
    this.records = await this.getAll()
  }

  async getAll () {
    const records = await this.db.findAll()
    // log.info('维格表中的记录：', JSON.stringify(records))
    return records
  }

  // 更新环境变量配置到云端
  async updateConfigToVika (config: any) {
    log.info('当前环境变量：', config)
  }

  // 下载环境变量配置
  async downConfigFromVika () {
    return await this.getConfigFromVika()
  }

  // 从维格表中获取环境变量配置
  async getConfigFromVika () {
    log.info('从维格表中获取环境变量配置,getConfigFromVika ()')
    const vikaIdMap: any = {}
    const vikaData: any = {}

    const configRecords = await this.getAll()

    await delay(1000)
    // log.info(configRecords)

    for (let i = 0; i < configRecords.length; i++) {
      const record: IRecord = configRecords[i] as IRecord
      const fields = record.fields
      const recordId = record.recordId

      if (fields['标识|key']) {
        if (fields['值|value'] && [ 'false', 'true' ].includes(fields['值|value'])) {
          vikaData[record.fields['标识|key'] as string] = fields['值|value'] === 'true'
        } else {
          vikaData[record.fields['标识|key'] as string] = fields['值|value'] || ''
        }
        vikaIdMap[record.fields['标识|key'] as string] = recordId
      }
    }

    this.vikaIdMap = vikaIdMap
    this.vikaData = vikaData

    // log.info('sysConfig:', JSON.stringify(sysConfig, null, '\t'))

    return this.vikaData
  }

  // 从环境变量中获取环境变量配置
  getConfigFromEnv () {
    const envData: any = {}

    const config:ProcessEnv = process.env
    // log.info(configRecords)

    for (const key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        if (process.env[key]) {
          if ([ 'false', 'true' ].includes(process.env[key] as string)) {
            envData[key] = process.env[key] === 'true'
          } else {
            envData[key] = process.env[key] || ''
          }
        }
      }
    }

    this.envData = envData

    // log.info('sysConfig:', JSON.stringify(sysConfig, null, '\t'))

    return envData
  }

  // 将环境变量更新到云
  async updateCloud (config: { [x: string]: string }) {
    const newData: {
      recordId: string;
      fields: {
          [key: string]: any;
      };
  }[] = []
    for (const key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        if (process.env[key]) {
          config[key] = process.env[key]!
          const fields:{
            [key: string]: any;
        } = { '值|value':process.env[key] }
          const item = { recordId:this.envIdMap[key], fields }
          newData.push(item)
        }
      }
    }

    if (newData.length) {
      await this.db.update(newData)
    }

    return newData

  }

  // 将云端配置更新到环境变量
  updateEnv (config: { [s: string]: unknown } | ArrayLike<unknown>) {
    for (const [ key, value ] of Object.entries(config)) {
      process.env[key] = String(value)
    }

  }

  getBotOps () {
    const puppet = this.envData?.WECHATY_PUPPET || 'wechaty-puppet-wechat'
    const token = this.envData?.WECHATY_TOKEN
    const ops: any = {
      name: 'chatflow',
      puppet,
      puppetOptions: {
        token,
      },
    }

    if (puppet === 'wechaty-puppet-service') {
      process.env['WECHATY_PUPPET_SERVICE_NO_TLS_INSECURE_CLIENT'] = 'true'
    }

    if ([ 'wechaty-puppet-wechat4u', 'wechaty-puppet-xp', 'wechaty-puppet-engine' ].includes(puppet)) {
      delete ops.puppetOptions.token
    }

    if (puppet === 'wechaty-puppet-wechat') {
      delete ops.puppetOptions.token
      ops.puppetOptions.uos = true
    }

    log.info('Wchaty配置信息:\n', JSON.stringify(ops))
    return ops
  }

}
