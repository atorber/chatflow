// 根据DB类型导入对应的DB模块，默认使用Vika，更好的方式时根据环境变量来判断自动选择
import { BiTable } from './vika-db.js';
import { BaseEntity } from './vika-orm.js';

// 如果使用Lark，可以使用以下方式导入
// import { BiTable } from './lark-db.js';
// import { BaseEntity } from './lark-orm.js';

export { BiTable, BaseEntity };

/**
 * 实体类映射选项
 */
export interface MappingOptions {
  // 表名
  tableName: string;

  // 字段映射
  fieldMapping: Record<string, string>;
}

export interface DateBase {
  messageSheet: string;
  keywordSheet: string;
  contactSheet: string;
  roomSheet: string;
  envSheet: string;
  whiteListSheet: string;
  noticeSheet: string;
  statisticSheet: string;
  orderSheet: string;
  stockSheet: string;
  groupNoticeSheet: string;
  qaSheet: string;
  chatBotSheet: string;
  chatBotUserSheet: string;
  groupSheet: string;
  welcomeSheet: string;
  mediaSheet: string;
  carpoolingSheet: string;
}

export type BiTableConfig = {
  spaceId: string;
  token: string;
};
