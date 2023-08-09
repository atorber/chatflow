/* eslint-disable sort-keys */
import type { types as configTypes } from './mods/mod.js'
const config:configTypes.Config = {
  botInfo: {

  },
  functionOnStatus: {
    autoQa: {
      autoReply: true,
      atReply: false,
      customReply: false,
      roomWhitelist: true,
      contactWhitelist: false,
    },
    vika: {
      useVika: false,
      uploadMessageToVika: false,
      autoMaticCloud: false,
    },
    webHook: {
      webhookMessagePush: false,
    },
    mqtt: {
      mqttMessagePush: false,
      mqttControl: true,
    },
    im: {
      imChat: false,
    },
  },
  botConfig: {
    base: {
      welcomeMessageForJoinRoom: '',
      welcomeMessageForAddFriend: '',
    },
    wechaty: {
      puppet: 'wechaty-puppet-wechat',
      token: '',
    },
    vika: {
      spaceName: 'bot-test',
      token: '',
    },
    adminRoom: {
      adminRoomId: '管理员群ID',
      adminRoomTopic: '管理员群名称',
    },
    autoQa: {
      type: 'chatGpt',
    },
    wxOpenAi: {
      token: '',
      encodingAesKey: '',
    },
    chatGpt: {
      key: '你的openai api key',
      endpoint: 'https://www.openai-proxy.com',
    },
    mqtt: {
      username: '',
      password: '',
      endpoint: '',
      port: 1883,
    },
    webHook: {
      url: '',
      token: '',
      username: '',
      password: '',
    },
    yuQue: {
      token: '',
      nameSpace: '',
    },
  },
  apps: {
    riding: {
      config: {},
      isOpen: true,
    },
  },
  command: {
    bot: {
      reboot: '#重启机器人',
      selfInfo: '#机器人信息',
    },
    contact: {
      findall: '#联系人列表',
    },
    room: {
      findall: '#群列表',
    },
  },
  welcomeList: [],
  roomWhiteList: [],
  contactWhiteList: [],
  contactConfig: {
    tyutluyc: {
      app: 'waiting',
      apps: {
        qa: {
          config: {},
          isOpen: true,
        },
        riding: {
          config: {},
          isOpen: true,
        },
      },
    },
    tyutluyc2: {
      app: 'waiting',
      apps: {
        qa: {
          config: {},
          isOpen: true,
        },
        riding: {
          config: {},
          isOpen: true,
        },
      },
    },
  },
  roomConfig: {},
}

config.botConfig.vika.spaceName = process.env['BOTCONFIG_VIKA_SPACENAME']
config.botConfig.vika.token = process.env['BOTCONFIG_VIKA_TOKEN']

type Configs = {
  [key: string]: any;
}
// 配置文件，所有配置必须齐全，补充空白配置项，其他配置项可按需要修改
const baseConfig:Configs = {
  VIKA_SPACENAME: process.env['BOTCONFIG_VIKA_SPACENAME'] || config.botConfig.vika.spaceName,
  VIKA_TOKEN: process.env['BOTCONFIG_VIKA_TOKEN'] || config.botConfig.vika.token,
  puppetName: process.env['BOTCONFIG_WECHATY_PUPPET'] || config.botConfig.wechaty.puppet,
  puppetToken: process.env['BOTCONFIG_WECHATY_TOKEN'] || config.botConfig.wechaty.token,
}

export { baseConfig, config }
