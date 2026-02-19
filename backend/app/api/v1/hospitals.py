from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.db.session import get_db
from app.models.hospital import Hospital
from app.schemas.hospital import Hospital as HospitalSchema

router = APIRouter()


@router.get("/", response_model=List[HospitalSchema])
async def get_hospitals(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Hospital))
    return result.scalars().all()
