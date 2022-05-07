import { nop } from '@pipeletteio/nop'

interface Logger {
  error   (moduleName: string, message: string, ...args: any[]): void
  warn    (moduleName: string, message: string, ...args: any[]): void
  info    (moduleName: string, message: string, ...args: any[]): void
  verbose (moduleName: string, message: string, ...args: any[]): void
  silly   (moduleName: string, message: string, ...args: any[]): void
}

const getLogger = (logger?: Logger): Logger => {
  if (logger) {
    return logger
  }

  return {
    error   : nop,
    info    : nop,
    silly   : nop,
    verbose : nop,
    warn    : nop,
  }
}

export type {
  Logger as Loggable, // @deprecated: use Logger instead. will be removed after Dec 31, 2022
  Logger,
}
export {
  getLogger as getLoggable, // @deprecated: use getLogger instead. will be removed after Dec 31, 2022
  getLogger,
}
