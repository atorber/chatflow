/* eslint-disable sort-keys */
import { Contact, Message, Room, Sayable, log } from 'wechaty'
import type { configTypes } from '../types/mod.js'
import { EnvironmentVariables } from '../types/mod.js'
import fs from 'fs'

const config: configTypes.Config = {
  botInfo: {},
  functionOnStatus: {
    autoQa: {
      autoReply: process.env[EnvironmentVariables.AUTOQA_AUTOREPLY] === 'true',
      atReply: false,
    },
    vika: {
      useVika: process.env[EnvironmentVariables.VIKA_USEVIKA] === 'true',
      uploadMessageToVika: process.env[EnvironmentVariables.VIKA_UPLOADMESSAGETOVIKA] === 'true',
      autoMaticCloud: process.env[EnvironmentVariables.VIKA_AUTOMATICCLOUD] === 'true',
    },
    webHook: {
      webhookMessagePush: process.env[EnvironmentVariables.WEBHOOK_WEBHOOKMESSAGEPUSH] === 'true',
    },
    mqtt: {
      mqttMessagePush: process.env[EnvironmentVariables.MQTT_MQTTMESSAGEPUSH] === 'true',
      mqttControl: process.env[EnvironmentVariables.MQTT_MQTTCONTROL] === 'true' || true,
    },
    im: {
      imChat: process.env[EnvironmentVariables.IM_IMCHAT] === 'true',
    },
  },
  botConfig: {
    base: {
      welcomeMessageForJoinRoom: process.env[EnvironmentVariables.BASE_WELCOMEMESSAGEFORJOINROOM] || '',
      welcomeMessageForAddFriend: process.env[EnvironmentVariables.BASE_WELCOMEMESSAGEFORADDFRIEND] || '',
      botid:process.env[EnvironmentVariables.BASE_BOT_ID] || '',
    },
    wechaty: {
      puppet: process.env[EnvironmentVariables.WECHATY_PUPPET] || 'wechaty-puppet-wechat',
      token: process.env[EnvironmentVariables.WECHATY_TOKEN] || '',
    },
    vika: {
      spaceName: process.env[EnvironmentVariables.VIKA_SPACE_NAME] || '',
      token: process.env[EnvironmentVariables.VIKA_TOKEN] || '',
    },
    adminRoom: {
      adminRoomId: process.env[EnvironmentVariables.ADMINROOM_ADMINROOMID] || '',
      adminRoomTopic: process.env[EnvironmentVariables.ADMINROOM_ADMINROOMTOPIC] || '',
    },
    autoQa: {
      type: '',
    },
    wxOpenAi: {
      token: process.env[EnvironmentVariables.WXOPENAI_TOKEN] || '',
      encodingAesKey: process.env[EnvironmentVariables.WXOPENAI_ENCODINGAESKEY] || '',
    },
    chatGpt: {
      key: process.env[EnvironmentVariables.CHATGPT_KEY] || '',
      endpoint: process.env[EnvironmentVariables.CHATGPT_ENDPOINT] || '',
    },
    mqtt: {
      username: process.env[EnvironmentVariables.MQTT_USERNAME] || '',
      password: process.env[EnvironmentVariables.MQTT_PASSWORD] || '',
      endpoint: process.env[EnvironmentVariables.MQTT_ENDPOINT] || '',
      port: parseInt(process.env[EnvironmentVariables.MQTT_PORT] || '1883', 10),
    },
    webHook: {
      url: process.env[EnvironmentVariables.WEBHOOK_URL] || '',
      token: process.env[EnvironmentVariables.WEBHOOK_TOKEN] || '',
      username: process.env[EnvironmentVariables.WEBHOOK_USERNAME] || '',
      password: process.env[EnvironmentVariables.WEBHOOK_PASSWORD] || '',
    },
    yuQue: {
      token: process.env[EnvironmentVariables.YUQUE_TOKEN] || '',
      nameSpace: process.env[EnvironmentVariables.YUQUE_NAMESPACE] || '',
    },
  },
  apps: {
    riding: {
      config: {},
      isOpen: true,
    },
  },
  welcomeList: [],
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

// 配置机器人
function getBotOps (puppet: string, token: string) {
  const ops: any = {
    name: 'chatflow',
    puppet,
    puppetOptions: {
      token,
    },
  }

  if (puppet === 'wechaty-puppet-service') {
    process.env['WECHATY_PUPPET_SERVICE_NO_TLS_INSECURE_CLIENT'] = 'true'
  }

  if ([ 'wechaty-puppet-wechat4u', 'wechaty-puppet-xp', 'wechaty-puppet-engine' ].includes(puppet)) {
    delete ops.puppetOptions.token
  }

  if (puppet === 'wechaty-puppet-wechat') {
    delete ops.puppetOptions.token
    ops.puppetOptions.uos = true
  }
  return ops
}

// 消息发布器
export const sendMsg = async (publisher: Message | Room | Contact, sayable: Sayable, messageService: { onMessage: (arg0: Message) => any }, inviteeList?: Contact[]) => {
  try {
    let replyMessage: Message | void
    if (inviteeList?.length) {
      const text = sayable as string
      replyMessage = await (publisher as Room).say(text, ...inviteeList)
    } else {
      replyMessage = await publisher.say(sayable)
    }
    if (replyMessage) {
      await messageService.onMessage(replyMessage)
    }
  } catch (e) {
    log.error('消息发送失败:', publisher, sayable, e)
  }
}

// 保存配置文件到data/config.json
export function updateConfig (config: any) {
  fs.writeFileSync('data/config.json', JSON.stringify(config, null, '\t'))
  // log.info('配置有变更, updateConfig:', JSON.stringify(config))
}

export { config, getBotOps }
