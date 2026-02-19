from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.db.session import Base


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    date = Column(String, nullable=False)  # ISO format YYYY-MM-DD
    time = Column(String, nullable=False)  # HH:MM
    reason = Column(String, nullable=False)
    # Scheduled, Completed, Cancelled
    status = Column(String, default="Scheduled")

    doctor = relationship("Doctor", back_populates="appointments")
    patient = relationship("Patient", back_populates="appointments")
