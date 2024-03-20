import { DB } from './nedb.js'
import path from 'path'

export interface Database {
  activity:any;
  bot: any;
  config:any;
  contact: any;
  env:any;
  groupNotice:any;
  message: any;
  notice:any;
  order:any;
  room: any;
  whiteList:any;
}

export class DataTables {

  static tables: Database | undefined

  constructor () {}

  static createTables = (dataDir:string) => {
    DB.dataDir = path.join(dataDir, 'data/db')
    const tables: Database = {
      activity:new DB('activities.db'),
      bot: new DB('bots.db'),
      config: new DB('configs.db'),
      contact: new DB('contacts.db'),
      env: new DB('envs.db'),
      groupNotice: new DB('groupNotices.db'),
      message: new DB('messages.db'),
      notice: new DB('notices.db'),
      order: new DB('orders.db'),
      room: new DB('rooms.db'),
      whiteList: new DB('whiteLists.db'),
    }
    DataTables.tables = tables
    return tables
  }

  static getTables = () => {
    // eslint-disable-next-line no-console
    console.info('获取数据库表实例', DB.dataDir)
    return DataTables.tables
  }

}
