from pydantic import BaseModel
from typing import Optional


class AppointmentBase(BaseModel):
    patient_id: int
    date: str
    time: str
    reason: str
    status: str = "Scheduled"


class AppointmentCreate(AppointmentBase):
    pass


class Appointment(AppointmentBase):
    id: int
    doctor_id: int
    patient_name: Optional[str] = None
    doctor_name: Optional[str] = None

    class Config:
        from_attributes = True
