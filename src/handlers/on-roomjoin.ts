import { Contact, Room, log } from 'wechaty'

const welcomeList:any[] = []
/**
 * 群中有新人进入
 */
async function onRoomjoin (room: Room, inviteeList: Contact[], inviter: Contact) {
  const roomTopic = await room.topic()
  const nameList = inviteeList.map(c => c.name()).join(',')
  const inviterName = inviter.name()

  log.info(`Room Join: Room "${roomTopic}" got new members "${nameList}", invited by "${inviterName}"`)

  // Check if Vika is OK and if the room is in the welcome list
  if (welcomeList.includes(room.id)) {
    // Send a welcome message only if there are invitees
    if (inviteeList.length > 0) {
      const welcomeMessage = `欢迎加入${roomTopic}, 请阅读群公告~`
      // await sendMsg(room, welcomeMessage, (chatflowConfig.services as Services).messageService, inviteeList)
      await room.say(welcomeMessage)
    }
  }
}
export default onRoomjoin
