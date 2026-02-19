import time
from fastapi import APIRouter
from app.api.v1 import auth, predictions, hospitals, doctors, patients, admin

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(
    hospitals.router, prefix="/hospitals", tags=["hospitals"])
api_router.include_router(doctors.router, prefix="/doctors", tags=["doctors"])
api_router.include_router(
    patients.router, prefix="/patients", tags=["patients"])
api_router.include_router(
    predictions.router, prefix="/predictions", tags=["predictions"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])


@api_router.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": time.time()}
