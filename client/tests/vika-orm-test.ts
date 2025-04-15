/* eslint-disable no-console */
import 'dotenv/config.js'
import { BiTable } from '../src/db/vika-db.js'
import { BaseEntity, MappingOptions } from '../src/db/vika-orm.js'

export class Env extends BaseEntity {

  name?: string

  key?: string

  value?: string

  desc?: string

  syncStatus?: string

  lastOperationTime?: string

  action?: string

  // protected static override recordId: string = ''  // 定义记录ID，初始为空字符串

  protected override mappingOptions: MappingOptions = {
    // 定义字段映射选项
    fieldMapping: {
      // 字段映射
      name: '配置项|name',
      key: '标识|key',
      value: '值|value',
      desc: '说明|desc',
      syncStatus: '同步状态|syncStatus',
      lastOperationTime: '最后操作时间|lastOperationTime',
      action: '操作|action',
    },
    tableName: '环境变量|Env', // 表名
  } // 设置映射选项为上面定义的 mappingOptions

  protected override getMappingOptions (): MappingOptions {
    // 获取映射选项的方法
    return this.mappingOptions // 返回当前类的映射选项
  }

  override setMappingOptions (options: MappingOptions) {
    // 设置映射选项的方法
    this.mappingOptions = options // 更新当前类的映射选项
  }

}

const main = async () => {
  const db = new BiTable()
  const dbInit = await db.init({
    token: process.env.VIKA_TOKEN || '',
    spaceId: process.env.VIKA_SPACE_ID || '',
  })

  console.log('dbInit:', dbInit)

  // 测试
  const env = new Env()
  await env.setVikaOptions({
    apiKey: db.token,
    baseId: db.dataBaseIds.envSheet, // 设置 base ID
  })

  const envData = await env.findAll()
  console.log('envData:', JSON.stringify(envData, null, 2))

  const demo = [
    {
      recordId: 'rec0ofQXMfryc',
      createdAt: 1694860633000,
      updatedAt: 1697695907000,
      fields: {
        name: 'Wechaty-Puppet',
        key: 'WECHATY_PUPPET',
        value: 'wechaty-puppet-padlocal',
        desc: '可选值：\nwechaty-puppet-wechat4u\nwechaty-puppet-wechat\nwechaty-puppet-xp\nwechaty-puppet-engine\u0000\nwechaty-puppet-padlocal\nwechaty-puppet-service',
        syncStatus: '未同步',
        lastOperationTime: 1694860632945,
        action: '选择操作',
      },
    },
  ]

  console.log('demo:', JSON.stringify(demo))
}

void main()
