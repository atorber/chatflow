import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { Store } from '../../db/store.js';
import { NoticesService } from './notices.service.js';

@Controller('api/v1/notice')
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}
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
    const data = await db.db.notice.findAll();
    const items = data.data.map((value: any) => {
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
        itemCount: data.data.length,
        items: items,
      },
    };
    return res;
  }

  @Get('task')
  async getTimedTask(@Request() req: any): Promise<string> {
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);
    const data = await db.db.notice.findAll();
    const items = data.data.map((value: any) => {
      const fields = value.fields;
      fields.recordId = value.recordId;
      return fields;
    });

    const jobs = this.noticesService.getTimedTask(items);

    // console.debug(data);
    const res: any = {
      code: 200,
      message: 'success',
      data: {
        page: 1,
        pageSize: 1000,
        pageCount: 1,
        itemCount: jobs.length,
        items: jobs,
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

    const resCreate = await db.db.notice.create(body);
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
    console.debug('notice delete', body);
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);

    const resDel = await db.db.notice.delete(body.recordId);
    console.debug('notice resDel', resDel);

    let res: any = {
      code: 400,
      message: 'error',
      data: {},
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
