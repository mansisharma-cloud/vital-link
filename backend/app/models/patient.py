from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.db.session import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, unique=True, index=True,
                        nullable=False)  # e.g. HOSP-PID-1001
    full_name = Column(String, index=True, nullable=False)
    dob = Column(String, nullable=False)  # Used as password (DDMMYYYY)
    gender = Column(String, nullable=False)
    contact_number = Column(String, nullable=False)
    address = Column(String, nullable=False)
    emergency_contact = Column(String, nullable=False)
    blood_group = Column(String, nullable=True)
    medical_conditions = Column(String, nullable=True)

    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))

    doctor = relationship("Doctor", back_populates="patients")
    hospital = relationship("Hospital", back_populates="patients")
    appointments = relationship("Appointment", back_populates="patient")
    health_metrics = relationship("HealthMetric", back_populates="patient")
