/* eslint-disable guard-for-in */
import { Vika, ICreateRecordsReqParams } from '@vikadata/vika'
import { log } from 'wechaty'
// import 'dotenv/config.js'

interface IField {
  [key:string]: string | '';
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
  protected static vikaOptions: VikaOptions | undefined

  /**
   * 映射选项
   */
  protected static mappingOptions: MappingOptions

  recordId: string = ''

  /**
   * 设置 Vika API 选项
   */

  // 一个方法，用于访问实例属性
  getId () {
    return this.recordId
  }

  protected static getRecordId (): string {
    throw new Error('Must be implemented by subclass')
  }

  static datasheet: any

  /**
   * 设置 Vika API 选项
   */

  static setVikaOptions (options: VikaOptions) {
    // log.info('setVikaOptions:', options)
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
  static setMappingOptions (options: MappingOptions) {
    this.mappingOptions = options
  }

  protected static getMappingOptions (): MappingOptions {
    throw new Error('Must be implemented by subclass')
  }

  /**
   * 格式化数据
   */
  static formatData (data: Record<string, any>) {
    const formatted: Record<string, any> = {}
    const mappingOptions = this.getMappingOptions()
    // log.info('this.mappingOptions', mappingOptions)
    for (const key in data) {
      const mappedKey = mappingOptions.fieldMapping[key]
      if (mappedKey) {
        formatted[mappedKey] = data[key]
      }
    }
    // log.info('formatted:', JSON.stringify(formatted))
    return formatted
  }

  /**
   * 从记录创建实体
   */
  protected static createFromRecord (record: any) {
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
  static async create<T extends BaseEntity> (entity: Partial<T>) {
    const recordFormat = this.formatData(entity)
    // log.info('recordFormat', JSON.stringify(recordFormat))
    const records:ICreateRecordsReqParams = [ { fields:recordFormat } ]
    try {
      const res = await this.datasheet.records.create(records)
      // log.info('record res:', JSON.stringify(res))
      const record = res.data.records[0]
      return this.createFromRecord(record) as T
    } catch (err) {
      throw Error('create fail')
    }
  }

  /**
   * 批量创建记录
   */
  static async createBatch<T extends BaseEntity> (entity: Partial<T>[]) {
    // log.info('写入维格表:', records.length)
    const recordsNew:ICreateRecordsReqParams = entity.map((r: any) => ({ fields:this.formatData(r) }))
    try {
      const res = await this.datasheet.records.create(recordsNew)
      if (res.success) {
        // log.info(res.data.records)
      } else {
        log.error('记录写入维格表失败：', res)
      }
      const records = res.data.records.map((r: any) => this.createFromRecord(r))
      return records
    } catch (err) {
      log.error('请求维格表写入失败：', err)
      return err
    }
  }

  /**
   * 更新记录
   */
  static async update<T extends BaseEntity> (
    id: string,
    entity: Partial<T>,
  ) {
    const data = this.formatData(entity)

    try {
      const res = await this.datasheet.records.update([ { fields:data, recordId:id } ])
      if (!res.success) {
        log.error('记录更新维格表失败：', res)
      }
      const record:IRecord = res.data.records[0]
      return this.createFromRecord(record) as IRecord
    } catch (err) {
      log.error('请求维格表更新失败：', err)
      return err
    }
  }

  /**
   * 批量更新记录
   */
  static async updatEmultiple<T extends BaseEntity> (
    records: {recordId: string, fields: Partial<T>}[],
  ) {
    const datas = records.map((item) => {
      return {
        fields:this.formatData(item),
        recordId:item.recordId,
      }
    })

    try {
      const res = await this.datasheet.records.update(datas)
      if (!res.success) {
        log.error('记录更新维格表失败：', res)
      }
      const record:IRecord = res.data.records[0]
      return this.createFromRecord(record) as IRecord
    } catch (err) {
      log.error('请求维格表更新失败：', err)
      return err
    }
  }

  /**
   * 删除记录
   */
  static async delete (id: string) {
    const response = await this.datasheet.records.delete([ id ])
    if (!response.success) {
      log.error('删除记录失败：', response)
    }
    return response
  }

  /**
   * 批量删除记录
   */
  static async deleteBatch (ids: string[]) {
    const response = await this.datasheet.records.delete(ids)
    if (!response.success) {
      log.error('删除记录失败：', response)
    }
    return response
  }

  /**
   * 根据 ID 查找单个记录
   */
  static async findById (id: string): Promise<IRecord | null> {

    let records: IRecord[] = []
    const query = { recordIds:id }
    // 分页获取记录，默认返回第一页
    const response = await this.datasheet.records.query(query)
    if (response.success) {
      records = response.data.records
      if (records.length) return this.createFromRecord(records[0]) as IRecord
      // log.info(records)
      return null
    }
    log.error('获取数据记录失败：', JSON.stringify(response))
    throw response

  }

  /**
   * 根据字段查询多条记录
   */
  static async findByField (fieldName: string, value: any, pageSize: number | undefined = 1000): Promise<IRecord[]|undefined[]> {
    const field = this.mappingOptions.fieldMapping[fieldName]
    let records: IRecord[] = []
    if (!field) {
      throw new Error('Invalid field name')
    }

    const query = {
      filterByFormula:`{${field}}="${value}"`,
      pageSize,
    }
    log.info('query:', JSON.stringify(query))
    // 分页获取记录，默认返回第一页
    const response = await this.datasheet.records.query(query)
    if (response.success) {
      records = response.data.records
      // log.info(records)
      return records.map((r: any) => this.createFromRecord(r)) as IRecord[]
    }
    log.error('获取数据记录失败：', JSON.stringify(response))
    return response

  }

  /**
   * 根据字段查询多条记录
   */
  static async findByQuery (filterByFormula: string, pageSize: number | undefined = 1000): Promise<IRecord[]|undefined[]> {
    const query = {
      filterByFormula,
      pageSize,
    }
    log.info('query:', JSON.stringify(query))
    // 分页获取记录，默认返回第一页
    const response = await this.datasheet.records.query(query)
    if (response.success) {
      const { records } = response.data
      // log.info(records)
      return records.map((r: any) => this.createFromRecord(r)) as IRecord[]
    }
    log.error('获取数据记录失败：', JSON.stringify(response))
    return response

  }

  /**
   * 查询所有记录
   */
  static async findAll (): Promise<IRecord[]|unknown[]> {
    const records:IRecord[] = []
    try {
      // Automatically handle pagination and iterate through all records.
      const recordsIter = this.datasheet.records.queryAll()

      // The for-await loop requires an async function and has specific version requirements for Node.js/browser.
      for await (const eachPageRecords of recordsIter) {
        // log.info('findAll ():', JSON.stringify(eachPageRecords))
        records.push(...eachPageRecords)
      }

      // log.info('findAll() records:', records.length)
      return records.map((r: any) => this.createFromRecord(r)) as IRecord[]

    } catch (error) {
      log.error('Error in findAll():', error)
      throw error
    }
  }

  /**
   * 保存实体
   */
  async save (): Promise<this> {
    const Constructor = this.constructor as typeof BaseEntity
    if (this.recordId) {
      await Constructor.update(this.recordId, this)
    } else {
      const entity:any = await Constructor.create(this)
      this.recordId = entity.id
    }

    return this
  }

}
