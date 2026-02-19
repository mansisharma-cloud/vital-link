import asyncio
import sys
import os

# Add the current directory to path so we can import app
sys.path.append(os.path.join(os.getcwd(), "backend"))


async def check():
    try:
        from app.db.session import SessionLocal, get_db, engine
        from app.models.patient import Patient
        from sqlalchemy import select

        print(f"Database URL: {engine.url}")

        async with SessionLocal() as db:
            result = await db.execute(select(Patient))
            patients = result.scalars().all()
            print(f"Total Patients: {len(patients)}")
            for p in patients:
                print(
                    f"ID: {p.patient_id} | Name: {p.full_name} | Doctor ID: {p.doctor_id}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(check())
