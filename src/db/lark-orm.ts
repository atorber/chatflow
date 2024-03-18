/* eslint-disable no-console */
/* eslint-disable guard-for-in */
import * as lark from '@larksuiteoapi/node-sdk'
import * as fs from 'node:fs'

type RecordType = {
  fields: {
    [key: string]: string;
  };
};

interface OrmResponse {
  message: 'success' | 'fail';
  data: any;
}

interface IField {
  [key: string]: any;
}

export interface IRecord {
  record_id?: string;
  recordId?: string;
  fields: IField;
}

export type LarkConfig = {
  appId: string;
  appSecret: string;
  appToken: string;
  datasheetId: string;
};

/**
 * Vika API 接口选项
 */
export interface VikaOptions {
  apiKey: string;
  baseId: string;
}

/**
 * 实体类映射选项
 */
export interface MappingOptions {
  // 表名
  tableName: string;

  // 字段映射
  fieldMapping: Record<string, string>;
}

/**
 * 基类实体
 */
export abstract class BaseEntity {

  /**
   * Vika API 选项
   */
  protected vikaOptions: VikaOptions | undefined

  /**
   * 映射选项
   */
  protected mappingOptions!: MappingOptions

  recordId: string = ''

  datasheet!: lark.Client

  config!: LarkConfig

  /**
   * 设置 Vika API 选项
   */

  // 一个方法，用于访问实例属性
  getId () {
    return this.recordId
  }

  protected getRecordId (): string {
    throw new Error('Must be implemented by subclass')
  }

  /**
   * 设置 Vika API 选项
   */

  setVikaOptions (options: VikaOptions) {
    // console.info('setVikaOptions:', options)
    this.vikaOptions = options
    this.config = {
      appId: options.apiKey.split('/')[0] as string,
      appSecret: options.apiKey.split('/')[1] as string,
      appToken: options.apiKey.split('/')[2] as string,
      datasheetId: options.baseId,
    }
    this.datasheet = new lark.Client({
      appId: this.config.appId,
      appSecret: this.config.appSecret,
    })
  }

  /**
   * 设置映射选项
   */
  setMappingOptions (options: MappingOptions) {
    this.mappingOptions = options
  }

  protected getMappingOptions (): MappingOptions {
    throw new Error('Must be implemented by subclass')
  }

  /**
   * 格式化数据
   */
  formatData (data: Record<string, any>) {
    // console.info('formatData:', data)
    const formatted: Record<string, any> = {}
    const mappingOptions = this.getMappingOptions()
    // console.info('this.mappingOptions', mappingOptions)
    for (const key in data) {
      const mappedKey = mappingOptions.fieldMapping[key]
      if (mappedKey) {
        formatted[mappedKey] = data[key]
      }
    }
    // console.info('formatted:', JSON.stringify(formatted))
    return formatted
  }

  /**
   * 从记录创建实体
   */
  protected createFromRecord (record: {
    fields: { [key: string]: any };
    record_id?: string;
    recordId?: string;
  }) {
    const data: any = record.fields
    const entity: any = {}
    const mappingOptions = this.getMappingOptions()

    for (const key in mappingOptions.fieldMapping) {
      const field = mappingOptions.fieldMapping[key]
      entity[key] = data[field as string]
    }
    record.fields = entity
    if (record.record_id) record.recordId = record.record_id
    return record
  }

  /**
   * 创建记录
   */
  async create (entity: { [key: string]: any }): Promise<OrmResponse> {
    const recordFormat = this.formatData(entity)
    // console.info('recordFormat', JSON.stringify(recordFormat))
    const records = [ { fields: recordFormat } ]
    try {
      const res = await this.datasheet.bitable.appTableRecord.batchCreate({
        data: {
          records,
        },
        path: {
          app_token: this.config.appToken,
          table_id: this.config.datasheetId,
        },
      })

      if (res.data?.records) {
        // console.info(res.data.records)
        const record = res.data.records[0] as IRecord
        return {
          message: 'success',
          data: this.createFromRecord(record),
        }
      } else {
        console.error('记录写入飞书多维表格失败：', res)
        return {
          message: 'fail',
          data: res,
        }
      }
    } catch (err: any) {
      console.error('请求飞书多维表格写入失败：', err)
      return {
        message: 'fail',
        data: err,
      }
    }
  }

