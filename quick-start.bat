@echo off
REM ============================================
REM Quick Start - Frontend & Backend
REM ============================================

title Starting Brilian's Portal - Frontend & Backend

echo.
echo ========================================
echo   🚀 SETUP DEVELOPMENT ENVIRONMENT
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js tidak terinstall!
    echo Install dari: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Semua requirement terinstall
echo.
echo Langkah:
echo 1. Backend server akan dibuka di terminal baru
echo 2. Buka index.html di VS Code
echo 3. Klik "Go Live" untuk buka frontend
echo.
pause

REM Open Backend in new window
start cmd /k "cd Backend && node script.js"

echo.
echo ✨ Backend sudah dibuka!
echo Buka index.html di VS Code dan klik "Go Live"
echo.
pause
