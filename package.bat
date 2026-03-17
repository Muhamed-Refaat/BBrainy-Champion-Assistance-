@echo off
REM BBrainy Champion Assistance - Package ^& VSIX Builder
REM Builds both extensions, bumps versions, and produces .vsix files
REM for generic, Windows, and Ubuntu/WSL ^(linux-x64^).
REM
REM Usage:
REM   package.bat                        - package with current versions
REM   package.bat <client-ver>           - e.g. package.bat 1.2.0
REM   package.bat <client-ver> <srv-ver> - e.g. package.bat 1.2.0 1.0.5
REM
REM The packaged client .vsix files are copied to:
REM   - \\cai1-users\share\AI-Champion-Assist\client-release\release
REM All produced VSIX files are also copied to root .\package\

echo.
echo [PACKAGE] BBrainy Champion Assistance - Package Script
echo [PACKAGE] =============================================
echo.

setlocal enabledelayedexpansion
set "buildFailed=0"
cd /d "%~dp0"

set "ROOT_PACKAGE_DIR=%CD%\package"
if not exist "%ROOT_PACKAGE_DIR%" mkdir "%ROOT_PACKAGE_DIR%" >nul 2>&1

REM ── Version arguments ────────────────────────────────────────────────────────
set "CLIENT_VER="
set "SERVER_VER="
set "CLIENT_RELEASE_DIR=\\cai1-users\share\AI-Champion-Assist\client-release\release"

if not "%~1"=="" set "CLIENT_VER=%~1"
if not "%~2"=="" set "SERVER_VER=%~2"

REM ── Validate semver helper (basic x.y.z check via PowerShell) ────────────────
if not "%CLIENT_VER%"=="" (
    powershell -NoProfile -Command "if ('%CLIENT_VER%' -notmatch '^\d+\.\d+\.\d+$') { exit 1 }"
    if errorlevel 1 (
        echo [PACKAGE] Error: client version '%CLIENT_VER%' is not valid semver ^(expected x.y.z^)
        exit /b 1
    )
)
if not "%SERVER_VER%"=="" (
    powershell -NoProfile -Command "if ('%SERVER_VER%' -notmatch '^\d+\.\d+\.\d+$') { exit 1 }"
    if errorlevel 1 (
        echo [PACKAGE] Error: server version '%SERVER_VER%' is not valid semver ^(expected x.y.z^)
        exit /b 1
    )
)

REM ── Check vsce is available ──────────────────────────────────────────────────
where vsce >nul 2>&1
if errorlevel 1 (
    echo [PACKAGE] Error: 'vsce' not found. Install it with: npm install -g @vscode/vsce
    exit /b 1
)

REM ════════════════════════════════════════════════════════════════════════════
REM  CLIENT EXTENSION
REM ════════════════════════════════════════════════════════════════════════════
echo [CLIENT] Processing client-extension...
cd client-extension

REM -- Read current version from package.json
for /f "delims=" %%V in ('powershell -NoProfile -Command "(Get-Content package.json | ConvertFrom-Json).version"') do set "CLIENT_CURRENT_VER=%%V"
echo [CLIENT] Current version: %CLIENT_CURRENT_VER%

REM -- Bump version in package.json if requested
if not "%CLIENT_VER%"=="" (
    if not "%CLIENT_VER%"=="%CLIENT_CURRENT_VER%" (
        echo [CLIENT] Updating package.json version: %CLIENT_CURRENT_VER% ^-^> %CLIENT_VER%
        powershell -NoProfile -Command ^
            "$pkg = Get-Content 'package.json' -Raw | ConvertFrom-Json; $pkg.version = '%CLIENT_VER%'; $pkg | ConvertTo-Json -Depth 20 | Set-Content 'package.json'"
        if errorlevel 1 (
            echo [CLIENT] Error: Failed to update version in package.json
            cd ..
            exit /b 1
        )
        set "CLIENT_CURRENT_VER=%CLIENT_VER%"
    ) else (
        echo [CLIENT] Version already %CLIENT_VER%, no change needed
    )
)

REM -- Build (esbuild bundle)
echo [CLIENT] Building...
call npm run build
if errorlevel 1 (
    echo [CLIENT] Error: Build failed
    set "buildFailed=1"
    cd ..
    goto SERVER_SECTION
)
echo [CLIENT] Built successfully

