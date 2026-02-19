from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.services.prediction import predict_multi_disease_risk
from app.api.deps import get_current_user_optional, get_db, get_current_doctor
from app.schemas.prediction import HealthAnalysisRequest, HealthAnalysisResponse
from app.models.user import User
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.health_metrics import HealthMetric

router = APIRouter()


@router.post("/analyze", response_model=HealthAnalysisResponse)
async def analyze_health(
    request: HealthAnalysisRequest,
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    metrics_dict = request.metrics.dict(exclude_unset=True)
    prediction = predict_multi_disease_risk(metrics_dict)

    return {
        "user_id": str(current_user.id) if current_user else "demo_user",
        **prediction
    }


async def _get_patient_latest_metrics(db: AsyncSession, patient_id: int):
    # Fetch most recent metrics across types
    result = await db.execute(
        select(HealthMetric)
        .where(HealthMetric.patient_id == patient_id)
        .order_by(desc(HealthMetric.timestamp))
        .limit(20)
    )
    metrics_list = result.scalars().all()

    # Simple aggregation of latest unique types
    metrics_dict = {}
    for m in metrics_list:
        if m.metric_type not in metrics_dict:
            metrics_dict[m.metric_type] = float(m.value)

    # Defaults for simulation if empty
    if not metrics_dict:
        metrics_dict = {
            "heart_rate": 72, "glucose": 95, "spo2": 98,
            "blood_pressure_sys": 120, "blood_pressure_dia": 80,
            "stress_level": 25, "temperature": 98.6, "respiratory_rate": 16
        }
    return metrics_dict


@router.get("/patient/{patient_clinical_id}/all", response_model=HealthAnalysisResponse)
async def get_patient_all_predictions(
    patient_clinical_id: str,
    db: AsyncSession = Depends(get_db),
    current_doctor: Doctor = Depends(get_current_doctor)
):
    # Verify patient belongs to doctor
    result = await db.execute(
        select(Patient).where(Patient.patient_id == patient_clinical_id)
        .where(Patient.doctor_id == current_doctor.id)
    )
    patient = result.scalars().first()
    if not patient:
        raise HTTPException(
            status_code=404, detail="Patient profile not found in your clinical registry")

    metrics_dict = await _get_patient_latest_metrics(db, patient.id)

    # Calculate age for better prediction
    # dob is hashed in this system, so we might need to store age or just use default
    # For now, let's use a default age from a hypothetical field or just 45
    prediction = predict_multi_disease_risk(
        metrics_dict, {"age": 52, "bmi": 28.4})

    return {
        "user_id": str(patient.id),
        **prediction
    }


# Individual endpoints as requested
@router.get("/patient/{patient_clinical_id}/diabetes")
async def get_diabetes_prediction(patient_clinical_id: str, db: AsyncSession = Depends(get_db), current_doctor: Doctor = Depends(get_current_doctor)):
    summary = await get_patient_all_predictions(patient_clinical_id, db, current_doctor)
    return next(p for p in summary["predictions"] if p["condition"] == "Diabetes")


@router.get("/patient/{patient_clinical_id}/hypertension")
async def get_hypertension_prediction(patient_clinical_id: str, db: AsyncSession = Depends(get_db), current_doctor: Doctor = Depends(get_current_doctor)):
    summary = await get_patient_all_predictions(patient_clinical_id, db, current_doctor)
    return next(p for p in summary["predictions"] if p["condition"] == "Hypertension")


@router.get("/patient/{patient_clinical_id}/arrhythmia")
async def get_arrhythmia_prediction(patient_clinical_id: str, db: AsyncSession = Depends(get_db), current_doctor: Doctor = Depends(get_current_doctor)):
    summary = await get_patient_all_predictions(patient_clinical_id, db, current_doctor)
    return next(p for p in summary["predictions"] if p["condition"] == "Cardiac Arrhythmia")


@router.get("/patient/{patient_clinical_id}/respiratory")
async def get_respiratory_prediction(patient_clinical_id: str, db: AsyncSession = Depends(get_db), current_doctor: Doctor = Depends(get_current_doctor)):
    summary = await get_patient_all_predictions(patient_clinical_id, db, current_doctor)
    return next(p for p in summary["predictions"] if p["condition"] == "Respiratory Breakdown")


@router.get("/patient/{patient_clinical_id}/stress")
async def get_stress_prediction(patient_clinical_id: str, db: AsyncSession = Depends(get_db), current_doctor: Doctor = Depends(get_current_doctor)):
    summary = await get_patient_all_predictions(patient_clinical_id, db, current_doctor)
    return next(p for p in summary["predictions"] if p["condition"] == "Stress Disorder")


@router.get("/patient/{patient_clinical_id}/cholesterol")
async def get_cholesterol_prediction(patient_clinical_id: str, db: AsyncSession = Depends(get_db), current_doctor: Doctor = Depends(get_current_doctor)):
    summary = await get_patient_all_predictions(patient_clinical_id, db, current_doctor)
    return next(p for p in summary["predictions"] if p["condition"] == "Cholesterol")


@router.post("/patient/{patient_clinical_id}/refresh")
async def refresh_predictions(patient_clinical_id: str, db: AsyncSession = Depends(get_db), current_doctor: Doctor = Depends(get_current_doctor)):
    # In a real system, this might trigger a background ML job. Here we just re-run the heuristic.
    return await get_patient_all_predictions(patient_clinical_id, db, current_doctor)
