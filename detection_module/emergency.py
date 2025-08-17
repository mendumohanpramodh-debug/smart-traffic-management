
class EmergencyAccidentDetector:
    def __init__(self, config):
        self.config=config
    def analyze_emergency_situation(self, frame):
        return {'timestamp':None,'emergency_vehicles':[],'accidents':[]}
    def draw_emergency_analysis(self, frame, analysis):
        return frame
