import type {
  BotConfig,
  BotInfo,
  ContactConfig,
  RoomConfig,
  Config,
  SysConfig,
  BiTableConfig,
  ContactWhiteList,
  RoomWhiteList,
} from './config.js'
import type { ChatMessage } from './interface.js'

export { EnvironmentVariables } from './env.js'
export type { ProcessEnv } from './env.js'

export * as configTypes from './config.js'

export {
  type BiTableConfig,
  type BotInfo,
  type BotConfig,
  type ContactConfig,
  type RoomConfig,
  type Config,
  type SysConfig,
  ContactWhiteList,
  RoomWhiteList,
  type ChatMessage,
}
