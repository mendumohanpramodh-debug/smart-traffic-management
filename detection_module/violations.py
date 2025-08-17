
import cv2
class ViolationDetector:
    def __init__(self, config):
        self.config=config
    def analyze_violations(self, frame, signal_state=None, stop_line_y=None, footpath_regions=None):
        return {'timestamp':None,'total_violations':0,'helmet_violations':[],'red_light_violations':[],'footpath_violations':[]}
    def draw_violations(self, frame, violations):
        try:
            for hv in violations.get('helmet_violations',[]):
                x1,y1,x2,y2=hv.get('bbox',[0,0,0,0])
                cv2.rectangle(frame,(x1,y1),(x2,y2),(0,0,255),2)
                cv2.putText(frame,'NO HELMET',(x1,y1-6),cv2.FONT_HERSHEY_SIMPLEX,0.6,(0,0,255),2)
        except Exception:
            pass
        return frame
