
from pathlib import Path
import sqlite3, json, time
class SimpleDB:
    def __init__(self, url=None):
        self.path='data/test_traffic.db'; Path(self.path).parent.mkdir(parents=True,exist_ok=True)
        conn=sqlite3.connect(self.path); c=conn.cursor()
        c.execute('CREATE TABLE IF NOT EXISTS vehicle_detections (id INTEGER PRIMARY KEY, camera_id TEXT, lane_id TEXT, vehicle_type TEXT, bbox TEXT, confidence REAL, ts REAL)')
        c.execute('CREATE TABLE IF NOT EXISTS violations (id INTEGER PRIMARY KEY, type TEXT, details TEXT, ts REAL)')
        conn.commit(); conn.close()
    def log_vehicle_detection(self,camera_id,lane_id,vehicle_type,bbox,confidence):
        conn=sqlite3.connect(self.path); c=conn.cursor(); c.execute('INSERT INTO vehicle_detections (camera_id,lane_id,vehicle_type,bbox,confidence,ts) VALUES (?,?,?,?,?,?)',(camera_id,lane_id,vehicle_type,json.dumps(bbox),confidence,time.time())); conn.commit(); conn.close()
    def log_violation(self,vtype,details):
        conn=sqlite3.connect(self.path); c=conn.cursor(); c.execute('INSERT INTO violations (type,details,ts) VALUES (?,?,?)',(vtype,json.dumps(details),time.time())); conn.commit(); conn.close()
def get_database(url=None): return SimpleDB(url)

def init_db():
    """Initializes the database connection and schema."""
    db = SimpleDB() # This will create the database and tables if they don't exist
