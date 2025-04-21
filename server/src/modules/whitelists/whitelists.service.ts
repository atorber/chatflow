import { Injectable } from '@nestjs/common';
import { ContactWhiteList, RoomWhiteList } from '../../types/index';
@Injectable()
export class WhitelistsService {}
export type WhiteList = {
  contactWhiteList: ContactWhiteList;
  roomWhiteList: RoomWhiteList;
};
