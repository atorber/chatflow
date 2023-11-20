import { EnvChat } from '../services/mod.js'

// 获取系统配置信息
export const getSetting = async () => {
  await EnvChat.init()
  const settings = await EnvChat.getConfigFromVika()
  return settings
}

// 批量更新配置
export const updateSetting = (setting: any) => {
  return setting
}

// 更新指定配置
export const updateSettingByKey = (key: string, value: any) => {
  return [ key, value ]
}
