from fastapi import APIRouter, Depends, HTTPException
from domain.entities import ChatMessage
from presentation.schemas import ChatRequestDTO, ChatResponseDTO
from presentation.dependencies import get_chat_use_case
from use_cases.chat_finbot import ChatFinBotUseCase

router = APIRouter(prefix="/api/chat", tags=["Chat & Assistente Virtual"])

@router.post("", response_model=ChatResponseDTO)
async def chat_endpoint(
    request: ChatRequestDTO,
    use_case: ChatFinBotUseCase = Depends(get_chat_use_case)
):
    """
    Processa mensagens de diálogo financeiro com o FinBot via Gemini AI ou regras de contingência.
    """
    try:
        domain_messages = [
            ChatMessage(role=msg.role, content=msg.content)
            for msg in request.messages
        ]
        result = use_case.execute(domain_messages)
        return ChatResponseDTO(
            reply=result.reply,
            response=result.response,
            action_trigger=result.action_trigger,
            source=result.source
        )
    except ValueError as val_err:
        raise HTTPException(status_code=400, detail=str(val_err))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Falha interna no processamento do chat: {str(exc)}")

