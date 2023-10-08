/* eslint-disable sort-keys */

import Datastore from 'nedb'
import { EventEmitter } from 'events'
import { log } from 'wechaty'

// BaseEntity class
abstract class BaseEntity<T extends { _id?: string }> {

  protected _id?: string
  protected static events = new EventEmitter()
  protected static datastore: Datastore

  constructor (props: T) {
    Object.assign(this, props)
  }

  public static setDatastore (ds: Datastore) {
    this.datastore = ds
  }

  public static on (event: string, listener: (...args: any[]) => void) {
    this.events.on(event, listener)
  }

  public static async findOne<T extends typeof BaseEntity> (
    this: T,
    query: object,
  ): Promise<InstanceType<T> | null> {
    return new Promise((resolve, reject) => {
      this.datastore.findOne(query, (err: any, doc: InstanceType<T>) => {
        if (err) reject(err)
        else resolve(doc as InstanceType<T>)
      })
    })
  }

  public static async find<T extends typeof BaseEntity> (
    this: T,
    query: object,
  ): Promise<InstanceType<T>[]> {
    return new Promise((resolve, reject) => {
      this.datastore.find(query, (err: any, docs: InstanceType<T>[]) => {
        if (err) reject(err)
        else resolve(docs as InstanceType<T>[])
      })
    })
  }

  public static async update<T extends typeof BaseEntity> (
    this: T,
    query: object,
    updateQuery: object,
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      this.datastore.update(
        query,
        updateQuery,
        {},
        (err: any, numReplaced: number | PromiseLike<number>) => {
          if (err) reject(err)
          else resolve(numReplaced)
        },
      )
    })
  }

  public static async remove<T extends typeof BaseEntity> (
    this: T,
    query: object,
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      this.datastore.remove(
        query,
        {},
        (err: any, numRemoved: number | PromiseLike<number>) => {
          if (err) reject(err)
          else resolve(numRemoved)
        },
      )
    })
  }

  public validate (): string[] {
    return []
  }

  public async save (): Promise<void> {
    const errors = this.validate()
    if (errors.length) {
      throw new Error(errors.join(', '))
    }

    if (this._id) {
      await (this.constructor as typeof BaseEntity).update(
        { _id: this._id },
        this,
      );
      (this.constructor as typeof BaseEntity).events.emit('updated', this)
    } else {
      const doc = await new Promise<any>((resolve, reject) => {
        (this.constructor as typeof BaseEntity).datastore.insert(
          this,
          (err: any, newDoc: any) => {
            if (err) reject(err)
            else resolve(newDoc)
          },
        )
      });

      (this.constructor as typeof BaseEntity).events.emit('created', this)
      this._id = doc._id
    }
  }

  public async delete (): Promise<void> {
    if (this._id) {
      await (this.constructor as typeof BaseEntity).remove({ _id: this._id });
      (this.constructor as typeof BaseEntity).events.emit('deleted', this)
    } else {
      throw new Error('Entity does not have an _id and cannot be deleted.')
    }
  }

}

// User model
interface UserProps {
  _id?: string;
  name: string;
  email: string;
}

class User extends BaseEntity<UserProps> {

  public name: string
  public email: string

  constructor (props: UserProps) {
    super(props)
    this.name = props.name
    this.email = props.email
  }

  public override validate (): string[] {
    const errors = []
    if (!this.name) errors.push('Name is required.')
    if (!this.email) errors.push('Email is required.')
    return errors
  }

}

const newUser = new User({
  name: 'Alice',
  email: 'alice@example.com',
})

// Initialization function to set up the datastore
function initDatabase (filename: string) {
  const userDB = new Datastore({ filename, autoload: true })
  User.setDatastore(userDB)
}

// Test usage
async function test () {
  initDatabase('user.db')

  User.on('created', (user: User) => {
    log.info('User created:', user)
  })

  try {
    await newUser.save()
    log.info('User saved!')
  } catch (error) {
    console.error('Error saving user:', error)
  }
}

await test()
