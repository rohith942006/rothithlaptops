@echo off
title Rohith Laptops
cd /d "%~dp0"
where node >nul 2>nul || (echo Please install Node.js LTS from https://nodejs.org then run this again. & start https://nodejs.org & pause & exit /b)
if not exist node_modules (echo Installing - first time only, please wait... & call npm install)
if not exist public\products (echo Downloading real product photos - first time only... & call npm run images)
start "" http://localhost:3000
call npm run dev
pause
