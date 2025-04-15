import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { Store } from '../../db/store.js';
import { delay } from '../../utils/utils.js';
import { Env } from '../../db/vikaModel/Env/db.js';

@Controller('/api/v1/users')
export class UsersController {
  @Get('detail')
  async getProfile(@Request() req: any) {
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    console.debug(db);
    const userInfo = {
      code: 200,
      message: 'success',
      data: {
        avatar:
          'https://im.gzydong.com/public/media/image/avatar/20230530/f76a14ce98ca684752df742974f5473a_200x200.png',
        birthday: '2023-06-11',
        email: '837215079@qq.com',
        gender: 2,
        id: '2055',
        mobile: '13800138000',
        motto: '...',
        nickname: '老牛逼了',
        hash: db.hash,
      },
    };

    userInfo.data.nickname = db.nickname;
    userInfo.data.id = db.id;
    return userInfo;
  }

  @Post('change/detail')
  async changeProfile(
    @Request()
    req: {
      avatar: string;
      birthday: string;
      gender: number;
      motto: string;
      nickname: string;
    },
  ) {
    console.debug(req);
    return { code: 200, message: '个人信息修改成功！' };
  }

  @Get('setting')
  async getSetting(@Request() req: any) {
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);
    const userCur = new Env();
    userCur.setVikaOptions({
      apiKey: db.token,
      baseId: db.dataBaseIds.envSheet, // 设置 base ID
    });
    const res = await userCur.findByField('key', 'BASE_BOT_ID');
    console.debug('ServeLoginVika:', res);

    const userInfo: any = {
      code: 200,
      message: 'success',
      data: {
        setting: {
          keyboard_event_notify: '',
          notify_cue_tone: '',
          theme_bag_img: '',
          theme_color: '',
          theme_mode: '',
        },
        user_info: {
          avatar: '',
          email: '',
          gender: 0,
          is_qiye: false,
          mobile: '15901228151',
          motto: '',
          nickname: db.nickname,
          uid: db.id,
          hash: db.hash,
          recordId: res.data[0]?.recordId,
        },
      },
    };

    console.debug('userInfo:', JSON.stringify(userInfo));
    return userInfo;
  }

  @Get('config')
  async getConfig(@Request() req: any) {
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);
    const userCur = new Env();
    userCur.setVikaOptions({
      apiKey: db.token,
      baseId: db.dataBaseIds.envSheet, // 设置 base ID
    });
    // const res = await UsersService.findByField('key', 'BASE_BOT_ID');
    // console.debug('ServeLoginVika:', res);

    const res = await userCur.findAll();
    const data = res.data.map((item: any) => {
      const field = item.fields;
      field.id = item.recordId;
      return field;
    });

    const resInfo: any = {
      code: 200,
      message: 'success',
      data,
    };

    // console.debug('config resInfo:', JSON.stringify(resInfo));
    return resInfo;
  }

  @Get('config/keys')
  async getConfigKeys(@Request() req: any) {
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);
    const userCur = new Env();
    userCur.setVikaOptions({
      apiKey: db.token,
      baseId: db.dataBaseIds.envSheet, // 设置 base ID
    });
    // const res = await UsersService.findByField('key', 'BASE_BOT_ID');
    // console.debug('ServeLoginVika:', res);

    const res = await userCur.findAll();
    const data = res.data.map((item: any) => {
      const field = item.fields;
      field.id = item.recordId;
      return field;
    });

    const vikaData: any = {};
    const configRecords = data;

    for (let i = 0; i < configRecords.length; i++) {
      const fields: any = configRecords[i];

      if (fields['key']) {
        if (fields['value'] && ['false', 'true'].includes(fields['value'])) {
          vikaData[fields['key'] as string] = fields['value'] === 'true';
        } else {
          vikaData[fields['key'] as string] = fields['value'] || '';
        }
      }
    }

    const resInfo: any = {
      code: 200,
      message: 'success',
      data: vikaData,
    };

    // console.debug('config resInfo:', JSON.stringify(resInfo));
    return resInfo;
  }

  @Get('config/group')
  async getConfigGroup(@Request() req: any) {
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);
    const userCur = new Env();
    userCur.setVikaOptions({
      apiKey: db.token,
      baseId: db.dataBaseIds.envSheet, // 设置 base ID
    });
    // const res = await UsersService.findByField('key', 'BASE_BOT_ID');
    // console.debug('ServeLoginVika:', res);

    const res = await userCur.findAll();
    const data: any = {};
    res.data.forEach((item: any) => {
      const field = item.fields;
      if (field.value === 'true') {
        field.value = true;
      } else if (field.value === 'false') {
        field.value = false;
      }
      field.id = item.recordId;
      const group = field.name.split('-')[0];
      field.name = field.name.split('-')[1];
      if (data[group]) {
        data[group].push(field);
      } else {
        data[group] = [field];
      }
    });

    const resInfo: any = {
      code: 200,
      message: 'success',
      data,
    };

    // console.debug('config/group resInfo:', JSON.stringify(resInfo));
    return resInfo;
  }

  // 批量更新配置信息
  @Post('config')
  async setConfig(@Request() req: any, @Body() body: any) {
    console.debug('user/update body:', body);
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    const env = new Env();
    // console.debug(db);
    env.setVikaOptions({
      apiKey: db.token,
      baseId: db.dataBaseIds.envSheet, // 设置 base ID
    });
    const res = await env.updatEmultiple(body);
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

  // 批量更新配置信息
  @Post('config/bykey')
  async updateConfig(@Request() req: any, @Body() body: any) {
    console.debug('user/config/bykey body:', body);
    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }
    // console.debug(db);
    const env = new Env();
    env.setVikaOptions({
      apiKey: db.token,
      baseId: db.dataBaseIds.envSheet, // 设置 base ID
    });
    await delay(500);
    const res = await env.findByField('key', body.key);
    console.debug('wait update config:', res);
    const recordId = res.data[0]?.recordId as string;
    const fields = res.data[0]?.fields as any;
    fields.value = body.value;
    await delay(500);
    const data: any = {
      code: 400,
      message: 'fail',
      data: {},
    };
    try {
      const resUpdate = await env.update(recordId, fields);
      console.debug('update config:', resUpdate);
      if (resUpdate.data.updatedAt) {
        data.code = 200;
        data.message = 'success';
        data.data = resUpdate;
      }
    } catch (e) {
      console.error('update config error:', e);
    }
    return data;
  }
}
