/* eslint-disable guard-for-in */
import { Vika, ICreateRecordsReqParams } from '@vikadata/vika'
import * as fs from 'node:fs'

interface IField {
  [key: string]: string | '';
}

interface OrmResponse {
  message: 'success' | 'fail';
  data: any;
}

export interface IRecord {
  recordId: string;
  fields: IField;
}

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

  datasheet: any

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
    if (!options.apiKey || !options.baseId) {
      throw Error('loss apiKey or baseId')
    } else {
      this.vikaOptions = options
      const vika = new Vika({ token: this.vikaOptions.apiKey })
      this.datasheet = vika.datasheet(this.vikaOptions.baseId)
    }
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
  protected createFromRecord (record: any) {
    const data: any = record.fields
    const entity: any = {}
    const mappingOptions = this.getMappingOptions()

    for (const key in mappingOptions.fieldMapping) {
      const field = mappingOptions.fieldMapping[key]
      entity[key] = data[field as string]
    }
    record.fields = entity
    return record
  }

  /**
   * 创建记录
   */
  async create<T extends BaseEntity> (entity: Partial<T>): Promise<OrmResponse> {
    const recordFormat = this.formatData(entity)
    // console.info('recordFormat', JSON.stringify(recordFormat))
    const records: ICreateRecordsReqParams = [ { fields: recordFormat } ]
    try {
      const res = await this.datasheet.records.create(records)
      // console.info('record res:', JSON.stringify(res))
      const record = res.data.records[0]
      return {
        message: 'success',
        data: this.createFromRecord(record) as T,
      }
    } catch (err) {
      // throw Error('create fail');
      console.error('create fail:', err)
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
    // console.info('写入维格表:', records.length)
    const recordsNew: ICreateRecordsReqParams = entity.map((r: any) => ({
      fields: this.formatData(r),
    }))
    try {
      const res = await this.datasheet.records.create(recordsNew)
      if (res.success) {
        // console.info(res.data.records)
      } else {
        console.error('记录写入维格表失败：', res)
      }
      const records = res.data.records.map((r: any) =>
        this.createFromRecord(r),
      )
      return {
        message: 'success',
        data: records,
      }
    } catch (err) {
      console.error('请求维格表写入失败：', err)
      return {
        message: 'fail',
        data: err,
      }
    }
  }

  /**
   * 更新记录
   */
  async update (id: string, entity: IRecord): Promise<OrmResponse> {
    const data = this.formatData(entity)

    try {
      const res = await this.datasheet.records.update([
        { fields: data, recordId: id },
      ])
      if (!res.success) {
        console.error('记录更新维格表失败：', res)
      }
      const record: IRecord = res.data.records[0]
      return {
        message: 'success',
        data: this.createFromRecord(record) as IRecord,
      }
    } catch (err) {
      console.error('请求维格表更新失败：', err)
      return {
        message: 'fail',
        data: err,
      }
    }
  }

  /**
   * 批量更新记录
   */
  async updatEmultiple<T extends BaseEntity> (
    records: { recordId: string; fields: Partial<T> }[],
  ): Promise<OrmResponse> {
    const datas = records.map((item) => {
      return {
        fields: this.formatData(item.fields),
        recordId: item.recordId,
      }
    })
    // console.debug('updatEmultiple:', datas)
    try {
      const res = await this.datasheet.records.update(datas)
      if (!res.success) {
        console.error('记录更新维格表失败：', res)
      } else {
        // console.debug('updatEmultiple success res:', res)
      }
      return {
        message: 'success',
        data: res,
      }
      // const record: IRecord = res.data.records[0];
      // return this.createFromRecord(record) as IRecord;
    } catch (err) {
      console.error('请求维格表更新失败：', err)
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
    const response = await this.datasheet.records.delete([ id ])
    if (!response.success) {
      console.error('删除记录失败：', response)
    }
    return {
      message: response.success ? 'success' : 'fail',
      data: response,
    }
  }

  /**
   * 批量删除记录
   */
  async deleteBatch (ids: string[]): Promise<OrmResponse> {
    const response = await this.datasheet.records.delete(ids)
    if (!response.success) {
      console.error('删除记录失败：', response)
    }
    return {
      message: response.success ? 'success' : 'fail',
      data: response,
    }
  }

  /**
   * 根据 ID 查找单个记录
   */
  async findById (id: string): Promise<OrmResponse> {
    let records: IRecord[] = []
    const query = { recordIds: id }
    // 分页获取记录，默认返回第一页
    const response = await this.datasheet.records.query(query)
    if (response.success) {
      records = response.data.records
      return {
        message: 'success',
        data: this.createFromRecord(records[0]) as IRecord,
      }
    }
    console.error('findById获取数据记录失败：', JSON.stringify(response))
    return {
      message: 'fail',
      data: response,
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

    const query = {
      filterByFormula: `{${field}}="${value}"`,
      pageSize,
    }
    console.info('findByField:', JSON.stringify(query))
    // 分页获取记录，默认返回第一页
    const response = await this.datasheet.records.query(query)
    if (response.success) {
      records = response.data.records
      // console.info(records)
      return {
        message: 'success',
        data: records.map((r: any) => this.createFromRecord(r)) as IRecord[],
      }
    }
    console.error('findByField获取数据记录失败：', JSON.stringify(response))
    return {
      message: 'fail',
      data: response,
    }
  }

  /**
   * 根据字段查询多条记录
   */
  async findByQuery (
    filterByFormula: string,
    pageSize: number | undefined = 100,
  ): Promise<OrmResponse> {
    const query = {
      filterByFormula,
      pageSize,
    }
    console.info('findByQuery:', JSON.stringify(query))
    // 分页获取记录，默认返回第一页
    const response = await this.datasheet.records.query(query)
    if (response.success) {
      const { records } = response.data
      // console.info(records)
      return {
        message: 'success',
        data: records.map((r: any) => this.createFromRecord(r)) as IRecord[],
      }
    }
    console.error('findByQuery获取数据记录失败：', JSON.stringify(response))
    return {
      message: 'fail',
      data: response,
    }
  }

  /**
   * 查询所有记录
   */
  async findAll (): Promise<OrmResponse> {
    const records: IRecord[] = []
    try {
      // Automatically handle pagination and iterate through all records.
      const recordsIter = this.datasheet.records.queryAll()

      // The for-await loop requires an async function and has specific version requirements for Node.js/browser.
      for await (const eachPageRecords of recordsIter) {
        // console.info('findAll ():', JSON.stringify(eachPageRecords))
        records.push(...eachPageRecords)
      }

      // console.info('findAll() records:', records.length)
      return {
        message: 'success',
        data: records.map((r: any) => this.createFromRecord(r)) as IRecord[],
      }
    } catch (error) {
      console.error('Error in findAll():', error)
      return {
        message: 'fail',
        data: error,
      }
    }
  }

  async upload (path: string): Promise<OrmResponse> {
    console.info('文件本地路径：', path)
    try {
      if (fs.existsSync(path)) {
        // 文件存在，可以继续你的操作
        const file = fs.createReadStream(path)
        const resp = await this.datasheet.upload(file)
        return {
          message: 'success',
          data: resp,
        }
      } else {
        console.error('文件不存在')
        // 文件不存在，你需要处理这个问题
        return {
          message: 'fail',
          data: '文件不存在',
        }
      }
    } catch (error) {
      console.error('上传文件失败：', error)
      return {
        message: 'fail',
        data: error,
      }
    }
  }

}
