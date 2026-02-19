from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class HealthAlert(Base):
    __tablename__ = "health_alerts"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    # "High Blood Pressure", "Arrhythmia", etc.
    alert_type = Column(String, nullable=False)
    # "Info", "Warning", "Critical"
    severity = Column(String, nullable=False)
    message = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    is_read_by_patient = Column(Boolean, default=False)
    is_read_by_doctor = Column(Boolean, default=False)
    action_taken = Column(String, nullable=True)

    patient = relationship("Patient", backref="health_alerts")
