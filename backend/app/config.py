from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "sqlite:///./signal_clone.db"
    secret_key: str = "super-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 30
    frontend_url: str = "http://localhost:3000"
    mock_otp: str = "123456"

    class Config:
        env_file = ".env"

settings = Settings()
