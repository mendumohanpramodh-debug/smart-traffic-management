
import numpy as np
from .base_detector import BaseDetector
from datetime import datetime
class TrafficDensityDetector(BaseDetector):
    def __init__(self, config):
        super().__init__(config)
        self.lanes = config.get('lanes',{})
        self.load_model(config.get('models',{}).get('vehicle_person_model','yolov8n.pt'))
    def process_frame(self,frame):
        objs=self.detect(frame)
        lane_counts={}; lane_vehicles={}
        for lane,info in self.lanes.items():
            region=info.get('region',[]); lane_counts[lane]=0; lane_vehicles[lane]=[]
            for o in objs:
                x1,y1,x2,y2=o['bbox']; cx=(x1+x2)//2; cy=(y1+y2)//2
                if region:
                    xs=[p[0] for p in region]; ys=[p[1] for p in region]
                    if min(xs)<=cx<=max(xs) and min(ys)<=cy<=max(ys):
                        lane_counts[lane]+=1; lane_vehicles[lane].append({'bbox':o['bbox'],'class_name':o['name'],'confidence':o['conf']})
        density_levels={lane:{'vehicle_count':cnt,'level':self._categorize(cnt)} for lane,cnt in lane_counts.items()}
        recs={lane:{'signal':('GREEN' if density_levels[lane]['vehicle_count']>5 else 'RED'),'duration':10} for lane in lane_counts}
        return {'timestamp':datetime.now().isoformat(),'total_vehicles':sum(lane_counts.values()),'lane_counts':lane_counts,'lane_vehicles':lane_vehicles,'density_levels':density_levels,'signal_recommendations':recs}
    def _categorize(self,c):
        if c<=3: return 'CLEAR'
        if c<=8: return 'LIGHT'
        if c<=15: return 'MODERATE'
        if c<=25: return 'HEAVY'
        return 'CONGESTED'
    def draw_detections(self,frame,detections):
        import cv2, numpy as np
        for lane,info in self.lanes.items():
            region=info.get('region',[])
            if region:
                pts=np.array(region,dtype=np.int32)
                cv2.polylines(frame,[pts],True,(0,255,255),2)
                label=f"{lane.upper()} {detections.get('lane_counts',{}).get(lane,0)} ({detections.get('density_levels',{}).get(lane,{}).get('level','CLEAR')})"
                cv2.putText(frame,label,(region[0][0],region[0][1]-8),cv2.FONT_HERSHEY_SIMPLEX,0.5,(0,255,255),2)
        return frame
