import { BaseEntity, MappingOptions } from '../../mod.js';

export class ChatbotUsers extends BaseEntity {
  id: string; // 定义名字属性，可选
  botname: string;
  wxid: string;
  name: string;
  alias: string;
  prompt: string;
  quota: string;
  state: string;
  info: string;
  // protected static override recordId: string = ''  // 定义记录ID，初始为空字符串

  protected override mappingOptions: MappingOptions = {
    // 定义字段映射选项
    fieldMapping: {
      // 字段映射
      id: '机器人ID|id',
      botname: '昵称|botname',
      wxid: '用户ID|wxid',
      name: '用户名称|name',
      alias: '好友备注(选填)|alias',
      prompt: '用户提示词|prompt',
      quota: '配额|quota',
      state: '启用状态|state',
      info: '备注|info',
    },
    tableName: '智聊用户|ChatbotUser', // 表名
  };

  protected override getMappingOptions(): MappingOptions {
    // 获取映射选项的方法
    return this.mappingOptions; // 返回当前类的映射选项
  }

  override setMappingOptions(options: MappingOptions) {
    // 设置映射选项的方法
    this.mappingOptions = options; // 更新当前类的映射选项
  }
}
