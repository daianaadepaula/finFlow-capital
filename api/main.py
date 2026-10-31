from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from infrastructure.config import settings
from infrastructure.database.sqlite_connection import init_database

from presentation.routers.chat_router import router as chat_router
from presentation.routers.booking_router import router as booking_router
from presentation.routers.calculator_router import router as calculator_router
from presentation.routers.market_router import router as market_router
from presentation.routers.health_router import router as health_router

def create_application() -> FastAPI:
    """Fábrica da aplicação FastAPI com configurações de middleware e roteadores."""
    application = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="API RESTful de Gestão Financeira, Chatbot FinBot com Gemini AI e Simuladores de Mercado.",
        docs_url="/docs",
        redoc_url="/redoc"
    )

    # Configuração de CORS para permitir requisições do frontend React
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Inclusão dos Roteadores da Camada de Apresentação
    application.include_router(chat_router)
    application.include_router(booking_router)
    application.include_router(calculator_router)
    application.include_router(market_router)
    application.include_router(health_router)

    @application.on_event("startup")
    def on_startup():
        """Inicializa as tabelas do banco SQLite."""
        init_database()

    return application

app = create_application()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)
