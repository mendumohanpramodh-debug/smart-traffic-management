
import time
class SmartSignal:
    def __init__(self, config=None):
        cfg=config or {}
        self.lanes = cfg.get('lanes', ['north','east','south','west'])
        self.state = {l:{'state':'RED','remaining':0} for l in self.lanes}
        self.green_lane = self.lanes[0]; self.state[self.green_lane]={'state':'GREEN','remaining':cfg.get('min_green',8)}
    def update(self, density_levels):
        try:
            cur=self.green_lane
            level=density_levels.get(cur,{}).get('level','CLEAR') if isinstance(density_levels,dict) else 'CLEAR'
            if level in ['HEAVY','CONGESTED']:
                self.state[cur]['remaining']=max(self.state[cur]['remaining'],10)
            else:
                idx=self.lanes.index(cur); next_idx=(idx+1)%len(self.lanes)
                self.state[cur]={'state':'RED','remaining':2}; self.green_lane=self.lanes[next_idx]; self.state[self.green_lane]={'state':'GREEN','remaining':8}
        except Exception:
            pass
    def force_green(self,lane):
        for l in self.lanes: self.state[l]={'state':'RED','remaining':0}
        self.state[lane]={'state':'GREEN','remaining':30}; self.green_lane=lane
    def get_signal_status(self):
        return {'signals':self.state,'green_lane':self.green_lane}
    def draw_signal_status(self, frame):
        import cv2
        y=20
        for lane,info in self.state.items():
            color=(0,255,0) if info['state']=='GREEN' else (0,0,255)
            cv2.putText(frame,f"{lane.upper()}: {info['state']}",(10,y),cv2.FONT_HERSHEY_SIMPLEX,0.6,color,2); y+=25
        return frame
