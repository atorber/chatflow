import {
  Controller,
  Query,
  Request,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { Store } from '../../db/store.js';

@Controller('api/v1/welcome')
export class WelcomesController {
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
      data = await db.db.welcome.findByQuery(query.keyword);
    } else {
      data = await db.db.welcome.findAll();
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
}
