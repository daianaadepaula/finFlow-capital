from fastapi import APIRouter, Depends, HTTPException
from presentation.schemas import (
    CreateBookingRequestDTO,
    BookingResponseDTO,
    BookingListResponseDTO
)
from presentation.dependencies import (
    get_create_booking_use_case,
    get_list_bookings_use_case
)
from use_cases.manage_booking import (
    CreateBookingUseCase,
    ListBookingsUseCase
)

router = APIRouter(prefix="/api", tags=["Consultorias & Agendamento"])

@router.post("/agendar", response_model=BookingResponseDTO)
async def book_consultation(
    booking: CreateBookingRequestDTO,
    use_case: CreateBookingUseCase = Depends(get_create_booking_use_case)
):
    """
    Cadastra uma nova solicitação de consultoria financeira na FinFlow Capital.
    """
    try:
        created = use_case.execute(
            full_name=booking.full_name,
            email=booking.email,
            phone=booking.phone,
            objective=booking.objective,
            preferred_date=booking.preferred_date,
            preferred_period=booking.preferred_period,
            investor_profile=booking.investor_profile
        )
        return BookingResponseDTO(
            status="success",
            message="Agendamento salvo com sucesso no banco SQLite!",
            id=created.id
        )
    except ValueError as val_err:
        raise HTTPException(status_code=400, detail=str(val_err))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Erro ao salvar agendamento: {str(exc)}")

@router.get("/agendamentos", response_model=BookingListResponseDTO)
async def list_consultations(
    use_case: ListBookingsUseCase = Depends(get_list_bookings_use_case)
):
    """
    Lista todos os agendamentos registrados no banco de dados.
    """
    try:
        bookings = use_case.execute()
        return BookingListResponseDTO(
            bookings=[
                {
                    "id": b.id,
                    "full_name": b.full_name,
                    "email": b.email,
                    "phone": b.phone,
                    "objective": b.objective,
                    "investor_profile": b.investor_profile,
                    "preferred_date": b.preferred_date,
                    "preferred_period": b.preferred_period,
                    "created_at": b.created_at
                }
                for b in bookings
            ]
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Erro ao recuperar agendamentos: {str(exc)}")

