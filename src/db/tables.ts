import DB from './nedb.js'

export interface Database {
  activity:any;
  message: any;
  bot: any;
  room: any;
  contact: any;
  order:any;
}

export const db: Database = {
  activity: DB('data/db/activities.db'),
  bot: DB('data/db/bots.db'),
  contact: DB('data/db/contacts.db'),
  message: DB('data/db/messages.db'),
  order: DB('data/db/orders.db'),
  room: DB('data/db/rooms.db'),
}
