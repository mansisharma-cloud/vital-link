import asyncio
from app.db.session import engine, Base
from app.models.user import User
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.hospital import Hospital
from app.models.appointment import Appointment
from app.models.health_metrics import HealthMetric
from app.models.risk_assessment import RiskAssessment
from app.models.health_alert import HealthAlert
from app.models.health_baseline import HealthBaseline


async def init_db():
    async with engine.begin() as conn:
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)
    print("Database initialized successfully.")

if __name__ == "__main__":
    asyncio.run(init_db())