  /**
   * 批量创建记录
   */
  async createBatch (entity: IRecord[]): Promise<OrmResponse> {
    // console.info('写入飞书多维表:', records.length)
    const records: RecordType[] = entity.map((r: any) => ({
      fields: this.formatData(r),
    }))
    // console.debug('createBatch:', records)
    try {
      const res = await this.datasheet.bitable.appTableRecord.batchCreate({
        data: {
          records,
        },
        path: {
          app_token: this.config.appToken,
          table_id: this.config.datasheetId,
        },
      })

      if (res.data?.records) {
        // console.info('res.data.records:', res.data.records)
        const records = res.data.records.map((r: any) =>
          this.createFromRecord(r),
        )
        return {
          message: 'success',
          data: records,
        }
      } else {
        console.error('记录写入飞书多维表格失败：', res)
        return {
          message: 'fail',
          data: res,
        }
      }
    } catch (err) {
      console.error('请求飞书多维表格写入失败：', err)
      return {
        message: 'fail',
        data: err,
      }
    }
  }

  /**
   * 更新记录
   */
  async update<T extends BaseEntity> (
    id: string,
    entity: Partial<T>,
  ): Promise<OrmResponse> {
    const data = this.formatData(entity)

    try {
      const res = await this.datasheet.bitable.appTableRecord.batchUpdate({
        data: {
          records: [
            {
              fields: data,
              record_id: id,
            },
          ],
        },
        path: {
          app_token: this.config.appToken,
          table_id: this.config.datasheetId,
        },
      })
      // console.info('update res:', JSON.stringify(res))
      if (!res.data || !res.data.records || !res.data.records.length) {
        console.error('记录更新飞书多维表失败：', res)
        return {
          message: 'fail',
          data: res,
        }
      } else {
        const records: IRecord[] = res.data.records
        const record: IRecord = records[0] as IRecord
        return {
          message: 'success',
          data: this.createFromRecord(record) as IRecord,
        }
      }
    } catch (err) {
      console.error('请求飞书多维表更新失败：', err)
      return {
        message: 'fail',
        data: err,
      }
    }
  }

  /**
   * 批量更新记录
   */
  async updatEmultiple (records: IRecord[]): Promise<OrmResponse> {
    const datas = records.map((item) => {
      return {
        fields: this.formatData(item.fields),
        record_id: item.record_id,
      }
    })
    // console.debug('updatEmultiple:', datas)
    try {
      const res = await this.datasheet.bitable.appTableRecord.batchUpdate({
        data: {
          records: datas,
        },
        path: {
          app_token: this.config.appToken,
          table_id: this.config.datasheetId,
        },
      })
      // console.info('updatEmultiple res:', res)
      if (!res.data || !res.data.records || !res.data.records.length) {
        console.error('记录更新飞书多维表失败：', res)
        return {
          message: 'fail',
          data: res,
        }
      } else {
        const records: IRecord[] = res.data.records
        records.map((r: any) => this.createFromRecord(r)) as IRecord[]
        return {
          message: 'success',
          data: records.map((r: any) => this.createFromRecord(r)) as IRecord[],
        }
      }
      // const record: IRecord = res.data.records[0];
      // return this.createFromRecord(record) as IRecord;
    } catch (err) {
      console.error('请求飞书多维表更新失败：', err)
      return {
        message: 'fail',
        data: err,
      }
    }
  }

  /**
   * 删除记录
   */
  async delete (id: string): Promise<OrmResponse> {
    const response = await this.datasheet.bitable.appTableRecord.batchDelete({
      data: { records: [ id ] },
      path: {
        app_token: this.config.appToken,
        table_id: this.config.datasheetId,
      },
    })
    if (response.data && response.data.records) {
      console.info('删除记录成功：', JSON.stringify(response.data))
      return { message: 'success', data: response.data }
    } else {
      console.error('删除记录失败：', response)
      return { message: 'fail', data: response }
    }
  }

  /**
   * 批量删除记录
   */
  async deleteBatch (ids: string[]): Promise<OrmResponse> {
    const response = await this.datasheet.bitable.appTableRecord.batchDelete({
      data: {
        records: ids,
      },
      path: {
        app_token: this.config.appToken,
        table_id: this.config.datasheetId,
      },
    })
    if (response.data && response.data.records) {
      console.info('删除记录成功：', JSON.stringify(response.data))
      return { message: 'success', data: response.data }
    } else {
      console.error('删除记录失败：', response)
      return { message: 'fail', data: response }
    }
  }

