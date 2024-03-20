import { ChatOpenAI } from 'langchain/chat_models/openai'
import { HumanMessage, SystemMessage } from 'langchain/schema'
import { ChatFlowCore } from '../api/base-config.js'

const basePath = `${ChatFlowCore.configEnv.CHATGPT_ENDPOINT}/v1`
const chat = new ChatOpenAI({ temperature: 0 }, { basePath })

const sysMsg = '你是一个智能助手，你可以利用你自己的知识回答问题，但需要注意当你掌握的知识不能客观回答问题时，不要编造，而是谦虚的承认自己的不足'

export const aide = async (humanMessage:string) => {
  const res = await chat.call([
    new SystemMessage(
      sysMsg,
    ),
    new HumanMessage(humanMessage),
  ])
  // log.info(res.content)
  return res
}
