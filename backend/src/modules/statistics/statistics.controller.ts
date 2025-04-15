import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { Store } from '../../db/store.js';

@Controller('api/v1/statistic')
export class StatisticsController {
  @Get('list')
  async findAll(@Request() req: any): Promise<string> {
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);
    try {
      const data = await db.db.statistic.findAll();
      // console.debug('Statistics data', data);
      const res: any = {
        code: 200,
        message: 'success',
        data,
      };
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
      return res;
    } catch (e) {
      console.error(e);
      const res: any = {
        code: 400,
        message: 'error',
        data: e,
      };
      return res;
    }
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

    const resCreate = await db.db.statistic.create(body);
    console.debug('resCreate', resCreate);
    const res: any = { code: 400, message: 'fail', data: { data: resCreate } };
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
    console.debug('statistic delete', body);
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);

    const resDel = await db.db.statistic.delete(body.recordId);
    console.debug('statistic resDel', resDel);

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
}
