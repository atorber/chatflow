/* eslint-disable sort-keys */
import rp from 'request-promise'
import WXBizMsgCrypt from 'wxcrypt'
import xml2js from 'xml2js'

export type SkillInfo = {
  skillname: string;
  title: string;
  question: string[];
  answer: string[];
};

type VikaRecord = {
  recordId: string;
  fields: {
    [key: string]: any;
  };
};

export type SkillInfoArray = SkillInfo[];

export interface WxOpenaiBotConfig {
  encodingAESKey: string;
  token: string;
  nonce: string;
  appid: string;
  managerid: string;
}

export class WxOpenaiBot {

  private encodingAESKey: string
  private token: string
  private nonce: string
  private appid: string
  private managerid: string

  builder: any
  parser: any
  WXBizMsgCryptnew: any

  constructor (config: WxOpenaiBotConfig) {
    this.encodingAESKey = config.encodingAESKey
    this.token = config.token
    this.nonce = config.nonce
    this.appid = config.appid
    this.managerid = config.managerid

    this.builder = new xml2js.Builder()
    this.parser = new xml2js.Parser()
    this.WXBizMsgCryptnew = new WXBizMsgCrypt(this.token, this.encodingAESKey, this.appid)
  }

  async json2encrypt (rawJson: any, action:string) {
    try {
      let rawMsg = this.builder.buildObject(rawJson)
      rawMsg = `<xml${rawMsg.split('root')[1]}xml>`
      if (action === 'publish') {
        rawMsg = `<xml><managerid><![CDATA[${rawJson.managerid}]]></managerid></xml>`
      }

      const timestamp = String(new Date().getTime())
      const estr = this.WXBizMsgCryptnew.encryptMsg(rawMsg, timestamp, this.nonce)
      const json = await this.parser.parseStringPromise(estr)
      return json.xml.Encrypt[0]
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async aibot (action: string, encrypt: any) {
    const options = {
      method: 'POST',
      uri: `https://openai.weixin.qq.com/openapi/${action}/${this.token}`,
      body: { encrypt },
      json: true,
    }

    try {
      const res = await rp(options)
      return res
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  buildParams (records:VikaRecord[]) {
    if (!Array.isArray(records)) {
      throw new Error('Invalid event data')
    }

    return records.map((item:VikaRecord) => {
      const fields = item.fields
      return {
        skillname: fields['分类(必填)'],
        title: fields['标准问题(必填)'],
        question: [ fields['相似问题1(选填)'] ], // 按需要填充
        answer: [ fields['机器人回答'] ],
      }
    })
  }

  async updateSkill (skills: SkillInfoArray, mode: 0 | 1 = 0) {
    try {
      const action = 'batchimportskill'
      const rawJson = {
        managerid: this.managerid,
        mode,
        skill: skills,
      }
      console.info('rawJson:', JSON.stringify(rawJson))

      const encrypt = await this.json2encrypt(rawJson, action)
      console.info('encrypt:', encrypt)
      const res = await this.aibot(action, encrypt)

      return res
    } catch (error) {
      console.error(error)
      return { error }
    }
  }

  async publishSkill () {
    try {
      const action = 'publish'
      const rawJson = {
        managerid: this.managerid,
      }
      console.info('rawJson:', JSON.stringify(rawJson))

      const encrypt = await this.json2encrypt(rawJson, action)
      console.info('encrypt:', encrypt)
      const res = await this.aibot(action, encrypt)

      return res
    } catch (error) {
      console.error(error)
      return { error }
    }
  }

}
