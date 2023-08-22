import { Wechaty, Room, Contact, log } from 'wechaty'

export type BusinessUser = {
    alias?: string;
    id?: string;
    name: string;
  };

// 优先级：好友ID、备注名称、昵称
export const getContact = async (bot:Wechaty, businessUser:BusinessUser) => {

  // 查找联系人
  let contact:Contact|undefined
  let contactList:Contact[]

  if (businessUser.id) {
    contact = await bot.Contact.find({ id:businessUser.id })
  } else if (businessUser.alias) {
    contact = await bot.Contact.find({ alias:businessUser.alias })
  } else {
    contactList = await bot.Contact.findAll({ name:businessUser.name })
    if (contactList.length > 0) {
      contact = contactList[0]
    } else {
      log.info('getContact:', '昵称没有匹配到好友')
    }
  }

  return contact
}

export const isThisContact = async (businessUser:BusinessUser, contact:Contact) => {
  // 判断联系人
  const alias = await contact.alias()
  if (businessUser.id && contact.id === businessUser.id) {
    return true
  } else if (businessUser.alias && (alias === businessUser.alias || contact.name() === businessUser.alias)) {
    return true
  } else {
    if (businessUser.name && contact.name() === businessUser.name) {
      return true
    } else {
      return false
    }
  }
}

export type BusinessRoom = {
    id?:string;
    luckyDog?:string;
    memberAlias?: string;
    topic: string;
  };

// 优先级：群ID、机器人昵称、指定好友、群名称
export const getRoom = async (bot:Wechaty, businessRoom:BusinessRoom) => {
  // 查找联系人
  let room:Room|undefined
  let roomList:Room[]

  if (businessRoom.id) {
    room = await bot.Room.find({ id:businessRoom.id })
  } else if (businessRoom.memberAlias) {
    roomList = await bot.Room.findAll({ topic:businessRoom.topic })
    if (roomList.length > 0) {
      for (const i in roomList) {
        const item = roomList[i]
        const memberAlias =  await item?.alias(bot.currentUser)
        if (memberAlias === businessRoom.memberAlias) {
          room = item
          break
        }
      }
    } else {
      log.info('getContact:', '昵称没有匹配到好友')
    }
  } else if (businessRoom.luckyDog) {
    roomList = await bot.Room.findAll({ topic:businessRoom.topic })
    if (roomList.length > 0) {
      for (const i in roomList) {
        const item = roomList[i]
        const member = await item?.member(businessRoom.luckyDog)
        if (member) {
          room = item
          break
        }
      }
    } else {
      log.info('getContact:', '昵称没有匹配到好友')
    }
  } else {
    room = await bot.Room.find({ topic:businessRoom.topic })
  }
  return room
}

export const isThisRoom = async (bot:Wechaty, businessRoom:BusinessRoom, room:Room) => {
  const topic = await room.topic()
  if (businessRoom.id && room.id === businessRoom.id) {
    return true
  } else if (businessRoom.memberAlias) {
    const memberAlias =  await room.alias(bot.currentUser)
    if (memberAlias === businessRoom.memberAlias) {
      return true
    } else {
      return false
    }
  }  else if (businessRoom.luckyDog) {
    const member = await room.member(businessRoom.luckyDog)
    if (member) {
      return true
    } else {
      return false
    }
  } else {
    if (topic === businessRoom.topic) {
      return true
    } else {
      return false
    }
  }
}
