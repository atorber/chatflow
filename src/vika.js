/* eslint-disable no-console */
/* eslint-disable sort-keys */
import { Vika } from '@vikadata/vika'
import moment from 'moment'
import { v4 } from 'uuid'
import rp from 'request-promise'

// 定义一个延时方法
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

class VikaBot {

  constructor(config) {
    if (!config.token) {
      console.error('未配置token，请在config.ts中配置')
    } else if (!config.spaceName) {
      console.error('未配置空间名称，请在config.ts中配置')
    } else {
      this.token = config.token
      this.spaceName = config.spaceName
      this.vika = new Vika({ token: this.token })
      this.spaceId = ''
      // this.checkInit()
    }
  }

  async getAllSpaces() {
    // 获取当前用户的空间站列表
    const spaceListResp = await this.vika.spaces.list()
    if (spaceListResp.success) {
      console.table(spaceListResp.data.spaces)
      return spaceListResp.data.spaces
    } else {
      console.error(spaceListResp)
      return spaceListResp
    }
  }

  async getSpaceId() {
    const spaceList = await this.getAllSpaces()
    for (const i in spaceList) {
      if (spaceList[i].name === this.spaceName) {
        this.spaceId = spaceList[i].id
        break
      }
    }
    if (this.spaceId) {
      return this.spaceId
    } else {
      return null
    }
  }

  async getNodesList() {
    // 获取指定空间站的一级文件目录
    const nodeListResp = await this.vika.nodes.list({ spaceId: this.spaceId })
    const tables = {}
    if (nodeListResp.success) {
      // console.log(nodeListResp.data.nodes);
      const nodes = nodeListResp.data.nodes
      nodes.forEach((node) => {
        // 当节点是文件夹时，可以执行下列代码获取文件夹下的文件信息
        if (node.type === 'Datasheet') {
          tables[node.name] = node.id
        }
      })
    } else {
      console.error(nodeListResp)
    }
    return tables
  }

  async getSheetFields(datasheetId) {
    const datasheet = await this.vika.datasheet(datasheetId)
    const fieldsResp = await datasheet.fields.list()
    let fields = []
    if (fieldsResp.success) {
      console.log(JSON.stringify(fieldsResp.data.fields))
      fields = fieldsResp.data.fields
    } else {
      console.error(fieldsResp)
    }
    return fields
  }

  async createDataSheet(key, name, fields) {

    const datasheetRo = {
      fields,
      name,
    }

    try {
      const res = await this.vika.space(this.spaceId).datasheets.create(datasheetRo)

      console.log(`系统表【${name}】创建成功，表ID【${res.data.id}】`)

      this[key] = res.data.id

      await this.clearBlankLines(this[key])

      return res.data
    } catch (error) {
      console.error(name, error)
      return error
      // TODO: handle error
    }
  }

  async createRecord(datasheetId, records) {
    const datasheet = await this.vika.datasheet(datasheetId)

    const res = await datasheet.records.create(records)

    if (res.success) {
      // console.log(res.data.records)
    } else {
      console.error(res)
    }

  }

  async addChatRecord(msg, uploadedAttachments, msgType, text) {
    // console.debug(msg)
    // console.debug(JSON.stringify(msg))
    const talker = msg.talker()
    // console.debug(talker)
    const to = msg.to()
    const type = msg.type()
    text = text || msg.text()
    const room = msg.room()
    let topic = ''
    if (room) {
      topic = await room.topic()
    }
    const curTime = this.getCurTime()
    const reqId = v4()
    const ID = msg.id
    // let msgType = msg.type()
    const timeHms = moment(curTime).format('YYYY-MM-DD HH:mm:ss')
    const files = []
    if (uploadedAttachments) {
      files.push(uploadedAttachments)
      text = JSON.stringify(uploadedAttachments)
    }

    const records = [
      {
        fields: {
          _id: ID,
          timeHms: timeHms,
          name: talker ? talker.name() : '未知',
          topic: topic || '--',
          messagePayload: text,
          wxid: talker.id !== 'null' ? talker.id : '--',
          roomid: room && room.id ? room.id : '--',
          messageType: msgType,
          file: files,
        },
      },
    ]

    // let records = [
    //   {
    //     fields: {
    //       id: ID,
    //       timeHms: timeHms,
    //       name: talker ? talker.name() : '未知',
    //       topic: topic || '--',
    //       text: text,
    //       wxid: talker.id != 'null' ? talker.id : '--',
    //       roomid: room && room.id ? room.id : '--',
    //       messageType: msgType,
    //       files: files
    //     },
    //   },
    // ]

    // console.debug(records)
    const messageSheet = this.messageSheet
    const datasheet = this.vika.datasheet(messageSheet)
    try {
      datasheet.records.create(records).then((response) => {
        if (response.success) {
          console.log('写入vika成功：', JSON.stringify(response.code))
        } else {
          console.error('调用vika写入接口成功，写入vika失败：', response)
        }
        return response
      }).catch(err => { console.error('调用vika写入接口失败：', err) })
    } catch (err) {
      console.error(err)
    }



  }

