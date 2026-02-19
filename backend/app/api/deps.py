from typing import Optional, Union
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core import security
from app.db.session import get_db
from app.models.doctor import Doctor
from app.models.patient import Patient
from app.schemas.user import TokenPayload
from app.models.user import User
from sqlalchemy import select

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/doctor/login",
    auto_error=False
)


async def get_current_user_data(
    db: AsyncSession = Depends(get_db), token: Optional[str] = Depends(reusable_oauth2)
) -> dict:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
        role = payload.get("role")
    except (JWTError, ValidationError) as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        ) from exc

    if not token_data.sub:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Token missing subject ID",
        )

    return {"id": int(token_data.sub), "role": role}


async def get_current_doctor(
    db: AsyncSession = Depends(get_db),
    auth_data: dict = Depends(get_current_user_data)
) -> Doctor:
    if auth_data["role"] != "doctor":
        raise HTTPException(status_code=403, detail="Not authorized as doctor")

    result = await db.execute(select(Doctor).filter(Doctor.id == auth_data["id"]))
    doctor = result.scalars().first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor


async def get_current_patient(
    db: AsyncSession = Depends(get_db),
    auth_data: dict = Depends(get_current_user_data)
) -> Patient:
    if auth_data["role"] != "patient":
        raise HTTPException(
            status_code=403, detail="Not authorized as patient")

    result = await db.execute(select(Patient).filter(Patient.id == auth_data["id"]))
    patient = result.scalars().first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


async def get_current_user_optional(
    db: AsyncSession = Depends(get_db),
    token: Optional[str] = Depends(reusable_oauth2)
) -> Optional[Union[Doctor, Patient]]:
    if not token:
        return None
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
        role = payload.get("role")
    except (JWTError, ValidationError):
        return None

    if role == "doctor":
        result = await db.execute(select(Doctor).filter(Doctor.id == int(token_data.sub)))
    elif role == "patient":
        result = await db.execute(select(Patient).filter(Patient.id == int(token_data.sub)))
    else:
        return None

    return result.scalars().first()


async def get_current_user(
    db: AsyncSession = Depends(get_db),
    auth_data: dict = Depends(get_current_user_data)
) -> User:
    from app.models.user import User
    result = await db.execute(select(User).filter(User.id == auth_data["id"]))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
