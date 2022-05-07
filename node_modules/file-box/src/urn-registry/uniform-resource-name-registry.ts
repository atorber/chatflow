/**
 * Huan(202110): Assignment and Resolution of Uniform Resource Names
 *  https://datatracker.ietf.org/wg/urn/about/
 */

/**
 * RFC 4122: A Universally Unique IDentifier (UUID) URN Namespace
 *  ------------------------------------------------------------
 *  This specification defines a Uniform Resource Name namespace for
 *  UUIDs (Universally Unique IDentifier), also known as GUIDs (Globally
 *  Unique IDentifier).  A UUID is 128 bits long, and can guarantee
 *  uniqueness across space and time.  UUIDs were originally used in the
 *  Apollo Network Computing System and later in the Open Software
 *  Foundation's (OSF) Distributed Computing Environment (DCE), and then
 *  in Microsoft Windows platforms.
 *
 *  The information here is meant to be a concise guide for those wishing
 *  to implement services using UUIDs as URNs.  Nothing in this document
 *  should be construed to override the DCE standards that defined UUIDs.
 */

/**
 * RFC 2141: Uniform Resource Names (URNs) Syntax
 * ----------------------------------------------
 *  Uniform Resource Names (URNs) are intended to serve as persistent,
 *  location-independent, resource identifiers. This document sets
 *  forward the canonical syntax for URNs.  A discussion of both existing
 *  legacy and new namespaces and requirements for URN presentation and
 *  transmission are presented.  Finally, there is a discussion of URN
 *  equivalence and how to determine it.
 */
import fs     from 'fs'
import os     from 'os'
import path   from 'path'

import type { Readable } from 'stream'

import { instanceToClass }  from 'clone-class'
import { log }              from 'brolog'

import {
  FileBox,
}                         from '../file-box.js'

import {
  randomUuid,
}               from './random-uuid.js'

/**
 * A UUID will be only keep for a certain time.
 */
const DEFAULT_UUID_EXPIRE_MINUTES         = 30
const DEFAULT_UUID_PURGE_INTERVAL_MINUTES = 1

interface UniformResourceNameRegistryOptions {
  expireMilliseconds? : number,
  storeDir?           : string,
}

class UniformResourceNameRegistry {

  protected static processExitMap = new WeakMap<
    UniformResourceNameRegistry,
    Function
  >()

  /**
   * The directory that store all UUID files
   */
  protected storeDir: string

  protected expireMilliseconds: number

  /**
   * Key: expiretime
   * Value: the array of UUID that will expires after the `expiretime` (Key)
   */
  protected uuidExpiringTable: Map<
    number,
    string[]
  >

  protected purgerTimer?: ReturnType<typeof setInterval>

  constructor (
    options: UniformResourceNameRegistryOptions = {},
  ) {
    log.verbose('UniformResourceNameRegistry', 'constructor("%s")', JSON.stringify(options))

    this.uuidExpiringTable = new Map()

    this.expireMilliseconds = options.expireMilliseconds ?? (DEFAULT_UUID_EXPIRE_MINUTES * 60 * 1000 * 1000)
    this.storeDir = options.storeDir || path.join(
      os.tmpdir(),
      'file-box-urn-registry.' + String(process.pid),
    )
  }

  /**
   * Return a FileBox Interface with the current URN Registry for conience
   */
  getFileBox (): typeof FileBox {
    this.init()

    class UUIDFileBox extends FileBox {}
    UUIDFileBox.setUuidLoader(this.load.bind(this))
    UUIDFileBox.setUuidSaver(this.save.bind(this))
    return UUIDFileBox
  }

  /**
   * init the UUID registry
   *
   * must be called before use.
   */
  init () {
    log.verbose('UniformResourceNameRegistry', 'init()')

    try {
      const stat = fs.statSync(this.storeDir)
      if (!stat.isDirectory()) {
        throw new Error(this.storeDir + ' is Not a directory')
      }
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
        fs.mkdirSync(this.storeDir, { recursive: true })
      } else {
        throw e
      }
    }

