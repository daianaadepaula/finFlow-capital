from fastapi import Depends
from domain.interfaces import IBookingRepository, IGeminiService, IBCBService
from infrastructure.database.sqlite_booking_repository import SqliteBookingRepository
from infrastructure.external.gemini_service import GeminiService
from infrastructure.external.bcb_service import BCBService

from use_cases.chat_finbot import ChatFinBotUseCase
from use_cases.manage_booking import CreateBookingUseCase, ListBookingsUseCase
from use_cases.calculate_finance import CalculateCompoundInterestUseCase, SimulateLoanUseCase
from use_cases.get_market_rates import GetSelicRateUseCase

# Repositórios e Serviços (Singletons/Instâncias compartilhadas)
_booking_repo = SqliteBookingRepository()
_gemini_service = GeminiService()
_bcb_service = BCBService()

def get_booking_repository() -> IBookingRepository:
    return _booking_repo

def get_gemini_service() -> IGeminiService:
    return _gemini_service

def get_bcb_service() -> IBCBService:
    return _bcb_service

# Provedores de Use Cases
def get_chat_use_case(
    gemini_service: IGeminiService = Depends(get_gemini_service)
) -> ChatFinBotUseCase:
    return ChatFinBotUseCase(gemini_service=gemini_service)

def get_create_booking_use_case(
    repo: IBookingRepository = Depends(get_booking_repository)
) -> CreateBookingUseCase:
    return CreateBookingUseCase(booking_repository=repo)

def get_list_bookings_use_case(
    repo: IBookingRepository = Depends(get_booking_repository)
) -> ListBookingsUseCase:
    return ListBookingsUseCase(booking_repository=repo)

def get_compound_calculator_use_case() -> CalculateCompoundInterestUseCase:
    return CalculateCompoundInterestUseCase()

def get_loan_simulator_use_case() -> SimulateLoanUseCase:
    return SimulateLoanUseCase()

def get_selic_use_case(
    bcb_service: IBCBService = Depends(get_bcb_service)
) -> GetSelicRateUseCase:
    return GetSelicRateUseCase(bcb_service=bcb_service)

