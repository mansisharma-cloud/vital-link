from pydantic import BaseModel
from typing import Optional


class HospitalBase(BaseModel):
    name: str
    address: str
    contact_number: str
    hosp_code: str


class HospitalCreate(HospitalBase):
    pass


class Hospital(HospitalBase):
    id: int

    class Config:
        from_attributes = True
