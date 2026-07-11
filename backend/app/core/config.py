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




    CHUNK_SIZE: int = 512
    CHUNK_OVERLAP: int = 64

    DATA_DIR: str = "data"

    RECREATE_COLLECTION: bool = True

    RETRIEVE_TOP_K: int = 15
    FINAL_TOP_K: int = 5
    ENABLE_RETRIEVAL_LOGS: bool = True

    MIN_SCORE: float = 0.3




@lru_cache
def get_settings() -> Settings:
    return Settings()