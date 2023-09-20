# 使用Alpine Linux作为基础镜像
FROM node:16

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json（如果存在）
COPY package*.json ./

# 安装依赖
RUN npm install
RUN npm install @swc/core@1.3.78

# 复制所有文件到工作目录
COPY . .

# 设置默认启动命令
CMD ["sh", "-c", "npm run start"]