  async addScanRecord(uploadedAttachments, text) {

    const curTime = this.getCurTime()
    const timeHms = moment(curTime).format('YYYY-MM-DD HH:mm:ss')
    const files = []
    if (uploadedAttachments) {
      files.push(uploadedAttachments)
    }

    const records = [
      {
        fields: {
          _id: timeHms,
          timeHms: timeHms,
          name: 'system',
          topic: '--',
          messagePayload: text,
          wxid: 'system',
          roomid: '--',
          messageType: 'qrcode',
          file: files,
        },
      },
    ]

    // console.debug(records)
    const datasheet = this.vika.datasheet(this.messageSheet)
    datasheet.records.create(records).then((response) => {
      if (response.success) {
        console.log('写入vika成功：', response.code)
      } else {
        console.error('调用vika写入接口成功，写入vika失败：', response)
      }
      return response
    }).catch(err => { console.error('调用vika写入接口失败：', err) })
  }

  async upload(file) {
    const datasheet = this.vika.datasheet(this.messageSheet)
    try {
      const resp = await datasheet.upload(file)
      if (resp.success) {
        const uploadedAttachments = resp.data
        console.debug('上传成功', uploadedAttachments)
        // await vika.datasheet('dstWUHwzTHd2YQaXEE').records.create([{
        //   'title': '标题 A',
        //   'photos': [uploadedAttachments]
        // }])
        return uploadedAttachments
      }
    } catch (error) {
      // console.error(error.message)
    }
  }

  async deleteRecords(datasheetId, recordsIds) {
    const datasheet = await this.vika.datasheet(datasheetId)
    const response = await datasheet.records.delete(recordsIds)

    if (response.success) {
      // console.log(`删除${recordsIds.length}条记录`)
    } else {
      console.error(response)
    }
  }

  async getRecords(datasheetId, query = {}) {
    let records = []
    const datasheet = await this.vika.datasheet(datasheetId)
    // 分页获取记录，默认返回第一页
    const response = await datasheet.records.query(query)
    if (response.success) {
      records = response.data.records
      // console.log(records)
    } else {
      console.error(response)
      records = response
    }
    return records
  }

  async clearBlankLines(datasheetId) {
    const records = await this.getRecords(datasheetId, {})
    const recordsIds = []
    for (const i in records) {
      recordsIds.push(records[i].recordId)
    }
    await this.deleteRecords(datasheetId, recordsIds)

  }

  async getConfig() {
    const records = await this.getRecords(this.configSheet, {})
    const config = records[0].fields
    const sysConfig = {
      VIKA_ONOFF: config['消息上传到维格表'] === '开启', // 维格表开启
      puppetName: config['puppet'],  // 支持wechaty-puppet-wechat、wechaty-puppet-xp、wechaty-puppet-padlocal
      puppetToken: config['wechaty-token'],
      WX_TOKEN: config['对话平台token'], // 微信对话平台token
      EncodingAESKey: config['对话平台EncodingAESKey'], // 微信对话平台EncodingAESKey
      WX_OPENAI_ONOFF: config['智能问答'] === '开启', // 微信对话平台开启
      roomWhiteListOpen: config['群白名单'] === '开启', // 群白名单功能
      AT_AHEAD: config['AT回复'] === '开启', // 只有机器人被@时回复
      DIFF_REPLY_ONOFF: config['不同群个性回复'] === '开启', // 开启不同群个性化回复
      linkWhiteList: ['ledongmao', 'xxxxxxx'],  // 群内链接检测白名单，白名单里成员发布的卡片、链接消息不提示
      imOpen: config['IM对话'] === '开启',  // 是否开启uve-im客户端，设置为true时，需要先 cd ./vue-im 然后 npm install 启动服务 npm run dev
      noderedOpen: config['可视化控制'] === '开启',  // 是否开启nodered，开启nodered后可以以可视化界面启动机器人，需要先导入 ./tools 目录下的 flows.json
    }
    let roomWhiteList = []
    const roomWhiteListRecords = await this.getRecords(this.roomWhiteListSheet, {})

    for (let i = 0; i < roomWhiteListRecords.length; i++) {
      roomWhiteList.push(roomWhiteListRecords[i].fields['群ID'])
    }

    return [sysConfig, roomWhiteList]

  }

