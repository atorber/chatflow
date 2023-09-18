/* eslint-disable sort-keys */
import type { Message, Wechaty } from 'wechaty'
import type { ProcessEnv } from './env'

export interface Plugin {
    init(app: any): void;
    enable(app: any): void;
    disable(app: any): void;
  }

enum PluginType {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}

export interface PluginConfig {
  name: string;
  active: boolean;
  type: PluginType;
  room?: any;
  contact?: any;
  params?:any;
}

export interface WechatyApp {
  (bot: Wechaty, config: ProcessEnv, message: Message): void;
}

interface ChatTalker {
  name: string;
  id: string;
  alias?:string;
}

interface ChatRoom {
  topic?: string;
  id?: string;
}

interface ChatListener {
  id?: string;
  name?: string;
  alias?:string;
}

export interface ChatMessage {
  id:string;
  text: string;
  type: number;
  talker: ChatTalker;
  room: ChatRoom;
  listener: ChatListener;
}
