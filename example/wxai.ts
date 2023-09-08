/* eslint-disable no-console */
/* eslint-disable sort-keys */
import { WxOpenaiBot, AIBotConfig, SkillInfoArray  } from '../src/services/wxopenaiService.js'
import 'dotenv/config.js'

// Usage
// 假设这是你的 event 对象
const skills:SkillInfoArray  = [
  {
    skillname:'技能名称1',
    title:'标题1',
    question:[
      '相似问题1', '相似问题2', '相似问题3',
    ],
    answer:[
      '回答1',
    ],
  },
  {
    skillname:'技能名称2',
    title:'标题2',
    question:[
      '问题2',
    ],
    answer:[
      '回答2',
    ],
  },
]

// 使用
// const config: AIBotConfig = {
//   encodingAESKey: process.env['ENCODING_AES_KEY'] || '',
//   token: process.env['TOKEN'] || '',
//   nonce: process.env['NONCE'] || '',
//   appid: process.env['APP_ID'] || '',
//   managerid: process.env['MANAGER_ID'] || '',
// }

const config: AIBotConfig = {
  encodingAESKey: '',
  token: '',
  nonce: 'ABSBSDSD',
  appid: 'tR36hgbMs4TyG6Y',
  managerid: 'fbkrb75TNaT',
}

const aiBotInstance = new WxOpenaiBot(config)
aiBotInstance.updateSkill(skills, 1)
  // eslint-disable-next-line no-console
  .then(async result => {
    // eslint-disable-next-line no-console
    console.log('Success:', result)
    if (result.data && result.data.task_id) {
      const res = await aiBotInstance.publishSkill()
      console.info('publishSkill:', res)
      return res
    }
    return result
  })
  .catch(error => {
    // eslint-disable-next-line no-console
    console.error('Error:', error)
  })
