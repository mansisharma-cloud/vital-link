import asyncio
from app.db.session import engine, Base, SessionLocal
from app.models.doctor import Doctor
from app.models.patient import Patient
from app.models.hospital import Hospital
from app.models.appointment import Appointment
from app.models.health_metrics import HealthMetric
from app.models.user import User
from app.core.security import get_password_hash
from sqlalchemy import select

async def seed_data():
    print("Creating database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as db:
        print("Seeding data...")
        
        # 1. Create Default Hospital
        result = await db.execute(select(Hospital).where(Hospital.hosp_code == "DEMO"))
        hospital = result.scalars().first()
        if not hospital:
            hospital = Hospital(
                name="Demo General Hospital",
                address="123 Health St, Wellness City",
                contact_number="555-0123",
                hosp_code="DEMO"
            )
            db.add(hospital)
            await db.commit()
            await db.refresh(hospital)
            print("Created Default Hospital")
        else:
            print("Default Hospital already exists")

        # 2. Create Default Doctor
        result = await db.execute(select(Doctor).where(Doctor.email == "demo@doctor.com"))
        doctor = result.scalars().first()
        if not doctor:
            doctor = Doctor(
                full_name="Dr. Demo User",
                email="demo@doctor.com",
                hashed_password=get_password_hash("password"),
                qualification="MBBS, MD",
                role="doctor",
                hospital_id=hospital.id,
                emergency_contact="555-0999",
                consultation_timings="09:00 AM - 05:00 PM",
                license_number="DEMO-LIC-001"
            )
            db.add(doctor)
            await db.commit()
            await db.refresh(doctor)
            print("Created Default Doctor")
        else:
            print("Default Doctor already exists")

        # 3. Create Default Patient
        result = await db.execute(select(Patient).where(Patient.patient_id == "DEMO-PID-001"))
        patient = result.scalars().first()
        if not patient:
            patient = Patient(
                patient_id="DEMO-PID-001",
                full_name="John Doe",
                dob=get_password_hash("01011990"), # DOB is password for patients
                gender="Male",
                contact_number="555-5555",
                address="456 Recovery Rd",
                emergency_contact="555-1111",
                blood_group="O+",
                medical_conditions="None",
                doctor_id=doctor.id,
                hospital_id=hospital.id
            )
            db.add(patient)
            await db.commit()
            print("Created Default Patient")
        else:
            print("Default Patient already exists")
    
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    asyncio.run(seed_data())
