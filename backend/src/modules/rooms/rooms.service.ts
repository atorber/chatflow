import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

@Injectable()
export class RoomsService {
  static formatMsgToWechaty(roomid: string) {
    const msg = {
      reqId: v4(),
      method: 'thing.command.invoke',
      version: '1.0',
      timestamp: new Date().getTime(),
      name: 'memberAllGet',
      params: {
        roomid: roomid,
      },
    };
    return JSON.stringify(msg);
  }
}
