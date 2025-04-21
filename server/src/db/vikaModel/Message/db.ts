import { BaseEntity, MappingOptions } from '../../mod.js';

export class Messages extends BaseEntity {
  timeHms?: string;

  name?: string;

  alias?: string;

  topic?: string;

  listener?: string;

  messagePayload?: string;

  file?: any;

  messageType?: string;

  wxid?: string;

  roomid?: string;

  messageId?: string;

  wxAvatar?: string;

  roomAvatar?: string;

  listenerAvatar?: string;

  // protected static override recordId: string = ''  // 定义记录ID，初始为空字符串

  protected override mappingOptions: MappingOptions = {
    // 定义字段映射选项
    fieldMapping: {
      // 字段映射
      timeHms: '时间|timeHms',
      name: '发送者|name',
      alias: '好友备注|alias',
      topic: '群名称|topic',
      listener: '接收人|listener',
      messagePayload: '消息内容|messagePayload',
      file: '文件图片|file',
      messageType: '消息类型|messageType',
      wxid: '好友ID|wxid',
      listenerid: '接收人ID|listenerid',
      roomid: '群ID|roomid',
      messageId: '消息ID|messageId',
      wxAvatar: '发送者头像|wxAvatar',
      roomAvatar: '群头像|roomAvatar',
      listenerAvatar: '接收人头像|listenerAvatar',
    },
    tableName: '消息记录|Message', // 表名
  }; // 设置映射选项为上面定义的 mappingOptions

  protected override getMappingOptions(): MappingOptions {
    // 获取映射选项的方法
    return this.mappingOptions; // 返回当前类的映射选项
  }

  override setMappingOptions(options: MappingOptions) {
    // 设置映射选项的方法
    this.mappingOptions = options; // 更新当前类的映射选项
  }
}
