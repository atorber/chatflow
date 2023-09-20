/* eslint-disable sort-keys */
import type { ICreateRecordsReqParams, Vika } from '@vikadata/vika'
import { log } from 'wechaty'
import fs from 'fs'
import 'dotenv/config.js'

interface IField {
  [key:string]: string | '';
}

export interface IRecord {
  recordId: string;
  fields: IField;
}

interface IFieldMapping {
  id: string;
  name: string;
  type: string;
  property: any;
  editable: boolean;
  isPrimary?: boolean;
}

interface IFieldMappingResponse {
  code: number;
  success: boolean;
  data: {
    fields: IFieldMapping[];
  };
  message: string;
}

export class VikaSheet {

  private datasheet: any
  offsetValue!: number
  limitValue!: number
  orderby!: any
  private fields: any[] = []
  records: any

  constructor (client:Vika, datasheetId: string) {
    this.datasheet = client.datasheet(datasheetId)
    this.offsetValue = 0
    this.limitValue = 15
  }

  public limit (offset: number, limit: number): this {
    this.offsetValue = offset || 0
    this.limitValue = limit || 15
    return this
  }

  public sort (orderby: any): this {
    this.orderby = orderby
    return this
  }

  async insert (records: ICreateRecordsReqParams) {
    // log.info('写入维格表:', records.length)

    try {
      const res = await this.datasheet.records.create(records)
      if (res.success) {
        // log.info(res.data.records)
      } else {
        log.error('记录写入维格表失败：', res)
      }
      return res
    } catch (err) {
      log.error('请求维格表写入失败：', err)
      return err
    }

  }

  async upload (path:string, file:any) {
    if (path) {
      log.info('文件本地路径：', path)
      file = fs.createReadStream(path)
    }

    try {
      const resp = await this.datasheet.upload(file)
      if (!resp.success) {
        log.info('文件上传请求成功，上传失败', JSON.stringify(resp))
      }
      return resp
    } catch (error) {
      log.error('文件上传请求失败:', error)
      return error
    }

  }

  async update (records: {
    recordId: string
    fields: {[key:string]:any}
  }[]) {
    log.info('更新维格表记录:', records.length)

    try {
      const res = await this.datasheet.records.update(records)
      if (!res.success) {
        log.error('记录更新维格表失败：', res)
      }
      return res
    } catch (err) {
      log.error('请求维格表更新失败：', err)
      return err
    }

  }

  async updateOne (recordId: string, fields: {[key:string]:any}) {

    try {
      const res = await this.datasheet.records.update([ { recordId, fields } ])
      if (!res.success) {
        log.error('记录更新维格表失败：', res)
      }
      return res
    } catch (err) {
      log.error('请求维格表更新失败：', err)
      return err
    }

  }

  async remove (recordsIds: string[]) {
    // log.info('操作数据表ID：', datasheetId)
    // log.info('待删除记录IDs：', recordsIds)
    const response = await this.datasheet.records.delete(recordsIds)
    if (!response.success) {
      log.error('删除记录失败：', response)
    }
    return response
  }

  async removeOne (recordsId: string) {
    // log.info('操作数据表ID：', datasheetId)
    // log.info('待删除记录IDs：', recordsIds)
    const response = await this.datasheet.records.delete([ recordsId ])
    if (!response.success) {
      log.error('删除记录失败：', response)
    }
    return response
  }

  async find (query:any = {}) {
    let records: IRecord[] = []
    query['pageSize'] = 1000
    // 分页获取记录，默认返回第一页
    const response = await this.datasheet.records.query(query)
    if (response.success) {
      records = response.data.records
      // log.info(records)
      return records
    } else {
      log.error('获取数据记录失败：', JSON.stringify(response))
      return response
    }
  }

  async findOne (query:any = {}) {
    let records: IRecord[] = []
    query['pageSize'] = 1
    // 分页获取记录，默认返回第一页
    const response = await this.datasheet.records.query(query)
    if (response.success) {
      records = response.data.records
      if (records.length) return records[0]
      // log.info(records)
      return {}
    } else {
      log.error('获取数据记录失败：', JSON.stringify(response))
      return response
    }
  }

  async findAll (): Promise<IRecord[]> {
    const records: IRecord[] = []

    try {
      // Automatically handle pagination and iterate through all records.
      const recordsIter = this.datasheet.records.queryAll()

      // The for-await loop requires an async function and has specific version requirements for Node.js/browser.
      for await (const eachPageRecords of recordsIter) {
        // log.info('findAll ():', JSON.stringify(eachPageRecords))
        records.push(...eachPageRecords)
      }

      // log.info('findAll() records:', records.length)
      return records
    } catch (error) {
      log.error('Error in findAll():', error)
      throw error
    }
  }

  async getFields () {
    if (this.fields.length) return this.fields
    const fieldsResp:IFieldMappingResponse = await this.datasheet.fields.list()

    if (fieldsResp.success) {
      this.fields = fieldsResp.data.fields
      // log.info('fieldsResp:', this.fields)
    } else {
      console.error(fieldsResp)
    }
    return this.fields
  }

  async createFields (fieldRo: any) {
    try {
      const res = await this.datasheet.fields.create(fieldRo)
      if (res.success) {
        // TODO: save field.id
      }
      return res
    } catch (error) {
      // TODO: handle error
      return error
    }

  }

  async removeFields (fieldId: string) {
    try {
      const res = await this.datasheet.fields.delete(fieldId)
      return res
    } catch (error) {
      return error
    }

  }

  keyConversion (records:ICreateRecordsReqParams) {
    return records.map(record => {
      const newFields: { [key: string]: any } = {}

      for (const [ oldKey, value ] of Object.entries(record.fields)) {
        const newKey = oldKey.split('|')[1] || oldKey // 获取 "|" 后面的部分作为新键
        newFields[newKey] = value
      }
      record.fields = newFields
      return record
    })
  }

  async nameConversion (records: ICreateRecordsReqParams) {
    const fields = await this.getFields()
    // 创建一个映射表
    const fieldMap: { [key: string]: string } = {}
    for (const field of fields) {
      const parts = field.name.split('|')
      if (parts.length === 2) {
        fieldMap[parts[1]] = field.name
      }
    }

    // 使用映射表转换记录
    const convertedRecords: ICreateRecordsReqParams = records.map((record) => {
      const newFields: { [key: string]: string } = {}
      for (const [ key, value ] of Object.entries(record.fields)) {
        newFields[fieldMap[key] || key] = value as string
      }
      record.fields = newFields
      return record
    })

    return convertedRecords
  }

}

export default VikaSheet

// const client = new VikaSheet(new Vika({ token:process.env['VIKA_TOKEN'] as string }), 'dstSQVXuiF81YpoD7j')

// const records = await client.findAll()

// const keyData = client.keyConversion(records)

// log.info('keyData:', JSON.stringify(keyData))

// const nameData = await client.nameConversion(keyData)
// log.info('nameData:', JSON.stringify(nameData))
