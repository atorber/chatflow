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
    log
} from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'
import rp from 'request-promise'

// import WechatyVikaPlugin from 'wechaty-vika-link'
import WechatyVikaPlugin from './src/index.js'

import excel2order from './excel.js'
import { FileBox } from 'file-box'
import path from 'path'
const __dirname = path.resolve();

import os from 'os'
const userInfo = os.userInfo()
const rootPath = `${userInfo.homedir}\\Documents\\WeChat Files\\`

//定义一个延时方法
let wait = ms => new Promise(resolve => setTimeout(resolve, ms));

import configs from './config.js'

const TOKEN = configs.WX_TOKEN

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
    try {
        log.info('message id=============:', message.id)
        log.info('message type===========:', bot.Message.Type[message.type()])
        if (message.room() && message.room().id) {
            await wxai(message)
        }
    } catch (e) {
        console.error(e)
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

const vika_config = { token: configs.VIKA_TOKEN, sheetName: configs.VIKA_DATASHEETNAME || '' }
bot.use(
    WechatyVikaPlugin(vika_config)
)
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
    let text = message.text()
    let answer = ''
    if (message.type() === bot.Message.Type.Text) {
        answer = await aibot(talker, room, text)
    }

    if (message.type() === bot.Message.Type.MiniProgram) {
        let MiniProgram = await message.toMiniProgram()
        text = `${MiniProgram.title().slice(0, 5)}是由群主或管理员所发布的小程序卡片消息吗？`
        answer = await aibot(talker, room, text)
    }

    if (message.type() === bot.Message.Type.Url) {
        let urllink = await message.toUrlLink()
        text = `${urllink.title().slice(0, 5)}是由群主或管理员所发布的小程序卡片消息吗？`
        answer = await aibot(talker, room, text)
    }

    if (message.type() === bot.Message.Type.Attachment) {
        try {
            let file = await message.toFileBox()
            let fileName = file.name
            // text = `${urllink.title().slice(0, 5)}是由群主或管理员所发布的小程序卡片消息吗？`
            // answer = await aibot(talker, room, text)
            if (fileName.split('.')[1] === 'xlsx') {
                // console.debug('file=============', file)
                let filePath = __dirname + `\\cache\\${new Date().getTime() + fileName}`
                // let filePath = `C:\\Users\\wechaty\\Documents\\WeChat Files\\wxid_0o1t51l3f57221\\FileStorage\\File\\2022-05\\${file.name}`
                await file.toFile(filePath)
                await wait(1000)
                console.debug('fileName=====', filePath)

                await excel2order(filePath, message)
            }
        } catch (err) {
            console.error(err)
        }

    }

    if (message.type() === bot.Message.Type.Image) {
        await wait(1000)
        try {
            let file = await message.toFileBox()
            console.debug('image=====', file)
        } catch (err) {
            console.error(err)
        }

    }

    // console.debug('answer=====================', answer)
    if (answer) {
        console.debug('start to say...')
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
    console.debug('start getSignature...')
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
        console.debug('start call aibot...')
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
    } catch (err) {
        console.table(err)
        return answer
    }
}
function token(token: any, VIKA_TOKEN: string): import("wechaty").WechatyPlugin | import("wechaty").WechatyPlugin[] {
    throw new Error('Function not implemented.')
}

