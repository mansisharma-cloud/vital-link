from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    # e.g. "Diabetes", "Hypertension"
    disease_type = Column(String, nullable=False)
    risk_score = Column(Float, nullable=False)    # 0.0 to 100.0
    # "Low", "Moderate", "High", "Critical"
    risk_level = Column(String, nullable=False)
    assessment_date = Column(DateTime(timezone=True),
                             server_default=func.now())
    notes = Column(String, nullable=True)

    patient = relationship("Patient", backref="risk_assessments")
