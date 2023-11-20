/* eslint-disable no-console */
import { EnvChat } from '../services/mod.js'

// 查询用户信息接口
export const getUserInfo = (_params: any) => {
  const data = {
    avatar: 'https://im.gzydong.com/public/media/image/avatar/20230530/f76a14ce98ca684752df742974f5473a_200x200.png',
    birthday: '2023-06-11',
    email: '837215079@qq.com',
    gender: 2,
    id: 2055,
    mobile: '18798272055',
    motto: '是的发送到发送到发',
    nickname: '老牛逼了',
  }
  return data
}

// 获取用户相关设置信息接口
export const getUserSetting = async (_params: any) => {
  const res = await EnvChat.findByField('key', 'BASE_BOT_ID')

  console.debug('ServeLoginVika:', res)

  const userInfo: any = {
    setting: {
      keyboard_event_notify: '',
      notify_cue_tone: '',
      theme_bag_img: '',
      theme_color: '',
      theme_mode: '',
    },
    user_info: {
      avatar: '',
      email: '',
      gender: 0,
      is_qiye: false,
      mobile: '13800138000',
      motto: '',
      nickname: '超哥',
      uid: res[0]?.fields['value'] || '',
    },
  }

  console.debug('userInfo:', userInfo)
  return userInfo
}
