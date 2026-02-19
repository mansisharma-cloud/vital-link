from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class HealthMetricBase(BaseModel):
    patient_id: Optional[int] = None
    metric_type: str
    value: float
    timestamp: Optional[datetime] = None


class HealthMetricCreate(HealthMetricBase):
    pass


class HealthMetric(HealthMetricBase):
    id: int

    class Config:
        from_attributes = True


class HealthMetricGroup(BaseModel):
    heart_rate: float
    glucose: float
    temperature: float
    stress_level: float
    timestamp: Optional[float] = None
    status: Optional[str] = "Normal"
