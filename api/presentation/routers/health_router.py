from fastapi import APIRouter
from infrastructure.config import settings

router = APIRouter(prefix="/api/health", tags=["Health & Monitoramento"])

@router.get("")
async def health_check():
    """
    Retorna o status da aplicação e a prontidão dos componentes de IA e banco.
    """
    return {
        "status": "healthy",
        "gemini_configured": bool(settings.GEMINI_API_KEY),
        "primary_model": settings.GEMINI_PRIMARY_MODEL,
        "database": "sqlite_ready"
    }

