/* eslint-disable no-console */
/*!
 * Brolog JavaScript Library v1.1.0
 * https://github.com/huan/brolog
 *
 * Copyright Huan LI <zixia@zixia.net>
 * Released under the ISC license
 * https://github.com/huan/brolog/blob/master/LICENSE
 *
 * Date: 2016-07
 */
import {
  VERSION,
  BROLOG_LEVEL,
  BROLOG_PREFIX,
}                 from './config.js'

import type {
  Loggable,
}                 from './logger.js'

type LogLevelTitle =
  | 'ERR'
  | 'WARN'
  | 'INFO'
  | 'VERB'
  | 'SILL'

type TextPrinterFunction = (title: string, text?: string) => void

enum LogLevel {
  silent  = 0,
  error   = 1,
  warn    = 2,
  info    = 3,
  verbose = 4,
  silly   = 5,
}

type LogLevelName = keyof typeof LogLevel

class Brolog implements Loggable {

  private static globalInstance?  : Brolog
  private static globalLogLevelName: LogLevelName     = 'info'
  private static globalPrefix      : string | RegExp  = /.*/  // Match all by default

  private enableTimestamp = true
  private logLevel:     LogLevel
  private prefixFilter?: RegExp

  public textPrinter: (levelTitle: LogLevelTitle, text: string) => void

  constructor () {
    this.level(Brolog.globalLogLevelName)
    this.logLevel = LogLevel[this.level()]

    this.prefix(Brolog.globalPrefix)
    this.prefixFilter = this.prefix()

    this.textPrinter = this.defaultTextPrinter
  }

  /**
   * Create a global Brolog Instance for sharing between modules
   */
  public static instance (
    levelName?: LogLevelName,
    prefix?:    string | RegExp,
  ): Brolog {
    if (!this.globalInstance) {
      this.globalInstance = new Brolog()
    }

    if (levelName) {
      this.globalLogLevelName = levelName
      this.globalInstance.level(levelName)
    }
    if (prefix) {
      this.globalPrefix = prefix
      this.globalInstance.prefix(prefix)
    }

    return this.globalInstance
  }

  public static version (): string {
    return VERSION
  }

  public version (): string {
    return Brolog.version()
  }

  public static enableLogging (printerFunc: boolean | TextPrinterFunction): Brolog {
    return Brolog.instance().enableLogging(printerFunc)
  }

  public enableLogging (printerFunc: boolean | TextPrinterFunction): Brolog {
    this.verbose('Brolog', 'enableLogging(%s)', printerFunc)

    // const loggerMethodList = [
    //   'error',
    //   'warn',
    //   'info',
    //   'verbose',
    //   'silly',
    // ]

    if (printerFunc === false) {
      this.silly('Brolog', 'enableLogging() disabled')
      // loggerMethodList.forEach(m => {
      //   this[m] =  nullLogger[m]
      // })
      this.textPrinter = function () { /* null logger */ }

    } else if (printerFunc === true) {
      this.silly('Brolog', 'enableLogging() enabled: restore Brolog instance')
      // const restore = new Brolog()
      // loggerMethodList.forEach(m => {
      //   this[m] = restore[m]
      // })
      this.textPrinter = this.defaultTextPrinter

      // } else if (typeof log.verbose === 'function') {
      //   this.silly('Brolog', 'enableLogging() enabled: using provided logger')
      //   for (const method of loggerMethodList) {
      //     this[method] = () => {
      //       // In order to compatible with winston,
      //       // we need to change the args from
      //       // brolog.info('Main', 'Hello %s', 'world')
      //       // to
      //       // log.info('Main Hello %s', 'world')
      //       const argList: string[] = Array.from(arguments)
      //       if (argList.length > 1) {
      //         const module = argList.shift()
      //         argList[0] = `${module} ` + argList[0]
      //       }
      //       return Reflect.apply(log[method], log, argList)
      //     }
      //   }

    } else if (typeof printerFunc === 'function') {
      this.silly('Brolog', 'enableLogging() enabled: using provided log function')
      this.textPrinter = function (levelTitle: LogLevelTitle, text: string): void {
        printerFunc(levelTitle, text)
      }
    } else {
      throw new Error('got invalid logger')
    }

    return this
  }

