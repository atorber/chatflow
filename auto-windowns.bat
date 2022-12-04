@echo off  
 
echo "killing node.exe ..."
 
taskkill /f /im node.exe

echo "node.exe was killed successfully."
 
echo "it will continue to start node.exe in 3 sec ..."

@ping 127.0.0.1 -n 3 >nul

cd /d %~dp0

npm run start

echo "node.exe was started successfully."

exit /b
