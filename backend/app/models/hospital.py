from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.session import Base


class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    address = Column(String, nullable=False)
    contact_number = Column(String, nullable=False)
    hosp_code = Column(String, unique=True, index=True, nullable=False)

    doctors = relationship("Doctor", back_populates="hospital")
    patients = relationship("Patient", back_populates="hospital")
