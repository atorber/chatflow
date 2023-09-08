/* eslint-disable sort-keys */
import { ICreateRecordsReqParams, Vika } from '@vikadata/vika'

import {
  log,
} from 'wechaty'

import type { Sheets, Field } from './vikaModel/Model.js'
import { sheets } from './vikaModel/index.js'
import { waitForMs as wait } from '../utils/utils.js'
import type { BusinessRoom, BusinessUser } from '../plugins/finder.js'

type VikaBotConfigTypes = {
  spaceName: string,
  token: string,
}

export interface TaskConfig {
  id: string;
  msg: string;
  time: string;
  cycle: string;
  targetType: 'contact' | 'room';
  target: BusinessRoom | BusinessUser;
  active: boolean;
}

export interface Notifications {
  recordId: string
  text: string
  type: string
  name: string
  id?: string
  alias?: string
  state: string
  pubTime?: string
  info?: string
  room?: BusinessRoom
  contact?: BusinessUser
}

export interface DateBase {
  messageSheet: string
  keywordSheet: string
  contactSheet: string
  roomSheet: string
  envSheet: string
  whiteListSheet: string
  noticeSheet: string
  statisticSheet: string
  orderSheet: string
  stockSheet: string
  groupNoticeSheet: string
}

export class BiDirectionalMap {

  private map: Map<string, string>
  private reverseMap: Map<string, string>

  constructor (fields: any[]) {
    const initPairs:[string, string][] = fields.map((fields:any) => {
      return this.transformKey(fields.name)
    })
    this.reverseMap = new Map(initPairs)
    this.map = new Map(initPairs.map(([ key, value ]) => [ value, key ]))
  }

  transformKey (key: string): [string, string] {
    return [ key, key.split('|')[1] || key ]
  }

  getKey (value: string): string | undefined {
    return this.reverseMap.get(value)
  }

  getValue (key: string): string | undefined {
    return this.map.get(key)
  }

}

export class VikaBot {

  spaceName!: string
  vika!: Vika
  spaceId!: string
  dataBaseIds!: DateBase
  dataBaseNames!: DateBase
  msgStore!: any[]
  envsOnVika!: any[]
  switchsOnVika!: any[]
  reminderList!: any[]
  statisticRecords: any

  constructor (config: VikaBotConfigTypes) {
    if (!config.token) {
      log.error('未配置token，请在config.ts中配置')
    } else if (!config.spaceName) {
      log.error('未配置空间名称，请在config.ts中配置')
    } else {
      this.spaceName = config.spaceName
      this.vika = new Vika({ token: config.token })
      this.spaceId = ''
      this.msgStore = []
      this.dataBaseIds = {
        messageSheet: '',
        keywordSheet: '',
        contactSheet: '',
        roomSheet: '',
        envSheet: '',
        whiteListSheet: '',
        noticeSheet: '',
        statisticSheet: '',
        orderSheet: '',
        stockSheet: '',
        groupNoticeSheet: '',
      }
      this.dataBaseNames = { ...this.dataBaseIds }
    }
  }

  async getAllSpaces () {
    // 获取当前用户的空间站列表
    const spaceListResp = await this.vika.spaces.list()
    if (spaceListResp.success) {
      // log.info(spaceListResp.data.spaces)
      return spaceListResp.data.spaces
    } else {
      log.error('获取空间列表失败:', spaceListResp)
      return spaceListResp
    }
  }

  async getSpaceId () {
    const spaceList: any = await this.getAllSpaces()
    for (const i in spaceList) {
      if (spaceList[i].name === this.spaceName) {
        this.spaceId = spaceList[i].id
        break
      }
    }
    if (this.spaceId) {
      return this.spaceId
    } else {
      return ''
    }
  }

  async getNodesList () {
    // 获取指定空间站的一级文件目录
    const nodeListResp = await this.vika.nodes.list({ spaceId: this.spaceId })
    const tables: any = {}
    if (nodeListResp.success) {
      // log.info(nodeListResp.data.nodes);
      const nodes = nodeListResp.data.nodes
      nodes.forEach((node: any) => {
        // 当节点是文件夹时，可以执行下列代码获取文件夹下的文件信息
        if (node.type === 'Datasheet') {
          tables[node.name] = node.id
        }
      })
    } else {
      log.error('获取数据表失败:', nodeListResp)
    }
    return tables
  }

