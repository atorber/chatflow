import {
    init,
    // chat,
    chatAibot,
    // nlp,
    // QueryData,
    genToken,
} from '../openai/index.js'

import { FileBox } from 'file-box'
// import excel2order from '../excel.js'

import {
    // Contact,
    // Room,
    // Message,
    // ScanStatus,
    // WechatyBuilder,
    log,
    types,
  } from 'wechaty'

import path from 'path'
// import os from 'os'

const __dirname = path.resolve()
// const userInfo = os.userInfo()
// const rootPath = `${userInfo.homedir}\\Documents\\WeChat Files\\`

  // 定义一个延时方法
const wait = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms))

async function wxai(sysConfig:any,bot:any, talker:any, room:any, message:any) {
    // const talker = message.talker()
    //   const roomid = room ? room.id : ''
    let text = message.text()
    let answer:any = {}
    if (message.type() === bot.Message.Type.Text && room) {
        answer = await aibot(sysConfig,talker, room, text)
    }

    if (message.type() === bot.Message.Type.Text && !room) {
        answer = await aibot(sysConfig,talker, undefined, text)
    }

    if (room && message.type() === bot.Message.Type.MiniProgram && !sysConfig.linkWhiteList.includes(talker.id)) {
        const miniProgram = await message.toMiniProgram()
        text = `${miniProgram.title()?.slice(0, 5)}是由群主或管理员所发布的小程序卡片消息吗？`
        answer = await aibot(sysConfig,talker, room, text)
    }

    if (room && message.type() === bot.Message.Type.Url && !sysConfig.linkWhiteList.includes(talker.id)) {
        const urllink = await message.toUrlLink()
        text = `${urllink.title().slice(0, 5)}是由群主或管理员所发布的小程序卡片消息吗？`
        answer = await aibot(sysConfig,talker, room, text)
    }

    log.info(JSON.stringify(answer))

    if (answer.messageType) {
        switch (answer.messageType) {
            case types.Message.Text: {
                log.info(`向 ${talker.name()} 发送消息...`)

                if (room) {
                    // answer = text.length > 20 ? (answer.text + '\n------------------------------\n' + talker.name() + ':' + text.slice(0, 10) + '...') : (answer.text + '\n------------------------------\n' + talker.name() + ':' + text)
                    answer = answer.text + '\n'
                    await room.say(answer, ...[talker])
                } else {
                    answer = answer.text + '\n'
                    await message.say(answer)
                }

                break
            }
            case types.Message.Image: {
                const fileBox = FileBox.fromUrl(answer.text.url)

                if (room) {
                    await room.say(fileBox)
                } else {
                    await message.say(fileBox)
                }

                break
            }
            case types.Message.MiniProgram: {

                const miniProgram = new bot.MiniProgram({
                    appid: answer.text.appid,
                    title: answer.text.title,
                    pagePath: answer.text.pagepath,
                    // thumbUrl: answer.text.thumb_url,
                    thumbUrl: 'https://openai-75050.gzc.vod.tencent-cloud.com/openaiassets_afffe2516dac42406e06eddc19303a8d.jpg',
                    thumbKey: '42f8609e62817ae45cf7d8fefb532e83',
                })

                let sayRes
                if (room) {
                    sayRes = await room.say(miniProgram)
                } else {
                    sayRes = await message.say(miniProgram)
                }

                console.debug(sayRes)

                break
            }
            default: {
                break
            }

        }

    }

    if (message.type() === bot.Message.Type.Attachment) {
        try {
            const file = await message.toFileBox()
            const fileName = file.name
            // text = `${urllink.title().slice(0, 5)}是由群主或管理员所发布的小程序卡片消息吗？`
            // answer = await aibot(talker, room, text)
            if (fileName.split('.')[1] === 'xlsx') {
                // log.info('file=============', file)
                const filePath = __dirname + `\\cache\\${new Date().getTime() + fileName}`
                // let filePath = `C:\\Users\\wechaty\\Documents\\WeChat Files\\wxid_0o1t51l3f57221\\FileStorage\\File\\2022-05\\${file.name}`
                await file.toFile(filePath)
                await wait(1000)
                log.info('fileName=====', filePath)

                // await excel2order(filePath, message)
            }
        } catch (err) {
            log.error('转换失败', err)
        }

    }

    // if (message.type() === bot.Message.Type.Image) {
    //   await wait(1000)
    //   try {
    //     const file = await message.toFileBox()
    //     log.info('image=====', file)
    //   } catch (err) {
    //     log.error('image=====', err)
    //   }

    // }

};

async function aibot(sysConfig:any, talker:any, room:any, query:any) {
    // log.info('开始请求微信对话平台...')
    init({
        TOKEN: sysConfig.WX_TOKEN,
        EncodingAESKey: sysConfig.EncodingAESKey,
    })

    const roomid = room?.id
    const wxid = talker.id
    const nickName = talker.name()
    const topic = await room?.topic()
    // log.info(opt)

    let answer = {}
    let answerJson

    try {
        const username = room ? (nickName + '/' + topic) : nickName
        const userid = room ? (wxid + '/' + roomid) : wxid
        const signature = genToken({
            username,
            userid,
        })

        let queryData
        if (sysConfig.DIFF_REPLY_ONOFF && room) {
            queryData = {
                signature,
                query,
                first_priority_skills: [topic || ''],
                second_priority_skills: ['通用问题'],
            }
        } else {
            queryData = {
                signature,
                query,
                first_priority_skills: ['通用问题'],
            }
        }

        const resMsg = await chatAibot(queryData)
        log.info(JSON.stringify({query:resMsg.title, answer:resMsg.answer}))

        if (resMsg.msgtype && resMsg.confidence > 0.8) {
            switch (resMsg.msgtype) {
                case 'text':
                    answer = {
                        messageType: types.Message.Text,
                        text: resMsg.answer,
                    }
                    break
                case 'miniprogrampage':
                    answerJson = JSON.parse(resMsg.answer)
                    answer = {
                        messageType: types.Message.MiniProgram,
                        text: answerJson.miniprogrampage,
                    }
                    break
                case 'image':
                    answerJson = JSON.parse(resMsg.answer)
                    answer = {
                        messageType: types.Message.Image,
                        text: answerJson.image,
                    }
                    break
                default:
                    log.info(JSON.stringify({ msg: '没有命中关键字', nickName, topic, roomid, query }))
                    break
            }

            if (sysConfig.DIFF_REPLY_ONOFF && room && (resMsg.skill_name !== topic && resMsg.skill_name !== '通用问题')) {
                answer = {}
            }
            return answer
        }
        return answer
    } catch (err) {
        log.error(JSON.stringify(err))
        return answer
    }
}

export {
    wxai,
    aibot
}

export default wxai