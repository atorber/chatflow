import {
  Controller,
  Post,
  Body,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { Store } from '../../db/store.js';
import axios from 'axios';

@Controller('api/v1/copilot')
export class CopilotController {
  // 生成摘要
  @Post('summary/create')
  async createSummary(@Request() req: any, @Body() body: any): Promise<any> {
    console.debug('ServeSummaryCreate', body);
    try {
      const user = req.user;
      console.debug(user);
      // console.debug(Store.users);
      const db = Store.findUser(user.userId);
      if (!db) {
        throw new UnauthorizedException();
      }
      const key = db.config.CHATGPT_KEY;
      const endpoint = db.config.CHATGPT_ENDPOINT || 'https://api.openai.com';
      const model = db.config.CHATGPT_MODEL || 'gpt-3.5-turbo';
      console.debug('ServeSummaryCreate', key, endpoint, model);

      let chatRecoresText = '';
      for (let i = 0; i < body.data.length; i++) {
        const chatRecord = body.data[i];
        chatRecoresText += `发言人：${chatRecord.name}\n时间：${chatRecord.time}\n内容：${chatRecord.content}\n\n`;
      }

      const prompt = `聊天记录：
      ${chatRecoresText}
        
        摘要：xxxxx
        
        摘要格式模板：
        1. 事项1描述...
          - 事项1详细描述...
          - 事项1详细描述...
          - 事项1详细描述...
        2. 事项2描述...
          - 事项2详细描述...
          - 事项2详细描述...
          - 事项3详细描述...`;
      const systemPromt =
        '你是一个资深语言学家，善于从文本信息中总结、提取关键信息，你需要将给定的聊天记录整理成一份摘要，摘要内容条理清晰、简练、突出重点，输出结构化的文本信息，字数不超过300字。';
      console.debug('prompt', prompt);
      // 调用openai接口生成摘要
      // 创建一个 OpenAI.Client 的实例，传入你的 API 密钥

      const data = {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPromt,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      };
      const url = `${endpoint}/v1/chat/completions`;

      // 调用 axios.post 方法
      const res = await axios.post(url, data, {
        // 在请求头中设置你的 API 密钥
        headers: {
          Authorization: `Bearer ${key}`,
        },
      });

      console.debug('res', res.data);

      return {
        code: 200,
        message: 'success',
        data: {
          type: body.type,
          id: body.id,
          content: res.data.choices[0].message.content,
        },
      };
    } catch (error) {
      console.error('Error creating summary:', error);
      throw new UnauthorizedException();
    }
  }

  // 文本翻译
  @Post('translate')
  async translate(@Request() req: any, @Body() body: any): Promise<any> {
    console.debug('ServeSummaryCreate', body);
    //   {
    //     "content":"xxxx",
    //     "type":"xxxx",
    //     "id":"xxx",
    //     "targetLanguage":"中文"
    // }
    try {
      const user = req.user;
      console.debug(user);
      // console.debug(Store.users);
      const db = Store.findUser(user.userId);
      if (!db) {
        throw new UnauthorizedException();
      }
      const key = db.config.CHATGPT_KEY;
      const endpoint = db.config.CHATGPT_ENDPOINT || 'https://api.openai.com';
      const model = db.config.CHATGPT_MODEL || 'gpt-3.5-turbo';
      console.debug('ServeSummaryCreate', key, endpoint, model);

      const prompt = `
      输入文本：${body.content}
      目标语言：${body.targetLanguage}
      输出文本：
      `;
      const systemPromt =
        '你是一个专业的翻译器，可以将【输入文本】翻译为【目标语言】，直接给出【输入文本】翻译后的结果不需要其他额外的文字';
      console.debug('prompt', prompt);
      // 调用openai接口生成摘要
      // 创建一个 OpenAI.Client 的实例，传入你的 API 密钥

      const data = {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPromt,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      };
      const url = `${endpoint}/v1/chat/completions`;

      // 调用 axios.post 方法
      const res = await axios.post(url, data, {
        // 在请求头中设置你的 API 密钥
        headers: {
          Authorization: `Bearer ${key}`,
        },
      });

      console.debug('res', res.data);

      return {
        code: 200,
        message: 'success',
        data: {
          type: body.type,
          id: body.id,
          content: res.data.choices[0].message.content,
        },
      };
    } catch (error) {
      console.error('Error creating summary:', error);
      throw new UnauthorizedException();
    }
  }

  // 聊天
  @Post('chat')
  async chat(@Request() req: any, @Body() body: any): Promise<any> {
    console.debug('ServeSummaryCreate', body);
    //   {
    //     "content":"xxxx",
    //     "type":"xxxx",
    //     "id":"xxx",
    // }
    try {
      const user = req.user;
      console.debug(user);
      // console.debug(Store.users);
      const db = Store.findUser(user.userId);
      if (!db) {
        throw new UnauthorizedException();
      }
      const key = db.config.CHATGPT_KEY;
      const endpoint = db.config.CHATGPT_ENDPOINT || 'https://api.openai.com';
      const model = db.config.CHATGPT_MODEL || 'gpt-3.5-turbo';
      console.debug('ServeSummaryCreate', key, endpoint, model);

      const prompt = body.content;
      const systemPromt =
        '你是一个智能助手，可以根据用户的输入进行智能回复，你需要给出客观、中立、有逻辑的回复，当你不知道如何回复时，可以直接回复“我不知道”而不是编造一个答案。';
      console.debug('prompt', prompt);
      // 调用openai接口生成摘要
      // 创建一个 OpenAI.Client 的实例，传入你的 API 密钥

      const data = {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPromt,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      };
      const url = `${endpoint}/v1/chat/completions`;

      // 调用 axios.post 方法
      const res = await axios.post(url, data, {
        // 在请求头中设置你的 API 密钥
        headers: {
          Authorization: `Bearer ${key}`,
        },
      });

      console.debug('res', res.data);

      return {
        code: 200,
        message: 'success',
        data: {
          type: body.type,
          id: body.id,
          content: res.data.choices[0].message.content,
        },
      };
    } catch (error) {
      console.error('Error creating summary:', error);
      throw new UnauthorizedException();
    }
  }
}
