@echo off
REM Batch script to install dependencies and start server
REM Run this file to quickly setup and start the backend

echo.
echo ========================================
echo   KOPI KUBA - Backend Setup & Start
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
)

echo.
echo Starting Kopi Kuba Backend Server...
echo.
echo Server akan berjalan di: http://localhost:3000
echo Database: kopikuba.db
echo.
echo Tekan CTRL+C untuk menghentikan server
echo.

call npm start

pause
