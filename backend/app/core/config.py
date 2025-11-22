from pydantic_settings import BaseSettings

from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    CHROMA_PERSIST_DIR: str = "./chroma_db"
    UPLOADS_DIR: str = "./uploaded_files"
    MAX_UPLOAD_SIZE: int = 10_000_000  # 10MB
    ALLOWED_ORIGINS: str = "http://localhost:3000"  # Default para desarrollo

    class Config:
        env_file = ".env"
        case_sensitive = False
    
    def get_allowed_origins(self) -> List[str]:
        """Convierte el string de orígenes a lista"""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]

settings = Settings()
