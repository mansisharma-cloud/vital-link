from pydantic import BaseModel, Field
from typing import List, Optional


class HealthMetrics(BaseModel):
    heart_rate: Optional[float] = Field(None, example=75.0)
    glucose: Optional[float] = Field(None, example=95.0)
    stress_level: Optional[float] = Field(None, example=25.0)
    temperature: Optional[float] = Field(None, example=98.6)
    spo2: Optional[float] = Field(None, example=98.0)
    respiratory_rate: Optional[float] = Field(None, example=16.0)
    blood_pressure_sys: Optional[float] = Field(None, example=120.0)
    blood_pressure_dia: Optional[float] = Field(None, example=80.0)


class HealthAnalysisRequest(BaseModel):
    metrics: HealthMetrics


class RiskPrediction(BaseModel):
    condition: str
    risk_level: str
    score: float
    trend: Optional[str] = None
    time_to_event: Optional[str] = None
    confidence: Optional[float] = None
    key_indicators: Optional[List[str]] = None
    status_text: Optional[str] = None


class Recommendations(BaseModel):
    immediate: List[Optional[str]]
    short_term: List[Optional[str]]


class DataQuality(BaseModel):
    monitoring_coverage: float
    lab_accuracy: float
    manual_entry: float


class HealthAnalysisResponse(BaseModel):
    overall_status: str
    predictions: List[RiskPrediction]
    timeline: List[dict]
    summary: str
    comorbidities: List[Optional[str]]
    recommendations: Recommendations
    data_quality: DataQuality
    user_id: Optional[str] = None
