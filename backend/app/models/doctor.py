from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    qualification = Column(String, nullable=False)
    role = Column(String, nullable=False)  # Specialization
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    emergency_contact = Column(String, nullable=False)
    consultation_timings = Column(String, nullable=False)
    license_number = Column(String, nullable=True)

    hospital = relationship("Hospital", back_populates="doctors")
    patients = relationship("Patient", back_populates="doctor")
    appointments = relationship("Appointment", back_populates="doctor")
