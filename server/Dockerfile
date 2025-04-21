# 使用更小的基础镜像
FROM node:18.20.2
# FROM node:18.17.0-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json 并执行 npm install
COPY package.json ./

# 安装 pkg-config 工具
RUN apt-get update && apt-get install -y pkg-config
# RUN apk add --update pkgconfig
# RUN apk add --update python3 make g++ && \
#     ln -sf python3 /usr/bin/python

# 对于Debian或Ubuntu基础镜像
RUN apt-get update && apt-get install -y fonts-noto-cjk

RUN npm install

# 复制应用程序文件
COPY . .

# 设置启动命令
CMD [ "npm", "run", "dev" ]