  public static prefix (): RegExp
  public static prefix (filter: string | RegExp): void

  public static prefix (filter?: string | RegExp): void | RegExp {
    if (filter) {
      this.globalPrefix = filter
      this.globalInstance?.prefix(filter)
    } else {
      return this.instance().prefix()
    }
  }

  public prefix (): RegExp
  public prefix (filter: string | RegExp): void
  public prefix (filter?: string | RegExp): void | RegExp {
    if (filter) {
      if (typeof filter === 'string') {
        this.prefixFilter = new RegExp('^' + filter + '$')
      } else if (filter instanceof RegExp) {
        this.prefixFilter = filter
      } else {
        throw new Error('unsupported prefix filter')
      }
    } else {
      return this.prefixFilter
    }
  }

  public static level (levelName?: LogLevelName): LogLevelName {
    if (levelName) {
      this.globalLogLevelName = levelName
    }
    return this.instance().level(levelName)
  }

  public level (levelName?: LogLevelName) {
    if (levelName) {
      // console.log('levelName: ' + levelName)
      // http://stackoverflow.com/a/21294925/1123955
      // XXX: fix the any here?
      let logLevel = LogLevel[levelName.toLowerCase() as any] as any as (undefined | LogLevel)
      if (logLevel === undefined) { // be aware of number 0 here
        log.error('Brolog', 'level(%s) not exist, set to silly.', levelName)
        logLevel = LogLevel.silly
      }
      this.logLevel = logLevel
    }
    return LogLevel[this.logLevel] as LogLevelName
  }

  private log (levelTitle: LogLevelTitle, prefix: string, message: string) {
    if (this.prefixFilter && !this.prefixFilter.test(prefix)) {
      return  // skip message not match prefix filter
    }

    const args = Array.prototype.slice.call(arguments, 3)
    args.unshift(this.timestamp() + levelTitle + ' ' + prefix + ' ' + (message || ''))
    // const args = Array.from(arguments) || []
    // args[0] = this.timestamp() + args[0]

    const text = Reflect.apply(sprintf, null, args)
    this.textPrinter(levelTitle, text)
  }

  public defaultTextPrinter (levelTitle: LogLevelTitle, text: string): void {
    // Use Reflect at:
    // https://www.keithcirkel.co.uk/metaprogramming-in-es6-part-2-reflect/
    switch (levelTitle) {
      case 'ERR':
        // console.error.apply(console, args)
        // Reflect.apply(console.error, console, args)
        console.error(text)
        break
      case 'WARN':
        // console.warn.apply(console, args)
        // Reflect.apply(console.warn, console, args)
        console.warn(text)
        break
      case 'INFO':
        // console.info.apply(console, args)
        // Reflect.apply(console.info, console, args)
        console.info(text)
        break

      // eslint-disable-next-line default-case-last
      default:
      case 'VERB':
      case 'SILL':
        // console.log.apply(console, args)
        // Reflect.apply(console.log, console, args)
        console.log(text)
    }

  }

  public static error (prefix: string, ...args: any[]): void {
    const instance = Brolog.instance()
    // return instance.error.apply(instance, arguments)
    return Reflect.apply(instance.error, instance, ([] as any).concat(prefix, args))
  }

  public error (prefix: string, ...args: any[]): void {
    if (this.logLevel < LogLevel.error) {
      return
    }
    const argList = Array.from([prefix, ...args])
    argList.unshift('ERR')
    return Reflect.apply(this.log, this, argList)
  }

  public static warn (prefix: string, ...args: any[]): void {
    const instance = Brolog.instance()
    return Reflect.apply(instance.warn, instance, ([] as any).concat(prefix, args))
  }

