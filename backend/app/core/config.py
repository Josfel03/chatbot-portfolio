from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    CHROMA_PERSIST_DIR: str = "./chroma_db"
    UPLOADS_DIR: str = "./uploaded_files"
    MAX_UPLOAD_SIZE: int = 10_000_000  # 10MB

    class Config:
        env_file = ".env"

settings = Settings()
