import asyncio
from app.db.session import engine
from app.db.base import Base


async def init_db():
    async with engine.begin() as conn:
        # Import all models to ensure they are registered with Base
        # Base.metadata.drop_all(conn) # Uncomment to reset DB
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables created successfully.")

if __name__ == "__main__":
    asyncio.run(init_db())
