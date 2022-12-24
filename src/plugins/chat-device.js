import mqtt from 'mqtt'
import { v4 } from 'uuid'
import { FileBox } from 'file-box'
import {
    // Contact, 
    log,
    // Message, ScanStatus, Wechaty, UrlLink, MiniProgram
} from "wechaty"
import * as PUPPET from 'wechaty-puppet'
import { wechaty2chatdev, propertyMessage, eventMessage } from './msg-format.js'

import {
    // waitForMs as wait,
    storeSentMessage
} from '../util/tool.js'

let chatbot
let chatdevice

class ChatDevice {
    constructor(username, password, endpoint, port, botId) {
        this.bot
        this.mqttclient = mqtt.connect(`mqtt://${endpoint}:${port || 1883}`, {
            username: username,
            password: password,
            clientId: v4()
        })
        this.isConnected = ''
        this.propertyApi = `thing/chatbot/${botId}/property/post`
        this.eventApi = `thing/chatbot/${botId}/event/post`
        this.commandApi = `thing/chatbot/${botId}/command/invoke`
    }

    init(bot) {
        chatbot = bot
        chatdevice = this
        this.bot = bot
        this.mqttclient.on('connect', function () {
            this.isConnected = true
            console.log('================================================\n\nMQTT连接成功~\n\n================================================\n')
        })
        this.mqttclient.on('reconnect', function (e) {
            console.log('subscriber on reconnect')
        })
        this.mqttclient.on('disconnect', function (e) {
            console.log('disconnect--------', e)
            this.isConnected = false
        })
        this.mqttclient.on('error', function (e) {
            console.debug('error----------', e)
        })
        this.mqttclient.on('message', this.onMessage)
        this.sub_command()
    }

    sub_command() {
        this.mqttclient.subscribe(this.commandApi, function (err) {
            if (err) {
                console.log(err)
            }
        })
    }

    pub_property(msg) {
        this.mqttclient.publish(this.propertyApi, msg);
    }

    pub_event(msg) {
        this.mqttclient.publish(this.eventApi, msg);
    }

    async pub_message(msg) {
        try {
            let payload = await wechaty2chatdev(msg)
            this.mqttclient.publish(this.eventApi, payload);
        } catch (err) {
            console.error(err)
        }

    }

    static getBot() {
        return this.bot
    }

    async onMessage(topic, message) {
        log.info('mqtt onMessage:', topic, message.toString())
        // const content = JSON.parse(message.toString())
        message = JSON.parse(message)
        const name = message.name
        const params = message.params

        if (name == 'start') {

        }
        if (name == 'stop') {

        }
        if (name == 'logout') {

        }
        if (name == 'logonoff') {

        }
        if (name == 'userSelf') {

        }
        if (name == 'say') {

        }
        if (name == 'send') {
            send(params, chatbot)
        }
        if (name == 'sendAt') {
            sendAt(params, chatbot)
        }

        if (name == 'aliasGet') {

        }
        if (name == 'aliasSet') {

        }
        if (name == 'roomCreate') {
            createRoom(params, chatbot)
        }
        if (name == 'roomAdd') {

        }
        if (name == 'roomDel') {

        }
        if (name == 'roomAnnounceGet') {

        }
        if (name == 'roomAnnounceSet') {

        }
        if (name == 'roomQuit') {

        }
        if (name == 'roomTopicGet') {

        }
        if (name == 'roomTopicSet') {

        }
        if (name == 'roomQrcodeGet') {
            getQrcod(params, chatbot, chatdevice)

        }
        if (name == 'memberAllGet') {

        }
        if (name == 'contactAdd') {

        }
        if (name == 'contactAliasSet') {

        }
        if (name == 'contactFindAll') {
            getAllContact(chatdevice, chatbot)
        }
        if (name == 'contactFind') {

        }
        if (name == 'roomFindAll') {
            getAllRoom(chatdevice, chatbot)
        }
        if (name == 'roomFind') {

        }
        if (name == 'config') {

        }

    }

}

