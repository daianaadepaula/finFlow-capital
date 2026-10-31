from fastapi import APIRouter, Depends, HTTPException
from presentation.schemas import SelicMarketResponseDTO
from presentation.dependencies import get_selic_use_case
from use_cases.get_market_rates import GetSelicRateUseCase

router = APIRouter(prefix="/api/market", tags=["Indicadores Macroeconômicos"])

@router.get("/selic", response_model=SelicMarketResponseDTO)
async def get_selic_rate(
    use_case: GetSelicRateUseCase = Depends(get_selic_use_case)
):
    """
    Retorna a taxa Selic Meta oficial do Banco Central do Brasil em tempo real.
    """
    try:
        rate = use_case.execute()
        return SelicMarketResponseDTO(
            indicator=rate.indicator_name,
            selic_annual_rate=rate.annual_rate,
            reference_date=rate.reference_date,
            is_fallback=rate.is_fallback
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar indicador Selic: {str(exc)}")

