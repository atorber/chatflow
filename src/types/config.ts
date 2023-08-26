import type { BusinessRoom, BusinessUser } from '../plugins/finder'

type AIType = 'WxOpenai' | string;

interface RoomWhiteList{
  qa:BusinessRoom[]
  msg:BusinessRoom[]
  act:BusinessRoom[] 
}

interface ContactWhiteList{
qa:BusinessUser[]
msg:BusinessUser[]
act:BusinessUser[] 
}

interface SysConfig {
  adminRoomTopic: string;
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

interface BotInfo {
  alias: string;
  avatar: string;
  city: string;
  friend: boolean;
  gender: number;
  id: string;
  name: string;
  phone: any[];
  province: string;
  signature: string;
  type: number;
  weixin: string;
}

interface AutoQa {
  autoReply: boolean;
  atReply: boolean;
  customReply: boolean;
  roomWhitelist: boolean;
  contactWhitelist: boolean;
}

interface Vika {
  useVika: boolean;
  uploadMessageToVika: boolean;
  autoMaticCloud: boolean;
}

interface WebHook {
  webhookMessagePush: boolean;
}

interface Mqtt {
  mqttMessagePush: boolean;
  mqttControl: boolean;
}

interface Im {
  imChat: boolean;
}

interface FunctionOnStatus {
  autoQa: AutoQa;
  vika: Vika;
  webHook: WebHook;
  mqtt: Mqtt;
  im: Im;
}

interface WechatyConfig {
  puppet: string;
  token: string | '';
}

interface VikaConfig {
  spaceName?: string;
  token: string;
}

interface AdminRoomConfig {
  adminRoomId: string;
  adminRoomTopic: string;
}

interface AutoQaConfig {
  type?: string;
}

interface WxOpenAiConfig {
  token: string;
  encodingAesKey: string;
}

interface ChatGptConfig {
  key?: string;
  endpoint?: string;
}

interface MqttConfig {
  username?: string;
  password?: string;
  endpoint?: string;
  port: number;
}

interface WebHookConfig {
  url?: string;
  token?: string;
  username?: string;
  password?: string;
}

interface YuQueConfig {
  token?: string;
  nameSpace?: string;
}

interface RidingAppConfig {
  config: any;
  isOpen: boolean;
}

interface AppsConfig {
  riding: RidingAppConfig;
}

interface BaseConfig {
  [key: string]: string | undefined;
}

interface BotConfig {
  base?: BaseConfig;
  wechaty: WechatyConfig;
  vika: VikaConfig;
  adminRoom: AdminRoomConfig;
  autoQa: AutoQaConfig;
  wxOpenAi: WxOpenAiConfig;
  chatGpt: ChatGptConfig;
  mqtt: MqttConfig;
  webHook: WebHookConfig;
  yuQue: YuQueConfig;
}

interface ContactAppsConfig {
  qa: RidingAppConfig;
  riding: RidingAppConfig;
}

interface ContactConfig {
  [key: string]: {
    app: string;
    apps: ContactAppsConfig;
  };
}

interface RoomAppsConfig {
  qa: RidingAppConfig;
  riding: RidingAppConfig;
  riding2: RidingAppConfig;
}

interface RoomConfig {
  [key: string]: {
    app: string;
    apps: RoomAppsConfig;
  };
}

interface Config {
  botInfo: BotInfo | {};
  functionOnStatus: FunctionOnStatus;
  botConfig: BotConfig;
  welcomeList?: string[];
  roomWhiteList: RoomWhiteList;
  contactWhiteList: ContactWhiteList;
  contactConfig: ContactConfig;
  roomConfig: RoomConfig;
  apps?: AppsConfig;
}

export type {
  VikaConfig,
  BotInfo,
  BotConfig,
  ContactConfig,
  RoomConfig,
  SysConfig,
  Config,
  RoomWhiteList,
  ContactWhiteList
}
