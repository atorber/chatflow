/* eslint-disable sort-keys */
import type {
  types as configTypes,
} from './mods/mod.js'

type Configs = {
  [key: string]: any;
}

// 配置文件，所有配置必须齐全，补充空白配置项，其他配置项可按需要修改
const configs:Configs = {
  VIKA_TOKEN: '替换成你的维格表token', // VIKA维格表token
  VIKA_SPACENAME: '替换成你的维格表空间', // VIKA维格表空间名称，修改为自己的空间名称
}

const botConfig:configTypes.BotConfig = {
  adminRoomId:'213411825721@chatroom',
  adminRoomTopic:'TODO',
  apps:{
    qa:{
      config:{
        key1:123,
        key2:'xxx',
      },
      isOpen:true,
    },
    riding:{
      config:{

      },
      isOpen:true,
    },
  },
  bot:{
    puppet:'',
    token:'',
  },
  command:{
    bot:{
      reboot:'#重启机器人',
      selfInfo:'#机器人信息',
    },
    contact:{
      findall:'#联系人列表',
    },
    room:{
      findall:'#群列表',
    },
  },
}

const roomConfig:configTypes.RoomConfig = {
  '213411825721@chatroom':{
    app:'waiting',
    apps:{
      qa:{
        config:{

        },
        isOpen:true,
      },
      riding:{
        config:{

        },
        isOpen:true,
      },
    },
  },
  '21341182572@chatroom':{
    app:'waiting',
    apps:{
      qa:{
        config:{

        },
        isOpen:true,
      },
      riding:{
        config:{

        },
        isOpen:true,
      },
      riding2:{
        config:{

        },
        isOpen:true,
      },
    },
  },
}

const contactConfig:configTypes.ContactConfig = {
  tyutluyc:{
    app:'waiting',
    apps:{
      qa:{
        config:{

        },
        isOpen:true,
      },
      riding:{
        config:{

        },
        isOpen:true,
      },
    },
  },
  tyutluyc2:{
    app:'waiting',
    apps:{
      qa:{
        config:{

        },
        isOpen:true,
      },
      riding:{
        config:{

        },
        isOpen:true,
      },
    },
  },
}

const config:configTypes.Config = {
  botConfig,
  contactConfig,
  roomConfig,
}

export { configs, config }
