"""
Smart Traffic Management System - Main Orchestrator
Central brain that coordinates all modules and provides unified system 
control
"""
import cv2
import json
import logging
import time
from datetime import datetime
from pathlib import Path
import os
import threading
import queue
# Import our modules
from detection_module.traffic_density import TrafficDensityDetector
from detection_module.violations import ViolationDetector
from signal_controller.smart_signal import SmartSignalController
from detection_module.emergency import EmergencyAccidentDetector
# Configure logging
logging.basicConfig(
level=logging.INFO,
format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
handlers=[
logging.FileHandler('traffic_system.log'),
logging.StreamHandler()
]
)
logger = logging.getLogger(__name__)
class SmartTrafficManagementSystem:
"""Main orchestrator for the complete smart traffic management system"""
def __init__(self, config_file='config/system_config.json'):
"""Initialize the complete traffic management system"""
 logger.info("Initializing Smart Traffic Management System...")
# Load system configuration
self.config = self.load_system_config(config_file)
# Initialize all modules
self.density_detector = TrafficDensityDetector(self.config)
self.violation_detector = ViolationDetector()
self.signal_controller = SmartSignalController()
self.emergency_detector = EmergencyAccidentDetector()
# System state
self.running = False
self.frame_count = 0
self.system_stats = {
'start_time': datetime.now(),
'total_vehicles': 0,
'total_violations': 0,
'emergency_events': 0,
'signal_changes': 0
}
# Data queues for multi-threading (not used in this example)
self.frame_queue = queue.Queue(maxsize=10)
self.results_queue = queue.Queue()
 logger.info(" Smart Traffic Management System initialized successfully!")
