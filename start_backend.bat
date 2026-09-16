@echo off
title CropShield AI - Flask ML Backend
echo ===================================================
echo   CropShield AI - Production Flask ML Server
echo   Model: best.pt (YOLOv8 Real Classifier)
echo ===================================================
echo.
cd /d "%~dp0"
if exist "%~dp0ml\.venv\Scripts\python.exe" (
  "%~dp0ml\.venv\Scripts\python.exe" app.py
) else (
  python app.py
)
pause
