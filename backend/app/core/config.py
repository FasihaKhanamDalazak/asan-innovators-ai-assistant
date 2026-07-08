from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    GEMINI_API_KEY: str

    QDRANT_URL: str
    QDRANT_API_KEY: str

    COLLECTION_NAME: str = "asan-innovators"

    SIMILARITY_TOP_K: int = 5
    SIMILARITY_CUTOFF: float = 0.7


@lru_cache
def get_settings() -> Settings:
    return Settings()