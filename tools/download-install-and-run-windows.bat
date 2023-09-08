@echo off

REM 检查 Node.js 是否已经安装
where node >nul 2>nul
if %errorlevel% equ 0 (
  goto run_program
) else (
  goto install_node
)

:install_node
REM 下载 Node.js 安装程序
set NODE_VERSION=16.13.2
set NODE_FILENAME=node-v%NODE_VERSION%-x64.msi
set NODE_URL=https://nodejs.org/dist/v%NODE_VERSION%/%NODE_FILENAME%

REM 检查文件是否已经存在
if exist %NODE_FILENAME% (
  goto install_node
) else (
  goto download_node
)

:download_node
REM 下载 Node.js 安装程序
powershell -Command "& {Invoke-WebRequest -Uri '%NODE_URL%' -OutFile '%NODE_FILENAME%'}"
goto install_node

:install_node
REM 安装 Node.js
msiexec /i %NODE_FILENAME% /qn

:run_program
REM 安装依赖并运行程序
call npm install
call npm run sys-init
call npm start

echo "bot was started successfully."

pause

exit /b