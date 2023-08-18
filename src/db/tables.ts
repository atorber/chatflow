import DB from './nedb.js'

export interface Database {
  message: any;
  bot: any;
  room: any;
  contact: any;
}

export const db: Database = {
  bot: DB('data/db/bots.db'),
  contact: DB('data/db/contacts.db'),
  message: DB('data/db/messages.db'),
  room: DB('data/db/rooms.db'),
}
