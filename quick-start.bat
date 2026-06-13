@echo off
chcp 65001 >nul
REM ============================================
REM Quick Start - Frontend & Backend
REM ============================================

title Starting Brilian's Portal - Frontend & Backend

echo.
echo ========================================
echo   SETUP DEVELOPMENT ENVIRONMENT
echo ========================================
echo.

REM Navigate to the script's own directory
cd /d "%~dp0"

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js tidak terinstall!
    echo Install dari: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js ditemukan: 
node -v

REM Check if Backend dependencies are installed
if not exist "%~dp0Backend\node_modules" (
    echo.
    echo [INFO] Installing Backend dependencies...
    cd /d "%~dp0Backend"
    npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Gagal install dependencies!
        pause
        exit /b 1
    )
    cd /d "%~dp0"
    echo [OK] Dependencies terinstall
) else (
    echo [OK] Backend dependencies sudah ada
)

echo.
echo ========================================
echo   STARTING SERVICES
echo ========================================
echo.

REM Start Backend in a new window
echo [INFO] Memulai Backend server...
start "Backend Server" cmd /k "cd /d "%~dp0Backend" && node script.js"

REM Wait a moment for backend to initialize
timeout /t 3 /nobreak >nul

REM Auto-open Frontend in default browser
echo [INFO] Membuka Frontend di browser...
start "" "%~dp0Frontend\index.html"

echo.
echo ========================================
echo   SEMUA SUDAH BERJALAN!
echo ========================================
echo.
echo   Backend  : http://localhost:3000
echo   Frontend : Dibuka di browser
echo.
echo   Tekan tombol apa saja untuk menutup window ini.
echo   (Backend tetap berjalan di window terpisah)
echo.
pause
