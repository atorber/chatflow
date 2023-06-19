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

type BotInfo = {
  alias: string;
  avatar: string;
  city: string;
  friend: boolean;
  gender: number;
  id: string;
  name: string;
  phone: Array<any>;
  province: string;
  signature: string;
  type: number;
  weixin: string;
};

type AutoQa = {
  autoReply: boolean;
  atReply: boolean;
  customReply: boolean;
  roomWhitelist: boolean;
  contactWhitelist: boolean;
};

type Vika = {
  useVika: boolean;
  uploadMessageToVika: boolean;
  autoMaticCloud: boolean;
};

type WebHook = {
  webhookMessagePush: boolean;
};

type Mqtt = {
  mqttMessagePush: boolean;
  mqttControl: boolean;
};

type Im = {
  imChat: boolean;
};

type FunctionOnStatus = {
  autoQa: AutoQa;
  vika: Vika;
  webHook: WebHook;
  mqtt: Mqtt;
  im: Im;
};

type WechatyConfig = {
  puppet: string;
  token: string;
};

type VikaConfig = {
  spaceName: string|undefined;
  token: string|undefined;
};

type AdminRoomConfig = {
  adminRoomId: string;
  adminRoomTopic: string;
};

type AutoQaConfig = {
  type: string;
};

type WxOpenAiConfig = {
  token: string;
  encodingAesKey: string;
};

type ChatGptConfig = {
  key: string;
  endpoint: string;
};

type MqttConfig = {
  username: string;
  password: string;
  endpoint: string;
  port: number;
};

type WebHookConfig = {
  url: string;
  token: string;
  username: string;
  password: string;
};

type YuQueConfig = {
  token: string;
  nameSpace: string;
};

type RidingAppConfig = {
  config: any;
  isOpen: boolean;
};

type AppsConfig = {
  riding: RidingAppConfig;
};

type BotCommandConfig = {
  reboot: string;
  selfInfo: string;
};

type ContactCommandConfig = {
  findall: string;
};

type RoomCommandConfig = {
  findall: string;
};

type CommandConfig = {
  bot: BotCommandConfig;
  contact: ContactCommandConfig;
  room: RoomCommandConfig;
};

type BaseConfig = {
  [key: string]: string;
};

type BotConfig = {
  base?: BaseConfig,
  wechaty: WechatyConfig;
  vika: VikaConfig;
  adminRoom: AdminRoomConfig;
  autoQa: AutoQaConfig;
  wxOpenAi: WxOpenAiConfig;
  chatGpt: ChatGptConfig;
  mqtt: MqttConfig;
  webHook: WebHookConfig;
  yuQue: YuQueConfig;
};

type ContactAppsConfig = {
  qa: RidingAppConfig;
  riding: RidingAppConfig;
};

type ContactConfig = {
  [key: string]: {
    app: string;
    apps: ContactAppsConfig;
  };
};

type RoomAppsConfig = {
  qa: RidingAppConfig;
  riding: RidingAppConfig;
  riding2: RidingAppConfig;
};

type RoomConfig = {
  [key: string]: {
    app: string;
    apps: RoomAppsConfig;
  };
};

type Config = {
  botInfo: BotInfo;
  functionOnStatus: FunctionOnStatus;
  botConfig: BotConfig;
  welcomeList?: Array<string>;
  roomWhiteList: Array<string>;
  contactWhiteList: Array<string>;
  contactConfig: ContactConfig;
  roomConfig: RoomConfig;
  apps?: AppsConfig;
  command?: CommandConfig;
};

export {
  type VikaConfig,
  type BotInfo,
  type BotConfig,
  type ContactConfig,
  type RoomConfig,
  type SysConfig,
  type Config,
}
