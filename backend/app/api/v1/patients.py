from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload, joinedload
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
async def get_patient_me(
    db: AsyncSession = Depends(get_db),
    current_patient: Patient = Depends(get_current_patient)
):
    # Ensure relationships are loaded
    result = await db.execute(
        select(Patient)
        .options(joinedload(Patient.doctor), joinedload(Patient.hospital))
        .where(Patient.id == current_patient.id)
    )
    p = result.scalars().first()
    if p:
        # Add display fields for frontend
        p.doctor_name = p.doctor.full_name
        p.doctor_specialization = p.doctor.role
        p.doctor_qualification = p.doctor.qualification
        p.hospital_name = p.hospital.name
        p.hospital_address = p.hospital.address
        p.hospital_contact = p.hospital.contact_number
        # Simple DOB display format
        dob = p.dob  # assuming DDMMYYYY
        if len(dob) == 8:
            p.dob_display = f"{dob[:2]}-{dob[2:4]}-{dob[4:]}"
        return p
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

    # Re-fetch with relationships
    result = await db.execute(
        select(Patient)
        .options(joinedload(Patient.doctor), joinedload(Patient.hospital))
        .where(Patient.id == current_patient.id)
    )
    p = result.scalars().first()
    if p:
        p.doctor_name = p.doctor.full_name
        p.doctor_specialization = p.doctor.role
        p.doctor_qualification = p.doctor.qualification
        p.hospital_name = p.hospital.name
        p.hospital_address = p.hospital.address
        p.hospital_contact = p.hospital.contact_number
        dob = p.dob
        if len(dob) == 8:
            p.dob_display = f"{dob[:2]}-{dob[2:4]}-{dob[4:]}"
        return p
    return current_patient


@router.get("/appointments", response_model=List[AppointmentSchema])
async def list_appointments(
    db: AsyncSession = Depends(get_db),
    current_patient: Patient = Depends(get_current_patient)
):
    result = await db.execute(
        select(Appointment)
        .where(Appointment.patient_id == current_patient.id)
        .options(joinedload(Appointment.doctor))
    )
    appointments = result.scalars().all()
    for app in appointments:
        app.doctor_name = app.doctor.full_name
    return appointments


@router.get("/metrics", response_model=List[HealthMetricSchema])
async def list_metrics(
    db: AsyncSession = Depends(get_db),
    current_patient: Patient = Depends(get_current_patient)
):
    result = await db.execute(
        select(HealthMetric)
        .where(HealthMetric.patient_id == current_patient.id)
        .order_by(HealthMetric.timestamp.desc())
        .limit(100)
    )
    return result.scalars().all()


@router.get("/predictions")
async def get_predictions(
    db: AsyncSession = Depends(get_db),
    current_patient: Patient = Depends(get_current_patient)
):
    # Fetch latest metrics for the patient
    metrics_query = select(HealthMetric).where(
        HealthMetric.patient_id == current_patient.id
    ).order_by(HealthMetric.timestamp.desc()).limit(20)

    result = await db.execute(metrics_query)
    metrics_list = result.scalars().all()

    # Simple mapping to latest values
    latest_metrics = {}
    for m in metrics_list:
        if m.metric_type not in latest_metrics:
            latest_metrics[m.metric_type] = m.value

    from app.services.prediction import predict_multi_disease_risk
    # Use profile data or defaults
    analysis = predict_multi_disease_risk(
        latest_metrics, {"age": 52, "bmi": 28.4})
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
