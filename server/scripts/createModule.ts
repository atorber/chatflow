// createModule.ts
import { execSync } from 'child_process';
import { existsSync, mkdirSync, renameSync } from 'fs';
import { join } from 'path';

const moduleName = process.argv[2]; // 获取传递的模块名称

if (!moduleName) {
  console.error('Please provide a module name.');
  process.exit(1);
}

try {
  execSync(`nest g service ${moduleName}`, { stdio: 'inherit' });
  execSync(`nest g controller ${moduleName}`, { stdio: 'inherit' });
  execSync(`nest g module ${moduleName}`, { stdio: 'inherit' });
  console.log(`Module ${moduleName} created successfully.`);
  // 路径设置
  // 获取当前目录的上一层目录
  const parentDir = join(__dirname, '..');
  const sourceDir = join(parentDir, `/src/${moduleName}`);
  const targetDir = join(parentDir, '/src/modules', moduleName);

  // 确保目标目录存在
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  // 移动文件夹
  renameSync(sourceDir, targetDir);
  console.log(`Module ${moduleName} created and moved successfully.`);
} catch (error) {
  console.error('Error creating module:', error);
}
