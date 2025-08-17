
from flask import Flask, render_template, request, jsonify, send_from_directory
from pathlib import Path
import uuid
import os
APP_ROOT = Path(__file__).resolve().parent.parent
UPLOAD = APP_ROOT / 'uploads'; UPLOAD.mkdir(parents=True,exist_ok=True)
from main import SmartTrafficApp
processor = SmartTrafficApp(config_path=str(APP_ROOT/'config'/'system_config.json'))
app = Flask(__name__, template_folder='templates', static_folder='static')
@app.route('/')
def index(): return render_template('index.html')
@app.route('/upload', methods=['GET','POST'])
def upload():
    if request.method=='POST':
        f = request.files.get('video')
        if not f: return 'No file',400
        name = str(uuid.uuid4()) + '_' + f.filename
        path = UPLOAD / name; f.save(str(path))
        outp = APP_ROOT / 'output'; outp.mkdir(parents=True,exist_ok=True)
        annotated = outp / ('annotated_' + name)
        res = processor.process_video_file(str(path), str(annotated))
        return jsonify({'status':'done','result':res})
    return render_template('upload.html')
@app.route('/static/<path:p>')
def static_proxy(p): return send_from_directory(app.static_folder, p)
if __name__=='__main__': app.run(host='0.0.0.0', port=5000, debug=True)