  async checkInit() {
    this.spaceId = await this.getSpaceId()
    console.log('空间ID:', this.spaceId)

    if (this.spaceId) {
      const tables = await this.getNodesList()
      console.table(tables)

      if (!tables['指令列表']) {
        console.error('缺少【指令列表】表，请运行 npm run init 自动创建系统表,然后再运行 npm start')
      } else if (!tables['系统配置']) {
        console.error('缺少【系统配置】表，请运行 npm run init 自动创建系统表,然后再运行 npm start')

      } else if (!tables['好友列表']) {
        console.error('缺少【好友列表】表，请运行 npm run init 自动创建系统表,然后再运行 npm start')

      } else if (!tables['智能问答列表']) {
        console.error('缺少【智能问答列表】表，请运行 npm run init 自动创建系统表,然后再运行 npm start')

      } else if (!tables['群列表']) {
        console.error('缺少【群列表】表，请运行 npm run init 自动创建系统表,然后再运行 npm start')

      } else if (!tables['群白名单']) {
        console.error('缺少【群白名单】表，请运行 npm run init 自动创建系统表,然后再运行 npm start')

      } else if (!tables['消息记录']) {
        console.error('缺少【消息记录】表，请运行 npm run init 自动创建系统表,然后再运行 npm start')

      } else {
        this.commandSheet = tables['指令列表']
        this.configSheet = tables['系统配置']
        this.contactSheet = tables['好友列表']
        this.qaSheet = tables['智能问答列表']
        this.roomListSheet = tables['群列表']
        this.roomWhiteListSheet = tables['群白名单']
        this.messageSheet = tables['消息记录']
        console.log('================================================\n\n系统表齐全，启动成功啦~\n\n================================================\n')
      }

    } else {
      console.error('指定空间不存在，请先创建空间，并在config.ts中配置VIKA_SPACENAME')
    }
  }

