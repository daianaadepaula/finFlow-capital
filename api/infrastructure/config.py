import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent

ENV_FILE = BASE_DIR / ".env"
load_dotenv(ENV_FILE)

class Settings:
    PROJECT_NAME: str = "FinFlow Capital - Clean Architecture API"
    VERSION: str = "2.0.0"
    
    # Credenciais e Modelos
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_PRIMARY_MODEL: str = os.getenv("GEMINI_PRIMARY_MODEL", "gemini-2.5-flash")
    GEMINI_FALLBACK_MODEL: str = os.getenv("GEMINI_FALLBACK_MODEL", "gemini-2.0-flash")
    
    # Banco de Dados
    DB_PATH: Path = BASE_DIR / "finflow.db"
    
    # Lista de Origens Padrão (Fallback para Desenvolvimento)
    DEFAULT_CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://fin-flow-capital.vercel.app",
    ]

    @property
    def CORS_ORIGINS(self) -> list:
        """Lê a variável CORS_ORIGINS do ambiente (.env ou Render) separada por vírgula."""
        raw_env = os.getenv("CORS_ORIGINS", "")
        if raw_env:
            return [origin.strip().rstrip("/") for origin in raw_env.split(",") if origin.strip()]
        return [origin.rstrip("/") for origin in self.DEFAULT_CORS_ORIGINS]

settings = Settings()