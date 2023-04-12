#!/bin/bash

# 检查 Node.js 是否已经安装
function check_node {
  if command -v node > /dev/null 2>&1; then
    # 如果已经安装，则直接运行程序
    run_program
  else
    # 如果未安装，则下载并安装 Node.js
    install_node
  fi
}

install_node() {
  # 下载 Node.js 安装程序
  NODE_VERSION=16.13.2
  NODE_FILENAME=node-v${NODE_VERSION}-darwin-x64.tar.gz
  NODE_URL=https://nodejs.org/dist/v${NODE_VERSION}/${NODE_FILENAME}

  # 检查文件是否已经存在
  if [ -f "${NODE_FILENAME}" ]; then
    # 如果已经存在，则直接安装 Node.js
    install_node_from_file
  else
    # 如果不存在，则先下载 Node.js 安装程序，再安装 Node.js
    download_node
    install_node_from_file
  fi
}

download_node() {
  # 下载 Node.js 安装程序
  curl -o "${NODE_FILENAME}" "${NODE_URL}"
}

install_node_from_file() {
  # 解压 Node.js 安装程序，并将可执行文件添加到 PATH 环境变量中
  tar -xzf "${NODE_FILENAME}"
  export PATH="$PWD/node-v${NODE_VERSION}-darwin-x64/bin:$PATH"
}

run_program() {
  SCRIPT_RELATIVE_DIR=$(dirname "${BASH_SOURCE}")
  cd $SCRIPT_RELATIVE_DIR
  # 运行程序
  npm install
  npm run sys-init
  npm start
  echo "bot was started successfully."
}

# 调用检查 Node.js 的函数
check_node

# 等待用户按下回车键后退出脚本
read -p "Press [Enter] key to exit."
exit 0