#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/**
 * Wechaty - Conversational RPA SDK for Chatbot Makers.
 *  - https://github.com/wechaty/wechaty
 */
// https://stackoverflow.com/a/42817956/1123955
// https://github.com/motdotla/dotenv/issues/89#issuecomment-587753552
import 'dotenv/config.js'

import {
    Contact,
    Message,
    ScanStatus,
    WechatyBuilder,
    log,
} from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'
import rp from 'request-promise'

 // 替换为微信开放平台TOKEN或者使用环境变量，推荐使用环境变量
const WX_TOKEN = ''

let TOKEN = WX_TOKEN || process.env['WX_TOKEN']

function onScan(qrcode: string, status: ScanStatus) {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
        const qrcodeImageUrl = [
            'https://wechaty.js.org/qrcode/',
            encodeURIComponent(qrcode),
        ].join('')
        log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

        qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console

    } else {
        log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
    }
}

function onLogin(user: Contact) {
    log.info('StarterBot', '%s login', user)
}

function onLogout(user: Contact) {
    log.info('StarterBot', '%s logout', user)
}

async function onMessage(message: Message) {
    log.info('StarterBot', JSON.stringify(message))

    if (message.text() === 'ding') {
        await message.say('dong')
    }

    if (message.room() && message.room().id && message.type() === bot.Message.Type.Text) {
        await wxai(message)
    }
}

const bot = WechatyBuilder.build({
    name: 'ding-dong-bot',
    /**
     * How to set Wechaty Puppet Provider:
     *
     *  1. Specify a `puppet` option when instantiating Wechaty. (like `{ puppet: 'wechaty-puppet-whatsapp' }`, see below)
     *  1. Set the `WECHATY_PUPPET` environment variable to the puppet NPM module name. (like `wechaty-puppet-whatsapp`)
     *
     * You can use the following providers locally:
     *  - wechaty-puppet-wechat (web protocol, no token required)
     *  - wechaty-puppet-whatsapp (web protocol, no token required)
     *  - wechaty-puppet-padlocal (pad protocol, token required)
     *  - etc. see: <https://wechaty.js.org/docs/puppet-providers/>
     */
    puppet: 'wechaty-puppet-xp',

    /**
     * You can use wechaty puppet provider 'wechaty-puppet-service'
     *   which can connect to remote Wechaty Puppet Services
     *   for using more powerful protocol.
     * Learn more about services (and TOKEN) from https://wechaty.js.org/docs/puppet-services/
     */
    // puppet: 'wechaty-puppet-service'
    // puppetOptions: {
    //   token: 'xxx',
    // }
})

bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)

bot.start()
    .then(() => log.info('StarterBot', 'Starter Bot Started.'))
    .catch(e => log.error('StarterBot', e))

async function wxai(message) {
    const room = message.room()
    const talker = message.talker()
    const roomid = room.id
    const text = message.text()
    let answer = await aibot(talker, room, text)
    // console.debug('answer=====================', answer)
    if (answer) {
        await room.say(answer, ...[talker,])
    }
};


async function getSignature(room) {
    let query = {}
    let method = 'POST'
    let uri = `https://openai.weixin.qq.com/openapi/sign/${TOKEN}`
    let headers = {}
    const topic = await room.topic()
    let body = {
        username: topic,
        avatar: '',
        userid: room.id
    }

    let opt = {
        method,
        uri,
        qs: query,
        body,
        headers,
        json: true
    }
    // console.debug(opt)

    try {
        let res = await rp(opt)
        // console.debug(res)
        let signature = res.signature
        return signature
    }
    catch (err) {
        console.error(err)
        return err
    }
}

async function aibot(talker, room, query) {
    let signature = await getSignature(room)
    let method = 'POST'
    let uri = `https://openai.weixin.qq.com/openapi/aibot/${TOKEN}`
    let headers = {}
    let body = {
        signature,
        query
    }

    let opt = {
        method,
        uri,
        qs: {},
        body,
        headers,
        json: true
    }
    // console.debug(opt)
    const roomid = room.id
    let nickName = talker.name()
    let topic = await room.topic()
    let answer = ''
    let log = {}
    try {
        let resMsg = await rp(opt)
        // console.debug(JSON.stringify(resMsg))
        if (resMsg.answer_type == 'text') {
            let msgText = resMsg.answer
            // console.debug('msgText==========', msgText)
            try {
                msgText = JSON.parse(msgText)
                // console.table(msgText)

                if (msgText.multimsg && msgText.multimsg.length) {
                    let answers = msgText.multimsg
                    console.table(answers)
                    for (let i in answers) {
                        let textArr = answers[i].split(roomid)
                        // console.debug('textArr===========', textArr)
                        if (textArr.length == 2) {
                            answer = textArr[1]
                        }
                    }
                    console.table({ answer, nickName, topic, roomid, query })
                    return answer
                }
                console.table({ msg: '没有命中关键字', nickName, topic, roomid, query })
                return answer
            } catch (err) {
                // console.error(err)
                let textArr = msgText.split(roomid)
                if (textArr.length == 2) {
                    answer = textArr[1]
                    return answer
                }
                console.table({ msg: '没有命中关键字', nickName, topic, roomid, query })
                return answer
            }
        }
        return answer
    }
    catch (err) {
        console.error(err)
        return answer
    }
}
