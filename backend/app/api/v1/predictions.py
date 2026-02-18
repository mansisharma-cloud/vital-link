from fastapi import APIRouter, Depends
from app.services.prediction import predict_risk
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()


@router.post("/analyze")
async def analyze_health(
    metrics: dict,
    current_user: User = Depends(get_current_user)
):
    prediction = predict_risk(metrics)
    return {
        "user_id": current_user.id,
        "prediction": prediction
    }