def load_system_config(self, config_file):
"""Load system configuration"""
default_config = {
"camera_source": 0,  # 0 for webcam, or path to video file
"fps": 30,
"resolution": [640, 480],
"detection_interval": 1,  # Process every N frames
"save_violations": True,
"save_statistics": True,
"signal_update_interval": 5,  # Update signals every N seconds
"emergency_response_time": 2,  # Seconds to respond to emergency
"output_video": False,
"output_video_path": "output/traffic_analysis.mp4",
"footpath_regions": {}
# Optional footpath regions for violation detection
}
config_path = Path(config_file)
if config_path.exists():
try:
with open(config_path, 'r') as f:
config = json.load(f)
return {**default_config, **config}
except Exception as e: logger.warning(f"Failed to load config: {e}. Using defaults.")
# Create config directory and file with defaults
config_path.parent.mkdir(exist_ok=True, parents=True)
with open(config_path, 'w') as f:
json.dump(default_config, f, indent=2)
logger.info(f"Default config created at {config_file}")
return default_config
def process_frame(self, frame):
"""Process a single frame through all detection modules"""
frame_results = {
'timestamp': datetime.now().isoformat(),
'frame_number': self.frame_count
}
try:
# 1. Traffic Density Analysis
density_analysis = self.density_detector.process_frame(frame)
frame_results['density'] = density_analysis
# 2. Violation Detection
status = self.signal_controller.get_signal_status()
signal_state = status.get('signals', {}).get('north',
{}).get('state', 'RED')
violation_analysis = self.violation_detector.analyze_violations(
frame,
signal_state=signal_state,
stop_line_y=300, # Configure based on camera setup
footpath_regions=self.config.get('footpath_regions', {})
)
frame_results['violations'] = violation_analysis
# 3. Emergency & Accident Detection
emergency_analysis =
self.emergency_detector.analyze_emergency_situation(frame)
frame_results['emergencies'] = emergency_analysis
# 4. Update Signal Controller
if emergency_analysis.get('emergency_vehicles'):
# Handle emergency override (take the first detected 
emergency vehicle)
emergency = emergency_analysis['emergency_vehicles'][0]
lane = self.determine_emergency_lane(emergency['center'])
self.signal_controller.handle_emergency_vehicle(lane,
emergency['type'])
self.system_stats['emergency_events'] += 1
else:
# Normal signal operation
self.signal_controller.update_signals(density_analysis)
frame_results['signals'] =
self.signal_controller.get_signal_status()
# Update system statistics
self.system_stats['total_vehicles'] +=
density_analysis.get('total_vehicles', 0)
self.system_stats['total_violations'] +=
violation_analysis.get('total_violations', 0)
return frame_results
except Exception as e:
logger.error(f" Error processing frame {self.frame_count}: {e}")
return frame_results
def get_current_signal_state(self):
"""Get current signal state for violation detection"""
status = self.signal_controller.get_signal_status()
# Find active green signal (simplified)
for lane, signal in status['signals'].items():
if signal['state'] == 'GREEN':
return signal
return {'state': 'RED'}
def determine_emergency_lane(self, emergency_position):
"""Determine which lane the emergency vehicle is in"""
x, y = emergency_position
# Simple lane determination based on position (configure for your 
setup)
if x < 320: # Left side
return 'west' if y < 240 else 'south'
else: # Right side
return 'north' if y < 240 else 'east'
def draw_complete_analysis(self, frame, frame_results):
"""Draw complete system analysis on frame"""
# Draw density analysis
if 'density' in frame_results:
frame = self.density_detector.draw_detections(frame,
frame_results['density'])
# Draw violation analysis
if 'violations' in frame_results:
frame = self.violation_detector.draw_violations(frame,
frame_results['violations'])
# Draw emergency analysis
if 'emergencies' in frame_results:
frame = self.emergency_detector.draw_emergency_analysis(frame,
frame_results['emergencies'])
# Draw signal status
frame = self.signal_controller.draw_signal_status(frame)
# System statistics overlay
stats_y = 50
cv2.putText(frame, f"Frame: {frame_results['frame_number']}",
(frame.shape[1] - 200, stats_y), cv2.FONT_HERSHEY_SIMPLEX,
0.6, (255, 255, 255), 2)
stats_y += 25
runtime = datetime.now() - self.system_stats['start_time']
cv2.putText(frame, f"Runtime: {str(runtime).split('.')[0]}",
(frame.shape[1] - 200, stats_y), cv2.FONT_HERSHEY_SIMPLEX,
0.6, (255, 255, 255), 2)
# System title
cv2.putText(frame, "SMART TRAFFIC MANAGEMENT SYSTEM",
(10, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
return frame
def save_frame_results(self, frame_results):
"""Save frame analysis results"""
if self.config.get('save_statistics', True):
# Save to JSON file (append mode for continuous logging)
results_file = Path("output") / "frame_results.json"
results_file.parent.mkdir(exist_ok=True)
with open(results_file, 'a') as f:
f.write(json.dumps(frame_results) + '\n')
def run_system(self, video_source=None):
"""Run the complete traffic management system"""
logger.info("🎬 Starting Smart Traffic Management System...")
# Initialize video capture
 source = video_source or (self.config.get('demo_video') if os.getenv('CI') else self.config['camera_source'])
cap = cv2.VideoCapture(source)
if not cap.isOpened():
logger.error(f" Failed to open video source: {source}")
return
# Set video properties
cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.config['resolution'][0])
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.config['resolution'][1])
# Video writer for output (optional)
video_writer = None
if self.config.get('output_video', False):
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
output_path = Path(self.config['output_video_path'])
output_path.parent.mkdir(exist_ok=True, parents=True)
video_writer = cv2.VideoWriter(
str(output_path), fourcc, self.config['fps'],
tuple(self.config['resolution'])
)
self.running = True
logger.info("📹 System is running! Press 'q' to quit, 's' to save 
screenshot")
try:
while self.running:
ret, frame = cap.read()
if not ret:
logger.warning("⚠ No frame received. Retrying...")
time.sleep(0.1)
continue
self.frame_count += 1
# Process frame (every N frames for performance)
if self.frame_count % self.config['detection_interval'] == 0:
frame_results = self.process_frame(frame)
# Save results
if self.config.get('save_statistics', True):
self.save_frame_results(frame_results)
# Draw analysis
frame = self.draw_complete_analysis(frame, frame_results)
# Display frame
cv2.imshow('Smart Traffic Management System', frame)
# Save to video if enabled
if video_writer:
video_writer.write(frame)
# Handle keyboard input
key = cv2.waitKey(1) & 0xFF
if key == ord('q'):
logger.info(" Stopping system...")
break
elif key == ord('s'):
screenshot_path = f"screenshots/
system_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
            Path(screenshot_path).parent.mkdir(exist_ok=True, parents=True)
cv2.imwrite(screenshot_path, frame)
logger.info(f" Screenshot saved: {screenshot_path}")
elif key == ord('e'):
# Test emergency override (for demo)
logger.info(" Testing emergency override...")
self.signal_controller.handle_emergency_vehicle('north',
'AMBULANCE')
# Small delay for CPU efficiency
time.sleep(1.0 / self.config['fps'])
except KeyboardInterrupt:
logger.info(" System stopped by user")
finally:
# Cleanup
self.running = False
cap.release()
if video_writer:
video_writer.release()
cv2.destroyAllWindows()
# Save final statistics
self.save_final_statistics()
logger.info(" Smart Traffic Management System stopped 
successfully")
def save_final_statistics(self):
"""Save final system statistics"""
end_time = datetime.now()
runtime = end_time - self.system_stats['start_time']
final_stats = {
**self.system_stats,
'end_time': end_time.isoformat(),
'total_runtime_seconds': runtime.total_seconds(),
'frames_processed': self.frame_count,
'average_fps': self.frame_count / runtime.total_seconds() if
runtime.total_seconds() > 0 else 0
}
# Save statistics
stats_file = Path("output") /
f"system_stats_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
stats_file.parent.mkdir(exist_ok=True, parents=True)
with open(stats_file, 'w') as f:
json.dump(final_stats, f, indent=2, default=str)
logger.info(f"📊 Final statistics saved: {stats_file}")
logger.info(f"📈 System Performance Summary:")
logger.info(f" Runtime: {str(runtime).split('.')[0]}")
logger.info(f" Frames processed: {self.frame_count}")
logger.info(f" Total vehicles detected: 
{final_stats['total_vehicles']}")
logger.info(f" Total violations detected: 
{final_stats['total_violations']}")
logger.info(f" Emergency events handled: 
{final_stats['emergency_events']}")
def main():
"""Main entry point"""
print(" SMART TRAFFIC MANAGEMENT SYSTEM")
print("=" * 50)
print(" Real-time AI-powered traffic control")
print(" Developed by: Mendu Mohan Pamodh")
print(" Siddhartha Academy of Higher Education")
print("=" * 50)
# Create system instance
system = SmartTrafficManagementSystem()
# Run system
try:
system.run_system()
except Exception as e:
logger.error(f" System error: {e}")
print(f" System error: {e}")
# Compatibility alias for dashboard
SmartTrafficApp = SmartTrafficManagementSystem
