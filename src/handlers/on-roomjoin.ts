import { Contact, Room, log } from 'wechaty'
import { ChatFlowCore } from '../api/base-config.js'
import { logger } from '../utils/utils.js'
/**
 * 群中有新人进入
 */
async function onRoomjoin (room: Room, inviteeList: Contact[], inviter: Contact) {
  log.info('有新人进入群聊...')
  const welcomeList = ChatFlowCore.welcomeList
  const welcomeRoom = welcomeList.find((item) => item.id === room.id)

  // Check if Vika is OK and if the room is in the welcome list
  if (welcomeRoom && welcomeRoom.state === '开启' && welcomeRoom.text) {
    const roomTopic = await room.topic()
    const nameList = inviteeList.map(c => c.name()).join(',')
    const inviterName = inviter.name()
    log.info(`新人进群: Room "${roomTopic}" got new members "${nameList}", invited by "${inviterName}"`)
    logger.info(`新人进群: Room "${roomTopic}" got new members "${nameList}", invited by "${inviterName}"`)
    // Send a welcome message only if there are invitees
    if (inviteeList.length > 0) {
      const welcomeMessage = `欢迎加入${roomTopic}, ${welcomeRoom.text}~`
      // await sendMsg(room, welcomeMessage, (ChatFlowCore.services as Services).messageService, inviteeList)
      await room.say(welcomeMessage, ...inviteeList)
    }
  }
}
export default onRoomjoin
