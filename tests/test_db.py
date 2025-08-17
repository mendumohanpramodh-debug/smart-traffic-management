
from logging_alerts.database import init_db
def test_db_init(tmp_path):
    db = tmp_path / "t.db"
    eng = init_db(f"sqlite:///{db}")
    assert eng is not None