async function getAllContact(chatdevice, bot) {
    const contactList = await bot.Contact.findAll()
    let friends = []
    for (let i in contactList) {
        let contact = contactList[i]
        let avatar = ''
        try {
            avatar = JSON.parse(JSON.stringify(await contact.avatar())).url
        } catch (err) {

        }
        let contactInfo = {
            "id": contact.id,
            "gender": contact.gender() || '',
            "name": contact.name() || '',
            "alias": await contact.alias() || '',
            "avatar": avatar
        }
        friends.push(contactInfo)

        if (friends.length == 100) {
            let msg = propertyMessage('contactList', friends)
            chatdevice.pub_property(msg)
            friends = []
        }
    }
    let msg = propertyMessage('contactList', friends)
    chatdevice.pub_property(msg)

}

async function getAllRoom(chatdevice, bot) {
    const roomList = await bot.Room.findAll()
    for (let i in roomList) {
        let room = roomList[i]
        let roomInfo = {}
        roomInfo.id = room.id

        let avatar = await room.avatar()
        roomInfo.avatar = JSON.parse(JSON.stringify(avatar)).url

        roomInfo.ownerId = room.owner().id
        try {
            roomInfo.topic = await room.topic()
        } catch (err) {
            roomInfo.topic = room.id
        }
        let memberAlias = ''
        try {
            memberAlias = await room.alias(talker)
        } catch (err) {

        }
        roomList[i] = roomInfo
    }
    let msg = propertyMessage('roomList', roomList)
    chatdevice.pub_property(msg)
}

