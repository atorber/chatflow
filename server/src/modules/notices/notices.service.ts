import { Injectable } from '@nestjs/common';
@Injectable()
export class NoticesService {
  getTimedTask(taskRecords: any[]): TaskConfig[] {
    const timedTasks: TaskConfig[] = taskRecords
      .map((fields: any) => {
        const { desc, time, cycle, type, name, id, alias, state, recordId } =
          fields as TaskFields;

        const isActive = state === '开启';
        const isContact = type === '好友';
        const target = isContact
          ? { name: name || '', id: id || '', alias: alias || '' }
          : { topic: name || '', id: id || '' };

        const taskConfig: TaskConfig = {
          id: recordId,
          msg: desc || '',
          time: Number(time) || 0,
          cycle: cycle || '无重复',
          targetType: isContact ? 'contact' : 'room',
          target,
          active: isActive,
          rule: '',
        };

        taskConfig.rule = getRule(taskConfig);

        return isActive && desc && time && cycle && (name || id || alias)
          ? taskConfig
          : null;
      })
      .filter(Boolean) as TaskConfig[];

    return timedTasks;
  }
}

const getRule = (task: TaskConfig) => {
  const curTimeF = new Date(task.time);
  // const curTimeF = new Date(task.time+8*60*60*1000)
  let curRule = '* * * * * *';
  let dayOfWeek: any = '*';
  let month: any = '*';
  let dayOfMonth: any = '*';
  let hour: any = curTimeF.getHours();
  let minute: any = curTimeF.getMinutes();
  const second = 0;
  const addMonth = [];
  switch (task.cycle) {
    case '每季度':
      month = curTimeF.getMonth();
      for (let i = 0; i < 4; i++) {
        if (month + 3 <= 11) {
          addMonth.push(month);
        } else {
          addMonth.push(month - 9);
        }
        month = month + 3;
      }
      month = addMonth;
      break;
    case '每天':
      break;
    case '每周':
      dayOfWeek = curTimeF.getDay();
      break;
    case '每月':
      month = curTimeF.getMonth();
      break;
    case '每小时':
      hour = '*';
      break;
    case '每30分钟':
      hour = '*';
      minute = [0, 30];
      break;
    case '每15分钟':
      hour = '*';
      minute = [0, 15, 30, 45];
      break;
    case '每10分钟':
      hour = '*';
      minute = [0, 10, 20, 30, 40, 50];
      break;
    case '每5分钟':
      hour = '*';
      minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
      break;
    case '每分钟':
      hour = '*';
      minute = '*';
      break;
    default:
      month = curTimeF.getMonth();
      dayOfMonth = curTimeF.getDate();
      break;
  }
  curRule = `${second} ${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
  return curRule;
};

export type TaskFields = {
  desc?: string;
  time?: string;
  cycle?: string;
  type?: string;
  name?: string;
  id?: string;
  alias?: string;
  state?: string;
  recordId: string;
};

export interface TaskConfig {
  id: string;
  msg: string;
  time: number;
  cycle: string;
  targetType: 'contact' | 'room';
  target: BusinessRoom | BusinessUser;
  active: boolean;
  rule: string;
}

export type BusinessRoom = {
  id?: string;
  luckyDog?: string;
  memberAlias?: string;
  topic: string;
};

export type BusinessUser = {
  alias?: string;
  id?: string;
  name: string;
};
