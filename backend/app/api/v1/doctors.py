from sqlalchemy.orm import selectinload
from app.models.appointment import Appointment
from app.schemas.appointment import AppointmentCreate, Appointment as AppointmentSchema
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from sqlalchemy.orm import joinedload

from typing import List, Optional
from app.db.session import get_db
from app.api.deps import get_current_doctor
from app.models.doctor import Doctor
from app.models.patient import Patient
from app.models.hospital import Hospital
from app.models.health_metrics import HealthMetric
from app.schemas.patient import PatientCreate, Patient as PatientSchema
from app.schemas.doctor import Doctor as DoctorSchema, DoctorUpdate
from app.schemas.health_metric import HealthMetric as HealthMetricSchema
from app.core.security import get_password_hash

router = APIRouter()


@router.get("/stats")
async def get_doctor_stats(
    db: AsyncSession = Depends(get_db),
    current_doctor: Doctor = Depends(get_current_doctor)
):
    # Total patients for this doctor
    patient_count_result = await db.execute(
        select(func.count(Patient.id)).where(
            Patient.doctor_id == current_doctor.id)
    )
    total_patients = patient_count_result.scalar_one()

    # Total appointments (today)
    from datetime import date
    today = date.today().isoformat()
    app_count_result = await db.execute(
        select(func.count(Appointment.id))
        .where(Appointment.doctor_id == current_doctor.id)
        .where(Appointment.date == today)
    )
    today_appointments = app_count_result.scalar_one()

    return {
        "total_patients": total_patients,
        "today_appointments": today_appointments,
        "pending_actions": 2,
        "new_patients": total_patients  # Simplified for now
    }


@router.get("/me", response_model=DoctorSchema)
async def get_doctor_me(
    db: AsyncSession = Depends(get_db),
    current_doctor: Doctor = Depends(get_current_doctor)
):
    # Ensure hospital is loaded
    result = await db.execute(
        select(Doctor).options(joinedload(Doctor.hospital)).where(
            Doctor.id == current_doctor.id)
    )
    doc = result.scalars().first()
    if doc:
        doc.hospital_name = doc.hospital.name
        doc.hospital_address = doc.hospital.address
        doc.hospital_contact = doc.hospital.contact_number
        return doc
    return current_doctor


@router.patch("/me", response_model=DoctorSchema)
async def update_doctor_me(
    doctor_in: DoctorUpdate,
    db: AsyncSession = Depends(get_db),
    current_doctor: Doctor = Depends(get_current_doctor)
):
    update_data = doctor_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_doctor, field, value)

    db.add(current_doctor)
    await db.commit()
    await db.refresh(current_doctor)

    # Repopulate hospital info
    current_doctor.hospital_name = current_doctor.hospital.name
    current_doctor.hospital_address = current_doctor.hospital.address
    current_doctor.hospital_contact = current_doctor.hospital.contact_number
    return current_doctor


