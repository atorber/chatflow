/* eslint-disable no-console */
/* eslint-disable sort-keys */
import { ICreateRecordsReqParams, Vika } from '@vikadata/vika'
import type { Sheets } from './vikaModel/Model.js'
import { sheets } from './vikaModel/index.js'
import { delay } from '../utils/utils.js'
import * as CryptoJS from 'crypto-js'
// import { Messages } from './vikaModel/Message/db.js';
// import { Env } from './vikaModel/Env/db.js';
// import { Chatbots } from './vikaModel/ChatBot/db.js';
// import { ChatbotUsers } from './vikaModel/ChatBotUser/db.js';
// import { Contacts } from './vikaModel/Contact/db.js';
// import { Groupnotices } from './vikaModel/GroupNotice/db.js';
// import { Groups } from './vikaModel/Group/db.js';
// import { Keywords } from './vikaModel/Keyword/db.js';
// import { Notices } from './vikaModel/Notice/db.js';
// import { Orders } from './vikaModel/Order/db.js';
// import { Qas } from './vikaModel/Qa/db.js';
// import { Rooms } from './vikaModel/Room/db.js';
// import { Statistics } from './vikaModel/Statistic/db.js';
// import { Whitelists } from './vikaModel/WhiteList/db.js';

type Field = {
  id?: string;
  name: string;
  type: string;
  property?: any;
  desc?: string;
  editable?: boolean;
  isPrimary?: boolean;
};

export type BiTableConfig = {
  spaceId: string;
  token: string;
};

export interface DateBase {
  messageSheet: string;
  keywordSheet: string;
  contactSheet: string;
  roomSheet: string;
  envSheet: string;
  whiteListSheet: string;
  noticeSheet: string;
  statisticSheet: string;
  orderSheet: string;
  stockSheet: string;
  groupNoticeSheet: string;
  qaSheet: string;
  chatBotSheet: string;
  chatBotUserSheet: string;
  groupSheet: string;
}

export class KeyDisplaynameMap {

  private map: Map<string, string>
  private reverseMap: Map<string, string>

