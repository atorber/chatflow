import {
  Controller,
  Get,
  Request,
  UnauthorizedException,
  Query,
  Body,
  UseInterceptors,
  UploadedFile,
  Post,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatsService } from './chats.service.js';
import { Store } from '../../db/store.js';
import mqtt from 'mqtt';
import { v4 } from 'uuid';
import {
  getKeyByBasicString,
  encrypt,
  decrypt,
} from '../../utils/crypto-use-crypto-js.js';
import * as fs from 'fs/promises';
import { join } from 'path';

@Controller('api/v1/talk')
export class ChatsController {
  @Get('list')
  async findAll(@Request() req: any): Promise<string> {
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const userCur = Store.findUser(user.userId);
    if (!userCur) {
      throw new UnauthorizedException();
    }
    // console.debug(db);
    const res = await userCur.db.message.findAll();
    // console.debug(res);
    const talks: any = {
      code: 200,
      message: 'success',
      data: {
        items: [
          {
            avatar:
              'https://im.gzydong.com/public/media/image/talk/20220221/447d236da1b5787d25f6b0461f889f76_96x96.png',
            id: 146,
            is_disturb: 0,
            is_online: 0,
            is_robot: 1,
            is_top: 0,
            msg_text: '[登录消息]',
            name: '登录助手',
            receiver_id: 4257,
            remark: '',
            talk_type: 1,
            unread_num: 0,
            updated_at: '2023-10-26 17:20:33',
          },
          {
            avatar: '',
            id: 34036,
            is_disturb: 0,
            is_online: 0,
            is_robot: 0,
            is_top: 0,
            msg_text: 'ok',
            name: '11111',
            receiver_id: 1028,
            remark: '',
            talk_type: 2,
            unread_num: 0,
            updated_at: '2023-10-26 18:00:57',
          },
          {
            avatar: '',
            id: 34062,
            is_disturb: 0,
            is_online: 0,
            is_robot: 0,
            is_top: 0,
            msg_text: '[群成员解除禁言消息]',
            name: '阿萨德',
            receiver_id: 1029,
            remark: '',
            talk_type: 2,
            unread_num: 0,
            updated_at: '2023-10-26 15:23:28',
          },
        ],
      },
    };

    const items = res.data
      .map((value: any) => {
        const {
          roomid,
          wxid,
          listenerid,
          messagePayload,
          name,
          alias,
          listener,
          timeHms,
          topic,
          wxAvatar,
          roomAvatar,
          listenerAvatar,
        } = value.fields;
        let id = '';
        let dispayname = '';
        let avatar = '';
        let receiver_id = '';

        if (roomid !== '--') {
          id = roomid;
          dispayname = topic;
          avatar = roomAvatar;
          receiver_id = roomid;
        } else if (listenerid === user.id) {
          id = wxid;
          dispayname = alias || name;
          avatar = wxAvatar;
          receiver_id = wxid;
        } else {
          id = listenerid;
          dispayname = listener;
          avatar = listenerAvatar;
          receiver_id = listenerid;
        }
        if (dispayname) {
          return {
            avatar:
              avatar ||
              'https://im.gzydong.com/public/media/image/talk/20220221/447d236da1b5787d25f6b0461f889f76_96x96.png',
            id: id,
            is_disturb: 0,
            is_online: 0,
            is_robot: 0,
            is_top: 0,
            msg_text: messagePayload,
            name: roomid !== '--' ? topic : dispayname,
            receiver_id: receiver_id,
            remark: '',
            talk_type: roomid !== '--' ? 2 : 1,
            unread_num: 0,
            updated_at: timeHms,
            recordId: value.recordId,
          };
        }
        return false;
      })
      .filter((item: any) => item !== false);

    // 过滤items对象数组中receiver_id相同的对象,只保留最新的一条
    const filteredItems = items.reduce((acc: any, curr: any) => {
      const existingItem = acc.find((item: any) => item.id === curr.id);
      if (existingItem) {
        if (existingItem.updated_at < curr.updated_at) {
          acc.splice(acc.indexOf(existingItem), 1, curr);
        }
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);

    talks.data.items = filteredItems;

    console.debug('ServeGetTalkList talks', talks.data.items.length);
    return talks;
  }

  @Get('records')
  async serveTalkRecords(
    @Request() req: any,
    @Query() data: any,
  ): Promise<any> {
    console.debug('ServeGetTalkRecords data', data);
    const user = req.user;
    console.debug(user);
    // console.debug(Store.users);
    const userCur = Store.findUser(user.userId);
    if (!userCur) {
      throw new UnauthorizedException();
    }
    // console.debug(db);

    data.record_id = userCur.id;
    const records = {
      code: 200,
      message: 'success',
      data: {
        items: [
          {
            id: 12013,
            sequence: 29,
            msg_id: '1d54eb03ebd146168bf92880b83f039c',
            talk_type: 1,
            msg_type: 1,
            user_id: 2055,
            receiver_id: 2053,
            nickname: '老牛逼了',
            avatar:
              'https://im.gzydong.com/public/media/image/avatar/20230530/f76a14ce98ca684752df742974f5473a_200x200.png',
            is_revoke: 0,
            is_mark: 0,
            is_read: 0,
            content: '000',
            created_at: '2023-09-16 00:49:07',
            extra: {},
          },
          {
            id: 12010,
            sequence: 28,
            msg_id: '40568d70349b2d01fe1898217bcc7cfa',
            talk_type: 1,
            msg_type: 4,
            user_id: 2055,
            receiver_id: 2053,
            nickname: '老牛逼了',
            avatar:
              'https://im.gzydong.com/public/media/image/avatar/20230530/f76a14ce98ca684752df742974f5473a_200x200.png',
            is_revoke: 0,
            is_mark: 0,
            is_read: 0,
            content: '',
            created_at: '2023-09-15 22:11:49',
            extra: {
              duration: 0,
              name: '',
              size: 245804,
              suffix: 'wav',
              url: 'https://im.gzydong.com/public/media/20230915/bad860440e5fb72974cb2426bead46d6.wav',
            },
          },
        ],
      },
    };

    // data = {
    //   record_id: loadConfig.minRecord,
    //   receiver_id: props.receiver_id,
    //   talk_type: props.talk_type,
    //   limit: 30,
    // }
    let res: any = [];

    if (!data.talk_type) {
      res = await userCur.db.message.findByQuery('', data.limit);
    } else if (data.talk_type === '2') {
      res = await userCur.db.message.findByField(
        'roomid',
        data.receiver_id,
        data.limit,
      );
    } else {
      res = await userCur.db.message.findByQuery(
        `({接收人ID|listenerid}="${data.receiver_id}"&&{好友ID|wxid}="${data.record_id}")||({接收人ID|listenerid}="${data.record_id}"&&{好友ID|wxid}="${data.receiver_id}")`,
        data.limit,
      );
    }
    // console.debug('vika res', res);
    const items = res.data
      .map((value: any) => {
        const { recordId } = value;
        const {
          roomid,
          messagePayload,
          name,
          alias,
          timeHms,
          messageType,
          messageId,
          wxAvatar,
          file,
        } = value.fields;
        // console.debug('消息messagePayload...', messagePayload);
        if (file) console.debug('文件消息 file', file);
        const { wxid, listenerid } = value.fields;
        const user_id = wxid;
        const dispayname = alias || name;
        const talk_type = roomid !== '--' ? 2 : 1;
        let msg_type = 1;
        let extra: any = {
          content: messagePayload || '',
        };
        const receiver_id = roomid !== '--' ? roomid : listenerid;

        // if (file) {
        //   const file0 = file[0];
        //   extra = {
        //     height: file0.height,
        //     name: file0.name,
        //     size: file0.size,
        //     suffix: file0.mimeType,
        //     url: file0.url,
        //     width: file0.width,
        //   };
        // }

        if (['Image', 'Attachment', 'Video', 'Audio'].includes(messageType)) {
          extra = {
            height: 1000,
            name: '无效文件',
            size: 0,
            suffix: '',
            url: '',
            width: 563,
          };
          try {
            const textObj = JSON.parse(messagePayload);
            extra.name = textObj.name;
            extra.url = textObj.url;
          } catch (e) {
            console.debug('解析消息内容失败', e);
          }
        }

        switch (messageType) {
          case 'Text':
            msg_type = 1;
            break;
          case 'Image':
            msg_type = 3;
            break;
          case 'Emoticon':
            msg_type = 1;
            break;
          case 'ChatHistory':
            msg_type = 9;
            break;
          case 'Audio':
            msg_type = 4;
            break;
          case 'Attachment':
            msg_type = 6;
            break;
          case 'Video':
            msg_type = 5;
            break;
          case 'MiniProgram':
            msg_type = 1;
            break;
          case 'Url':
            msg_type = 1;
            break;
          case 'Recalled':
            msg_type = 1;
            break;
          case 'RedEnvelope':
            msg_type = 1;
            break;
          case 'Contact':
            msg_type = 1;
            break;
          case 'Location':
            msg_type = 1;
            break;
          case 'GroupNote':
            msg_type = 1;
            break;
          case 'Transfer':
            msg_type = 1;
            break;
          case 'Post':
            msg_type = 1;
            break;
          case 'qrcode':
            msg_type = 3;
            break;
          case 'Unknown':
            msg_type = 1;
            break;
          default:
            break;
        }

        if (
          dispayname &&
          !['Recalled', 'RedEnvelope', 'Unknown'].includes(messageType)
        ) {
          const id = new Date(timeHms).getTime();
          return {
            id: id,
            sequence: id,
            msg_id: messageId,
            talk_type: talk_type,
            msg_type: msg_type,
            user_id: user_id,
            receiver_id: receiver_id,
            nickname: dispayname,
            avatar:
              wxAvatar ||
              'https://im.gzydong.com/public/media/image/talk/20220221/447d236da1b5787d25f6b0461f889f76_96x96.png',
            is_revoke: 0,
            is_mark: 0,
            is_read: 0,
            created_at: timeHms,
            extra: extra,
            recordId: recordId,
          };
        }
        return false;
      })
      .filter((item: boolean) => item !== false);
    records.data.items = items;
    console.debug('records', records.data.items.length);
    return records;
  }
  // 批量更新配置信息
  @Post('records')
  async create(@Request() req: any, @Body() body: any) {
    console.debug('create records body:', JSON.stringify(body));
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const userCur = Store.findUser(user.userId);
    // console.debug('create records db userCur:', userCur?.userId || undefined);
    if (!userCur) {
      throw new UnauthorizedException();
    }
    // console.debug(db);
    const res = await userCur.db.message.createBatch(body.records);
    // console.debug('create records res:', JSON.stringify(res, null, 2));

    const data: any = {
      code: 400,
      message: 'fail',
      data: res,
    };

    if (res.message === 'success') {
      data.code = 200;
      data.message = 'success';
      data.data = res.data;
    }
    return data;
  }

  @Post('imageVika')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageVika(@Request() req: any, @UploadedFile() file: any) {
    // console.info('上传图片文件:', file);
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const userCur = Store.findUser(user.userId);
    if (!userCur) {
      throw new UnauthorizedException();
    }
    // 构建保存文件的路径
    const savePath = join(__dirname, '../upload', file.originalname);
    console.info('文件保存路径:', savePath);
    // 使用fs模块将文件保存到磁盘
    await fs.writeFile(savePath, file.buffer);
    const resUpload = await userCur.db.message.upload(savePath);
    console.debug('ServeUploadImageVika resUpload', resUpload);
    // 删除临时文件
    await fs.unlink(savePath);
    // 响应
    return { data: resUpload.data };
  }

  @Get('records/history')
  async getTalkRecordsHistory(
    @Query()
    query: {
      talk_type: 1 | 2;
      receiver_id: string;
      record_id: string;
      msg_type: 1 | 3 | 4 | 5 | 6 | 2 | 7;
      limit: string;
    },
  ) {
    console.debug('ServeGetTalkRecordsHistory', query);
    return {
      code: 200,
      message: 'success',
      data: {
        items: [
          {
            id: 14927,
            sequence: 8,
            msg_id: '8964622062c3add87a2b1775ffe5f084',
            talk_type: 1,
            msg_type: 4,
            user_id: 4559,
            receiver_id: 2055,
            nickname: '超哥',
            avatar: '',
            is_revoke: 0,
            is_mark: 0,
            is_read: 0,
            content: '',
            created_at: '2023-11-24 22:36:59',
            extra: {
              duration: 0,
              name: '',
              size: 548908,
              suffix: 'wav',
              url: 'https://im.gzydong.com/public/media/20231124/b1b8535faae447c8394c18998ee0d480.wav',
            },
          },
          {
            id: 14926,
            sequence: 7,
            msg_id: 'd36619e1b05749ad897e002572c7d68e',
            talk_type: 1,
            msg_type: 2,
            user_id: 4559,
            receiver_id: 2055,
            nickname: '超哥',
            avatar: '',
            is_revoke: 0,
            is_mark: 0,
            is_read: 0,
            content: '',
            created_at: '2023-11-24 22:35:29',
            extra: {
              code: '{\n  "123": 123\n}',
              lang: 'json',
            },
          },
          {
            id: 14925,
            sequence: 6,
            msg_id: '43e79cb66ba2ee087e4fdd67a8e5d751',
            talk_type: 1,
            msg_type: 6,
            user_id: 4559,
            receiver_id: 2055,
            nickname: '超哥',
            avatar: '',
            is_revoke: 0,
            is_mark: 0,
            is_read: 0,
            content: '',
            created_at: '2023-11-24 22:30:34',
            extra: {
              drive: 1,
              name: '3.9.2.23发送名片消息.e',
              path: 'private/files/talks/20231124/c6677904291590f963d96cbd58882409.e',
              size: 1718438,
              suffix: 'e',
            },
          },
          {
            id: 14924,
            sequence: 5,
            msg_id: '0d21858f11da4e0fa716c93a3e67f6b0',
            talk_type: 1,
            msg_type: 3,
            user_id: 4559,
            receiver_id: 2055,
            nickname: '超哥',
            avatar: '',
            is_revoke: 0,
            is_mark: 0,
            is_read: 0,
            content: '',
            created_at: '2023-11-24 22:27:15',
            extra: {
              height: 4000,
              name: '',
              size: 0,
              suffix: '',
              url: 'https://im.gzydong.com/public/media/image/common/20231124/ae79f453eafe793f33ef43299f112b3e_2252x4000.jpg',
              width: 2252,
            },
          },
          {
            id: 14923,
            sequence: 4,
            msg_id: 'a6e47ae2d888466bb6bd79b461cc5eeb',
            talk_type: 1,
            msg_type: 1,
            user_id: 4559,
            receiver_id: 2055,
            nickname: '超哥',
            avatar: '',
            is_revoke: 0,
            is_mark: 0,
            is_read: 0,
            content: '[鄙视]',
            created_at: '2023-11-24 22:24:21',
            extra: {},
          },
          {
            id: 14922,
            sequence: 3,
            msg_id: '8edba7aa55f44ea7a958ee0dfbacb552',
            talk_type: 1,
            msg_type: 1,
            user_id: 4559,
            receiver_id: 2055,
            nickname: '超哥',
            avatar: '',
            is_revoke: 0,
            is_mark: 0,
            is_read: 0,
            content: '123',
            created_at: '2023-11-24 22:17:23',
            extra: {},
          },
          {
            id: 14915,
            sequence: 2,
            msg_id: '91d44dcdd0f946b29ad113e7a311ce74',
            talk_type: 1,
            msg_type: 1,
            user_id: 4559,
            receiver_id: 2055,
            nickname: '超哥',
            avatar: '',
            is_revoke: 0,
            is_mark: 0,
            is_read: 0,
            content: '123',
            created_at: '2023-11-24 18:58:17',
            extra: {},
          },
        ],
        limit: 30,
        record_id: 2,
      },
    };
  }

  @Post('unread/clear')
  async clearUnread(@Body() body: any): Promise<any> {
    console.debug('ServeClearUnread', body);
    return { code: 200, message: 'success', data: {} };
  }

  @Post('talk/create')
  async createTalk(
    @Body() body: { receiver_id: string; talk_type: string },
  ): Promise<any> {
    console.debug('ServeCreateTalk', body);
    return {
      code: 200,
      message: 'success',
      data: {
        avatar:
          'https://im.gzydong.com/public/media/image/avatar/20230530/f76a14ce98ca684752df742974f5473a_200x200.png',
        id: 36127,
        is_disturb: 0,
        is_online: 0,
        is_robot: 0,
        is_top: 0,
        msg_text: '[系统消息]',
        name: '老牛逼了1',
        receiver_id: 2055,
        remark_name: '老牛逼了1',
        talk_type: 1,
        unread_num: 1,
        updated_at: '2023-11-24 17:44:29',
      },
    };
  }

  @Post('message/publish')
  async publishMessage(@Body() body: any, @Request() req: any): Promise<any> {
    console.debug('ServePublishMessage', body);
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    console.debug('ServePublishMessage db', db?.userId);
    if (!db) {
      throw new UnauthorizedException();
    }

    // const data = {
    //   text: {
    //     content: '123',
    //     mention: { all: 0, uids: [] },
    //     quote_id: '',
    //     receiver: { receiver_id: 2055, talk_type: 1 },
    //     type: 'text',
    //   },
    //   表情: {
    //     content: '[鄙视]',
    //     mention: { all: 0, uids: [] },
    //     quote_id: '',
    //     receiver: { receiver_id: 2055, talk_type: 1 },
    //     type: 'text',
    //   },
    //   image: {
    //     height: 4000,
    //     receiver: { receiver_id: 2055, talk_type: 1 },
    //     size: 10000,
    //     type: 'image',
    //     url: 'https://im.gzydong.com/public/media/image/common/20231124/ae79f453eafe793f33ef43299f112b3e_2252x4000.jpg',
    //     width: 2252,
    //   },
    //   code: {
    //     type: 'code',
    //     code: '{\n  "123": 123\n}',
    //     lang: 'json',
    //     receiver: {
    //       receiver_id: 2055,
    //       talk_type: 1,
    //     },
    //   },
    // };
    // console.debug('ServePublishMessage', data);

    // 连接到MQTT服务器
    const client = mqtt.connect('mqtt://127.0.0.1:11883', {
      password: '',
      username: '',
    });
    const publishTopic = `thing/chatbot/${db.hash}/command/invoke`;
    const publishPayloadRaw: any = ChatsService.formatMsgToWechaty(body);
    let publishPayload: any = publishPayloadRaw;
    console.info('ServePublishMessage publishPayload', publishPayload);
    // 加密
    // console.debug('ServePublishMessage db.hash', db.hash);
    const key = getKeyByBasicString(db.hash);
    publishPayload = encrypt(publishPayload, key);

    return new Promise<any>((resolve) => {
      // 设置15秒超时
      const timeout: any = setTimeout(() => {
        const responsePayload = {
          status: 408,
          body: { error: 'Request timed out' },
        };
        client.end();
        resolve(responsePayload);
      }, 120000);

      client.on('connect', () => {
        client.subscribe(publishTopic, (err: any) => {
          if (err) {
            const responsePayload = {
              status: 500,
              body: { error: 'Failed to subscribe to topic' },
            };
            client.end();
            resolve(responsePayload);
            return;
          }

          client.publish(publishTopic, publishPayload, (err: any) => {
            if (err) {
              const responsePayload = {
                status: 500,
                body: { error: 'Failed to publish to topic' },
              };
              client.end();
              resolve(responsePayload);
            } else {
              console.debug('ServePublishMessage publish success');
              // const responsePayload = {
              //   status: 200,
              //   body: { message: 'success' },
              // };
              // client.end();
              // resolve(responsePayload);
            }
          });
        });
      });

      client.on('message', (topic: any, message: { toString: () => any }) => {
        if (topic === publishTopic) {
          let messageText = message.toString();
          // 解密
          const key = getKeyByBasicString(db.hash);
          messageText = decrypt(messageText, key);

          const messagePayload = JSON.parse(messageText);
          // console.debug(
          //   'ServePublishMessage messagePayload',
          //   JSON.stringify(messagePayload),
          // );
          console.debug('messagePayload.reqId', messagePayload.reqId);
          console.debug(
            'publishPayload.reqId',
            JSON.parse(publishPayloadRaw).reqId,
          );
          if (messagePayload.reqId === JSON.parse(publishPayloadRaw).reqId) {
            clearTimeout(timeout);
            const responsePayload = { code: 200, message: 'success' };
            client.end();
            resolve(responsePayload);
          }
        }
      });

      client.on('error', (err: { message: any }) => {
        const responsePayload = {
          status: 500,
          body: { error: err.message },
        };
        client.end();
        resolve(responsePayload);
      });
    });
    // return { code: 200, message: 'success' }
  }

  @Post('message/file')
  async uploadFile(
    @Body()
    body: {
      upload_id: string;
      receiver_id: string;
      talk_type: 1 | 2;
      url: string;
    },
    @Request() req: any,
  ): Promise<any> {
    // {
    //   "upload_id": "1700836233fa2e0dca0271837531ebc0506c525ea6",
    //   "receiver_id": 2055,
    //   "talk_type": 1
    // }
    console.debug('ServeUploadFile', body);
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }

    // 连接到MQTT服务器
    const client = mqtt.connect('mqtt://127.0.0.1:11883', {
      password: '',
      username: '',
    });
    const publishTopic = `thing/chatbot/${db.hash}/command/invoke`;
    let publishPayload: any = {
      reqId: v4(),
      method: 'thing.command.invoke',
      version: '1.0',
      timestamp: new Date().getTime(),
      name: 'send',
      params: {
        toContacts: [body.receiver_id],
        messageType: 'Attachment',
        messagePayload:
          body.url.indexOf('http') === 0 || body.url.indexOf('https') === 0
            ? body.url
            : `https://${body.url}`,
      },
    };

    publishPayload = JSON.stringify(publishPayload);
    // 加密
    const key = getKeyByBasicString(db.hash);
    publishPayload = encrypt(publishPayload, key);
    return new Promise<any>((resolve) => {
      // 设置15秒超时
      const timeout: any = setTimeout(() => {
        const responsePayload = {
          status: 408,
          body: { error: 'Request timed out' },
        };
        client.end();
        resolve(responsePayload);
      }, 15000);

      client.on('connect', () => {
        client.subscribe(publishTopic, (err: any) => {
          if (err) {
            const responsePayload = {
              status: 500,
              body: { error: 'Failed to subscribe to topic' },
            };
            client.end();
            resolve(responsePayload);
            return;
          }

          client.publish(publishTopic, publishPayload, (err: any) => {
            if (err) {
              const responsePayload = {
                status: 500,
                body: { error: 'Failed to publish to topic' },
              };
              client.end();
              resolve(responsePayload);
            }
          });
        });
      });

      client.on('message', (topic: any, message: { toString: () => any }) => {
        if (topic === publishTopic) {
          let messageText = message.toString();
          // 解密
          const key = getKeyByBasicString(db.hash);
          messageText = decrypt(messageText, key);
          const messagePayload = JSON.parse(messageText);
          if (messagePayload.reqId === JSON.parse(publishPayload).reqId) {
            clearTimeout(timeout);
            const responsePayload = { code: 200, message: 'success' };
            client.end();
            resolve(responsePayload);
          }
        }
      });

      client.on('error', (err: { message: any }) => {
        const responsePayload = {
          status: 500,
          body: { error: err.message },
        };
        client.end();
        resolve(responsePayload);
      });
    });
    // return { code: 200, message: 'success' }
  }

  @Post('delete')
  async delete(@Body() body: any, @Request() req: any): Promise<string> {
    //   {
    //     "recordId":21705
    // }
    console.debug('chatbots delete', body);
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const userCur = Store.findUser(user.userId);
    if (!userCur) {
      throw new UnauthorizedException();
    }
    // console.debug(db);

    const resDel = await userCur.db.message.delete(body.recordId);
    console.debug('chatbots resDel', JSON.stringify(resDel));

    let res: any = '';
    if (resDel.message === 'success') {
      res = {
        code: 200,
        message: 'success',
        data: {},
      };
    } else {
      res = {
        code: 400,
        message: 'error',
        data: {},
      };
    }
    return res;
  }
}
