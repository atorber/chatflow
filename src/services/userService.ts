// services/userService.ts

// import { User } from '../types';

// services/userService.ts
// import { User } from '../types';
import { Contact, Room, log } from 'wechaty'
import type { BusinessRoom, BusinessUser } from '../plugins/finder.js'

type User = {
    id:number
}

export class UserService {

  private users: User[]

  constructor () {
    this.users = []
  }

  public addUser (user: User): void {
    this.users.push(user)
  }

  public getUserById (id: number): User | undefined {
    return this.users.find(user => user.id === id)
  }

  public getUsers (): User[] {
    return this.users
  }

}

export async function containsContact (array: BusinessUser[], contact: Contact): Promise<boolean> {
  const alias = await contact.alias()
if(array.length){
  return array.some(item => {
    if (item.id && item.id === contact.id) {
      return true
    }

    if (!item.id && item.alias && item.alias === alias) {
      return true
    }

    return !item.id && !item.alias && item.name && item.name === contact.name()
  })
}else{
  return false
}
}

export async function containsRoom (array: BusinessRoom[], room: Room): Promise<boolean> {
  log.verbose('入参：', JSON.stringify(array), JSON.stringify(room))
  const topic = await room.topic()
  if(array.length){
    return array.some(item => {
      if (item.id && item.id === room.id) {
        return true
      }
      return item.topic && item.topic === topic
    })
  }else{
    return false
  }
}
