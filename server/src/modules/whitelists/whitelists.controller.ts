import {
  Controller,
  Get,
  Request,
  Query,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { Store } from '../../db/store.js';
import { WhiteList } from './whitelists.service.js';
import { BusinessRoom, BusinessUser } from '../../types/index.js';

@Controller('api/v1/whitelist')
export class WhitelistsController {
  @Get('list/white')
  async findAllWhite(
    @Request() req: any,
    @Query() query: any,
  ): Promise<string> {
    console.debug('list/white query:', query);
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);
    let data;
    if (query.fieldName && query.value) {
      data = await db.db.whiteList.findByField(query.fieldName, query.value);
    } else {
      data = await db.db.whiteList.findAll();
    }
    const res: any = {
      code: 400,
      message: 'error',
      data: data.data,
    };

    if (data.data) {
      const items = data.data.map((value: any) => {
        const fields = value.fields;
        fields.recordId = value.recordId;
        return fields;
      });
      res.code = 200;
      res.message = 'success';
      res.data = {
        page: 1,
        pageSize: 1000,
        pageCount: 1,
        itemCount: items.length,
        items: items,
      };
    }
    return res;
  }

  @Get('list/white/object')
  async findAllWhiteObject(
    @Request() req: any,
    @Query() query: any,
  ): Promise<string> {
    console.debug('list/white query:', query);
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);
    let data;
    if (query.fieldName && query.value) {
      data = await db.db.whiteList.findByField(query.fieldName, query.value);
    } else {
      data = await db.db.whiteList.findAll();
    }
    const res: any = {
      code: 400,
      message: 'error',
      data: data.data,
    };

    if (data.data) {
      const items = data.data.map((value: any) => {
        const fields = value.fields;
        fields.recordId = value.recordId;
        return fields;
      });
      const whiteList: WhiteList = {
        contactWhiteList: { qa: [], msg: [], act: [], gpt: [] },
        roomWhiteList: { qa: [], msg: [], act: [], gpt: [] },
      };
      const whiteListRecords: any[] = items;
      for (let i = 0; i < whiteListRecords.length; i++) {
        const fields = whiteListRecords[i];
        const app: 'qa' | 'msg' | 'act' | 'gpt' = fields['app']?.split('|')[1];
        // logger.info('当前app:' + app)
        if (fields['name'] || fields['id'] || fields['alias']) {
          if (fields['type'] === '群') {
            const room: BusinessRoom = {
              topic: fields['name'],
              id: fields['id'],
            };
            whiteList.roomWhiteList[app].push(room);
          } else {
            const contact: BusinessUser = {
              name: fields['name'],
              alias: fields['alias'],
              id: fields['id'],
            };
            whiteList.contactWhiteList[app].push(contact);
          }
        }
      }

      console.info('获取的最新白名单:' + JSON.stringify(whiteList));

      res.code = 200;
      res.message = 'success';
      res.data = whiteList;
    }
    return res;
  }

  @Post('list/white/create')
  async create(@Body() body: any, @Request() req: any): Promise<string> {
    console.debug('white create', body);
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);

    const res: any = { code: 400, message: 'fail', data: {} };
    try {
      const resCreate = await db.db.whiteList.create(body);
      res.data = resCreate;
      console.debug('resCreate', resCreate);
      if (resCreate.data.recordId) {
        res.code = 200;
        res.message = 'success';
      }
    } catch (e) {
      console.error('white create error', e);
      res.data = e;
    }
    return res;
  }
  @Post('list/white/delete')
  async delete(@Body() body: any, @Request() req: any): Promise<string> {
    //   {
    //     "recordId":21705
    // }
    console.debug('white delete', body);
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);

    const resDel = await db.db.whiteList.delete(body.recordId);
    console.debug('white resDel', resDel);

    let res: any = {
      code: 400,
      message: 'error',
      data: resDel,
    };
    if (resDel.message === 'success') {
      res = {
        code: 200,
        message: 'success',
        data: {
          recordId: body.recordId,
        },
      };
    }
    return res;
  }
  @Get('list/black')
  async findAllBlack(@Request() req: any): Promise<string> {
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);

    const data = await db.db.whiteList.findAll();
    // console.debug(data);
    const res: any = {
      code: 400,
      message: 'error',
      data,
    };
    if (data.data.length) {
      const items = data.data.map((value: any) => {
        const fields = value.fields;
        fields.recordId = value.recordId;
        return fields;
      });
      res.code = 200;
      res.message = 'success';
      res.data = {
        page: 1,
        pageSize: 1000,
        pageCount: 1,
        itemCount: data.data.length,
        items: items,
      };
    }
    return res;
  }
}
