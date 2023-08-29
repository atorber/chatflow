/* eslint-disable sort-keys */

/*
定义一个消息管理接口，至少包含以下几个动作，给出ts示例代码：
新增消息记录
获取消息列表（支持通过好友ID/群组ID进行筛选）
删除指定消息
更新指定消息
*/

export interface Message {
    id: string;
    content: string;
    timestamp: Date;
    friendId?: string;
    groupId?: string;
    // Other properties related to the message
  }

export interface MessageManager {
    addMessage(message: Message): void;
    getMessageList(filter?: { friendId?: string, groupId?: string }): Message[];
    deleteMessage(messageId: string): boolean;
    updateMessage(messageId: string, updatedContent: string): boolean;
  }
