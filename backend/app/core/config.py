from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "BioSense Live"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key-for-jwt"  # Should be changed in production
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "biosense_live"
    SQLALCHEMY_DATABASE_URI: str | None = None

    @property
    def database_url(self) -> str:
        if self.SQLALCHEMY_DATABASE_URI:
            return self.SQLALCHEMY_DATABASE_URI

        # In a real environment, we'd only return Postgres.
        # For this demo/local setup, we return Postgres but session.py will handle the actual fallback to SQLite if connection fails.
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
