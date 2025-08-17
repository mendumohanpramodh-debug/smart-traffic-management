\
@echo off
REM Create venv if not exists
if not exist .venv (
  python -m venv .venv
)
call .venv\Scripts\activate
pip install -r requirements.txt
REM Start the dashboard API
python dashboard\app.py
pause
