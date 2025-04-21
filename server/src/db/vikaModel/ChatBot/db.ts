import 'dotenv/config.js';
import { BaseEntity, MappingOptions } from '../../mod.js';

export class Chatbots extends BaseEntity {
  id: string; // 定义名字属性，可选
  name: string;
  desc: string;
  type: string;
  model: string;
  prompt: string;
  quota: string;
  endpoint: string;
  key: string;

  // protected static override recordId: string = ''  // 定义记录ID，初始为空字符串

  protected override mappingOptions: MappingOptions = {
    // 定义字段映射选项
    fieldMapping: {
      // 字段映射
      id: '机器人ID|id',
      name: '昵称|name',
      desc: '描述|desc',
      type: '类型|type',
      model: '模型|model',
      prompt: '系统提示词|prompt',
      quota: '配额|quota',
      endpoint: '接入点|endpoint',
      key: '密钥|key',
    },
    tableName: '智聊|Chatbot', // 表名
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
