
import random
from typing import List
from .base_detector import BaseDetector, Detection

COLORS = {
    "car": (0,255,0),
    "motorcycle": (255,255,0),
    "bus": (0,255,255),
    "truck": (255,0,0),
    "helmet": (0,200,0),
    "no-helmet": (0,0,255)
}

class HelmetDemoDetector(BaseDetector):
    def __init__(self, seed=42):
        random.seed(seed)
        self.track_id = 0
    def detect(self, frame) -> List[Detection]:
        h,w = frame.shape[:2]
        dets = []
        # Generate 2-4 fake vehicles with deterministic positions
        for i in range(random.randint(2,4)):
            x = 50 + (i*120) % max(60, w-100)
            y = 70 + (i*80) % max(60, h-80)
            bbox = (x, y, x+80, y+40)
            cls = "motorcycle" if i%2==0 else "car"
            if cls=="motorcycle":
                cls2 = "helmet" if i%3!=0 else "no-helmet"
                dets.append(Detection(bbox, cls2, 0.9, track_id=self.track_id+i, color=COLORS[cls2]))
            dets.append(Detection(bbox, cls, 0.8, track_id=self.track_id+i, color=COLORS[cls]))
        self.track_id += len(dets)
        return dets