REM -- Package generic
set "CLIENT_VSIX=client-monitor-%CLIENT_CURRENT_VER%.vsix"
echo [CLIENT] Packaging generic VSIX...
call :DeleteIfExists "%CLIENT_VSIX%"
echo y| call vsce package --no-dependencies -o "%CLIENT_VSIX%" 2>&1
if errorlevel 1 (
    echo [CLIENT] Error: generic package failed
    set "buildFailed=1"
)

REM -- Package Windows
set "CLIENT_VSIX_WIN=client-monitor-%CLIENT_CURRENT_VER%-win32-x64.vsix"
echo [CLIENT] Packaging Windows VSIX...
call :DeleteIfExists "%CLIENT_VSIX_WIN%"
echo y| call vsce package --no-dependencies --target win32-x64 -o "%CLIENT_VSIX_WIN%" 2>&1
if errorlevel 1 (
    echo [CLIENT] Warning: Windows target package failed
)

REM -- Package Ubuntu/WSL
set "CLIENT_VSIX_LINUX=client-monitor-%CLIENT_CURRENT_VER%-linux-x64.vsix"
echo [CLIENT] Packaging Ubuntu/WSL VSIX...
call :DeleteIfExists "%CLIENT_VSIX_LINUX%"
echo y| call vsce package --no-dependencies --target linux-x64 -o "%CLIENT_VSIX_LINUX%" 2>&1
if errorlevel 1 (
    echo [CLIENT] Warning: Linux target package failed
)

if exist "%CLIENT_VSIX%" echo [CLIENT] Created: %CLIENT_VSIX%
if exist "%CLIENT_VSIX_WIN%" echo [CLIENT] Created: %CLIENT_VSIX_WIN%
if exist "%CLIENT_VSIX_LINUX%" echo [CLIENT] Created: %CLIENT_VSIX_LINUX%

REM -- Copy all client VSIX to root package folder
call :CopyIfExistsToDir "%CLIENT_VSIX%" "%ROOT_PACKAGE_DIR%"
call :CopyIfExistsToDir "%CLIENT_VSIX_WIN%" "%ROOT_PACKAGE_DIR%"
call :CopyIfExistsToDir "%CLIENT_VSIX_LINUX%" "%ROOT_PACKAGE_DIR%"

REM -- Copy client VSIX to fixed release folder
if not defined CLIENT_RELEASE_DIR set "CLIENT_RELEASE_DIR=\\cai1-users\share\AI-Champion-Assist\client-release\release"
echo [CLIENT] Copying client VSIX files to:
echo          !CLIENT_RELEASE_DIR!
call :CopyIfExistsToDir "%CLIENT_VSIX%" "!CLIENT_RELEASE_DIR!"
call :CopyIfExistsToDir "%CLIENT_VSIX_WIN%" "!CLIENT_RELEASE_DIR!"
call :CopyIfExistsToDir "%CLIENT_VSIX_LINUX%" "!CLIENT_RELEASE_DIR!"

cd ..

REM ════════════════════════════════════════════════════════════════════════════
REM  SERVER EXTENSION
REM ════════════════════════════════════════════════════════════════════════════
:SERVER_SECTION
echo.
echo [SERVER] Processing server-extension...
cd server-extension

REM -- Read current version from package.json
for /f "delims=" %%V in ('powershell -NoProfile -Command "(Get-Content package.json | ConvertFrom-Json).version"') do set "SERVER_CURRENT_VER=%%V"
echo [SERVER] Current version: %SERVER_CURRENT_VER%

REM -- Bump version in package.json if requested
if not "%SERVER_VER%"=="" (
    if not "%SERVER_VER%"=="%SERVER_CURRENT_VER%" (
        echo [SERVER] Updating package.json version: %SERVER_CURRENT_VER% ^-^> %SERVER_VER%
        powershell -NoProfile -Command ^
            "$pkg = Get-Content 'package.json' -Raw | ConvertFrom-Json; $pkg.version = '%SERVER_VER%'; $pkg | ConvertTo-Json -Depth 20 | Set-Content 'package.json'"
        if errorlevel 1 (
            echo [SERVER] Error: Failed to update version in package.json
            cd ..
            exit /b 1
        )
        set "SERVER_CURRENT_VER=%SERVER_VER%"
    ) else (
        echo [SERVER] Version already %SERVER_VER%, no change needed
    )
)

