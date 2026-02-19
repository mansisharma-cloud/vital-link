from pydantic import BaseModel, Field
from typing import List, Optional


class HealthMetrics(BaseModel):
    heart_rate: Optional[float] = Field(None, example=75.0)
    glucose: Optional[float] = Field(None, example=95.0)
    stress_level: Optional[float] = Field(None, example=25.0)
    temperature: Optional[float] = Field(None, example=36.6)


class HealthAnalysisRequest(BaseModel):
    metrics: HealthMetrics


class RiskPrediction(BaseModel):
    condition: str
    risk_level: str
    score: float


class HealthAnalysisResponse(BaseModel):
    overall_status: str
    predictions: List[RiskPrediction]
    summary: Optional[str] = None
    user_id: Optional[str] = None
