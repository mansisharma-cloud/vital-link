from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class HealthMetric(Base):
    __tablename__ = "health_metrics"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    # heart_rate, glucose, temperature, etc.
    metric_type = Column(String, index=True)
    value = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    patient = relationship("Patient", back_populates="health_metrics")
