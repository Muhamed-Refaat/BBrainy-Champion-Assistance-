@echo off
REM BBrainy Champion Assistance - Package ^& VSIX Builder
REM Builds both extensions, bumps versions, and produces .vsix files.
REM
REM Usage:
REM   package.bat                        - package with current versions
REM   package.bat <client-ver>           - e.g. package.bat 1.2.0
REM   package.bat <client-ver> <srv-ver> - e.g. package.bat 1.2.0 1.0.5
REM
REM The packaged client .vsix is also copied to the configured clientReleasePath\updates\
REM so the auto-update mechanism can pick it up on client machines.

echo.
echo [PACKAGE] BBrainy Champion Assistance - Package Script
echo [PACKAGE] =============================================
echo.

setlocal enabledelayedexpansion
set "buildFailed=0"
cd /d "%~dp0"

REM ── Version arguments ────────────────────────────────────────────────────────
set "CLIENT_VER=1.0.0"
set "SERVER_VER=1.0.0"

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

REM -- Compile
echo [CLIENT] Compiling...
call npm run compile
if errorlevel 1 (
    echo [CLIENT] Error: Compilation failed
    set "buildFailed=1"
    cd ..
    goto SERVER_SECTION
)
echo [CLIENT] Compiled successfully

REM -- Package
echo [CLIENT] Packaging as VSIX...
call vsce package --no-dependencies 2>&1
if errorlevel 1 (
    echo [CLIENT] Error: vsce package failed
    set "buildFailed=1"
    cd ..
    goto SERVER_SECTION
)

REM -- Locate the produced .vsix
set "CLIENT_VSIX=client-monitor-%CLIENT_CURRENT_VER%.vsix"
if not exist "%CLIENT_VSIX%" (
    echo [CLIENT] Warning: Expected %CLIENT_VSIX% not found - skipping copy to release path
    cd ..
    goto SERVER_SECTION
)
echo [CLIENT] Created: %CLIENT_VSIX%

REM -- Copy to configured clientReleasePath\updates\ (read from package.json)
for /f "delims=" %%P in ('powershell -NoProfile -Command ^
    "try { $p = (Get-Content 'package.json' -Raw | ConvertFrom-Json).contributes.configuration.properties.'clientMonitor.clientReleasePath'.default; if ($p) { $p } else { '' } } catch { '' }"') do set "RELEASE_PATH=%%P"

if not "%RELEASE_PATH%"=="" (
    set "UPDATES_DIR=%RELEASE_PATH%\updates"
    echo [CLIENT] Copying to release path: !UPDATES_DIR!
    powershell -NoProfile -Command ^
        "if (-not (Test-Path '!UPDATES_DIR!')) { try { New-Item -ItemType Directory -Path '!UPDATES_DIR!' -Force | Out-Null } catch {} }" 2>nul
    copy /Y "%CLIENT_VSIX%" "!UPDATES_DIR!\%CLIENT_VSIX%" >nul 2>&1
    if errorlevel 1 (
        echo [CLIENT] Warning: Could not copy VSIX to release path ^(network drive unavailable?^)
    ) else (
        echo [CLIENT] Copied to: !UPDATES_DIR!\%CLIENT_VSIX%
    )
) else (
    echo [CLIENT] No clientReleasePath configured - skipping copy
)

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

REM -- Package
echo [SERVER] Packaging as VSIX...
call vsce package --no-dependencies 2>&1
if errorlevel 1 (
    echo [SERVER] Error: vsce package failed
    set "buildFailed=1"
    cd ..
    goto DONE
)

set "SERVER_VSIX=server-monitor-%SERVER_CURRENT_VER%.vsix"
if exist "%SERVER_VSIX%" (
    echo [SERVER] Created: %SERVER_VSIX%
) else (
    echo [SERVER] Warning: Expected %SERVER_VSIX% not found
)

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
    if exist "server-extension\%SERVER_VSIX%"  echo   server: server-extension\%SERVER_VSIX%
    exit /b 0
)
