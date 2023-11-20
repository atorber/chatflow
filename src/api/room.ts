/* eslint-disable no-console */
/* eslint-disable camelcase */
import { RoomChat } from '../services/mod.js'
import { db } from '../db/tables.js'
const rdb = db.room

/**
 * 记录群聊天记录 记录格式
 * { roomName: '群名', roomId: '', content: '内容', contact: '用户名', wxid: '', time: '时间' }
 * @param info
 * @returns {Promise<unknown>}
 */
export async function addRoomRecord (info:any): Promise<boolean> {
  try {
    await rdb.insert(info)
    return true
  } catch (error) {
    // console.log('插入数据错误', error)
    return false
  }
}

/**
 * 获取指定群的聊天记录
 * @param room
 * @returns {Promise<*>}
 */
export async function getRoomRecord (roomName:any): Promise<any> {
  try {
    const search = await rdb.find({ roomName })
    return search
  } catch (error) {
    // console.log('查询数据错误', error)
  }
}

/**
 * 清楚指定群的聊天记录
 * @param roomName
 * @returns {Promise<void>}
 */
export async function removeRecord (roomName:any): Promise<void> {
  try {
    const search = await rdb.remove({ roomName }, { multi: true })
    return search
  } catch (e) {
    // console.log('error', e)
  }
}

/**
 * 获取指定群聊的所有聊天内容
 * @param rooName
 * @param day 取的天数
 * @returns {Promise<*>}
 */
export async function getRoomRecordContent (rooName:any, day:any): Promise<any> {
  try {
    let list = await getRoomRecord(rooName)
    list = list.filter((item:any) => {
      return item.time >= new Date().getTime() - day * 24 * 60 * 60 * 1000
    })
    let word = ''
    list.forEach((item:any) => {
      word = word + item.content
    })
    return word
  } catch (e) {
    // console.log('error', e)
  }
}

// 查询用户群聊列表接口
export async function getRoomList (): Promise<any> {
  const roomListRaw:any = await RoomChat.findAll()
  // console.log('roomListRaw', JSON.stringify(roomListRaw))
  const roomList = roomListRaw.map((value: { fields: { topic: any; avatar: any; ownerId: any; id: any }; recordId: any }) => {
    if (value.fields.topic) {
      return {
        avatar: value.fields.avatar || 'http://localhost:5173/files/public/media/image/avatar/20231022/4f67de6461b9e930be9ac97b3a6cee4c_200x200.png',
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
  }).filter((item: boolean) => item !== false)

  const data =     {
    items:roomList,
  }
  return data
}

// 查询群信息接口
export async function getRoomInfo (_group_id:string): Promise<any> {
  const roomInfo:any = {
    avatar: '',
    created_at: '2023-05-25 21:51:52',
    group_id: 902,
    group_name: '撒旦',
    is_disturb: 0,
    is_manager: true,
    profile: '',
    visit_card: '',
  }
  return roomInfo
}

// 获取群组成员列表接口
export async function getRoomMemberList (_group_id:string): Promise<any> {
  const data:any[] = [
    {
      id: '3958',
      user_id: '2055',
      avatar: 'https://im.gzydong.club/public/media/image/avatar/20230516/f23389630a568faa4d37b25a20bada62_200x200.png',
      nickname: '猪八戒2',
      gender: 2,
      motto: '人间繁华无尽',
      leader: 2,
      is_mute: 0,
      user_card: '',
    },
    {
      id: '4027',
      user_id: '1070',
      avatar: 'http://im-serve0.gzydong.club/static/image/sys-head/u=2427656680,2114648815\u0026fm=26\u0026gp=0.jpg',
      nickname: '史洋',
      gender: 0,
      motto: '',
      leader: 0,
      is_mute: 0,
      user_card: '',
    },
    {
      id: '4028',
      user_id: '1149',
      avatar: 'http://im-serve0.gzydong.club/static/image/sys-head/2018111907565496202.jpg',
      nickname: '王晨',
      gender: 0,
      motto: '',
      leader: 0,
      is_mute: 0,
      user_card: '',
    },
    {
      id: '4029',
      user_id: '1887',
      avatar: 'http://im-serve0.gzydong.club/static/image/sys-head/u=2427656680,2114648815\u0026fm=26\u0026gp=0.jpg',
      nickname: '师佳',
      gender: 0,
      motto: '',
      leader: 0,
      is_mute: 0,
      user_card: '',
    },
    {
      id: '4030',
      user_id: '1903',
      avatar: 'http://im-serve0.gzydong.club/static/image/sys-head/u=2944719266,4234672866\u0026fm=26\u0026gp=0.jpg',
      nickname: '茅聪',
      gender: 0,
      motto: '',
      leader: 0,
      is_mute: 0,
      user_card: '',
    },
    {
      id: '4031',
      user_id: '2001',
      avatar: 'http://im-serve0.gzydong.club/static/image/sys-head/u=1221048678,2288695515\u0026fm=26\u0026gp=0.jpg',
      nickname: '宋辰',
      gender: 0,
      motto: '',
      leader: 0,
      is_mute: 0,
      user_card: '',
    },
    {
      id: '3955',
      user_id: '2053',
      avatar: 'http://im-serve0.gzydong.club/static/image/sys-head/2019011909042713419.jpg',
      nickname: '尉迟雄',
      gender: 1,
      motto: '你知不知道，思念一个人的滋味，就象欣赏一种残酷的美，然后用很小很小的声音，告诉自己坚强面对。 ',
      leader: 0,
      is_mute: 0,
      user_card: '',
    },
    {
      id: '3956',
      user_id: '2054',
      avatar: 'https://im.gzydong.club/public/media/image/avatar/20230516/c5039ad4f29de2fd2c7f5a1789e155f5_200x200.png',
      nickname: '大飞大飞大飞大飞大飞大飞大飞大飞大飞大飞',
      gender: 0,
      motto: '兔兔大肥猪 测试账号\n',
      leader: 0,
      is_mute: 0,
      user_card: '',
    },
    {
      id: '3957',
      user_id: '2056',
      avatar: 'http://im-serve0.gzydong.club/static/image/sys-head/2019012108290558654.jpg',
      nickname: '澹台韵',
      gender: 0,
      motto: '',
      leader: 0,
      is_mute: 0,
      user_card: '',
    },
  ]
  return data
}
