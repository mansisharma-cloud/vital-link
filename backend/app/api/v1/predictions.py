from fastapi import APIRouter, Depends
from typing import Optional
from app.services.prediction import predict_risk
from app.api.deps import get_current_user_optional
from app.schemas.prediction import HealthAnalysisRequest, HealthAnalysisResponse
from app.models.user import User

router = APIRouter()


@router.post("/analyze", response_model=HealthAnalysisResponse)
async def analyze_health(
    request: HealthAnalysisRequest,
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    # Convert Pydantic model to dict for the service
    metrics_dict = request.metrics.dict(exclude_unset=True)
    prediction = predict_risk(metrics_dict)

    return {
        "user_id": str(current_user.id) if current_user else "demo_user",
        "overall_status": prediction["overall_status"],
        "predictions": prediction["predictions"]
    }