REM -- Build (esbuild)
echo [SERVER] Building...
call npm run build
if errorlevel 1 (
    echo [SERVER] Error: Build failed
    set "buildFailed=1"
    cd ..
    goto DONE
)
echo [SERVER] Built successfully

REM -- Package generic
set "SERVER_VSIX=server-monitor-%SERVER_CURRENT_VER%.vsix"
echo [SERVER] Packaging generic VSIX...
call :DeleteIfExists "%SERVER_VSIX%"
echo y| call vsce package --no-dependencies -o "%SERVER_VSIX%" 2>&1
if errorlevel 1 (
    echo [SERVER] Error: generic package failed
    set "buildFailed=1"
)

REM -- Package Windows
set "SERVER_VSIX_WIN=server-monitor-%SERVER_CURRENT_VER%-win32-x64.vsix"
echo [SERVER] Packaging Windows VSIX...
call :DeleteIfExists "%SERVER_VSIX_WIN%"
echo y| call vsce package --no-dependencies --target win32-x64 -o "%SERVER_VSIX_WIN%" 2>&1
if errorlevel 1 (
    echo [SERVER] Warning: Windows target package failed
)

REM -- Package Ubuntu/WSL
set "SERVER_VSIX_LINUX=server-monitor-%SERVER_CURRENT_VER%-linux-x64.vsix"
echo [SERVER] Packaging Ubuntu/WSL VSIX...
call :DeleteIfExists "%SERVER_VSIX_LINUX%"
echo y| call vsce package --no-dependencies --target linux-x64 -o "%SERVER_VSIX_LINUX%" 2>&1
if errorlevel 1 (
    echo [SERVER] Warning: Linux target package failed
)

if exist "%SERVER_VSIX%" echo [SERVER] Created: %SERVER_VSIX%
if exist "%SERVER_VSIX_WIN%" echo [SERVER] Created: %SERVER_VSIX_WIN%
if exist "%SERVER_VSIX_LINUX%" echo [SERVER] Created: %SERVER_VSIX_LINUX%

REM -- Copy all server VSIX to root package folder
call :CopyIfExistsToDir "%SERVER_VSIX%" "%ROOT_PACKAGE_DIR%"
call :CopyIfExistsToDir "%SERVER_VSIX_WIN%" "%ROOT_PACKAGE_DIR%"
call :CopyIfExistsToDir "%SERVER_VSIX_LINUX%" "%ROOT_PACKAGE_DIR%"

cd ..

REM ════════════════════════════════════════════════════════════════════════════
REM  SUMMARY
REM ════════════════════════════════════════════════════════════════════════════
:DONE
echo.
echo [PACKAGE] =============================================
if "%buildFailed%"=="1" (
    echo [PACKAGE] Result: Packaging completed with errors
    exit /b 1
) else (
    echo [PACKAGE] Result: All extensions packaged successfully!
    echo.
    if exist "client-extension\%CLIENT_VSIX%"  echo   client: client-extension\%CLIENT_VSIX%
    if exist "client-extension\%CLIENT_VSIX_WIN%"  echo   client: client-extension\%CLIENT_VSIX_WIN%
    if exist "client-extension\%CLIENT_VSIX_LINUX%"  echo   client: client-extension\%CLIENT_VSIX_LINUX%
    if exist "server-extension\%SERVER_VSIX%"  echo   server: server-extension\%SERVER_VSIX%
    if exist "server-extension\%SERVER_VSIX_WIN%"  echo   server: server-extension\%SERVER_VSIX_WIN%
    if exist "server-extension\%SERVER_VSIX_LINUX%"  echo   server: server-extension\%SERVER_VSIX_LINUX%
    if exist "%ROOT_PACKAGE_DIR%" echo   all: %ROOT_PACKAGE_DIR%
    exit /b 0
)

:CopyIfExistsToDir
if "%~1"=="" goto :eof
if not exist "%~1" goto :eof
if not exist "%~2" mkdir "%~2" >nul 2>&1
copy /Y "%~1" "%~2\%~nx1" >nul 2>&1
if errorlevel 1 (
    echo [COPY] Warning: Failed to copy %~nx1 to %~2
) else (
    echo [COPY] Copied: %~nx1 ^> %~2
)
goto :eof

:DeleteIfExists
if "%~1"=="" goto :eof
if exist "%~1" del /f /q "%~1" >nul 2>&1
goto :eof
