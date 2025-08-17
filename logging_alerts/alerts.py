
import logging, json
logger=logging.getLogger(__name__)
class AlertManager:
    def __init__(self, cfg='config/alert_config.json'):
        try: self.cfg=json.loads(open(cfg).read())
        except Exception: self.cfg={}
    def send_violation_alert(self,info): logger.info(f'violation alert: {info}'); return True
    def send_emergency_alert(self,info): logger.critical(f'emergency alert: {info}'); return True