async function send(params, bot) {
    console.debug(params)

    let msg = ''
    if (params.messageType == 'Text') {
        /* {
      "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
      "method":"thing.command.invoke",
      "version":"1.0",
      "timestamp":1610430718000,
      "name":"send",
      "params":{
          "toContacts":[
              "tyutluyc",
              "5550027590@chatroom"
          ],
          "messageType":"Text",
          "messagePayload":"welcome to wechaty!"
      }
    } */
        msg = params.messagePayload

    } else if (params.messageType == 'Contact') {
        /* {
          "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
          "method":"thing.command.invoke",
          "version":"1.0",
          "timestamp":1610430718000,
          "name":"send",
          "params":{
              "toContacts":[
                  "tyutluyc",
                  "5550027590@chatroom"
              ],
              "messageType":"Contact",
              "messagePayload":"tyutluyc"
          }
      } */
        const contactCard = await this.bot.Contact.find({ id: params.messagePayload })
        if (!contactCard) {
            console.log('not found')
            return {
                msg: '无此联系人'
            }
        } else {
            msg = contactCard
        }

    } else if (params.messageType == 'Attachment') {
        /* {
        "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
        "method":"thing.command.invoke",
        "version":"1.0",
        "timestamp":1610430718000,
        "name":"send",
        "params":{
            "toContacts":[
                "tyutluyc",
                "5550027590@chatroom"
            ],
            "messageType":"Attachment",
            "messagePayload":"/tmp/text.txt"
        }
    } */
        if (params.messagePayload.indexOf('http') != -1 || params.messagePayload.indexOf('https') != -1) {
            msg = FileBox.fromUrl(params.messagePayload)
        } else {
            msg = FileBox.fromFile(params.messagePayload)
        }


    } else if (params.messageType == 'Image') {
        /* {
        "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
        "method":"thing.command.invoke",
        "version":"1.0",
        "timestamp":1610430718000,
        "name":"send",
        "params":{
            "toContacts":[
                "tyutluyc",
                "5550027590@chatroom"
            ],
            "messageType":"Image",
            "messagePayload":"https://wechaty.github.io/wechaty/images/bot-qr-code.png"
        }
    } */
        // msg = FileBox.fromUrl(params.messagePayload)
        if (params.messagePayload.indexOf('http') != -1 || params.messagePayload.indexOf('https') != -1) {
            console.debug('图片http地址：' + params.messagePayload)
            msg = FileBox.fromUrl(params.messagePayload)
        } else {
            console.debug('图片本地地址：' + params.messagePayload)
            msg = FileBox.fromFile(params.messagePayload)
        }

    } else if (params.messageType == 'Url') {
        /* {
        "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
        "method":"thing.command.invoke",
        "version":"1.0",
        "timestamp":1610430718000,
        "name":"send",
        "params":{
            "toContacts":[
                "tyutluyc",
                "5550027590@chatroom"
            ],
            "messageType":"Url",
            "messagePayload":{
                "description":"WeChat Bot SDK for Individual Account, Powered by TypeScript, Docker, and Love",
                "thumbnailUrl":"https://avatars0.githubusercontent.com/u/25162437?s=200&v=4",
                "title":"Welcome to Wechaty",
                "url":"https://github.com/wechaty/wechaty"
            }
        }
    } */
        msg = new UrlLink(params.messagePayload)

    } else if (params.messageType == 'MiniProgram') {
        /* {
        "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
        "method":"thing.command.invoke",
        "version":"1.0",
        "timestamp":1610430718000,
        "name":"send",
        "params":{
            "toContacts":[
                "tyutluyc",
                "5550027590@chatroom"
            ],
            "messageType":"MiniProgram",
            "messagePayload":{
                "appid":"wx36027ed8c62f675e",
                "description":"群组大师群管理工具",
                "title":"群组大师",
                "pagePath":"pages/start/relatedlist/index.html",
                "thumbKey":"",
                "thumbUrl":"http://mmbiz.qpic.cn/mmbiz_jpg/mLJaHznUd7O4HCW51IPGVarcVwAAAuofgAibUYIct2DBPERYIlibbuwthASJHPBfT9jpSJX4wfhGEBnqDvFHHQww/0",
                "username":"gh_6c52e2baeb2d@app"
            }
        }
    } */
        msg = new MiniProgram(params.messagePayload)

    } else {
        return {
            msg: '不支持的消息类型'
        }
    }

    console.debug(msg)

    const toContacts = params.toContacts

    for (let i = 0; i < toContacts.length; i++) {
        if (toContacts[i].split('@').length == 2 || toContacts[i].split(':').length == 2) {
            console.debug(`向群${toContacts[i]}发消息`)
            let room = await bot.Room.find({ id: toContacts[i] })
            if (room) {
                try {
                    await room.say(msg)
                    storeSentMessage(this.bot.currentUser, msg, undefined, room)
                } catch (err) {
                    console.error(err)
                }
            }
        } else {
            console.debug(`好友${toContacts[i]}发消息`)
            // console.debug(bot)
            let contact = await bot.Contact.find({ id: toContacts[i] })
            if (contact) {
                try {
                    await contact.say(msg)
                    storeSentMessage(this.bot.currentUser, msg, contact, undefined)
                } catch (err) {
                    console.error(err)
                }
            }
        }
    }

}

async function sendAt(params, bot) {
    let atUserIdList = params.toContacts
    let room = await bot.Room.find({ id: params.room })
    const atUserList = [];
    for (const userId of atUserIdList) {
        const cur_contact = await bot.Contact.load(userId);
        atUserList.push(cur_contact);
    }
    await room.say(params.messagePayload, ...atUserList)
    storeSentMessage(this.bot.currentUser, params.messagePayload, undefined, room)
}

async function createRoom(params, bot) {
    let contactList = []
    for (let i in params.contactList) {
        let c = await bot.Contact.find({ name: params.contactList[i] })
        contactList.push(c)
    }

    const room = await bot.Room.create(contactList, params.topic)
    // console.log('Bot', 'createDingRoom() new ding room created: %s', room)
    // await room.topic(params.topic)

    await room.say('你的专属群创建完成')
    storeSentMessage(this.bot.currentUser, '你的专属群创建完成', undefined, room)
}

async function getQrcod(params, bot, chatdevice) {
    let roomId = params.roomId
    let room = await bot.Room.find({ id: roomId })
    let qr = await room.qrcode()
    let msg = eventMessage('qrcode', qr)
    chatdevice.pub_event(msg)
}

export { ChatDevice }
export default ChatDevice