from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class HealthBaseline(Base):
    __tablename__ = "health_baselines"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    # "Heart Rate", "Glucose", etc.
    metric_type = Column(String, nullable=False)
    baseline_min = Column(Float, nullable=False)
    baseline_max = Column(Float, nullable=False)
    last_updated = Column(DateTime(timezone=True),
                          onupdate=func.now(), server_default=func.now())

    patient = relationship("Patient", backref="health_baselines")