  public warn (prefix: string, ...args: any[]): void {
    if (this.logLevel < LogLevel.warn) {
      return
    }
    const argList = Array.from([prefix, ...args])
    argList.unshift('WARN')
    return Reflect.apply(this.log, this, argList)
  }

  public static info (prefix: string, ...args: any[]): void {
    const instance = Brolog.instance()
    return Reflect.apply(instance.info, instance, ([] as any).concat(prefix, args))
  }

  public info (prefix: string, ...args: any[]): void {
    if (this.logLevel < LogLevel.info) {
      return
    }
    const argList = Array.from([prefix, ...args])
    argList.unshift('INFO')
    return Reflect.apply(this.log, this, argList)
  }

  public static verbose (prefix: string, ...args: any[]): void {
    const instance = Brolog.instance()
    return Reflect.apply(instance.verbose, instance, ([] as any).concat(prefix, args))
  }

  public verbose (prefix: string, ...args: any[]): void {
    if (this.logLevel < LogLevel.verbose) {
      return
    }

    const argList = Array.from([prefix, ...args])
    argList.unshift('VERB')
    return Reflect.apply(this.log, this, argList)
  }

  public static silly (prefix: string, ...args: any[]): void {
    const instance = Brolog.instance()
    return Reflect.apply(instance.silly, instance, ([] as any).concat(prefix, args))
  }

  public silly (prefix: string, ...args: any[]): void {
    if (this.logLevel < LogLevel.silly) {
      return
    }
    const argList = Array.from([prefix, ...args])
    argList.unshift('SILL')
    return Reflect.apply(this.log, this, argList)
  }

  public timestamp (enable: boolean): void
  public timestamp (): string

  public timestamp (enable?: boolean): string | void {
    if (typeof enable === 'boolean') {
      this.enableTimestamp = enable
      return
    }

    if (!this.enableTimestamp) {
      return ''
    }

    const date  = new Date()
    const hour    = date.getHours()
    const min     = date.getMinutes()
    const sec     = date.getSeconds()

    let stampStr = ''

    stampStr += (hour < 10) ? ('0' + hour)  : hour
    stampStr += ':'
    stampStr += (min < 10)  ? ('0' + min)   : min
    stampStr += ':'
    stampStr += (sec < 10)  ? ('0' + sec)   : sec

    return stampStr + ' '
  }

}

// Credit: https://stackoverflow.com/a/4795914/1123955
function sprintf () {
  const args = arguments
  const text = args[0] as string
  let i = 1
  return text.replace(/%((%)|s|d)/g, function (m) {
    // m is the matched format, e.g. %s, %d
    let val = null as any
    if (m[2]) {
      val = m[2]
    } else {
      val = args[i]
      // A switch statement so that the formatter can be extended. Default is %s
      switch (m) {
        case '%d':
          val = Number(val)
          /**
           * Huan(202111): use Number() to replace parseFloat,
           *  and keep the `NaN` as a result for easy debugging
           *  when we use `%d` mistakenly when `%s` should be expected.
           */
          // val = parseFloat(val)
          // if (isNaN(val)) {
          //   val = 0
          // }
          break
      }
      i++
    }
    return val
  })
}

export {
  VERSION,
}

const log = Brolog.instance()

if (BROLOG_LEVEL) {
  /**
   * set logLevel from:
   * 1. process.env['BROLOG_LEVEL'], or
   * 2. in URL: `?BROLOG_LEVEL=verbose&...`
   */
  if (BROLOG_LEVEL === '*') {
    log.level('silly')
  } else {
    log.level(BROLOG_LEVEL as any)
  }
}

if (BROLOG_PREFIX && BROLOG_PREFIX !== '*') {
  log.prefix(BROLOG_PREFIX)
}

export type {
  LogLevelTitle,
  Loggable,
  LogLevelName,
}
export {
  LogLevel,
  Brolog,
  log,
}
