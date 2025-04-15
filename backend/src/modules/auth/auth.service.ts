import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Store } from '../../db/store';
import { BiTable } from '../../db/mod.js';
import { delay } from '../../utils/utils';
import { Env } from '../../db/vikaModel/Env/db.js';
import { Messages } from '../../db/vikaModel/Message/db.js';
import { Chatbots } from '../../db/vikaModel/ChatBot/db.js';
import { ChatbotUsers } from '../../db/vikaModel/ChatBotUser/db.js';
import { Contacts } from '../../db/vikaModel/Contact/db.js';
import { Groupnotices } from '../../db/vikaModel/GroupNotice/db.js';
import { Groups } from '../../db/vikaModel/Group/db.js';
import { Keywords } from '../../db/vikaModel/Keyword/db.js';
import { Notices } from '../../db/vikaModel/Notice/db.js';
import { Orders } from '../../db/vikaModel/Order/db.js';
import { Qas } from '../../db/vikaModel/Qa/db.js';
import { Rooms } from '../../db/vikaModel/Room/db.js';
import { Statistics } from '../../db/vikaModel/Statistic/db.js';
import { Whitelists } from '../../db/vikaModel/WhiteList/db.js';
import { Welcomes } from '../../db/vikaModel/Welcome/db.js';
import { Medias } from '../../db/vikaModel/Media/db.js';
import { Carpoolings } from '../../db/vikaModel/Carpooling/db.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findUser(username);
    if (user && user.password === pass) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async init(username: string, pass: string) {
    const db = new BiTable();
    const res = await db.createSheet({
      token: pass,
      spaceId: username,
    });
    delay(500);
    return res;
  }

  async signIn(username: string, pass: string) {
    let userCur = await this.usersService.findUser(username);
    // console.debug('ServeLoginVika:', user);

    // 如果用户不存在，则验证并创建用户
    const db = new BiTable();
    const dbInit = await db.init({
      token: pass,
      spaceId: username,
    });
    delay(500);
    if (dbInit.data) {
      db.username = username;
      userCur = db;
      userCur.db = {};

      const env = new Env();
      env.setVikaOptions({
        apiKey: db.token,
        baseId: db.dataBaseIds.envSheet, // 设置 base ID
      });
      userCur.db.env = env;

      const message = new Messages();
      message.setVikaOptions({
        apiKey: db.token,
        baseId: db.dataBaseIds.messageSheet, // 设置 base ID
      });
      userCur.db.message = message;

      const chatbot = new Chatbots();
      chatbot.setVikaOptions({
        apiKey: db.token,
        baseId: db.dataBaseIds.chatBotSheet, // 设置 base ID
      });
      userCur.db.chatBot = chatbot;

      const chatbotUser = new ChatbotUsers();
      chatbotUser.setVikaOptions({
        apiKey: db.token,
        baseId: db.dataBaseIds.chatBotUserSheet, // 设置 base ID
      });
      userCur.db.chatBotUser = chatbotUser;

      const contact = new Contacts();
      contact.setVikaOptions({
        apiKey: db.token,
        baseId: db.dataBaseIds.contactSheet, // 设置 base ID
      });
      userCur.db.contact = contact;

      const groupnotice = new Groupnotices();
      groupnotice.setVikaOptions({
        apiKey: db.token,
        baseId: db.dataBaseIds.groupNoticeSheet, // 设置 base ID
      });
      userCur.db.groupNotice = groupnotice;

      const group = new Groups();
      group.setVikaOptions({
        apiKey: db.token,
        baseId: db.dataBaseIds.groupSheet, // 设置 base ID
      });
      userCur.db.group = group;

      const keyword = new Keywords();
      keyword.setVikaOptions({
        apiKey: db.token,
        baseId: db.dataBaseIds.keywordSheet, // 设置 base ID
      });
      userCur.db.keyword = keyword;

      const notice = new Notices();
      notice.setVikaOptions({
        apiKey: db.token,
        baseId: db.dataBaseIds.noticeSheet, // 设置 base ID
      });
      userCur.db.notice = notice;

      const order = new Orders();
      order.setVikaOptions({
        apiKey: db.token,
        baseId: db.dataBaseIds.orderSheet, // 设置 base ID
      });
      userCur.db.order = order;

      const qa = new Qas();
      qa.setVikaOptions({
        apiKey: db.token,
        baseId: db.dataBaseIds.qaSheet, // 设置 base ID
      });
      userCur.db.qa = qa;

      const room = new Rooms();
      room.setVikaOptions({
        apiKey: db.token,
        baseId: db.dataBaseIds.roomSheet, // 设置 base ID
      });
      userCur.db.room = room;

      const statistic = new Statistics();
      statistic.setVikaOptions({
        apiKey: db.token,
        baseId: db.dataBaseIds.statisticSheet, // 设置 base ID
      });
      userCur.db.statistic = statistic;

      const whitelist = new Whitelists();
      whitelist.setVikaOptions({
        apiKey: db.token,
        baseId: db.dataBaseIds.whiteListSheet, // 设置 base ID
      });
      userCur.db.whiteList = whitelist;

      const welcome = new Welcomes();
      welcome.setVikaOptions({
        apiKey: db.token,
        baseId: db.dataBaseIds.welcomeSheet, // 设置 base ID
      });
      userCur.db.welcome = welcome;

      const media = new Medias();
      media.setVikaOptions({
        apiKey: db.token,
        baseId: db.dataBaseIds.mediaSheet, // 设置 base ID
      });
      userCur.db.media = media;

      const carpooling = new Carpoolings();
      carpooling.setVikaOptions({
        apiKey: db.token,
        baseId: db.dataBaseIds.carpoolingSheet, // 设置 base ID
      });
      userCur.db.carpooling = carpooling;

      // 获取配置信息
      const resEnv = await env.findAll();
      // console.debug('ServeLoginVika:', resEnv.data.length);

      const config: any = {};
      resEnv.data.map((item: any) => {
        config[item.fields.key] = item.fields.value || undefined;
      });
      const BASE_BOT_ID: string = config['BASE_BOT_ID'] || '';
      // console.debug('ServeLoginVika:', BASE_BOT_ID);
      db.id = BASE_BOT_ID;

      const BASE_BOT_NAME: string = config['BASE_BOT_NAME'] || '';
      // console.debug('ServeLoginVika:', BASE_BOT_NAME);

      db.nickname = BASE_BOT_NAME || '';
      db.password = pass;
      db.config = config;

      // 缓存用户
      Store.addUser(userCur);
      const payload = {
        username: userCur.username,
        sub: userCur.userId,
      };
      console.debug(Store.users.length);
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      return {
        access_token: '',
      };
    }
  }
}
