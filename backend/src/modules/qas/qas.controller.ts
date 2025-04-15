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

@Controller('api/v1/qa')
export class QasController {
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
      data = await db.db.qa.findByQuery(query.keyword);
    } else {
      data = await db.db.qa.findAll();
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
  @Post('create')
  async create(@Body() body: any, @Request() req: any): Promise<string> {
    console.debug('qa create', body);
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
      const resCreate = await db.db.qa.create(body);
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
  @Post('update')
  async update(@Request() req: any): Promise<string> {
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);
    return '';
  }
  @Post('delete')
  async delete(@Body() body: any, @Request() req: any): Promise<string> {
    //   {
    //     "recordId":21705
    // }
    console.debug('welcome delete', body);
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);

    const resDel = await db.db.qa.delete(body.recordId);
    console.debug('welcome resDel', resDel);

    const res: any = {
      code: 400,
      message: 'error',
      data: resDel,
    };
    if (resDel.message === 'success') {
      res.code = 200;
      res.message = 'success';
      res.data = {
        recordId: body.recordId,
      };
    }
    return res;
  }
}
