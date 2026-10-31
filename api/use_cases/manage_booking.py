import uuid
from typing import List, Optional
from domain.entities import ConsultationBooking, PreferredPeriod, InvestorProfile
from domain.interfaces import IBookingRepository

class CreateBookingUseCase:
    """Caso de uso para registrar nova solicitação de consultoria."""

    def __init__(self, booking_repository: IBookingRepository):
        self.booking_repository = booking_repository

    def execute(
        self,
        full_name: str,
        email: str,
        phone: str,
        objective: str,
        preferred_date: str,
        preferred_period: PreferredPeriod,
        investor_profile: Optional[InvestorProfile] = None
    ) -> ConsultationBooking:
        booking = ConsultationBooking(
            id=str(uuid.uuid4()),
            full_name=full_name.strip(),
            email=email.strip().lower(),
            phone=phone.strip(),
            objective=objective.strip(),
            preferred_date=preferred_date,
            preferred_period=preferred_period,
            investor_profile=investor_profile
        )

        # Validação de regras de negócio da entidade
        booking.validate()

        return self.booking_repository.save(booking)

class ListBookingsUseCase:
    """Caso de uso para listar agendamentos existentes."""

    def __init__(self, booking_repository: IBookingRepository):
        self.booking_repository = booking_repository

    def execute(self) -> List[ConsultationBooking]:
        return self.booking_repository.find_all()

