import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { Store } from '../../db/store.js';

@Controller('api/v1/groupnotice')
export class GroupnoticesController {
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

    const data = await db.db.groupNotice.findAll();
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
    const resCreate = await db.db.groupNotice.create(body);
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
    console.debug('groupnotice delete', body);
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);
    const resDel = await db.db.groupNotice.delete(body.recordId);
    console.debug('groupnotice resDel', resDel);

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
  // 批量更新配置信息
  @Post('update')
  async update(@Request() req: any, @Body() body: any) {
    console.debug('group/update body:', body);
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);
    const res = await db.db.groupNotice.updatEmultiple(body);
    console.debug('update config:', res);
    const data: any = {
      code: 400,
      message: 'fail',
      data: {},
    };
    if (res.message === 'success') {
      data.code = 200;
      data.message = 'success';
      data.data = res.data;
    }

    return data;
  }
}
