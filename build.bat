@echo off
REM BBrainy Champion Assistance - Build Script (Batch)
REM Builds both client-extension and server-extension

echo.
echo [BUILD] BBrainy Champion Assistance - Build Script
echo [BUILD] ============================================
echo.

setlocal enabledelayedexpansion
set "buildFailed=0"
cd /d "%~dp0"

REM Build client-extension
echo [CLIENT] Building client-extension...
cd client-extension
call npm run package
if errorlevel 1 (
    echo [CLIENT] Error: client-extension build or packaging failed
    set "buildFailed=1"
) else (
    echo [CLIENT] Success: client-extension built and packaged as VSIX
)
cd ..

echo.

REM Build server-extension
echo [SERVER] Building server-extension...
cd server-extension
call npm run build
if errorlevel 1 (
    echo [SERVER] Error: server-extension build failed
    set "buildFailed=1"
) else (
    echo [SERVER] Success: server-extension built successfully
)
cd ..

echo.
echo [BUILD] ============================================

if "%buildFailed%"=="1" (
    echo [BUILD] Result: Build completed with errors
    exit /b 1
) else (
    echo [BUILD] Result: All extensions built successfully!
    exit /b 0
)