  async init() {

    this.spaceId = await this.getSpaceId()
    console.log('空间ID:', this.spaceId)

    if (this.spaceId) {

      const tables = await this.getNodesList()
      console.table(tables)

      await wait(2000)

      if (!tables['指令列表']) {
        const commandSheet = {
          fields: [
            {
              name: '指令名称',
              type: 'SingleText',
              property: {
                defaultValue: '',
              },
            },
            {
              name: '说明',
              type: 'Text',
            },
            {
              name: '管理员微信号',
              type: 'SingleText',
              property: {

              },
            },
            {
              name: '类型',
              type: 'SingleSelect',
              property: {
                options: [
                  {
                    name: '系统指令',
                    color: 'deepPurple_0',
                  },
                  {
                    name: '群指令',
                    color: 'indigo_0',
                  },
                ],
              },
              defaultValue: '系统指令',
            },
          ],
          name: '指令列表',
        }
        await this.createDataSheet('commandSheet', '指令列表', commandSheet.fields)
        await wait(200)
        const recordsCommand = [
          {
            fields: {
              指令名称: '更新配置',
              说明: '更新系统配置，更改配置后需主动更新一次配置配置才会生效',
              类型: '系统指令',
            },
          },
          {
            fields: {
              指令名称: '更新白名单',
              说明: '更新群白名单，白名单变动时需主动更新白名单',
              类型: '系统指令',
            },
          },
          {
            fields: {
              指令名称: '更新问答',
              说明: '更新微信对话平台中的问答列表',
              类型: '系统指令',
            },
          },
          {
            fields: {
              指令名称: '更新机器人',
              说明: '更新机器人的群列表和好友列表',
              类型: '系统指令',
            },
          },
          {
            fields: {
              指令名称: '启用问答',
              说明: '当前群启用智能问答',
              类型: '群指令',
            },
          },
          {
            fields: {
              指令名称: '关闭问答',
              说明: '当前群关闭智能问答',
              类型: '群指令',
            },
          },
        ]

        await this.createRecord(this.commandSheet, recordsCommand)
        console.log('初始化命令列表成功')
        await wait(200)
      }

      if (!tables['系统配置']) {
        const configSheet = {
          fields: [
            {
              name: '机器人名称',
              type: 'SingleText',
              property: {
                defaultValue: '',
              },
            },
            {
              name: 'AT回复',
              type: 'SingleSelect',
              property: {
                options: [
                  {
                    name: '开启',
                    color: 'deepPurple_0',
                  },
                  {
                    name: '关闭',
                    color: 'indigo_0',
                  },
                ],
              },
            },
            {
              name: '智能问答',
              type: 'SingleSelect',
              property: {
                options: [
                  {
                    id: 'optXzR09evfY3',
                    name: '开启',
                    color: 'deepPurple_0',
                  },
                  {
                    id: 'opthuJG4PVEYT',
                    name: '关闭',
                    color: 'indigo_0',
                  },
                ],
              },
              desc: '开启后可以使用微信对话平台只能问答',
            },
            {
              name: '对话平台token',
              type: 'SingleText',
              property: {

              },
              desc: '微信开放对话平台token，启用智能问答时必须填写，否则无效',
            },
            {
              name: '对话平台EncodingAESKey',
              type: 'SingleText',
              property: {

              },
              desc: '微信开放对话平台EncodingAESKey，启用智能问答时必须填写，否则无效',
            },
            {
              name: '不同群个性回复',
              type: 'SingleSelect',
              property: {
                options: [
                  {
                    name: '开启',
                    color: 'deepPurple_0',
                  },
                  {
                    name: '关闭',
                    color: 'indigo_0',
                  },
                ],
              },
              desc: '开启后不同群相同问题可以得到不同答案',
            },
            {
              name: '群白名单',
              type: 'SingleSelect',
              property: {
                options: [
                  {
                    name: '开启',
                    color: 'deepPurple_0',
                  },
                  {
                    name: '关闭',
                    color: 'indigo_0',
                  },
                ],
              },
              desc: '开启后只有白名单内的群会自动问答',
            },
            {
              name: '消息上传到维格表',
              type: 'SingleSelect',
              property: {
                options: [
                  {
                    id: 'optTWOVkhhlXU',
                    name: '开启',
                    color: 'deepPurple_0',
                  },
                  {
                    id: 'optvMosmPA40B',
                    name: '关闭',
                    color: 'indigo_0',
                  },
                ],
              },
              desc: '开启后消息记录会自动上传到维格表的【消息记录】表中',
            },
            {
              name: 'IM对话',
              type: 'SingleSelect',
              property: {
                options: [
                  {
                    id: 'optGKc3DuMP2J',
                    name: '开启',
                    color: 'deepPurple_0',
                  },
                  {
                    id: 'optRT22XNkiR0',
                    name: '关闭',
                    color: 'indigo_0',
                  },
                ],
              },
              desc: '开启后可以使用客服对话系统',
            },
            {
              name: 'puppet',
              type: 'SingleSelect',
              property: {
                options: [
                  {
                    name: 'wechaty-puppet-wechat',
                    color: 'deepPurple_0',
                  },
                  {
                    name: 'wechaty-puppet-xp',
                    color: 'indigo_0',
                  },
                  {
                    name: 'wechaty-puppet-padlocal',
                    color: 'blue_0',
                  },
                ],
              },
              desc: 'puppet名称，目前支持3中puppet',
            },
            {
              name: 'wechaty-token',
              type: 'SingleText',
              property: {

              },
              desc: 'puppet的token，仅当使用padlocal时需要填写',
            },
            {
              name: '可视化控制',
              type: 'SingleSelect',
              property: {
                options: [
                  {
                    name: '开启',
                    color: 'deepPurple_0',
                  },
                  {
                    name: '关闭',
                    color: 'indigo_0',
                  },
                ],
              },
              desc: '开启后可在node-red中可视化开启和关闭机器人',
            },
          ],
          name: '系统配置',
        }
        await this.createDataSheet('configSheet', '系统配置', configSheet.fields)
        await wait(200)
        const recordsConfig = [{
          fields: {
            机器人名称: '瓦力',
            AT回复: '开启',
            智能问答: '关闭',
            对话平台token: '',
            不同群个性回复: '关闭',
            群白名单: '关闭',
            消息上传到维格表: '开启',
            IM对话: '关闭',
            puppet: 'wechaty-puppet-xp',
            'wechaty-token': '',
            可视化控制: '关闭',
          },
        }]
        await this.createRecord(this.configSheet, recordsConfig)
        console.log('初始化系统配置成功')
        await wait(200)
      }

      if (!tables['好友列表']) {
        const contactSheet = {
          fields: [
            {
              id: 'fldYdYfRlcAc2',
              name: 'id',
              type: 'SingleText',
              property: {

              },
              editable: true,
            },
            {
              id: 'fldgypZVSwLJV',
              name: 'name',
              type: 'SingleText',
              property: {
                defaultValue: '',
              },
              editable: true,
            },
            {
              id: 'fldo5eltxJ8HX',
              name: 'alias',
              type: 'SingleText',
              property: {
                defaultValue: '',
              },
              editable: true,
            },
            {
              id: 'fldty7s7sFw3K',
              name: 'gender',
              type: 'SingleText',
              property: {
                defaultValue: '',
              },
              editable: true,
            },
            {
              id: 'fld5ww5AIMvP2',
              name: 'friend',
              type: 'Checkbox',
              property: {
                icon: 'white_check_mark',
              },
              editable: true,
            },
            {
              id: 'fldpbOTFDJ5tG',
              name: 'type',
              type: 'SingleText',
              property: {
                defaultValue: '',
              },
              editable: true,
            },
            {
              id: 'fldB05SidSokn',
              name: 'avatar',
              type: 'Text',
              editable: true,
            },
            {
              id: 'fldAN5iJmBilR',
              name: 'phone',
              type: 'SingleText',
              property: {
                defaultValue: '',
              },
              editable: true,
            },
            {
              id: 'fldlfpbHiui6r',
              name: 'file',
              type: 'Attachment',
              editable: true,
            },
          ],
          name: '好友列表',
        }
        await this.createDataSheet('contactSheet', '好友列表', contactSheet.fields)
        await wait(200)
      }

      if (!tables['智能问答列表']) {
        const qaSheet = {
          fields: [
            {
              name: '分类(必填)',
              type: 'Text',
            },
            {
              name: '问题(必填)',
              type: 'Text',
            },
            {
              name: '问题阈值(选填-默认0.9)',
              type: 'Text',
            },
            {
              name: '相似问题(多个用##分隔)',
              type: 'Text',
            },
            {
              name: '机器人回答(多个用##分隔)',
              type: 'Text',
            },
            {
              name: '是否停用(选填-默认FALSE)',
              type: 'Text',
            },
          ],
          name: '智能问答列表',
        }
        await this.createDataSheet('qaSheet', '智能问答列表', qaSheet.fields)
        await wait(200)
        const recordsQa = [
          {
            fields: {
              '﻿分类(必填)': '社区通知',
              '问题(必填)': '社区通知',
              '问题阈值(选填-默认0.9)': '0.7',
              '相似问题(多个用##分隔)': '社区状态通知##社区里的通知##社区通知，急##看社区通知##社区服务通知##社区公示##社区公告',
              '机器人回答(多个用##分隔)': '{"multimsg":["Easy Chatbot Show25108313781@chatroom北辰香麓欣麓园社区公告，点击链接查看详情https://spcp52tvpjhxm.com.vika.cn/share/shrsf3Sf0BHitZlU62C0N"]}',
              '是否停用(选填-默认FALSE)': 'false',
            },
          },
          {
            fields: {
              '﻿分类(必填)': '基础问答',
              '问题(必填)': 'What is Wechaty',
              '问题阈值(选填-默认0.9)': '0.7',
              '相似问题(多个用##分隔)': "what'swechaty",
              '机器人回答(多个用##分隔)': '{"multimsg":["Wechaty is an Open Source software application for building chatbots.LINE_BREAKGo to the https://wechaty.js.org/docs/wechaty for more information."]}',
              '是否停用(选填-默认FALSE)': 'false',
            },
          },
        ]

        await this.createRecord(this.qaSheet, recordsQa)
        console.log('初始化问答示例成功')
        await wait(200)

      }

      if (!tables['群列表']) {
        const roomListSheet = {
          fields: [
            {
              id: 'fldV5HJCOB6Rl',
              name: 'id',
              type: 'SingleText',
              property: {

              },
              editable: true,
            },
            {
              id: 'fldgEKH5CjXu7',
              name: 'topic',
              type: 'SingleText',
              property: {
                defaultValue: '',
              },
              editable: true,
            },
            {
              id: 'fldu000ieNIL3',
              name: 'ownerId',
              type: 'SingleText',
              property: {
                defaultValue: '',
              },
              editable: true,
            },
            {
              id: 'fldP5pXik9Tw0',
              name: 'avatar',
              type: 'Text',
              editable: true,
            },
            {
              id: 'fldWB1gC5mrrg',
              name: 'adminIdList',
              type: 'Text',
              editable: true,
            },
            {
              id: 'fld95m7IYPajP',
              name: 'memberIdList',
              type: 'Text',
              editable: true,
            },
            {
              id: 'fldYg3WRl6auV',
              name: 'external',
              type: 'SingleText',
              property: {
                defaultValue: '',
              },
              editable: true,
            },
            {
              id: 'fldarlC9hzslN',
              name: 'file',
              type: 'Attachment',
              editable: true,
            },
          ],
          name: '群列表',
        }
        await this.createDataSheet('roomListSheet', '群列表', roomListSheet.fields)
        await wait(200)
      }

      if (!tables['群白名单']) {
        const roomWhiteListSheet = {
          fields: [
            {
              id: 'fldxEzzn8r5ox',
              name: '群ID',
              type: 'SingleText',
              property: {
                defaultValue: '',
              },
              editable: true,
              isPrimary: true,
            },
            {
              id: 'fld9s9Sz7kmo3',
              name: '群名称',
              type: 'SingleText',
              property: {

              },
              editable: true,
            },
            {
              id: 'fldaic9DJDnZG',
              name: '群主昵称',
              type: 'SingleText',
              property: {

              },
              editable: true,
            },
            {
              id: 'fldSujdkqvifr',
              name: '群主微信号',
              type: 'SingleText',
              property: {

              },
              editable: true,
            },
            {
              id: 'fldKKH4aUXsWd',
              name: '备注',
              type: 'Text',
              editable: true,
            },
          ],
          name: '群白名单',
        }
        await this.createDataSheet('roomWhiteListSheet', '群白名单', roomWhiteListSheet.fields)
        await wait(200)
      }

      if (!tables['消息记录']) {
        const messageSheet = {
          fields: [
            {
              name: '_id',
              property: {
                defaultValue: '',
              },
              type: 'SingleText',
            },
            {
              name: 'timeHms',
              property: {
                defaultValue: '',
              },
              type: 'SingleText',
            },
            {
              name: 'name',
              property: {
                defaultValue: '',
              },
              type: 'SingleText',
            },
            {
              name: 'topic',
              property: {
                defaultValue: '',
              },
              type: 'SingleText',
            },
            {
              name: 'messagePayload',
              type: 'Text',
            },
            {
              name: 'wxid',
              property: {
                defaultValue: '',
              },
              type: 'SingleText',
            },
            {
              name: 'roomid',
              property: {
                defaultValue: '',
              },
              type: 'SingleText',
            },
            {
              name: 'messageType',
              property: {
                defaultValue: '',
              },
              type: 'SingleText',
            },
            {
              name: 'file',
              type: 'Attachment',
            },
          ],
          name: '消息记录',
        }
        await this.createDataSheet('messageSheet', '消息记录', messageSheet.fields)
        await wait(200)
      }

      console.log('================================================\n\n初始化系统表完成,运行 npm start 启动系统\n\n================================================\n')

    } else {
      console.error('指定空间不存在，请先创建空间，并在config.ts中配置VIKA_SPACENAME')
    }
  }

  getCurTime() {
    // timestamp是整数，否则要parseInt转换
    const timestamp = new Date().getTime()
    const timezone = 8 // 目标时区时间，东八区
    const offsetGMT = new Date().getTimezoneOffset() // 本地时间和格林威治的时间差，单位为分钟
    const time = timestamp + offsetGMT * 60 * 1000 + timezone * 60 * 60 * 1000
    return time
  }

}

export { VikaBot }

export default VikaBot
