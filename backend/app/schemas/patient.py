from pydantic import BaseModel
from typing import Optional, List
from datetime import date


class PatientBase(BaseModel):
    full_name: str
    dob: str  # DDMMYYYY
    gender: str
    contact_number: str
    address: str
    emergency_contact: str
    blood_group: Optional[str] = None
    medical_conditions: Optional[str] = None


class PatientCreate(PatientBase):
    pass


class PatientUpdate(BaseModel):
    contact_number: Optional[str] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    medical_conditions: Optional[str] = None


class Patient(PatientBase):
    id: int
    patient_id: str
    doctor_id: int
    hospital_id: int
    doctor_name: Optional[str] = None
    doctor_specialization: Optional[str] = None
    doctor_qualification: Optional[str] = None
    hospital_name: Optional[str] = None
    hospital_address: Optional[str] = None
    hospital_contact: Optional[str] = None
    dob_display: Optional[str] = None  # For display as DD-MM-YYYY

    class Config:
        from_attributes = True


class PatientLogin(BaseModel):
    patient_id: str
    dob: str
