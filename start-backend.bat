@echo off
REM ============================================
REM Start Backend Server - Brilian's Project
REM ============================================

title Backend Server - Brilian Portal

echo.
echo ========================================
echo   🚀 STARTING BACKEND SERVER
echo ========================================
echo.

REM Navigate to Backend folder
cd /d "%~dp0Backend"

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ ERROR: Node.js tidak terinstall!
    echo Silakan install dari: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Start the backend server
echo ✅ Node.js ditemukan. Memulai server...
echo.
node script.js

REM If server stops, pause so user can see the error
pause
