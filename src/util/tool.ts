import moment from 'moment'

import type {
    Contact,
    Room,
    // ScanStatus,
    // WechatyBuilder,
} from 'wechaty'


async function storeSentMessage(text: string, talker?: Contact, room?: Room) {
    const curTime = new Date().getTime()
    const timeHms = moment(curTime).format('YYYY-MM-DD HH:mm:ss')
    const record = {
        fields: {
            timeHms,
            name: 'botSelf',
            topic: room ? (await room?.topic() || '--') : (talker?.name() || '--'),
            messagePayload: text,
            wxid: talker?.id !== 'null' ? talker?.id : '--',
            roomid:  room ? (room?.id || '--') : (talker?.id || '--'),
            messageType: 'selfSent',
        },
    }

    global.sentMessage.push(record)
}

// 定义一个延时方法
const waitForMs = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))



export {
    waitForMs,
    storeSentMessage
}

export default waitForMs
