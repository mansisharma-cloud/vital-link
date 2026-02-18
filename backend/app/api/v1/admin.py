import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.db.session import get_db
from app.models.user import User
from app.models.health_metrics import HealthMetric
from app.schemas.user import User as UserSchema
from app.api.deps import get_current_user
from typing import List

router = APIRouter()


def is_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user


@router.get("/users", response_model=List[UserSchema])
async def get_all_users(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(is_admin)
):
    result = await db.execute(select(User))
    return result.scalars().all()


@router.get("/stats")
async def get_system_stats(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(is_admin)
):
    user_count = await db.execute(select(func.count(User.id)))
    metric_count = await db.execute(select(func.count(HealthMetric.id)))

    return {
        "total_users": user_count.scalar(),
        "total_readings": metric_count.scalar(),
        "system_status": "Healthy",
        "active_devices": random.randint(5, 20)  # Simulated
    }
