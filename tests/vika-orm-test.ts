import { log } from 'wechaty' // 导入 wechaty 的 log 模块
import { BaseEntity, VikaOptions, MappingOptions } from '../src/db/vika-orm.js' // 导入 BaseEntity, VikaOptions, 和 MappingOptions 类型/类
import 'dotenv/config.js'  // 导入环境变量配置
import { wait } from '../src/utils/utils.js'  // 导入 wait 功能
import { v4 as uuidv4 } from 'uuid'

const vikaOptions: VikaOptions = {  // 定义 Vika API 的选项
  apiKey: process.env.VIKA_TOKEN,  // 从环境变量获取 API 密钥
  baseId: 'dstv5YCjy3PUtN882p',  // 设置 base ID
}

const mappingOptions: MappingOptions = {  // 定义字段映射选项
  fieldMapping: {  // 字段映射
    email: 'Email',
    id: 'ID',
    name: 'Name',
  },
  tableName: 'users',  // 表名
}

/**
 * 用户实体
 */
class User extends BaseEntity {  // 用户类继承 BaseEntity

  name?: string  // 定义名字属性，可选
  email?: string  // 定义电子邮件属性，可选
  id?:string

  // protected static override recordId: string = ''  // 定义记录ID，初始为空字符串

  protected static override mappingOptions: MappingOptions = mappingOptions  // 设置映射选项为上面定义的 mappingOptions

  protected static override getMappingOptions (): MappingOptions {  // 获取映射选项的方法
    return this.mappingOptions  // 返回当前类的映射选项
  }

  static override setMappingOptions (options: MappingOptions) {  // 设置映射选项的方法
    this.mappingOptions = options  // 更新当前类的映射选项
  }

}

User.setVikaOptions(vikaOptions)  // 设置 Vika API 选项

// 使用示例

// 增
const newUser1 = new User()  // 创建一个新的用户实例
newUser1.name = 'Bob'  // 设置用户名为 Bob
newUser1.email = 'bob@example.com'  // 设置用户电子邮件为 bob@example.com
newUser1.id = uuidv4()
const res = await newUser1.save()  // 保存用户实例
log.info('保存newUser1:', JSON.stringify(res))  // 输出新用户的信息
await wait(500)  // 等待 500 毫秒

// 增
const newUser2 = await User.create<User>({  // 创建一个新的用户
  email: 'test@example.com',  // 用户电子邮件为 test@example.com
  id:uuidv4(),
  name: 'Test',  // 用户名为 Test
})

log.info('保存newUser2:', JSON.stringify(newUser2))  // 输出新用户的信息
await wait(500)  // 等待 500 毫秒

// 改
const updateRes = await User.update(newUser2.recordId, { email: 'newalice@example.com' } as Partial<User>)  // 更新新用户的电子邮件
log.info('更新newUser2:', JSON.stringify(updateRes))  // 输出更新后的新用户信息
await wait(500)  // 等待 500 毫秒

// 查
const queryRes = await User.findById(newUser2.recordId)
log.info('查询findById:', JSON.stringify(queryRes))  // 输出更新后的新用户信息
await wait(500)  // 等待 500 毫秒

const query2Res = await User.findByField('email', 'bob@example.com')
log.info('查询findByField:', JSON.stringify(query2Res))  // 输出更新后的新用户信息
await wait(500)  // 等待 500 毫秒

// 删
const deleteRes = await User.delete(newUser2.recordId)  // 删除新用户
log.info('删除newUser2:', JSON.stringify(deleteRes))  // 输出更新后的新用户信息
await wait(500)  // 等待 500 毫秒

// 查
const users = await User.findAll()  // 查找所有用户（当前被注释掉）
log.info('查询users:', JSON.stringify(users))  // 输出新用户的信息
await wait(500)  // 等待 500 毫秒
