
from detection_module.helmet_demo import HelmetDemoDetector
import numpy as np
def test_detect_shapes():
    det = HelmetDemoDetector()
    frame = np.zeros((360,640,3), dtype=np.uint8)
    out = det.detect(frame)
    assert isinstance(out, list) and len(out) >= 2