  async getDataBases () {
    return this.dataBaseIds
  }

  async getVikaSheet (datasheetId: string) {
    const datasheet = await this.vika.datasheet(datasheetId)
    return datasheet
  }

  async getSheetFields (datasheetId: string) {
    const datasheet = await this.vika.datasheet(datasheetId)
    const fieldsResp = await datasheet.fields.list()
    let fields: any = []
    if (fieldsResp.success) {
      log.info('getSheetFields获取字段：', JSON.stringify(fieldsResp.data.fields))
      fields = fieldsResp.data.fields
    } else {
      log.error('获取字段失败:', fieldsResp)
    }
    return fields
  }

  async createDataSheet (key: string, name: string, fields: { name: string; type: string }[]) {
    log.info('创建表...')
    const datasheetRo = {
      fields,
      name,
    }

    try {
      const res: any = await this.vika.space(this.spaceId).datasheets.create(datasheetRo)

      log.info(`系统表【${name}】创建成功，表ID【${res.data.id}】`)

      this.dataBaseIds[key as keyof DateBase] = res.data.id
      this.dataBaseNames[name as keyof DateBase] = res.data.id
      // log.info('创建表成功：', JSON.stringify(this.dataBaseIds))
      // 删除空白行
      await this.clearBlankLines(res.data.id)
      return res.data
    } catch (error) {
      log.error(name, error)
      return error
      // TODO: handle error
    }
  }

  async createRecord (datasheetId: string, records: ICreateRecordsReqParams) {
    log.info('写入维格表:', records.length)
    const datasheet = await this.vika.datasheet(datasheetId)

    try {
      const res = await datasheet.records.create(records)
      if (res.success) {
        // log.info(res.data.records)
      } else {
        log.error('记录写入维格表失败：', res)
      }
    } catch (err) {
      log.error('请求维格表写入失败：', err)
    }

  }

  async updateRecord (datasheetId: string, records: {
    recordId: string
    fields: {[key:string]:any}
  }[]) {
    log.info('更新维格表记录:', records.length)
    const datasheet = await this.vika.datasheet(datasheetId)

    try {
      const res = await datasheet.records.update(records)
      if (!res.success) {
        log.error('记录更新维格表失败：', res)
      }
    } catch (err) {
      log.error('请求维格表更新失败：', err)
    }

  }

  async deleteRecords (datasheetId: string, recordsIds: string | any[]) {
    // log.info('操作数据表ID：', datasheetId)
    // log.info('待删除记录IDs：', recordsIds)
    const datasheet = this.vika.datasheet(datasheetId)
    const response = await datasheet.records.delete(recordsIds)
    if (response.success) {
      log.info(`删除${recordsIds.length}条记录`)
    } else {
      log.error('删除记录失败：', response)
    }
  }

  async getRecords (datasheetId: string, query:any = {}) {
    let records: any = []
    query['pageSize'] = 100
    const datasheet = await this.vika.datasheet(datasheetId)
    // 分页获取记录，默认返回第一页
    const response = await datasheet.records.query(query)
    if (response.success) {
      records = response.data.records
      // log.info(records)
    } else {
      log.error('获取数据记录失败：', JSON.stringify(response))
      records = response
    }
    return records
  }

  async getAllRecords (datasheetId: string) {
    let records: any = []
    const datasheet = await this.vika.datasheet(datasheetId)
    const response: any = await datasheet.records.queryAll()
    // log.info('原始返回：',response)
    if (response.next) {
      for await (const eachPageRecords of response) {
        // log.info('eachPageRecords:',eachPageRecords.length)
        records.push(...eachPageRecords)
      }
      // log.info('records:',records.length)
    } else {
      log.error(response)
      records = response
    }
    return records
  }

  async clearBlankLines (datasheetId: any) {
    const records = await this.getRecords(datasheetId, {})
    // log.info(records)
    const recordsIds: any = []
    for (const i in records) {
      recordsIds.push(records[i].recordId)
    }
    // log.info(recordsIds)
    await this.deleteRecords(datasheetId, recordsIds)
  }