    if (!this.purgerTimer) {
      this.addProcessExitListener()

      this.purgerTimer = setInterval(
        () => this.purgeExpiredUuid(),
        DEFAULT_UUID_PURGE_INTERVAL_MINUTES * 60 * 1000,
      )
    }

  }

  protected purgeExpiredUuid () {
    log.verbose('UniformResourceNameRegistry', 'purgeExpiredUuid()')
    const expireTimeList = [...this.uuidExpiringTable.keys()]
      .sort((a, b) => Number(a) - Number(b))

    for (const expireTime of expireTimeList) {
      if (Date.now() < expireTime) {
        // The earliest expire time is in the future
        break
      }

      const uuidList = this.uuidExpiringTable.get(expireTime) || []
      this.uuidExpiringTable.delete(expireTime)

      for (const uuid of uuidList) {
        this.purge(uuid).catch(console.error)
      }
    }
  }

  /**
   * Clean up by calling this.destroy() before process exit
   */
  protected addProcessExitListener () {
    log.verbose('UniformResourceNameRegistry', 'addProcessExitListener()')

    const Klass = instanceToClass(this, UniformResourceNameRegistry)

    /**
     * If we have already registered the listener, do nothing.
     */
    if (Klass.processExitMap.has(this)) {
      return
    }

    const destroyCallback = () => this.destroy()

    process.addListener('exit', destroyCallback)
    Klass.processExitMap.set(
      this,
      () => process.removeListener('exit', destroyCallback),
    )
  }

  protected uuidFileName (uuid: string): string {
    return path.join(
      this.storeDir,
      uuid + '.dat',
    )
  }

  /**
   * @deprecated use `load()` instead
   */
  async resolve (uuid: string): Promise<Readable> {
    log.warn('UniformResourceNameRegistry', 'resolve() is deprecated: use `load()` instead.\n%s', new Error().stack)
    return this.load(uuid)
  }

  /**
   * `resolve()` can only be used once.
   *  after resolve(), the UUID will be not exist any more
   */
  async load (uuid: string): Promise<Readable> {
    log.verbose('UniformResourceNameRegistry', 'load(%s)', uuid)

    const filename  = this.uuidFileName(uuid)
    const stream    = fs.createReadStream(filename)

    await new Promise<void>((resolve, reject) => {
      stream.on('ready', resolve)
      stream.on('error', reject)
    })

    return stream
  }

  /**
   * @deprecated use `save()` instead
   */
  async register (stream: Readable): Promise<string> {
    log.verbose('UniformResourceNameRegistry', 'register() deprecated: use save() instead.\n%s', new Error().stack)
    return this.save(stream)
  }

  /**
   * Save the `Readable` stream and return a random UUID
   *  The UUID will be expired after MAX_KEEP_MINUTES
   */
  async save (stream: Readable): Promise<string> {
    log.verbose('UniformResourceNameRegistry', 'save(stream)')

    const uuid = randomUuid()

    const fileStream = fs.createWriteStream(this.uuidFileName(uuid))
    const future = new Promise<void>((resolve, reject) => {
      stream.on('end',        resolve)
      stream.on('error',      reject)
      fileStream.on('error',  reject)
    })
    stream.pipe(fileStream)
    await future

    this.addToExpiringTable(uuid)

    return uuid
  }

  /**
   * Set a timer to execute delete callback after `expireMilliseconds`
   */
  protected addToExpiringTable (uuid: string): void {
    log.verbose('UniformResourceNameRegistry', 'addToExpiringTable(%s)', uuid)

    const expireTime         = Date.now() + this.expireMilliseconds
    const expireTimeInterval = DEFAULT_UUID_PURGE_INTERVAL_MINUTES * 60 * 1000

    // https://stackoverflow.com/a/22687090
    const expireTimeNearestMinute = Math.ceil(expireTime / expireTimeInterval) * expireTimeInterval

    const uuidList = this.uuidExpiringTable.get(expireTime) || []
    uuidList.push(uuid)
    this.uuidExpiringTable.set(expireTimeNearestMinute, uuidList)

    log.silly('UniformResourceNameRegistry', 'addToExpiringTable() uuidList.length = %s, expireTime = %s',
      uuidList.length,
      expireTimeNearestMinute,
    )
  }

  protected async purge (uuid: string): Promise<void> {
    log.verbose('UniformResourceNameRegistry', 'purge(%s)', uuid)

    const file = this.uuidFileName(uuid)
    try {
      await fs.promises.unlink(file)
      log.silly('UniformResourceNameRegistry', 'purge() %s', file)
    } catch (e) {
      log.warn('UniformResourceNameRegistry', 'purge() rejection:', (e as Error).message)
    }
  }

  /**
   * destroy the urn registry.
   *
   * This function will be called automatically at `process.on(exit)`
   * however, it till need to be called before the program ends
   *  because there have some timers in eventloop task list
   */
  destroy () {
    log.verbose('UniformResourceNameRegistry', 'destroy() %s UUIDs left',
      [...this.uuidExpiringTable.values()].flat().length,
    )

    if (this.purgerTimer) {
      log.verbose('UniformResourceNameRegistry', 'destroy() clearing purger timer ...')
      clearInterval(this.purgerTimer)
      this.purgerTimer = undefined
    }

    const Klass = instanceToClass(this, UniformResourceNameRegistry)

    /**
     * Remove process exit listener
     */
    if (Klass.processExitMap.has(this)) {
      log.verbose('UniformResourceNameRegistry', 'destroy() remove process `exit` listener ...')
      const fn = Klass.processExitMap.get(this)
      Klass.processExitMap.delete(this)
      fn && fn()
    }

    /**
     * Clean up all the files
     */
    log.verbose('UniformResourceNameRegistry', 'destroy() fs.rmSync(%s) ...', this.storeDir)
    try {
      /**
       * Huan(202110):
       *  Check for the `this.uuidDir` exist or not
       *    when we are running unit tests, we might instanciate multiple UniformResourceNameRegistry
       *    which will cause the `this.destroy()` to be registered multiple times
       */
      fs.statSync(this.storeDir)

      fs.rmSync(this.storeDir, { recursive: true })
      log.verbose('UniformResourceNameRegistry', 'destroy() fs.rmSync(%s) done', this.storeDir)

    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
        log.verbose('UniformResourceNameRegistry', 'destroy() %s not exist', this.storeDir)
        return
      }
      log.warn('UniformResourceNameRegistry', 'destroy() fs.rmSync(%s) exception: %s', (e as Error).message)
    }
  }

}

export { UniformResourceNameRegistry }
