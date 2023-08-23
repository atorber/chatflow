/* eslint-disable sort-keys */
import type { configTypes } from '../types/mod.js'
import { EnvironmentVariables } from '../types/mod.js'

const config: configTypes.Config = {
  botInfo: {},
  functionOnStatus: {
    autoQa: {
      autoReply: process.env[EnvironmentVariables.AUTOQA_AUTOREPLY] === 'true',
      atReply: process.env[EnvironmentVariables.AUTOQA_ATREPLY] === 'true',
      customReply: process.env[EnvironmentVariables.AUTOQA_CUSTOMREPLY] === 'true',
      roomWhitelist: process.env[EnvironmentVariables.AUTOQA_ROOMWHITELIST] === 'true' || true,
      contactWhitelist: process.env[EnvironmentVariables.AUTOQA_CONTACTWHITELIST] === 'true' || true,
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
      type: process.env[EnvironmentVariables.AUTOQA_TYPE] || '',
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

export { config }
