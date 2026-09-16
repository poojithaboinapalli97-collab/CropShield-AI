@echo off
title CropShield AI - Full Stack Launcher
echo ===================================================
echo   Starting CropShield AI (Flask ML + React Frontend)
echo ===================================================
echo.

cd /d "%~dp0"
echo [1/2] Starting Flask ML Backend (Port 8001)...
if exist "%~dp0ml\.venv\Scripts\python.exe" (
  start "CropShield Flask Backend" cmd /k ""%~dp0ml\.venv\Scripts\python.exe" app.py"
) else (
  start "CropShield Flask Backend" cmd /k "python app.py"
)

timeout /t 2 /nobreak >nul

echo [2/2] Starting React + Vite Frontend...
cd frontend
start "CropShield Vite Frontend" cmd /k "npm run dev"

echo.
echo Application running at: http://localhost:5173
pause

