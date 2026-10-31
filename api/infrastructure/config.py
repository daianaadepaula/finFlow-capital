import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Carrega o .env localizado na raiz do backend (/api/.env)
ENV_FILE = BASE_DIR / ".env"
load_dotenv(ENV_FILE)

class Settings:
    PROJECT_NAME: str = "FinFlow Capital - Clean Architecture API"
    VERSION: str = "2.0.0"
    
    # Chaves e credenciais externas
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Modelos do Gemini em ordem de prioridade
    GEMINI_PRIMARY_MODEL: str = os.getenv("GEMINI_PRIMARY_MODEL", "gemini-3.5-flash-lite")
    GEMINI_FALLBACK_MODEL: str = os.getenv("GEMINI_FALLBACK_MODEL", "gemini-3.8-flash")
    
    # Banco de dados SQLite
    DB_PATH: Path = BASE_DIR / "finflow.db"
    
    # CORS
    CORS_ORIGINS: list = ["*"]

settings = Settings()

