/* eslint-disable sort-keys */
import { ICreateRecordsReqParams, Vika } from '@vikadata/vika'
import type { Sheets, Field } from './vikaModel/Model.js'
import { sheets } from './vikaModel/index.js'
import { delay, logForm } from '../utils/utils.js'

export type VikaConfig = {
  spaceId?: string,
  spaceName?: string,
  token: string,
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
  qaSheet:string
  chatBotSheet: string
  chatBotUserSheet:string
}

export class KeyDisplaynameMap {

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

export class VikaDB {

  static spaceName: string
  static token: string
  static vika: Vika
  static spaceId: string | undefined
  static dataBaseIds: DateBase
  static dataBaseNames: DateBase

  static async init (config:VikaConfig) {
    logForm('初始化检查系统表...')
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
      qaSheet:'',
      chatBotSheet: '',
      chatBotUserSheet:'',
    }
    this.dataBaseNames = { ...this.dataBaseIds }

    if (!this.spaceId && this.spaceName) this.spaceId = await this.getSpaceId()
    // console.info('空间ID:', this.spaceId)

    if (this.spaceId) {

      const tables = await this.getNodesList()
      // console.info('维格表文件列表：\n', JSON.stringify(tables, undefined, 2))

      await delay(500)

      for (const k in sheets) {
        // console.info(this)
        const sheet = sheets[k as keyof Sheets]
        // console.info('数据模型：', k, sheet)
        if (sheet && !tables[sheet.name]) {
          logForm(`表不存在，创建表并初始化数据...\n${k}/${sheet.name}`)
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
                newField.property.defaultValue = field.property.defaultValue || options[0].name
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
              case 'Attachment':
                newFields.push(newField)
                break
              default:
                newFields.push(newField)
                break
            }
          }

          console.info('创建表，表信息：', JSON.stringify(newFields))

          const resCreate = await this.createDataSheet(k, sheet.name, newFields)
          if (resCreate.success) {
            await delay(1000)
            const defaultRecords = sheet.defaultRecords
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (defaultRecords) {
              // console.info(defaultRecords.length)
              const count = Math.ceil(defaultRecords.length / 10)
              for (let i = 0; i < count; i++) {
                const records = defaultRecords.splice(0, 10)
                console.info('写入：', records.length)
                await this.createRecord(this.dataBaseIds[k as keyof DateBase], records)
                await delay(1000)
              }
              logForm(sheet.name + '初始化数据写入完成...')
            }
          } else {
            console.info('创建表失败：', resCreate)
            throw new Error(`创建表【${sheet.name}】失败,启动中止，需要重新运行...`)
          }

        } else if (sheet) {
          // logForm(`表已存在：\n${k}/${sheet.name}/${tables[sheet.name]}`)
          this.dataBaseIds[k as keyof DateBase] = tables[sheet.name]
          this.dataBaseNames[sheet.name as keyof DateBase] = tables[sheet.name]
        } else { /* empty */ }
      }
      logForm('初始化表完成...')

      return true
    } else {
      logForm('\n\n指定空间不存在，请先创建空间，并在.env文件或环境变量中配置vika信息\n\n')
      return false
    }
  }

  protected static async getAllSpaces () {
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

  protected static async getSpaceId () {
    if (this.spaceId) {
      return this.spaceId
    }
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
      return undefined
    }
  }

  protected static async getNodesList () {
    if (this.spaceId) {
      // 获取指定空间站的一级文件目录
      const nodeListResp = await this.vika.nodes.list({ spaceId: this.spaceId })
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
      } else {
        console.error('获取数据表失败:', nodeListResp)
      }
      return tables
    } else {
      return {}
    }
  }

  protected static async getDataBases () {
    return this.dataBaseIds
  }

  protected static async getVikaSheet (datasheetId: string) {
    const datasheet = await this.vika.datasheet(datasheetId)
    return datasheet
  }

  protected static async getSheetFields (datasheetId: string) {
    const datasheet = await this.vika.datasheet(datasheetId)
    const fieldsResp = await datasheet.fields.list()
    let fields: any = []
    if (fieldsResp.success) {
      console.info('getSheetFields获取字段：', JSON.stringify(fieldsResp.data.fields))
      fields = fieldsResp.data.fields
    } else {
      console.error('获取字段失败:', fieldsResp)
    }
    return fields
  }

  static async createDataSheet (key: string, name: string, fields: { name: string; type: string }[]) {
    // console.info('创建表...')
    const datasheetRo = {
      fields,
      name,
    }

    if (this.spaceId) {
      try {
        const res: any = await this.vika.space(this.spaceId).datasheets.create(datasheetRo)

        console.info(`系统表【${name}】创建结果:`, res.message || 'fail')

        if (res.data && res.data.id) {
          this.dataBaseIds[key as keyof DateBase] = res.data.id
          this.dataBaseNames[name as keyof DateBase] = res.data.id
          // console.info('创建表成功：', JSON.stringify(this.dataBaseIds))
          // 删除空白行
          await this.clearBlankLines(res.data.id)
          return res
        } else {
          return res
        }

      } catch (error) {
        console.error(`系统表${name}创建失败:`, error)
        return error
        // TODO: handle error
      }
    } else {
      return 'spaceId is undefined'
    }
  }

  protected static async createRecord (datasheetId: string, records: ICreateRecordsReqParams) {
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

  protected static async updateRecord (datasheetId: string, records: {
    recordId: string
    fields: {[key:string]:any}
  }[]) {
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

  protected static async deleteRecords (datasheetId: string, recordsIds: string | any[]) {
    // console.info('操作数据表ID：', datasheetId)
    // console.info('待删除记录IDs：', recordsIds)
    const datasheet = this.vika.datasheet(datasheetId)
    const response = await datasheet.records.delete(recordsIds)
    if (response.success) {
      console.info('删除记录成功：', recordsIds.length || '0')
    } else {
      console.error('删除记录失败：', response)
    }
  }

  protected static async getRecords (datasheetId: string, query:any = {}) {
    let records: any = []
    query['pageSize'] = 1000
    const datasheet = await this.vika.datasheet(datasheetId)
    // 分页获取记录，默认返回第一页
    const response = await datasheet.records.query(query)
    if (response.success) {
      records = response.data.records
      // console.info(records)
    } else {
      console.error('获取数据记录失败：', JSON.stringify(response))
      records = response
    }
    return records
  }

  static async getAllRecords (datasheetId: string) {
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

  protected static async clearBlankLines (datasheetId: any) {
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
