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

@Controller('api/v1/contact')
export class ContactsController {
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
    const res = await db.db.contact.findAll();
    // console.debug(res);
    const contacts: any = {
      code: 200,
      message: 'success',
      data: {
        items: [
          {
            avatar:
              'http://localhost:5173/files/public/media/image/avatar/20231022/4f67de6461b9e930be9ac97b3a6cee4c_200x200.png',
            gender: 0,
            group_id: 0,
            id: 7,
            is_online: 0,
            motto: '',
            nickname: 'test5',
            remark: 'test5',
          },
        ],
      },
    };

    const items: any[] = res.data
      .map((value: any) => {
        if (value.fields.name) {
          return {
            avatar:
              value.fields.avatar ||
              'http://localhost:5173/files/public/media/image/avatar/20231022/4f67de6461b9e930be9ac97b3a6cee4c_200x200.png',
            gender: value.fields.gender,
            group_id: value.fields.groupName || '',
            id: value.fields.id,
            is_online: 0,
            motto: '',
            nickname: value.fields.name,
            remark: value.fields.alias,
            recordId: value.recordId,
          };
        } else {
          return false;
        }
      })
      .filter((item: any) => item !== false);

    contacts.data.items = items;
    return contacts;
  }
  @Get('list/raw')
  async findAllRaw(@Request() req: any): Promise<string> {
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);
    const res = await db.db.contact.findAll();
    // console.debug(res);
    const contacts: any = {
      code: 200,
      message: 'success',
      data: {
        items: [],
      },
    };

    const items: any[] = res.data
      .map((value: any) => {
        const fields = value.fields;
        if (fields) {
          fields.recordId = value.recordId;
          return fields;
        } else {
          return false;
        }
      })
      .filter((item: any) => item !== false);

    contacts.data.items = items;
    return contacts;
  }
  // 批量更新配置信息
  @Post('create/batch')
  async createBatch(@Request() req: any, @Body() body: any) {
    // console.debug('create records body:', JSON.stringify(body));
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const userCur = Store.findUser(user.userId);
    // console.debug('create records db userCur:', userCur?.userId || undefined);
    if (!userCur) {
      throw new UnauthorizedException();
    }
    // console.debug(db);
    const res = await userCur.db.contact.createBatch(body);
    // console.debug('create records res:', res);
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
  @Post('delete')
  async delete(@Body() body: any, @Request() req: any): Promise<string> {
    //   {
    //     "recordId":21705
    // }
    console.debug('contact delete', body);
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);

    const resDel = await db.db.contact.delete(body.recordId);
    console.debug('contact resDel', resDel);

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
  @Post('deleteBatch')
  async deleteBatch(@Body() body: any, @Request() req: any): Promise<string> {
    //   {
    //     "recordId":21705
    // }
    console.debug('contact deleteBatch', body);
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);

    const resDel = await db.db.contact.deleteBatch(body.recordIds);
    console.debug('contact resDel', resDel);

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
    console.debug('api/v1/contact/update body:', body);
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);
    const res = await db.db.contact.updatEmultiple(body);
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
  @Get('detail')
  async findDetail(
    @Request() req: any,
    @Query() query: { user_id: string },
  ): Promise<any> {
    console.debug(query);
    const id = query.user_id;
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);

    let contact: any = {
      code: 200,
      message: 'success',
      data: {
        avatar:
          'http://localhost:5173/files/public/media/image/avatar/20231022/4f67de6461b9e930be9ac97b3a6cee4c_200x200.png',
        gender: 0,
        group_id: 0,
        id: 7,
        is_online: 0,
        motto: '',
        nickname: 'test5',
        remark: 'test5',
      },
    };
    const res = await db.db.contact.findByField('id', id);
    let item = {};
    if (res.data.length > 0) {
      const value: any = res.data[0];
      console.debug('value', JSON.stringify(value));
      item = {
        avatar:
          value.fields.avatar ||
          'http://localhost:5173/files/public/media/image/avatar/20231022/4f67de6461b9e930be9ac97b3a6cee4c_200x200.png',
        gender: value.fields.gender,
        group_id: value.fields.groupName || '',
        id: value.fields.id,
        is_online: 0,
        motto: '',
        nickname: value.fields.name,
        remark: value.fields.alias,
        recordId: value.recordId,
        email: 0,
        friend_apply: 0,
        friend_status: 2,
        mobile: '--',
      };
      contact.data = item;
    } else {
      contact = {
        code: 305,
        message: '用户不存在',
        data: res,
      };
    }

    console.debug('contact', contact);
    return contact;
  }
  // 更新好友所属分组
  @Post('move-group')
  moveGroup(@Body() body: { apply_id: string; remark: string }): any {
    console.debug('acceptApply', body);
    return { code: 200, message: 'success', data: {} };
  }

  // @Get('group/list')
  // async findGroup(@Request() req: any): Promise<string> {
  //   const user = req.user;
  //   // console.debug(user);
  //   // console.debug(Store.users);
  //   const db = Store.findUser(user.userId);
  //   if (!db) {
  //     throw new UnauthorizedException();
  //   }
  //   // console.debug(db);
  //   ContactsService.setVikaOptions({
  //     apiKey: db.token,
  //     baseId: db.dataBaseIds.contactSheet, // 设置 base ID
  //   });
  //   const res = await ContactsService.findAll();
  //   // console.debug(res);
  //   let contacts: any = {
  //     code: 200,
  //     message: 'success',
  //     data: {
  //       items: [
  //         {
  //           avatar:
  //             'http://localhost:5173/files/public/media/image/avatar/20231022/4f67de6461b9e930be9ac97b3a6cee4c_200x200.png',
  //           gender: 0,
  //           group_id: 0,
  //           id: 7,
  //           is_online: 0,
  //           motto: '',
  //           nickname: 'test5',
  //           remark: 'test5',
  //         },
  //       ],
  //     },
  //   };

  //   const items = res
  //     .map((value: any) => {
  //       if (value.fields.name) {
  //         return {
  //           avatar:
  //             value.fields.avatar ||
  //             'http://localhost:5173/files/public/media/image/avatar/20231022/4f67de6461b9e930be9ac97b3a6cee4c_200x200.png',
  //           gender: value.fields.gender,
  //           group_id: 0,
  //           id: value.fields.id,
  //           is_online: 0,
  //           motto: '',
  //           nickname: value.fields.name,
  //           remark: value.fields.alias,
  //           recordId: value.recordId,
  //         };
  //       }
  //       return false;
  //     })
  //     .filter((item) => item !== false);

  //   contacts.data.items = items;
  //   contacts = {
  //     code: 200,
  //     message: 'success',
  //     data: {
  //       items: [
  //         {
  //           count: 0,
  //           id: 0,
  //           name: '全部',
  //           sort: 0,
  //         },
  //       ],
  //     },
  //   };
  //   return contacts;
  // }

  @Get('apply/records')
  async findApplyRecords(@Request() req: any): Promise<string> {
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);
    const res = await db.db.contact.findAll();
    // console.debug(res);
    let contacts: any = {
      code: 200,
      message: 'success',
      data: {
        items: [
          {
            avatar:
              'http://localhost:5173/files/public/media/image/avatar/20231022/4f67de6461b9e930be9ac97b3a6cee4c_200x200.png',
            gender: 0,
            group_id: 0,
            id: 7,
            is_online: 0,
            motto: '',
            nickname: 'test5',
            remark: 'test5',
          },
        ],
      },
    };

    const items = res.data
      .map((value: any) => {
        if (value.fields.name) {
          return {
            avatar:
              value.fields.avatar ||
              'http://localhost:5173/files/public/media/image/avatar/20231022/4f67de6461b9e930be9ac97b3a6cee4c_200x200.png',
            gender: value.fields.gender,
            group_id: 0,
            id: value.fields.id,
            is_online: 0,
            motto: '',
            nickname: value.fields.name,
            remark: value.fields.alias,
            recordId: value.recordId,
          };
        }
        return false;
      })
      .filter((item: any) => item !== false);

    contacts.data.items = items;
    contacts = {
      code: 200,
      message: 'success',
      data: {
        items: [
          {
            avatar:
              'https://im.gzydong.com/public/media/image/avatar/20230530/f76a14ce98ca684752df742974f5473a_200x200.png',
            created_at: '2023-10-24 17:12:32',
            friend_id: 4559,
            id: 238,
            nickname: '老牛逼了1',
            remark: '123',
            user_id: 2055,
          },
        ],
      },
    };
    return contacts;
  }

  @Get('apply/unread-num')
  findUnread(): any {
    return { code: 200, message: 'success', data: { unread_num: 0 } };
  }

  @Post('apply/accept')
  acceptApply(@Body() body: { apply_id: string; remark: string }): any {
    console.debug('acceptApply', body);
    return { code: 200, message: 'success', data: {} };
  }

  @Post('edit-remark')
  editRemark(@Body() body: { friend_id: string; remark: string }): any {
    console.debug('editRemark', body);
    return { code: 200, message: 'success', data: {} };
  }
}
