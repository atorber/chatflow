import { expect } from 'chai'
import {
  init,
  chat,
  nlp,
  chatAibot,
  genToken,
} from '../index'

const { tokenize, ner, sentiment, sensitive } = nlp
init({
  TOKEN: '',
  EncodingAESKey: '',
})
describe('chat', () => {
  it('test chat', async () => {
    const chatRes = await chat({
      username: 'uid',
      msg: '谁是超哥',
    })
    expect(chatRes.title).to.equal('谁是超哥')
  })
})

describe('chatAibot', () => {
  it('test chatAibot', async () => {
    const signature = genToken({
      username: '超哥',
      userid: '12345',
    })
    const chatRes = await chatAibot({
      signature,
      query:'谁是超哥',
      first_priority_skills:['Moments'],
    })
    expect(chatRes.ans_node_name).to.equal('Moments')
  })
})

describe('nlp', () => {
  it('test tokenize', async () => {
    const tokenizeRes = await tokenize({
      uid: 'uid',
      data: {
        q: '我的家乡叫中国。',
      },
    })
    expect(tokenizeRes).to.have.property('words').with.lengthOf(6)
  })

  it('test ner', async () => {
    const nerRes = await ner({
      uid: 'uid',
      data: {
        q: '帮我订两张后天上午的火车票',
      },
    })
    expect(nerRes).to.have.property('entities').with.lengthOf(2)
    expect(nerRes['entities'][0]['type']).to.equal('number')
  })

  it('test sentiment', async () => {
    const sentimentRes = await sentiment({
      uid: 'uid',
      data: {
        q: '恭喜小张脱单成功',
        mode: '6class',
      },
    })
    expect(sentimentRes).to.have.property('result').with.lengthOf(6)
  })

  it('test sensitive', async () => {
    const sensitiveRes = await sensitive({
      uid: 'uid',
      data: {
        q: '楼主真垃圾，祝你早日死全家',
      },
    })
    expect(sensitiveRes).to.have.property('result').with.lengthOf(4)
  })

})
