/* eslint-disable sort-keys */
import 'dotenv/config.js'
import type * as lark from '@larksuiteoapi/node-sdk'
import { log } from 'wechaty'
import fs from 'fs'
import { FileBox } from 'file-box'

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

export interface IFieldMappingResponse {
  code: number;
  success: boolean;
  data: {
    fields: IFieldMapping[];
  };
  message: string;
}

type Record = {
  fields: {
      [key: string]: string
  }
}

export type LarkConfig = {
  appId: string;
  appSecret: string;
  appToken: string;
  userMobile: string;
  datasheetId: string;
};

export class LarkSheet {

  client!: lark.Client
  datasheetId!: string
  offsetValue!: number
  limitValue!: number
  orderby: any
  fields: any[] = []
  records: any
  config: LarkConfig

  constructor (config: LarkConfig) {
    this.config = config
  }

  init (client:lark.Client, datasheetId: string) {
    this.client = client
    this.datasheetId = datasheetId
    this.offsetValue = 0
    this.limitValue = 15
  }

  limit (offset: number, limit: number)  {
    this.offsetValue = offset || 0
    this.limitValue = limit || 15
    return this
  }

  sort (orderby: any) {
    this.orderby = orderby
    return this
  }

  async insert (records:Record[]) {
    // log.info('写入维格表:', records.length)

    try {
      const res = await this.client.bitable.appTableRecord.batchCreate({
        data:{
          records,
        },
        path:{
          app_token:this.config.appToken,
          table_id:this.datasheetId,
        },
      })
      if (res.data && res.data.records) {
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

  async upload (path:string) {
    log.info('文件本地路径：', path)
    const file = fs.createReadStream(path)
    const fileBox = FileBox.fromFile(path)
    // console.info(fileBox)
    try {
      const resp = await this.client.drive.media.uploadAll({
        data:{
          file_name:fileBox.name,
          parent_type: fileBox.mediaType !== 'image/jpeg' ? 'bitable_file' : 'bitable_image',
          parent_node: this.config.appToken,
          size: fileBox.size,
          file,
        },
      })
      if (!resp || !resp.file_token) {
        log.info('文件，上传失败', JSON.stringify(resp))
      } else {
        log.info('文件上传成功', JSON.stringify(resp))
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
      const res = await this.client.bitable.appTableRecord.batchUpdate({
        data:{
          records,
        },
        path:{
          app_token:this.config.appToken,
          table_id:this.datasheetId,
        },
      })
      if (!res.data || !res.data.records) {
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
      const res = await this.client.bitable.appTableRecord.update({
        data:{
          fields,
        },
        path:{
          app_token:this.config.appToken,
          table_id:this.datasheetId,
          record_id:recordId,
        },
      })
      if (!res.data || !res.data.record) {
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
    const response = await this.client.bitable.appTableRecord.batchDelete({
      data:{
        records:recordsIds,
      },
      path:{
        app_token:this.config.appToken,
        table_id:this.datasheetId,
      },
    })
    if (!response.data || !response.data.records) {
      log.error('删除记录失败：', response)
    }
    return response
  }

  async removeOne (recordsId: string) {
    // log.info('操作数据表ID：', datasheetId)
    // log.info('待删除记录IDs：', recordsIds)
    const response = await this.client.bitable.appTableRecord.delete({
      path:{
        app_token:this.config.appToken,
        table_id:this.datasheetId,
        record_id:recordsId,
      },
    })
    if (!response.data || !response.data.record_id) {
      log.error('删除记录失败：', response)
    }
    return response
  }

  async find (query:any = {}) {
    let records: any[] = []
    query['pageSize'] = 1000
    // 分页获取记录，默认返回第一页
    const response = await this.client.bitable.appTableRecord.list({
      params:{
        filter:query,
      },
      path:{
        app_token:this.config.appToken,
        table_id:this.datasheetId,
      },
    })
    if (response.data && response.data.items) {
      records = response.data.items
      // log.info(records)
      return records
    } else {
      log.error('获取数据记录失败：', JSON.stringify(response))
      return response
    }
  }

  async findOne (query:any = {}) {
    let records: any[] = []
    query['pageSize'] = 1
    // 分页获取记录，默认返回第一页
    const response = await this.client.bitable.appTableRecord.list({
      params:{
        filter:query,
      },
      path:{
        app_token:this.config.appToken,
        table_id:this.datasheetId,
      },
    })
    if (response.data && response.data.items) {
      records = response.data.items
      if (records.length) return records[0]
      // log.info(records)
      return {}
    } else {
      log.error('获取数据记录失败：', JSON.stringify(response))
      return response
    }
  }

  async getFields () {
    if (this.fields.length) return this.fields
    const fieldsResp = await this.client.bitable.appTableField.list()

    if (fieldsResp.data && fieldsResp.data.items) {
      this.fields = fieldsResp.data.items
      // log.info('fieldsResp:', this.fields)
    } else {
      console.error(fieldsResp)
    }
    return this.fields
  }

  async findAll (): Promise<any[]> {
    try {
      // Automatically handle pagination and iterate through all records.
      const res = await this.client.bitable.appTableRecord.list()
      if (res.data && res.data.items) {
        // log.info('findAll() records:', records.length)
        return res.data.items
      }
      // log.info('findAll() records:', records.length)
      return []
    } catch (error) {
      log.error('Error in findAll():', error)
      throw error
    }
  }

  keyConversion (records:any[]) {
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

  async nameConversion (records: any[]) {
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
    const convertedRecords: any[] = records.map((record) => {
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

export default LarkSheet
