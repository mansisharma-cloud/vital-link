from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.doctor import Doctor
from app.models.patient import Patient
from app.models.hospital import Hospital
from app.schemas.doctor import DoctorCreate, Doctor as DoctorSchema, DoctorLogin
from app.schemas.patient import PatientLogin, Patient as PatientSchema
from app.schemas.user import Token
from app.core.security import verify_password, create_access_token, get_password_hash

router = APIRouter()


@router.post("/doctor/signup", response_model=DoctorSchema)
async def doctor_signup(doctor_in: DoctorCreate, db: AsyncSession = Depends(get_db)):
    # Check if doctor exists
    result = await db.execute(select(Doctor).where(Doctor.email == doctor_in.email))
    if result.scalars().first():
        raise HTTPException(
            status_code=400, detail="Doctor with this email already exists.")

    hospital_id = doctor_in.hospital_id
    if not hospital_id and doctor_in.new_hospital_name:
        # Create new hospital
        hospital = Hospital(
            name=doctor_in.new_hospital_name,
            address=doctor_in.new_hospital_address,
            contact_number=doctor_in.new_hospital_contact,
            hosp_code=doctor_in.new_hospital_code or doctor_in.new_hospital_name[:4].upper(
            )
        )
        db.add(hospital)
        await db.commit()
        await db.refresh(hospital)
        hospital_id = hospital.id

    if not hospital_id:
        raise HTTPException(
            status_code=400, detail="Hospital selection or details required.")

    db_obj = Doctor(
        full_name=doctor_in.full_name,
        email=doctor_in.email,
        hashed_password=get_password_hash(doctor_in.password),
        qualification=doctor_in.qualification,
        role=doctor_in.role,
        hospital_id=hospital_id,
        emergency_contact=doctor_in.emergency_contact,
        consultation_timings=doctor_in.consultation_timings,
        license_number=doctor_in.license_number
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj


@router.post("/doctor/login", response_model=Token)
async def doctor_login(login_in: DoctorLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Doctor).where(Doctor.email == login_in.email))
    doctor = result.scalars().first()
    if not doctor or not verify_password(login_in.password, doctor.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token = create_access_token(
        data={"sub": str(doctor.id), "role": "doctor"})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/patient/login", response_model=Token)
async def patient_login(login_in: PatientLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Patient).where(Patient.patient_id == login_in.patient_id))
    patient = result.scalars().first()

    # Requirement: Password is DOB (DDMMYYYY). Encryption required for all users.
    # Assuming the doctor hashes the DOB during registration.
    if not patient or not verify_password(login_in.dob, patient.dob):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect Patient ID or DOB",
        )

    access_token = create_access_token(
        data={"sub": str(patient.id), "role": "patient"})
    return {"access_token": access_token, "token_type": "bearer"}
