/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable sort-keys */
import type { Sheets, Record } from './vikaModel/Model.js'
import { sheets } from './vikaModel/index.js'
import { delay } from '../utils/utils.js'
import CryptoJS from 'crypto-js'

import * as lark from '@larksuiteoapi/node-sdk'

// const res = await client.request({
//   method: 'GET',
//   url: 'https://open.feishu.cn/open-apis/bitable/v1/apps/bascnPgZURujrdwZ9T4JkLUSUQc/tables/tblZgivmheQdZjDe/records',
//   data: {},
//   params: {},
// })
// console.log(JSON.stringify(res.data))

type Field = {
  id?: string;
  field_name: string;
  type: number;
  property?: any;
  description?: {
    text?: string;
  };
  editable?: boolean;
  isPrimary?: boolean;
};

export type LarkConfig = {
  appId: string;
  appSecret: string;
  appToken: string;
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
  token!: string
  spaceId: string | undefined
  userId!: string
  username!: string
  password!: string
  isReady: boolean = true
  dataBaseIds!: DateBase
  dataBaseNames!: DateBase
  lark!: lark.Client
  larkConfig!: LarkConfig
  user_id: string | undefined
  hash!: string
  static dataBaseIds: any
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

  async init (config: BiTableConfig) {
    console.debug('初始化检查系统表...')
    this.config = config
    this.spaceId = config.spaceId
    this.userId = this.spaceId
    this.username = this.spaceId

    this.token = config.token
    this.password = config.token

    this.larkConfig = {
      appId: config.token.split('/')[0] as string,
      appSecret: config.token.split('/')[1] as string,
      appToken: config.spaceId,
    }

    this.lark = new lark.Client({
      appId: this.larkConfig.appId,
      appSecret: this.larkConfig.appSecret,
    })

    // const user = await this.lark.contact.user.batchGetId({
    //   data: { mobiles: [ config.userMobile ] },
    //   params: { user_id_type: 'user_id' },
    // })
    // console.log('\nuser:', JSON.stringify(user))

    // if (user.data && user.data.user_list && user.data.user_list.length) {
    //   const user_id = user.data.user_list[0]?.user_id
    //   // this.user_id = user_id
    //   this.config.user_id = user_id
    //   console.log('\nuser_id:', user_id)
    // }

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
    }
    this.dataBaseNames = { ...this.dataBaseIds }

    try {
      const tables = await this.getNodesList()
      console.info(
        '飞书多维表格文件列表：\n',
        JSON.stringify(tables, undefined, 2),
      )
      await delay(200)

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
            // console.debug('sheet...', sheet)
            console.log(`表已存在：\n${k}/${sheet.name}/${tables[sheet.name]}`)
            this.dataBaseIds[k as keyof DateBase] = tables[sheet.name]
            this.dataBaseNames[k as keyof DateBase] = sheet.name
          }
        }
        console.debug('初始化表完成...')
        const data = JSON.parse(JSON.stringify(this))
        delete data.lark
        return { success: true, code: 200, data: JSON.stringify(data) }
      } else {
        return { success: false, code: 400, data: '' }
      }
    } catch (error) {
      console.error('初始化表失败：', error)
      return { success: false, code: 400, data: '' }
    }
  }

  async createSheet (config: BiTableConfig) {
    console.debug('初始化创建或检查系统表...')
    this.config = config
    this.spaceId = config.spaceId
    this.userId = this.spaceId
    this.username = this.spaceId

    this.token = config.token
    this.password = config.token

    this.larkConfig = {
      appId: config.token.split('/')[0] as string,
      appSecret: config.token.split('/')[1] as string,
      appToken: config.spaceId,
    }

    this.lark = new lark.Client({
      appId: this.larkConfig.appId,
      appSecret: this.larkConfig.appSecret,
    })

    // const user = await this.lark.contact.user.batchGetId({
    //   data: { mobiles: [ config.userMobile ] },
    //   params: { user_id_type: 'user_id' },
    // })
    // console.log('\nuser:', JSON.stringify(user))

    // if (user.data && user.data.user_list && user.data.user_list.length) {
    //   const user_id = user.data.user_list[0]?.user_id
    //   this.user_id = user_id
    //   console.log('\nuser_id:', user_id)
    // }

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
    }
    this.dataBaseNames = { ...this.dataBaseIds }

    const tables = await this.getNodesList()
    console.info(
      '飞书多维表格文件列表：',
      JSON.stringify(tables, undefined, 2),
    )
    await delay(200)

    if (tables) {
      const client = config.token + config.spaceId
      console.debug('client字符串:', client)
      this.hash = CryptoJS.SHA256(client).toString()
      await delay(1000)

      for (const k in sheets) {
        // console.info(this)
        const sheet = sheets[k as keyof Sheets]
        // console.info('数据模型：', k, sheet)
        if (sheet && !tables[sheet.name]) {
          console.debug(`表不存在，创建表并初始化数据...\n${k}/${sheet.name}`)
          const fields = sheet.fields
          // console.info('fields:', JSON.stringify(fields))
          const newFields: Field[] = []
          for (let j = 0; j < fields.length; j++) {
            const field = fields[j]
            const newField: Field = {
              type: 1,
              field_name: field?.name || '',
              description: {
                text: field?.desc || '',
              },
            }
            // console.info('字段定义：', JSON.stringify(field))
            let options
            switch (field?.type) {
              case 'SingleText':
                newField.type = 1
                newField.property = field.property || {}
                newFields.push(newField)
                break
              case 'SingleSelect':
                newField.type = 3
                options = field.property.options
                newField.property = {}
                newField.property.options = []
                for (let z = 0; z < options.length; z++) {
                  const option = {
                    name: options[z].name,
                    color: z,
                  }
                  newField.property.options.push(option)
                }
                newFields.push(newField)
                break
              case 'MultiSelect':
                newField.type = 4
                options = field.property.options
                newField.property = {}
                newField.property.options = []
                for (let z = 0; z < options.length; z++) {
                  const option = {
                    name: options[z].name,
                    color: z,
                  }
                  newField.property.options.push(option)
                }
                newFields.push(newField)
                break
              case 'Text':
                newField.type = 1
                newFields.push(newField)
                break
              case 'Number':
                newField.type = 2
                newField.property = {}
                newField.property.formatter = '0'
                newFields.push(newField)
                break
              case 'DateTime':
                newField.type = 5
                newField.property = {}
                newField.property.date_formatter = 'yyyy-MM-dd HH:mm'
                newField.property.auto_fill = true
                newFields.push(newField)
                break
              case 'Checkbox':
                newField.type = 7
                newFields.push(newField)
                break
                // case 'MagicLink':
                //   newField.property = {}
                //   newField.property.foreignDatasheetId = this[field.desc as keyof LarkDB]
                //   if (field.desc) {
                //     newFields.push(newField)
                //   }
                //   break
              case 'Attachment':
                newField.type = 17
                newFields.push(newField)
                break
              default:
                newFields.push(newField)
                break
            }
          }

          console.info('创建表，表信息：', JSON.stringify(newFields))

          await this.createDataSheet(k, sheet.name, newFields)
          console.info('当前表ID:', this.dataBaseIds[k as keyof DateBase])
          await delay(200)
          const defaultRecords = sheet.defaultRecords
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (defaultRecords) {
            // console.info(defaultRecords.length)
            const count = Math.ceil(defaultRecords.length / 50)
            for (let i = 0; i < count; i++) {
              const records = defaultRecords.splice(0, 50)
              console.info('写入：', records.length)
              console.info('写入表ID:', this.dataBaseIds[k as keyof DateBase])
              await this.createRecord(
                this.dataBaseIds[k as keyof DateBase],
                records,
              )
              await delay(200)
            }
            console.debug(sheet.name + '初始化数据写入完成...')
          }
        } else if (sheet) {
          // console.debug('sheet...', sheet)
          console.log(`表已存在：\n${k}/${sheet.name}/${tables[sheet.name]}`)
          this.dataBaseIds[k as keyof DateBase] = tables[sheet.name]
          this.dataBaseNames[k as keyof DateBase] = sheet.name
        } else {
          /* empty */
        }
      }
      console.debug('初始化表完成...')
      const data = JSON.parse(JSON.stringify(this))
      delete data.lark
      return { success: true, code: 200, data: JSON.stringify(data) }
    } else {
      return { success: false, code: 400, data: '' }
    }
  }

  protected async getNodesList () {
    if (this.larkConfig.appToken) {
      // 获取指定空间站的一级文件目录
      const nodeListResp = await this.lark.bitable.appTable.list({
        path: { app_token: this.larkConfig.appToken },
      })
      const tables: any = {}
      if (nodeListResp.data && nodeListResp.data.items) {
        // console.info(nodeListResp.data.nodes);
        const nodes = nodeListResp.data.items
        nodes.forEach((node: any) => {
          // 当节点是文件夹时，可以执行下列代码获取文件夹下的文件信息
          tables[node.name] = node.table_id
        })
      } else {
        console.error('获取数据表失败:', nodeListResp)
      }
      return tables
    } else {
      return {}
    }
  }

  protected async getDataBases () {
    return this.dataBaseIds
  }

  protected async getSheetFields (datasheetId: string) {
    const fieldsResp = await this.lark.bitable.appTableField.list({
      path: { app_token: this.larkConfig.appToken, table_id: datasheetId },
    })
    let fields: any[] = []
    if (fieldsResp.data && fieldsResp.data.items) {
      console.info(
        'getSheetFields获取字段：',
        JSON.stringify(fieldsResp.data.items),
      )
      fields = fieldsResp.data.items
    } else {
      console.error('获取字段失败:', fieldsResp)
    }
    return fields
  }

  protected async createDataSheet (
    key: string,
    name: string,
    fields: { field_name: string; type: number }[],
  ) {
    console.info('开始创建表...')
    const datasheetRo = {
      fields,
      name,
    }

    // console.info('创建表，表信息：', JSON.stringify(datasheetRo))

    if (this.larkConfig.appToken) {
      try {
        const res = await this.lark.bitable.appTable.create({
          path: {
            app_token: this.larkConfig.appToken,
          },
          data: {
            table: datasheetRo,
          },
        })

        console.info('创建表返回：', JSON.stringify(res))
        console.info(
          `系统表【${name}】创建成功，表ID【${res.data?.table_id}】`,
        )

        this.dataBaseIds[key as keyof DateBase] = res.data?.table_id || ''
        this.dataBaseNames[name as keyof DateBase] = res.data?.table_id || ''
        console.info('创建表成功：', JSON.stringify(this.dataBaseIds))
        // 删除空白行
        // await this.clearBlankLines(res.data?.table_id)
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

  protected async createRecord (datasheetId: string, records: Record[]) {
    console.info('写入飞书多维表格ID:', datasheetId)
    console.info('写入飞书多维表格记录:', records.length)
    try {
      const res = await this.lark.bitable.appTableRecord.batchCreate({
        data: {
          records,
        },
        path: {
          app_token: this.larkConfig.appToken,
          table_id: datasheetId,
        },
      })

      if (res.data?.records) {
        // console.info(res.data.records)
      } else {
        console.error('记录写入飞书多维表格失败：', res)
      }
    } catch (err: any) {
      console.error('请求飞书多维表格写入失败：', err.code)
    }
  }

  protected async updateRecord (
    datasheetId: string,
    records: {
      recordId: string;
      fields: { [key: string]: any };
    }[],
  ) {
    console.info('更新飞书多维表格记录:', records.length)

    try {
      const res = await this.lark.bitable.appTableRecord.batchUpdate({
        data: { records },
        path: {
          app_token: this.larkConfig.appToken,
          table_id: datasheetId,
        },
      })
      if (!res.data) {
        console.error('记录更新飞书多维表格失败：', res)
      }
    } catch (err) {
      console.error('请求飞书多维表格更新失败：', err)
    }
  }

  protected async deleteRecords (
    datasheetId: string,
    recordsIds: string[],
  ) {
    // console.info('操作数据表ID：', datasheetId)
    // console.info('待删除记录IDs：', recordsIds)

    const response = await this.lark.bitable.appTableRecord.batchDelete({
      data: { records: recordsIds },
      path: {
        app_token: this.larkConfig.appToken,
        table_id: datasheetId,
      },
    })

    if (response.data?.records) {
      console.info('删除记录成功：', recordsIds.length || '0')
    } else {
      console.error('删除记录失败：', response)
    }
  }

  protected async getRecords (datasheetId: string, query: any = {}) {
    let records: any = []
    query['pageSize'] = 1000
    // 分页获取记录，默认返回第一页
    const response = await this.lark.bitable.appTableRecord.list({
      params: {
        filter: query,
      },
      path: {
        app_token: this.larkConfig.appToken,
        table_id: datasheetId,
      },
    })
    if (response.data) {
      records = response.data.items
      // console.info(records)
    } else {
      console.error('获取数据记录失败：', JSON.stringify(response))
      records = response
    }
    return records
  }

  async getAllRecords (datasheetId: string) {
    let records: any = []
    const response = await this.lark.bitable.appTableRecord.list({
      path: {
        app_token: this.larkConfig.appToken,
        table_id: datasheetId,
      },
    })
    // console.info('原始返回：',response)
    if (response.data) {
      records = response.data.items
      // console.info(records)
    } else {
      console.error('获取数据记录失败：', JSON.stringify(response))
      records = response
    }
    return records
  }

  protected async clearBlankLines (datasheetId: any) {
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
