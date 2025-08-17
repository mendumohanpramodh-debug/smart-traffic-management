import json

def load_json(p):
    try: return json.loads(open(p).read())
    except: return {}
