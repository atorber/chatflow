import { ProcessEnv as MyProcessEnv } from './types/mod.js'

declare global {
  namespace NodeJS {
    interface ProcessEnv extends MyProcessEnv {}
  }
}
