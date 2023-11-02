import DB from './nedb.js'

export interface Database {
  activity:any;
  message: any;
  bot: any;
  room: any;
  contact: any;
  order:any;
  env:any;
  groupNotice:any;
  notice:any;
  whiteList:any;
  config:any;
}

export const db: Database = {
  activity: DB('data/db/activities.db'),
  bot: DB('data/db/bots.db'),
  contact: DB('data/db/contacts.db'),
  env: DB('data/db/envs.db'),
  groupNotice: DB('data/db/groupNotices.db'),
  message: DB('data/db/messages.db'),
  notice: DB('data/db/notices.db'),
  order: DB('data/db/orders.db'),
  room: DB('data/db/rooms.db'),
  whiteList: DB('data/db/whiteLists.db'),
  config: DB('data/db/configs.db'),
}
