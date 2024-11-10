# backend/app/models/sensor_data.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SensorReading(BaseModel):
    sensor_id: str
    value: float
    timestamp: datetime = datetime.now()
    type: str
    unit: str
    location: Optional[str] = None