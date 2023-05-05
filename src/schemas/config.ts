type AppConfig = {
    config: Record<string, any>;
    isOpen: boolean;
  };

  type AppConfigs = {
    [appName: string]: AppConfig;
  };

  type BotConfig = {
    adminRoomId: string;
    adminRoomTopic: string;
    apps: AppConfigs;
    bot: {
      puppet: string;
      token: string;
      VIKA_TOKEN?: string
      VIKA_SPACENAME?: string
      [key : string]:any
    };
    command: {
      contact: Record<string, any>;
      room: Record<string, any>;
      bot: Record<string, any>;
    };
  };

  type ContactConfig = {
    [contactId: string]: {
      app: string;
      apps: AppConfigs;
    };
  };

  type RoomConfig = {
    [roomId: string]: {
      app: string;
      apps: AppConfigs;
    };
  };

  type Config = {
    botConfig: BotConfig;
    contactConfig: ContactConfig;
    roomConfig: RoomConfig;
  };

  type AIType = 'WxOpenai' | string;

interface SysConfig {
  adminRoomTopic:string
  welcomeList: string[];
  roomWhiteList: string[];
  contactWhiteList: string[];
  puppetName: string;
  puppetToken: string;
  aiType: AIType;
  WX_TOKEN: string;
  EncodingAESKey: string;
  ChatGPTAEmail: string;
  ChatGPTAPassword: string;
  ChatGPTASessionToken: string;
  mqttUsername: string;
  mqttPassword: string;
  mqttEndpoint: string;
  mqttPort: string;
  WEB_HOOK: string;
  WX_OPENAI_ONOFF: boolean;
  AT_AHEAD: boolean;
  DIFF_REPLY_ONOFF: boolean;
  roomWhiteListOpen: boolean;
  contactWhiteListOpen: boolean;
  VIKA_ONOFF: boolean;
  WEB_HOOK_ONOFF: boolean;
  mqtt_PUB_ONOFF: boolean;
  mqtt_SUB_ONOFF: boolean;
  imOpen: boolean;
}

export {
  type AppConfig,
  type AppConfigs,
  type BotConfig,
  type ContactConfig,
  type RoomConfig,
  type Config,
  type SysConfig,
}
