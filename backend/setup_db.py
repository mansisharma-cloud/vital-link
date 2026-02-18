import asyncio
import asyncpg
from app.core.config import settings


async def setup():
    # Connect to the default 'postgres' database
    conn = await asyncpg.connect(
        user=settings.POSTGRES_USER,
        password=settings.POSTGRES_PASSWORD,
        host=settings.POSTGRES_SERVER,
        database="postgres"
    )

    # Check if 'biosense_live' exists
    exists = await conn.fetchval(
        "SELECT 1 FROM pg_database WHERE datname = $1", settings.POSTGRES_DB
    )

    if not exists:
        # asyncpg doesn't support CREATE DATABASE in a transaction, but we can do it this way:
        await conn.execute(f'CREATE DATABASE "{settings.POSTGRES_DB}"')
        print(f"Database {settings.POSTGRES_DB} created.")
    else:
        print(f"Database {settings.POSTGRES_DB} already exists.")

    await conn.close()

if __name__ == "__main__":
    asyncio.run(setup())
