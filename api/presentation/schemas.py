from typing import List, Optional, Literal
from pydantic import BaseModel, EmailStr, Field

# --- Schemas de Chat ---
class MessageDTO(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str = Field(..., min_length=1, max_length=4000)

class ChatRequestDTO(BaseModel):
    messages: List[MessageDTO]

class ChatResponseDTO(BaseModel):
    reply: str
    response: str
    action_trigger: Optional[Literal["OPEN_SCHEDULER", "OPEN_CALCULATOR"]] = None
    source: Literal["gemini", "rules"]

# --- Schemas de Agendamento ---
class CreateBookingRequestDTO(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(..., min_length=8, max_length=30)
    objective: str = Field(..., min_length=5, max_length=1000)
    preferred_date: str
    preferred_period: Literal["morning", "afternoon", "evening"]
    investor_profile: Optional[Literal["conservative", "moderate", "aggressive"]] = None

class BookingResponseDTO(BaseModel):
    status: str
    message: str
    id: str

class BookingListResponseDTO(BaseModel):
    bookings: List[dict]

# --- Schemas de Calculadoras ---
class CompoundInterestRequestDTO(BaseModel):
    initial: float = Field(..., ge=0, description="Montante inicial em R$")
    monthly: float = Field(..., ge=0, description="Aporte mensal em R$")
    rate_annual: float = Field(..., ge=0, le=500, description="Taxa anual percentual (% a.a.)")
    years: int = Field(..., ge=1, le=50, description="Prazo em anos")

class YearlyBreakdownDTO(BaseModel):
    year: int
    invested: float
    balance: float

class CompoundInterestResponseDTO(BaseModel):
    projected_patrimony: float
    total_invested: float
    total_interest: float
    yearly_breakdown: List[YearlyBreakdownDTO]

class LoanSimulationRequestDTO(BaseModel):
    amount: float = Field(..., gt=0, description="Valor do empréstimo em R$")
    rate_annual: float = Field(..., ge=0, le=500, description="Taxa de juros anual (% a.a.)")
    months: int = Field(..., ge=1, le=360, description="Prazo em meses")

class MonthlyBreakdownDTO(BaseModel):
    month: int
    interest: float
    remaining_balance: float

class LoanSimulationResponseDTO(BaseModel):
    monthly_payment: float
    total_cost: float
    total_interest_paid: float
    monthly_breakdown: List[MonthlyBreakdownDTO]

# --- Schemas de Mercado ---
class SelicMarketResponseDTO(BaseModel):
    indicator: str
    selic_annual_rate: float
    reference_date: str
    is_fallback: bool

