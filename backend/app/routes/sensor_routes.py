# backend/app/routes/sensor_routes.py
from fastapi import APIRouter, HTTPException
from typing import List
from app.models.sensor_data import SensorReading  # Changed import
from datetime import datetime

router = APIRouter(prefix="/api/v1", tags=["sensors"])

# In-memory storage
sensor_readings = []

@router.post("/readings")
async def create_reading(reading: SensorReading):
    sensor_readings.append(reading)
    return reading

@router.get("/readings", response_model=List[SensorReading])
async def get_readings():
    return sensor_readings

@router.get("/readings/{sensor_id}", response_model=List[SensorReading])
async def get_sensor_readings(sensor_id: str):
    matches = [r for r in sensor_readings if r.sensor_id == sensor_id]
    if not matches:
        raise HTTPException(status_code=404, detail="Sensor not found")
    return matches

@router.post("/test-data")
async def add_test_data():
    # Clear existing data
    sensor_readings.clear()
    
    # Add temperature readings
    temp_reading = SensorReading(
        sensor_id="temp-001",
        value=25.5,
        type="temperature",
        unit="celsius",
        location="room-1"
    )
    sensor_readings.append(temp_reading)
    
    # Add humidity readings
    hum_reading = SensorReading(
        sensor_id="hum-001",
        value=45.0,
        type="humidity",
        unit="percent",
        location="room-1"
    )
    sensor_readings.append(hum_reading)
    
    return {"message": "Test data added", "count": len(sensor_readings)}