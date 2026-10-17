@echo off
cd /d "%~dp0"
title Nav-Blog Dev Server

echo ====================================================
echo             Starting Nav-Blog Dev Server
echo ====================================================
echo Local URL: http://localhost:4321
echo CMS Admin: http://localhost:4321/cms
echo Stop:      Press Ctrl+C or close this window
echo ====================================================
echo.

if not exist "node_modules" (
    echo [INFO] Installing dependencies, please wait...
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed!
        pause
        exit /b 1
    )
)

call node scripts/patch-cms.js >nul 2>&1

start "" "http://localhost:4321"
call npm run dev

if errorlevel 1 (
    echo.
    echo [INFO] Server stopped or exited with error.
    pause
)