  /**
   * 根据 ID 查找单个记录
   */
  async findById (id: string): Promise<OrmResponse> {
    // 分页获取记录，默认返回第一页
    try {
      const response = await this.datasheet.bitable.appTableRecord.get({
        path: {
          app_token: this.config.appToken,
          table_id: this.config.datasheetId,
          record_id: id,
        },
      })
      // const response = await this.datasheet.records.query(query)
      if (response.data && response.data.record) {
        const record = response.data.record
        return {
          message: 'success',
          data: this.createFromRecord(record),
        }
      } else {
        // console.info(records)
        return {
          message: 'fail',
          data: response,
        }
      }
    } catch (err) {
      console.error('findById获取数据记录失败：', JSON.stringify(err))
      return {
        message: 'fail',
        data: err,
      }
    }
  }

  /**
   * 根据字段查询多条记录
   */
  async findByField (
    fieldName: string,
    value: any,
    pageSize: number | undefined = 100,
  ): Promise<OrmResponse> {
    const field = this.mappingOptions.fieldMapping[fieldName]
    let records: IRecord[] = []
    if (!field) {
      throw new Error('Invalid field name')
    }

    const filterByFormula = `CurrentValue.[${field}]="${value}"`
    console.info('filterByFormula:', filterByFormula)
    // 分页获取记录，默认返回第一页
    // const response = await this.datasheet.records.query(query)
    const response = await this.datasheet.bitable.appTableRecord.list({
      params: {
        filter: filterByFormula,
        page_size: pageSize,
      },
      path: {
        app_token: this.config.appToken,
        table_id: this.config.datasheetId,
      },
    })
    if (response.data && response.data.items) {
      records = response.data.items
      // console.info(records)
      return {
        message: 'success',
        data: records.map((r: any) => this.createFromRecord(r)) as IRecord[],
      }
    } else {
      console.error('findByField获取数据记录失败：', JSON.stringify(response))
      return {
        message: 'fail',
        data: response,
      }
    }
  }

  /**
   * 根据字段查询多条记录
   * https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/filter
   */
  async findByQuery (
    filterByFormula: string,
    pageSize: number | undefined = 100,
  ): Promise<OrmResponse> {
    let records: IRecord[] = []
    const response = await this.datasheet.bitable.appTableRecord.list({
      params: {
        filter: filterByFormula,
        page_size: pageSize,
      },
      path: {
        app_token: this.config.appToken,
        table_id: this.config.datasheetId,
      },
    })
    if (response.data && response.data.items) {
      records = response.data.items
      // console.info(records)
      return {
        message: 'success',
        data: records.map((r: any) => this.createFromRecord(r)) as IRecord[],
      }
    } else {
      console.error('findByField获取数据记录失败：', JSON.stringify(response))
      return {
        message: 'fail',
        data: response,
      }
    }
  }

  /**
   * 查询所有记录
   * https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/filter
   * AND(CurrentValue.[订单号].contains("004"),CurrentValue.[订单日期]= TODAY())
   * OR(CurrentValue.[订单号].contains("004"),CurrentValue.[订单号].contains("009"))
   * CurrentValue.[订单日期] = TODAY()-1
   */
  async findAll () {
    let records: any = []
    const response = await this.datasheet.bitable.appTableRecord.list({
      path: {
        app_token: this.config.appToken,
        table_id: this.config.datasheetId,
      },
    })
    // console.info('原始返回：',response)
    if (response.data) {
      records = response.data.items
      // console.info(records)
      return {
        message: 'success',
        data: records.map((r: any) => this.createFromRecord(r)) as IRecord[],
      }
    } else {
      console.error('获取数据记录失败：', JSON.stringify(response))
      return {
        message: 'fail',
        data: response,
      }
    }
  }

  async upload (path: string): Promise<{ data: any; message?: any }> {
    console.info('文件本地路径：', path)
    try {
      if (fs.existsSync(path)) {
        // 文件存在，可以继续你的操作
        const file = fs.createReadStream(path)
        const size = fs.statSync(path).size
        const name = path.split('/').pop() as string
        const payload: any = {
          data: {
            file,
            file_name: name,
            parent_type: 'bitable_file',
            parent_node: this.config.appToken,
            size,
          },
        }
        console.info('payload', JSON.stringify(payload))

        const resp = await this.datasheet.drive.media.uploadAll(payload)
        console.info('上传文件成功：', JSON.stringify(resp))
        return {
          message: 'success',
          data: resp,
        }
      } else {
        console.error('文件不存在')
        // 文件不存在，你需要处理这个问题
        return {
          message: 'fail',
          data: undefined,
        }
      }
    } catch (error) {
      console.error('上传文件失败：', error)
      return { message: error, data: undefined }
    }
  }

}
