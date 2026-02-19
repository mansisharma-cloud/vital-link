from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.db.session import get_db
from app.api.deps import get_current_patient
from app.models.patient import Patient
from app.models.appointment import Appointment
from app.models.health_metrics import HealthMetric
from app.schemas.patient import Patient as PatientSchema, PatientUpdate
from app.schemas.appointment import Appointment as AppointmentSchema
from app.schemas.health_metric import HealthMetric as HealthMetricSchema, HealthMetricCreate

router = APIRouter()


@router.get("/me", response_model=PatientSchema)
async def get_patient_me(current_patient: Patient = Depends(get_current_patient)):
    # Add display fields for frontend
    current_patient.doctor_name = current_patient.doctor.full_name
    current_patient.doctor_specialization = current_patient.doctor.role
    current_patient.doctor_qualification = current_patient.doctor.qualification
    current_patient.hospital_name = current_patient.hospital.name
    current_patient.hospital_address = current_patient.hospital.address
    current_patient.hospital_contact = current_patient.hospital.contact_number
    # Simple DOB display format
    dob = current_patient.dob  # assuming DDMMYYYY
    if len(dob) == 8:
        current_patient.dob_display = f"{dob[:2]}-{dob[2:4]}-{dob[4:]}"
    return current_patient


@router.patch("/me", response_model=PatientSchema)
async def update_patient_me(
    patient_in: PatientUpdate,
    db: AsyncSession = Depends(get_db),
    current_patient: Patient = Depends(get_current_patient)
):
    update_data = patient_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_patient, field, value)

    db.add(current_patient)
    await db.commit()
    await db.refresh(current_patient)

    # Repopulate display fields if needed (same logic as in get_patient_me)
    current_patient.doctor_name = current_patient.doctor.full_name
    current_patient.doctor_specialization = current_patient.doctor.role
    current_patient.doctor_qualification = current_patient.doctor.qualification
    current_patient.hospital_name = current_patient.hospital.name
    current_patient.hospital_address = current_patient.hospital.address
    current_patient.hospital_contact = current_patient.hospital.contact_number
    # Simple DOB display format
    dob = current_patient.dob  # assuming DDMMYYYY
    if len(dob) == 8:
        current_patient.dob_display = f"{dob[:2]}-{dob[2:4]}-{dob[4:]}"
    return current_patient


@router.get("/appointments", response_model=List[AppointmentSchema])
async def list_appointments(
    db: AsyncSession = Depends(get_db),
    current_patient: Patient = Depends(get_current_patient)
):
    result = await db.execute(select(Appointment).where(Appointment.patient_id == current_patient.id))
    return result.scalars().all()


@router.get("/metrics", response_model=List[HealthMetricSchema])
async def list_metrics(
    db: AsyncSession = Depends(get_db),
    current_patient: Patient = Depends(get_current_patient)
):
    result = await db.execute(select(HealthMetric).where(HealthMetric.patient_id == current_patient.id))
    return result.scalars().all()


@router.get("/predictions")
async def get_predictions(
    db: AsyncSession = Depends(get_db),
    current_patient: Patient = Depends(get_current_patient)
):
    # Fetch latest metrics for the patient
    metrics_query = select(HealthMetric).where(
        HealthMetric.patient_id == current_patient.id
    ).order_by(HealthMetric.timestamp.desc())

    result = await db.execute(metrics_query)
    metrics_list = result.scalars().all()

    # Simple mapping to latest values
    latest_metrics = {}
    for m in metrics_list:
        if m.metric_type not in latest_metrics:
            latest_metrics[m.metric_type] = m.value

    from app.services.prediction import predict_risk
    analysis = predict_risk(latest_metrics)
    return analysis


@router.post("/metrics", response_model=HealthMetricSchema)
async def create_metric(
    metric_in: HealthMetricCreate,
    db: AsyncSession = Depends(get_db),
    current_patient: Patient = Depends(get_current_patient)
):
    db_obj = HealthMetric(
        patient_id=current_patient.id,
        metric_type=metric_in.metric_type,
        value=metric_in.value
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj
