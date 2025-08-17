
from sqlalchemy.orm import declarative_base, mapped_column
from sqlalchemy import Integer, String, Float, DateTime
import datetime as dt
Base = declarative_base()

class Event(Base):
    __tablename__ = "events"
    id = mapped_column(Integer, primary_key=True, autoincrement=True)
    type = mapped_column(String(50))
    message = mapped_column(String(255))
    value = mapped_column(Float, nullable=True)
    at = mapped_column(DateTime, default=dt.datetime.utcnow)
