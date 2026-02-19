import asyncio
import logging
from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings
from sqlalchemy.exc import SQLAlchemyError

logger = logging.getLogger(__name__)

# Default engine
SQLALCHEMY_DATABASE_URL = settings.database_url

# We'll use a single engine instance.
# We don't try to connect here because create_async_engine is lazy.
# The actual connection check happens in get_db.
engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=True)

SessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()


async def get_db():
    global engine, SessionLocal

    print(f"Connecting to database: {engine.url}")
    try:
        # Try to connect with a 5-second timeout to avoid long hangs
        async with asyncio.timeout(5):
            async with engine.connect() as conn:
                await conn.execute(select(1))
        print("Database connection successful.")
    except (Exception, SQLAlchemyError) as e:
        print(f"Database connection attempt failed: {e}")
        # If it's already using SQLite, we don't want to infinite loop,
        # but here we check if we should fallback.
        if "postgresql" in str(engine.url):
            logger.error(
                f"Postgres connection failed: {e}. Falling back to SQLite.")
            print("Falling back to SQLite...")
            sqlite_url = "sqlite+aiosqlite:///./sql_app.db"
            engine = create_async_engine(sqlite_url, echo=True, connect_args={
                                         "check_same_thread": False})
            # CRITICAL: Update SessionLocal to use the new engine
            SessionLocal = sessionmaker(
                engine, class_=AsyncSession, expire_on_commit=False)

            # Ensure tables are created in the fallback database
            from app.db.base import Base

            async def init_fallback():
                async with engine.begin() as conn:
                    await conn.run_sync(Base.metadata.create_all)
            asyncio.create_task(init_fallback())
        else:
            logger.error(f"Database connection failed: {e}")
            raise e

    async with SessionLocal() as session:
        try:
            yield session
            await session.commit()
        except SQLAlchemyError as e:
            await session.rollback()
            raise e
        finally:
            await session.close()
