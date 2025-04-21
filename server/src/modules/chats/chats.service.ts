import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

@Injectable()
export class ChatsService {
  static formatMsgToWechaty(data: any) {
    // {"type":"text","content":"ok","quote_id":"","mention":{"all":0,"uids":[]},"receiver":{"receiver_id":"wxid_pnza7m7kf9tq12","talk_type":1}}
    // {"type":"image","width":1024,"height":1024,"url":"https://im.gzydong.com/public/media/image/common/20231030/2143db60700049fd68ab44263cd8b2cc_1024x1024.png","size":10000,"receiver":{"receiver_id":"20889085065@chatroom","talk_type":2}}
    const msg_type = data.type;
    let messageType: any = 'Text';
    let messagePayload = '';

    switch (msg_type) {
      case 'text':
        messageType = 'Text';
        messagePayload = data.content;
        break;
      case 'code':
        messageType = 'Text';
        messagePayload = '```' + data.lang + '\n' + data.code + '\n' + '```';
        break;
      case 'image':
        messagePayload = data.url;
        messageType = 'Image';
        break;
      case 'Emoticon':
        messageType = 'Text';
        break;
      case 'ChatHistory':
        messageType = 'Text';
        break;
      case 'Audio':
        messageType = 4;
        break;
      case 'Attachment':
        messageType = 6;
        break;
      case 'Video':
        messageType = 5;
        break;
      case 'MiniProgram':
        messageType = 1;
        break;
      case 'Url':
        messageType = 1;
        break;
      case 'Recalled':
        messageType = 1;
        break;
      case 'RedEnvelope':
        messageType = 1;
        break;
      case 'Contact':
        messageType = 1;
        break;
      case 'Location':
        messageType = 1;
        break;
      default:
        messageType = 'Text';
        break;
    }
    const msg = {
      reqId: v4(),
      method: 'thing.command.invoke',
      version: '1.0',
      timestamp: new Date().getTime(),
      name: 'send',
      params: {
        toContacts: [
          data.receiver.receiver_id,
          // "5550027590@chatroom",
        ],
        messageType: messageType,
        messagePayload: messagePayload,
      },
    };
    return JSON.stringify(msg);
  }
}
