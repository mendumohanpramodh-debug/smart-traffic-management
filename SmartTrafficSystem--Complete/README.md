# Smart Traffic Management — Integrated
Run `python dashboard/app.py` and open http://localhost:5000


## Quick Start (Windows)

1) **Install Python 3.10–3.13** and ensure `python` is on PATH.
2) **Open PowerShell** in this folder.
3) Run:
```
.un.ps1
```
   (First run creates a venv, installs dependencies, and starts the app.)

Or use **Command Prompt**:
```
run.bat
```

Then open: http://localhost:5000

### Demo
- Upload a sample video on the dashboard **or** use the built-in demo at `tests/sample_videos/demo.mp4`.
- The app will show detection overlays, vehicle counts, violations, and adaptive signal status.
- All events are logged to `data/traffic_system.db` and `logs/`.

### Project Layout
- `dashboard/` — Frontend (HTML/JS/Chart.js) + Flask routes.
- `detection_module/` — YOLO-based detectors (density, violations, emergencies).
- `signal_controller/` — Smart signal timing logic.
- `logging_alerts/` — SQLite DB + alert loggers.
- `config/system_config.json` — Tweak thresholds & timings.
- `tests/` — Quick smoke tests.

### Notes
- Models use CPU-friendly configs. To enable GPU, set `"cpu_only": false` in `config/system_config.json`.
- License plate recognition is stubbed for demo. Hook in EasyOCR/OpenALPR later if needed.
