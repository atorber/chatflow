/* eslint-disable sort-keys */
// 时间格式化
function formatTimestamp(timestamp: string | number | Date) {
  const currentDate = new Date(timestamp);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const hour = currentDate.getHours();
  const minute = currentDate.getMinutes();
  const second = currentDate.getSeconds();
  const dayOfWeek = currentDate.getDay();

  const startOfDayTimestamp: number = currentDate.setHours(0, 0, 0, 0);
  const endOfDayTimestamp: number = startOfDayTimestamp + 60 * 60 * 24 * 1000;
  const daysOfWeek: string[] = ['日', '一', '二', '三', '四', '五', '六'];
  const dayText: string = '周' + daysOfWeek[dayOfWeek];
  const timeText: string = `${hour < 10 ? '0' + hour : hour}:${
    minute < 10 ? '0' + minute : minute
  }:${second < 10 ? '0' + second : second}`;
  const dateText: string = `${month}月${day}日`;
  const dateTimeText: string = `${year}-${month}-${day} ${dayText} ${timeText}`;

  const res: [string, number, number, string, string, string] = [
    dateText,
    startOfDayTimestamp,
    endOfDayTimestamp,
    dayText,
    timeText,
    dateTimeText,
  ];
  return res;
}

/**
 * 延时函数
 * @param {*} ms 毫秒
 */
async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getNow() {
  return new Date().toLocaleString();
}

function getCurTime() {
  // timestamp是整数，否则要parseInt转换
  const timestamp = new Date().getTime();
  const timezone = 8; // 目标时区时间，东八区
  const offsetGMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
  const time = timestamp + offsetGMT * 60 * 1000 + timezone * 60 * 60 * 1000;
  return time;
}

export function getCurrentTime(timestamp?: number) {
  const now = timestamp ? new Date(timestamp) : new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();
  return `${year}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute
    .toString()
    .padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
}

// 半角转全角
function toDBC(txtstring: any) {
  let tmp = '';
  let h = 0;
  let c = 0;
  for (let i = 0; i < txtstring.length; i++) {
    if (txtstring.charCodeAt(i) === 32) {
      tmp = tmp + String.fromCharCode(12288);
      h += 1;
    } else if (txtstring.charCodeAt(i) < 127) {
      tmp = tmp + String.fromCharCode(txtstring.charCodeAt(i) + 65248);
      h += 1;
    } else {
      tmp = tmp + txtstring[i];
      c += 1;
    }
  }
  return [tmp, h, c];
}

function generateRandomNumber(base: number): number {
  return Math.floor(Math.random() * 100) + base;
}

export {
  generateRandomNumber,
  toDBC,
  getNow,
  delay,
  formatTimestamp,
  getCurTime,
};
