import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { Store } from '../../db/store.js';
import { BusinessRoom, BusinessUser } from '../../types/index.js';

@Controller('api/v1/chatbot')
export class ChatbotsController {
  @Get('list')
  async findAll(@Request() req: any): Promise<string> {
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const userCur = Store.findUser(user.userId);
    if (!userCur) {
      throw new UnauthorizedException();
    }
    console.debug(userCur);

    const chatBotRes = await userCur.db.chatBot.findAll();
    const data = chatBotRes.data as any;
    const items = data.map((value: any) => {
      const fields = value.fields;
      fields.recordId = value.recordId;
      return fields;
    });
    // console.debug(data);
    const res: any = {
      code: 200,
      message: 'success',
      data: {
        page: 1,
        pageSize: 1000,
        pageCount: 1,
        itemCount: data.length,
        items: items,
      },
    };
    return res;
  }

  @Post('create')
  async create(@Body() body: any, @Request() req: any): Promise<string> {
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);
    const resCreate = await db.db.chatBot.create(body);
    console.debug('resCreate', resCreate);
    const res: any = { code: 400, message: 'fail', data: {} };
    if (resCreate.data.recordId) {
      res.code = 200;
      res.message = 'success';
      res.data = resCreate;
    }
    return res;
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
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);

    const resDel = await db.db.chatBot.delete(body.recordId);
    console.debug('chatbots resDel', JSON.stringify(resDel));

    let res: any = '';
    if (resDel.message === 'success') {
      res = {
        code: 200,
        message: 'success',
        data: resDel.data,
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

  @Get('user/list')
  async findUserAll(
    @Request() req: any,
    @Query() query: { id: string },
  ): Promise<string> {
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    console.debug('user/list query:', query);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);

    let chatBotUser;

    if (query) {
      chatBotUser = await db.db.chatBotUser.findByField('id', query.id);
    } else {
      chatBotUser = await db.db.chatBotUser.findAll();
    }

    const data = chatBotUser.data;
    const items = data.map((value: any) => {
      const fields = value.fields;
      fields.recordId = value.recordId;
      return fields;
    });
    // console.debug(data);
    const res: any = {
      code: 200,
      message: 'success',
      data: {
        page: 1,
        pageSize: 1000,
        pageCount: 1,
        itemCount: data.length,
        items: items,
      },
    };
    return res;
  }

  @Get('user/list/group')
  async findUserAllGroup(
    @Request() req: any,
    @Query() query: { id: string },
  ): Promise<string> {
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    console.debug('user/list query:', query);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);

    const chatBotUser = await db.db.chatBotUser.findAll();
    const data: {
      [key: string]: any[];
    } = {};
    const items = chatBotUser.data;
    items.map((value: any) => {
      const fields = value.fields;
      fields.recordId = value.recordId;
      if (data[fields.id]) {
        data[fields.id].push(fields);
      } else {
        data[fields.id] = [fields];
      }
    });
    // console.debug(data);
    const res: any = {
      code: 200,
      message: 'success',
      data,
    };
    return res;
  }

  @Get('user/list/detail')
  async findUserAllDetail(@Request() req: any): Promise<string> {
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);
    const resChatbot = await db.db.chatBot.findAll();
    console.debug('chatbot', JSON.stringify(resChatbot));

    const chatbots = resChatbot.data;
    const chatBotUser = await db.db.chatBotUser.findAll();
    console.debug('chatBotUser', JSON.stringify(chatBotUser));

    const items = chatBotUser.data;

    const data = items.map((value: any) => {
      const fields = value.fields;
      const chatbot = chatbots.find(
        (item: any) => String(item.fields?.id) === fields.id,
      );
      console.debug('chatbot', JSON.stringify(chatbot));
      if (chatbot) fields.chatbot = chatbot.fields;

      if (fields['name'] || fields['wxid'] || fields['alias']) {
        if (
          fields['wxid'] &&
          (fields['wxid'].includes('@') || fields['wxid'].includes('@@'))
        ) {
          const room: BusinessRoom = {
            topic: fields['name'],
            id: fields['wxid'],
          };
          fields['room'] = room;
        } else {
          const contact: BusinessUser = {
            name: fields['name'],
            alias: fields['alias'],
            id: fields['wxid'],
          };
          fields['contact'] = contact;
        }
      }
      return fields;
    });
    // console.debug(data);
    const res: any = {
      code: 200,
      message: 'success',
      data: {
        page: 1,
        pageSize: 1000,
        pageCount: 1,
        itemCount: data.length,
        items: data,
      },
    };
    return res;
  }

  @Post('user/create')
  async createUser(@Body() body: any, @Request() req: any): Promise<string> {
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);

    const resCreate = await db.db.chatBotUser.create(body);
    console.debug('resCreate', resCreate);
    const res: any = { code: 400, message: 'fail', data: {} };
    if (resCreate.data.recordId) {
      res.code = 200;
      res.message = 'success';
      res.data = resCreate;
    }
    return res;
  }

  @Post('user/delete')
  async deleteUser(@Body() body: any, @Request() req: any): Promise<string> {
    //   {
    //     "recordId":21705
    // }
    console.debug('user delete', body);
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const userCur = Store.findUser(user.userId);
    if (!userCur) {
      throw new UnauthorizedException();
    }
    // console.debug(db);

    const resDel = await userCur.db.chatBotUser.delete(body.recordId);
    console.debug('chatbots resDel', JSON.stringify(resDel));

    let res: any = '';
    if (resDel.message === 'success') {
      res = {
        code: 200,
        message: 'success',
        data: resDel.data,
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
