from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "NEXORA - Autonomous Coordination Agent"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    
    # Caspian Integration
    CASPIAN_API_KEY: Optional[str] = "caspian_live_key_sample"
    CASPIAN_BASE_URL: str = "https://api.trycaspianai.com/v1"
    CASPIAN_MODE: str = "mock"  # 'mock' or 'live'
    
    # Featherless AI Integration
    FEATHERLESS_API_KEY: Optional[str] = ""
    FEATHERLESS_BASE_URL: str = "https://api.featherless.ai/v1"
    FEATHERLESS_MODEL: str = "deepseek-ai/DeepSeek-V3.2"
    LLM_MODE: str = "mock"  # 'mock' or 'live'
    FEATHERLESS_PROMO_CODE: str = "AIBUILD26"
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./nexora.db"
    
    # Agent Policies
    DEFAULT_ACK_TIMEOUT_SECONDS: int = 10  # 10s for fast live hackathon demonstration
    CORS_ORIGINS: list[str] = ["*"]
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