  constructor (fields: any[]) {
    const initPairs: [string, string][] = fields.map((fields: any) => {
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

export class BiTable {

  spaceName!: string
  username!: string
  nickname!: string
  id!: string
  token!: string
  password!: string
  vika!: Vika
  spaceId: string | undefined
  userId: string | undefined
  dataBaseIds!: DateBase
  dataBaseNames!: DateBase
  isReady: boolean = true
  hash!: string
  config!: {
    [key: string]: any
    accessKeyId?: string
    secretAccessKey?: string
    region?: string
    endpoint?: string
    bucketName?: string
    CHATGPT_KEY?: string
    CHATGPT_ENDPOINT?: string
    CHATGPT_MODEL?: string
  }

  // db: {
  //   env: Env;
  //   message: Messages;
  //   chatBot: Chatbots;
  //   chatBotUser: ChatbotUsers;
  //   contact: Contacts;
  //   groupNotice: Groupnotices;
  //   group: Groups;
  //   keyword: Keywords;
  //   notice: Notices;
  //   order: Orders;
  //   qa: Qas;
  //   room: Rooms;
  //   statistic: Statistics;
  //   whiteList: Whitelists;
  // }

  constructor () {
  }

  async init (config: BiTableConfig) {
    console.info('初始化检查系统表...')
    this.config = config
    this.spaceId = config.spaceId
    this.userId = this.spaceId
    this.username = this.spaceId
    this.vika = new Vika({ token: config.token })
    this.token = config.token
    this.password = this.token
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
      qaSheet: '',
      chatBotSheet: '',
      chatBotUserSheet: '',
      groupSheet: '',
    }
    this.dataBaseNames = { ...this.dataBaseIds }

    try {
      const tables = await this.getNodesList()
      // console.info(
      //   '维格表文件列表：\n',
      //   JSON.stringify(tables, undefined, 2),
      // );

      if (tables) {
        const client = config.token + config.spaceId
        console.debug(client)
        this.hash = CryptoJS.SHA256(client).toString()
        await delay(1000)

        for (const k in sheets) {
          // console.info(this)
          const sheet = sheets[k as keyof Sheets]
          // console.info('数据模型：', k, sheet)
          if (sheet && !tables[sheet.name]) {
            console.info(`缺少数据表...\n${k}/${sheet.name}`)
            this.isReady = false
            return { success: false, code: 400, data: '' }
          } else if (sheet) {
            // console.info(`表已存在：\n${k}/${sheet.name}/${tables[sheet.name]}`)
            this.dataBaseIds[k as keyof DateBase] = tables[sheet.name]
            this.dataBaseNames[k as keyof DateBase] = sheet.name
          }
        }
        console.info('初始化表完成...')
        const data = JSON.parse(JSON.stringify(this))
        delete data.vika
        return { success: true, code: 200, data: JSON.stringify(data) }
      } else {
        return { success: false, code: 400, data: '' }
      }

    } catch (error) {
      console.error('初始化表失败：', error)
      return { success: false, code: 400, data: '' }
    }
    // console.info('空间ID:', this.spaceId)
  }

  async createSheet (config: BiTableConfig) {
    this.spaceId = config.spaceId
    this.vika = new Vika({ token: config.token })
    this.token = config.token
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
      qaSheet: '',
      chatBotSheet: '',
      chatBotUserSheet: '',
      groupSheet: '',
    }
    this.dataBaseNames = { ...this.dataBaseIds }

    try {
      const tables = await this.getNodesList()
      console.info('维格表文件列表：\n', JSON.stringify(tables, undefined, 2))
      if (tables) {
        await delay(500)

        for (const k in sheets) {
          // console.info(this)
          const sheet = sheets[k as keyof Sheets]
          // console.info('数据模型：', k, sheet)
          if (sheet && !tables[sheet.name]) {
            console.debug(`表不存在，创建表并初始化数据...${k}/${sheet.name}`)
            const fields = sheet.fields
            // console.info('fields:', JSON.stringify(fields))
            const newFields: Field[] = []
            for (let j = 0; j < fields.length; j++) {
              const field = fields[j]
              const newField: Field = {
                type: field?.type || '',
                name: field?.name || '',
                desc: field?.desc || '',
                // property:{},
              }
              // console.info('字段定义：', JSON.stringify(field))
              let options
              switch (field?.type) {
                case 'SingleText':
                  newField.property = field.property || {}
                  newFields.push(newField)
                  break
                case 'SingleSelect':
                  options = field.property.options
                  newField.property = {}
                  newField.property.defaultValue
                    = field.property.defaultValue || options[0].name
                  newField.property.options = []
                  for (let z = 0; z < options.length; z++) {
                    const option = {
                      name: options[z].name,
                      // color: options[z].color.name,
                    }
                    newField.property.options.push(option)
                  }
                  newFields.push(newField)
                  break
                case 'MultiSelect':
                  options = field.property.options
                  newField.property = {}
                  newField.property.defaultValue
                    = field.property.defaultValue || options[0].name
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
                case 'Attachment':
                  newFields.push(newField)
                  break
                default:
                  newFields.push(newField)
                  break
              }
            }

            console.info('创建表，表信息：', JSON.stringify(newFields))

            const resCreate = await this.createDataSheet(
              k,
              sheet.name,
              newFields,
            )
            console.info('创建表结果：', JSON.stringify(resCreate))
            if (resCreate.createdAt) {
              await delay(1000)
              const defaultRecords = sheet.defaultRecords
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              if (defaultRecords) {
                // console.info(defaultRecords.length)
                const count = Math.ceil(defaultRecords.length / 10)
                for (let i = 0; i < count; i++) {
                  const records = defaultRecords.splice(0, 10)
                  console.info('写入：', records.length)
                  try {
                    await this.createRecord(
                      this.dataBaseIds[k as keyof DateBase],
                      records,
                    )
                    await delay(1000)
                  } catch (error) {
                    console.error('写入表失败：', error)
                  }
                }
                console.debug(sheet.name + '初始化数据写入完成...')
              }
            } else {
              console.info('创建表失败：', resCreate)
              throw new Error(
                `创建表【${sheet.name}】失败,启动中止，需要重新运行...`,
              )
            }
          } else if (sheet) {
            // log.info(`表已存在：\n${k}/${sheet.name}/${tables[sheet.name]}`)
            this.dataBaseIds[k as keyof DateBase] = tables[sheet.name]
            this.dataBaseNames[sheet.name as keyof DateBase]
              = tables[sheet.name]
          } else {
            /* empty */
          }
        }
        console.debug('初始化表完成...')
        return { message: 'success' }
      } else {
        return { message: '初始化失败，检查配置信息是否有误！！！' }
      }
    } catch (error) {
      return error
    }
  }

  async getAllSpaces () {
    // 获取当前用户的空间站列表
    const spaceListResp = await this.vika.spaces.list()
    if (spaceListResp.success) {
      // console.info(spaceListResp.data.spaces)
      return spaceListResp.data.spaces
    } else {
      console.error('获取空间列表失败:', spaceListResp)
      return spaceListResp
    }
  }

  async getSpaceId () {
    const spaceList: any = await this.getAllSpaces()
    for (const i in spaceList) {
      if (spaceList[i].name === this.spaceName) {
        this.spaceId = spaceList[i].id
        this.userId = this.spaceId
        break
      }
    }
    if (this.spaceId) {
      return { success: true, code: 200, data: this.spaceId }
    } else {
      return spaceList
    }
  }

  async getNodesList () {
    if (this.spaceId) {
      // 获取指定空间站的一级文件目录
      const nodeListResp = await this.vika.nodes.list({
        spaceId: this.spaceId,
      })
      const tables: any = {}
      if (nodeListResp.success) {
        // console.info(nodeListResp.data.nodes);
        const nodes = nodeListResp.data.nodes
        nodes.forEach((node: any) => {
          // 当节点是文件夹时，可以执行下列代码获取文件夹下的文件信息
          if (node.type === 'Datasheet') {
            tables[node.name] = node.id
          }
        })
        return tables
      } else {
        console.error('获取数据表失败:', nodeListResp)
        return undefined
      }
    } else {
      return undefined
    }
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
      console.info(
        'getSheetFields获取字段：',
        JSON.stringify(fieldsResp.data.fields),
      )
      fields = fieldsResp.data.fields
    } else {
      console.error('获取字段失败:', fieldsResp)
    }
    return fields
  }

  async createDataSheet (
    key: string,
    name: string,
    fields: { name: string; type: string }[],
  ) {
    // console.info('创建表...')
    const datasheetRo = {
      fields,
      name,
    }

    if (this.spaceId) {
      try {
        const res: any = await this.vika
          .space(this.spaceId)
          .datasheets.create(datasheetRo)

        console.info(`系统表【${name}】创建结果:`, JSON.stringify(res))

        this.dataBaseIds[key as keyof DateBase] = res.data.id
        this.dataBaseNames[name as keyof DateBase] = res.data.id
        // console.info('创建表成功：', JSON.stringify(this.dataBaseIds))
        // 删除空白行
        await this.clearBlankLines(res.data.id)
        return res.data
      } catch (error) {
        console.error(name, error)
        return error
        // TODO: handle error
      }
    } else {
      return 'spaceId is undefined'
    }
  }

  async createRecord (datasheetId: string, records: ICreateRecordsReqParams) {
    // console.info('写入维格表:', records.length)
    const datasheet = await this.vika.datasheet(datasheetId)

    try {
      const res = await datasheet.records.create(records)
      if (res.success) {
        // console.info(res.data.records)
      } else {
        console.error('记录写入维格表失败：', res)
      }
    } catch (err) {
      console.error('请求维格表写入失败：', err)
    }
  }

  async updateRecord (
    datasheetId: string,
    records: {
      recordId: string;
      fields: { [key: string]: any };
    }[],
  ) {
    console.info('更新维格表记录:', records.length)
    const datasheet = await this.vika.datasheet(datasheetId)

    try {
      const res = await datasheet.records.update(records)
      if (!res.success) {
        console.error('记录更新维格表失败：', res)
      }
    } catch (err) {
      console.error('请求维格表更新失败：', err)
    }
  }

  async deleteRecords (datasheetId: string, recordsIds: string | any[]) {
    // console.info('操作数据表ID：', datasheetId)
    // console.info('待删除记录IDs：', recordsIds)
    const datasheet = this.vika.datasheet(datasheetId)
    const response = await datasheet.records.delete(recordsIds)
    if (response.success) {
      console.info(`删除${recordsIds.length}条记录`)
    } else {
      console.error('删除记录失败：', response)
    }
  }

  async getRecords (datasheetId: string, query: any = {}) {
    let records: any = []
    query['pageSize'] = 1000
    const datasheet = await this.vika.datasheet(datasheetId)
    // 分页获取记录，默认返回第一页
    const response = await datasheet.records.query(query)
    if (response.success) {
      records = response.data.records
      // console.info(records)
    } else {
      console.error('getRecords获取数据记录失败：', JSON.stringify(response))
      records = response
    }
    return records
  }

  async getAllRecords (datasheetId: string) {
    let records: any = []
    const datasheet = await this.vika.datasheet(datasheetId)
    const response: any = await datasheet.records.queryAll()
    // console.info('原始返回：',response)
    if (response.next) {
      for await (const eachPageRecords of response) {
        // console.info('eachPageRecords:',eachPageRecords.length)
        records.push(...eachPageRecords)
      }
      // console.info('records:',records.length)
    } else {
      console.error(response)
      records = response
    }
    return records
  }

  async clearBlankLines (datasheetId: any) {
    const records = await this.getRecords(datasheetId, {})
    // console.info(records)
    const recordsIds: any = []
    for (const i in records) {
      recordsIds.push(records[i].recordId)
    }
    // console.info(recordsIds)
    await this.deleteRecords(datasheetId, recordsIds)
  }

}