  async init () {

    this.spaceId = await this.getSpaceId()
    // log.info('空间ID:', this.spaceId)

    if (this.spaceId) {

      const tables = await this.getNodesList()
      log.info('维格表文件列表：\n', JSON.stringify(tables, undefined, 2))

      await wait(1000)

      for (const k in sheets) {
        // log.info(this)
        const sheet = sheets[k as keyof Sheets]
        // log.info('数据模型：', k, sheet)
        if (sheet && !tables[sheet.name]) {
          log.info('表不存在开始创建...', k, sheet.name)
          const fields = sheet.fields
          log.info('fields:', JSON.stringify(fields))
          const newFields: Field[] = []
          for (let j = 0; j < fields.length; j++) {
            const field = fields[j]
            const newField: Field = {
              type: field?.type || '',
              name: field?.name || '',
              desc: field?.desc || '',
            }
            // log.info('字段定义：', JSON.stringify(field))
            let options
            switch (field?.type) {
              case 'SingleText':
                newField.property = field.property || {}
                newFields.push(newField)
                break
              case 'SingleSelect':
                options = field.property.options
                newField.property = {}
                newField.property.defaultValue = field.property.defaultValue || options[0].name
                newField.property.options = []
                for (let z = 0; z < options.length; z++) {
                  const option = {
                    name: options[z].name,
                    color: options[z].color.name,
                  }
                  newField.property.options.push(option)
                }
                newFields.push(newField)
                break
              case 'MultiSelect':
                options = field.property.options
                newField.property = {}
                newField.property.defaultValue = field.property.defaultValue || options[0].name
                newField.property.options = []
                for (let z = 0; z < options.length; z++) {
                  const option = {
                    name: options[z].name,
                    color: options[z].color.name,
                  }
                  newField.property.options.push(option)
                }
                newFields.push(newField)
                break
              case 'Text':
                newFields.push(newField)
                break
              case 'Number':
                newField.property = {}
                newField.property.defaultValue = field.property.defaultValue
                newField.property.precision = field.property.precision
                newFields.push(newField)
                break
              case 'DateTime':
                newField.property = {}
                newField.property.dateFormat = 'YYYY-MM-DD'
                newField.property.includeTime = true
                newField.property.timeFormat = 'HH:mm'
                newField.property.autoFill = true
                newFields.push(newField)
                break
              case 'Checkbox':
                newField.property = {
                  icon: 'white_check_mark',
                }
                newFields.push(newField)
                break
              case 'MagicLink':
                newField.property = {}
                newField.property.foreignDatasheetId = this[field.desc as keyof VikaBot]
                if (field.desc) {
                  newFields.push(newField)
                }
                break
              case 'Attachment':
                newFields.push(newField)
                break
              default:
                newFields.push(newField)
                break
            }
          }

          // log.info('创建表，表信息：', JSON.stringify(newFields, undefined, 2))

          await this.createDataSheet(k, sheet.name, newFields)
          await wait(1000)
          const defaultRecords = sheet.defaultRecords
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (defaultRecords) {
            // log.info(defaultRecords.length)
            const count = Math.ceil(defaultRecords.length / 10)
            for (let i = 0; i < count; i++) {
              const records = defaultRecords.splice(0, 10)
              log.info('写入：', records.length)
              await this.createRecord(this.dataBaseIds[k as keyof DateBase], records)
              await wait(1000)
            }
            log.info(sheet.name, '初始化数据写入完成...')
          }
          log.info(sheet.name, '数据表配置完成...')
        } else if (sheet) {
          this.dataBaseIds[k as keyof DateBase] = tables[sheet.name]
          this.dataBaseNames[sheet.name as keyof DateBase] = tables[sheet.name]
        } else { /* empty */ }
      }
      log.info('\n\n初始化系统表完成...\n\n================================================\n')
      // const tasks = await this.getTimedTask()
      return true
    } else {
      log.error('\n\n指定空间不存在，请先创建空间，并在.env文件或环境变量中配置vika信息\n\n================================================\n')
      return false
    }
  }

}
