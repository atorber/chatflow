import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { Store } from '../../db/store.js';

@Controller('api/v1/carpooling')
export class CarpoolingsController {
  @Get('list')
  async findAll(@Request() req: any, @Query() query: any): Promise<string> {
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);
    let data;
    if (query.keyword) {
      data = await db.db.carpooling.findByQuery(query.keyword);
    } else {
      data = await db.db.carpooling.findAll();
    }
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
  @Post('create')
  async create(@Body() body: any, @Request() req: any): Promise<string> {
    console.debug('carpooling create', body);
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
      const resCreate = await db.db.carpooling.create(body);
      res.data = resCreate;
      console.debug('resCreate', resCreate);
      if (resCreate.data.recordId) {
        res.code = 200;
        res.message = 'success';
        res.data = resCreate;
      }
    } catch (e) {
      console.error(e);
      res.message = 'error';
      res.data = e;
    }
    return res;
  }
}
