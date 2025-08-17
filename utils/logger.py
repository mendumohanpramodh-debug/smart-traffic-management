
import logging
from pathlib import Path
def get_logger(name='app'):
    logger=logging.getLogger(name)
    if logger.handlers: return logger
    logger.setLevel(logging.INFO)
    Path('logs').mkdir(parents=True,exist_ok=True)
    fh=logging.FileHandler('logs/app.log'); ch=logging.StreamHandler()
    fmt=logging.Formatter('%(asctime)s [%(levelname)s] %(name)s: %(message)s')
    fh.setFormatter(fmt); ch.setFormatter(fmt); logger.addHandler(fh); logger.addHandler(ch)
    return logger
