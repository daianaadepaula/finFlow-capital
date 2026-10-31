from domain.entities import MarketRate
from domain.interfaces import IBCBService

class GetSelicRateUseCase:
    """Caso de uso para obter a taxa Selic oficial vigente do Banco Central."""

    def __init__(self, bcb_service: IBCBService):
        self.bcb_service = bcb_service

    def execute(self) -> MarketRate:
        return self.bcb_service.get_latest_selic_rate()

