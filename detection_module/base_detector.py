
import os, logging
try:
    from dataclasses import dataclass
    from ultralytics import YOLO
except Exception:
    YOLO=None
class BaseDetector:
    def __init__(self, config):
        self.config=config; self.logger=logging.getLogger(self.__class__.__name__); self.model=None
    def load_model(self,path):
        if YOLO and os.path.exists(path):
            try: self.model=YOLO(path)
            except Exception as e: self.logger.warning(f'load model failed: {e}'); self.model=None
    def detect(self,frame):
        if not self.model: return []
        res=self.model.predict(source=frame, conf=self.config.get('models',{}).get('conf',0.35), iou=self.config.get('models',{}).get('iou',0.45), verbose=False)
        out=[]
        if len(res)>0:
            r=res[0]; boxes=getattr(r,'boxes',None)
            if boxes is None: return []
            xy=boxes.xyxy.cpu().numpy(); cls=boxes.cls.cpu().numpy(); confs=boxes.conf.cpu().numpy()
            names=self.model.names if hasattr(self.model,'names') else {}
            for b,c,cf in zip(xy,cls,confs): out.append({'bbox':[int(b[0]),int(b[1]),int(b[2]),int(b[3])],'class':int(c),'name':names.get(int(c),str(int(c))),'conf':float(cf)})

        return out

@dataclass
class Detection:
    bbox: list[int]
    cls: int
    conf: float
    name: str