@router.post("/patients", response_model=PatientSchema)
async def add_patient(
    patient_in: PatientCreate,
    db: AsyncSession = Depends(get_db),
    current_doctor: Doctor = Depends(get_current_doctor)
):
    # Requirement 13: Auto-increment logic for Patient IDs
    # HOSPCODE + PID + NUMBER (e.g. HOSP-PID-1001)

    # Get hospital code
    result = await db.execute(select(Hospital).where(Hospital.id == current_doctor.hospital_id))
    hospital = result.scalars().first()
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")

    hosp_code = hospital.hosp_code

    # Count existing patients for this hospital to get the next number
    # Actually, the requirement says "track last assigned... per hospital/doctor"
    # and "Patient IDs are unique across the system".
    # I'll count all patients to ensure global uniqueness or at least hospital-level.

    count_result = await db.execute(select(func.count(Patient.id)))
    count = count_result.scalar_one()
    next_number = 1001 + count
    patient_id = f"{hosp_code}-PID-{next_number}"

    # Requirement 14: Password encryption for all users.
    # Patient password is DOB (DDMMYYYY).
    hashed_dob = get_password_hash(patient_in.dob)

    db_obj = Patient(
        patient_id=patient_id,
        full_name=patient_in.full_name,
        dob=hashed_dob,
        gender=patient_in.gender,
        contact_number=patient_in.contact_number,
        address=patient_in.address,
        emergency_contact=patient_in.emergency_contact,
        blood_group=patient_in.blood_group,
        medical_conditions=patient_in.medical_conditions,
        doctor_id=current_doctor.id,
        hospital_id=current_doctor.hospital_id
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj


@router.get("/patients", response_model=List[PatientSchema])
async def list_patients(
    db: AsyncSession = Depends(get_db),
    current_doctor: Doctor = Depends(get_current_doctor),
    skip: int = 0,
    limit: int = 20,
    search: Optional[str] = None
):
    query = select(Patient).options(joinedload(Patient.hospital)
                                    ).where(Patient.doctor_id == current_doctor.id)

    if search:
        query = query.where(
            or_(
                Patient.full_name.ilike(f"%{search}%"),
                Patient.patient_id.ilike(f"%{search}%")
            )
        )

    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    patients = result.scalars().all()
    for p in patients:
        if p.hospital:
            p.hospital_name = p.hospital.name
    return patients


@router.get("/appointments", response_model=List[AppointmentSchema])
async def list_appointments(
    db: AsyncSession = Depends(get_db),
    current_doctor: Doctor = Depends(get_current_doctor)
):
    result = await db.execute(
        select(Appointment)
        .options(joinedload(Appointment.patient))
        .where(Appointment.doctor_id == current_doctor.id)
    )
    appointments = result.scalars().all()
    for app in appointments:
        app.patient_name = app.patient.full_name
    return appointments


@router.post("/appointments", response_model=AppointmentSchema)
async def book_appointment(
    appointment_in: AppointmentCreate,
    db: AsyncSession = Depends(get_db),
    current_doctor: Doctor = Depends(get_current_doctor)
):
    db_obj = Appointment(
        doctor_id=current_doctor.id,
        patient_id=appointment_in.patient_id,
        date=appointment_in.date,
        time=appointment_in.time,
        reason=appointment_in.reason,
        status=appointment_in.status
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj


@router.patch("/appointments/{appointment_id}", response_model=AppointmentSchema)
async def update_appointment_status(
    appointment_id: int,
    status: str = Query(...),
    db: AsyncSession = Depends(get_db),
    current_doctor: Doctor = Depends(get_current_doctor)
):
    result = await db.execute(
        select(Appointment)
        .where(Appointment.id == appointment_id)
        .where(Appointment.doctor_id == current_doctor.id)
    )
    appointment = result.scalars().first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appointment.status = status
    db.add(appointment)
    await db.commit()
    await db.refresh(appointment)
    return appointment


@router.get("/patients/by-clinical-id/{clinical_id}", response_model=PatientSchema)
async def get_patient_by_clinical_id(
    clinical_id: str,
    db: AsyncSession = Depends(get_db),
    current_doctor: Doctor = Depends(get_current_doctor)
):
    result = await db.execute(
        select(Patient)
        .options(joinedload(Patient.hospital))
        .where(Patient.patient_id.ilike(clinical_id))
        .where(Patient.doctor_id == current_doctor.id)
    )
    patient = result.scalars().first()
    if not patient:
        raise HTTPException(
            status_code=404, detail=f"Patient {clinical_id} not found for current doctor")

    if patient.hospital:
        patient.hospital_name = patient.hospital.name
    patient.dob_display = "XX-XX-XXXX"
    return patient


@router.get("/patients/{patient_id}", response_model=PatientSchema)
async def get_patient_detail(
    patient_id: int,
    db: AsyncSession = Depends(get_db),
    current_doctor: Doctor = Depends(get_current_doctor)
):
    result = await db.execute(
        select(Patient)
        .options(joinedload(Patient.hospital))
        .where(Patient.id == patient_id)
        .where(Patient.doctor_id == current_doctor.id)
        .options(selectinload(Patient.hospital))
    )
    patient = result.scalars().first()
    if not patient:
        raise HTTPException(
            status_code=404, detail=f"Patient ID {patient_id} not found for current doctor")

    # Populate extra fields
    if patient.hospital:
        patient.hospital_name = patient.hospital.name
        patient.hospital_address = patient.hospital.address
        patient.hospital_contact = patient.hospital.contact_number

    patient.dob_display = "XX-XX-XXXX"
    return patient


@router.get("/patients/{patient_id}/metrics", response_model=List[HealthMetricSchema])
async def list_patient_metrics(
    patient_id: int,
    db: AsyncSession = Depends(get_db),
    current_doctor: Doctor = Depends(get_current_doctor)
):
    # Verify patient belongs to doctor
    result = await db.execute(
        select(Patient)
        .where(Patient.id == patient_id)
        .where(Patient.doctor_id == current_doctor.id)
    )
    if not result.scalars().first():
        raise HTTPException(status_code=404, detail="Patient not found")

    metric_result = await db.execute(
        select(HealthMetric)
        .where(HealthMetric.patient_id == patient_id)
        .order_by(HealthMetric.timestamp.desc())
    )
    return metric_result.scalars().all()


@router.get("/patients/{patient_id}/predictions")
async def get_patient_predictions(
    patient_id: int,
    db: AsyncSession = Depends(get_db),
    current_doctor: Doctor = Depends(get_current_doctor)
):
    # Verify patient belongs to doctor
    p_result = await db.execute(
        select(Patient)
        .where(Patient.id == patient_id)
        .where(Patient.doctor_id == current_doctor.id)
    )
    if not p_result.scalars().first():
        raise HTTPException(status_code=404, detail="Patient not found")

    # Fetch latest metrics for the patient
    metrics_query = select(HealthMetric).where(
        HealthMetric.patient_id == patient_id
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
