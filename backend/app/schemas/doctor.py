from pydantic import BaseModel, EmailStr
from typing import Optional, List


class DoctorBase(BaseModel):
    full_name: str
    email: EmailStr
    qualification: str
    role: str
    emergency_contact: str
    consultation_timings: str
    license_number: Optional[str] = None


class DoctorCreate(DoctorBase):
    password: str
    hospital_id: Optional[int] = None
    new_hospital_name: Optional[str] = None
    new_hospital_address: Optional[str] = None
    new_hospital_contact: Optional[str] = None
    new_hospital_code: Optional[str] = None


class DoctorUpdate(BaseModel):
    full_name: Optional[str] = None
    qualification: Optional[str] = None
    role: Optional[str] = None
    emergency_contact: Optional[str] = None
    consultation_timings: Optional[str] = None
    license_number: Optional[str] = None


class Doctor(DoctorBase):
    id: int
    hospital_id: int
    hospital_name: Optional[str] = None
    hospital_address: Optional[str] = None
    hospital_contact: Optional[str] = None

    class Config:
        from_attributes = True


class DoctorLogin(BaseModel):
    email: EmailStr
    password: str
