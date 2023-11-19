import { BaseEntity, MappingOptions } from '../../db/vika-orm.js' // 导入 BaseEntity, VikaOptions, 和 MappingOptions 类型/类
import { logger } from '../../utils/mod.js' // 导入 logger 对象

// // 定义一个延时方法
// const wait = (ms: number) => new Promise(resolve => {
//   setTimeout(resolve, ms);
// });

const mappingOptions: MappingOptions = {  // 定义字段映射选项
  fieldMapping: {  // 字段映射
    id: '群ID|id',
    topic: '群名称|topic',
    ownerId: '群主ID|ownerId',
    updated: '更新时间|updated',
    avatar: '头像|avatar',
    file: '头像图片|file',

  },
  tableName: '群列表|Room',  // 表名
}

/**
 * 用户实体
 */
export class Group extends BaseEntity {  // 用户类继承 BaseEntity

  topic?: string  // 定义名字属性，可选

  id?: string

  alias?: string

  updated?: string

  avatar?: string

  file?: string

  // protected static override recordId: string = ''  // 定义记录ID，初始为空字符串

  protected static override mappingOptions: MappingOptions = mappingOptions  // 设置映射选项为上面定义的 mappingOptions

  protected static override getMappingOptions (): MappingOptions {  // 获取映射选项的方法
    return this.mappingOptions  // 返回当前类的映射选项
  }

  static override setMappingOptions (options: MappingOptions) {  // 设置映射选项的方法
    this.mappingOptions = options  // 更新当前类的映射选项
  }

}

// 查询用户群聊服务接口
export const ServeGetGroupsVika = async () => {
  const res = await Group.findAll()
  logger.info('res:', JSON.stringify(res))
  const groups: any = {
    code: 200,
    message: 'success',
    data: {
      items: [
        {
          avatar: '',
          creator_id: 2055,
          group_name: '抖聊开发群',
          id: 1026,
          is_disturb: 0,
          leader: 2,
          profile: '',
        },
      ],
    },
  }

  const items = res.map((value:any) => {
    if (value.fields.topic) {
      return {
        avatar: value.fields.avatar,
        creator_id: value.fields.ownerId,
        group_name: value.fields.topic,
        id: value.fields.id,
        is_disturb: 0,
        leader: 2,
        profile: '',
        recordId: value.recordId,
      }
    }
    return false
  }).filter(item => item !== false)

  groups.data.items = items
  return groups
}

// 获取群信息服务接口
export const ServeGroupDetailVika = async (parse:any) => {
  const id = parse.group_id
  logger.info('id' + id)
  let group:any = {
    code: 200,
    message: 'success',
    data: {
      avatar: '',
      created_at: '2023-10-20 11:09:48',
      group_id: 1012,
      group_name: '测试一下',
      is_disturb: 0,
      is_manager: true,
      is_mute: 0,
      is_overt: 0,
      profile: '',
      visit_card: '',
    },
  }
  const res:any[] = await Group.findByField('id', id)
  let item = {}
  if (res.length > 0) {
    const groupInfo = res[0].fields
    item = {
      avatar: groupInfo.avatar,
      creator_id: groupInfo.ownerId,
      group_name: groupInfo.topic,
      id: groupInfo.id,
      is_disturb: 0,
      leader: 2,
      profile: '',
      recordId: groupInfo.recordId,
    }
    group.data = item
  } else {
    group = {
      code: 305,
      message: `strconv.ParseInt: parsing "${id}": value out of range`,
    }
  }

  logger.info(group)
  return group
}
