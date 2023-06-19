/*
修改config.json配置文件，参考一下说明修改
{
    "baseConfig": {
        "VIKA_TOKEN": "修改为自己的维格表token",
        "VIKA_SPACENAME": "修改为自己的维格表空间名称",
        "puppetName": "wechaty-puppet-wechat4u", //可选值：wechaty-puppet-wechat4u、wechaty-puppet-wechat、wechaty-puppet-xp、wechaty-puppet-engine、wechaty-puppet-padlocal、wechaty-puppet-service
        "puppetToken": ""
    },
}
*/
import fs from 'fs'
import type { types as configTypes } from './mods/mod.js'
const config:configTypes.Config = JSON.parse(fs.readFileSync('src/config.json', 'utf8'))
type Configs = {
  [key: string]: any;
}
// 配置文件，所有配置必须齐全，补充空白配置项，其他配置项可按需要修改
const baseConfig:Configs = {
  VIKA_SPACENAME: config.botConfig.vika.spaceName,
  VIKA_TOKEN: config.botConfig.vika.token,
  puppetName: config.botConfig.wechaty.puppet,
  puppetToken: config.botConfig.wechaty.token,
}

export { baseConfig, config }
