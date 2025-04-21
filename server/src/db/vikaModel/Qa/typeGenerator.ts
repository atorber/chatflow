/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';

// 创建一个获取当前目录的函数
const getCurrentDir = () => {
  const err = new Error();
  const stack = err.stack?.split('\n');
  // 寻找调用这个函数的位置
  const callerLine = stack?.find((line) => line.includes('at'));
  const match = callerLine?.match(/\((.*):[0-9]+:[0-9]+\)/);
  return match ? path.dirname(match[1] || '') : undefined;
};

// 使用函数获取当前目录
const currentDir = getCurrentDir() || '';

// 读取qa.json文件
const modelFields = JSON.parse(
  fs.readFileSync(path.join(currentDir, 'fields.json'), 'utf-8'),
);

// 初始化一个空字符串来保存生成的TypeScript类型
let tsType = 'export type FieldsData = {\n';

// 遍历字段生成TypeScript类型
modelFields.data.fields.forEach((field: { name: string }) => {
  const nameParts: any = field.name.split('|');
  if (nameParts.length === 2) {
    const tsKey: string = nameParts[1];
    const isRequired = nameParts[0].includes('必填');
    tsType += `  ${tsKey}${isRequired ? '' : '?'}: string;\n`;
  }
});

tsType += '};\n';

tsType += '\nexport type NamesData = {\n';

// 遍历字段生成TypeScript类型
modelFields.data.fields.forEach((field: { name: string }) => {
  const tsKey: string = field.name;
  const isRequired = tsKey.includes('必填');
  tsType += `'${tsKey}${isRequired ? '' : '?'}': string;\n`;
});

tsType += '};\n';

// 将生成的类型写入到qa.ts文件
fs.writeFile(path.join(currentDir, 'types.ts'), tsType, 'utf8', (writeErr) => {
  if (writeErr) {
    console.error('Error writing the file:', writeErr);
  } else {
    console.log('Successfully wrote to types.ts');
  }
});
