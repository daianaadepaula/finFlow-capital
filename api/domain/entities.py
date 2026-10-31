from dataclasses import dataclass, field
from datetime import datetime, date
from typing import List, Optional, Literal

InvestorProfile = Literal["conservative", "moderate", "aggressive"]
PreferredPeriod = Literal["morning", "afternoon", "evening"]
FinBotAction = Literal["OPEN_SCHEDULER", "OPEN_CALCULATOR"]

@dataclass
class ConsultationBooking:
    """Entidade representativa de um agendamento de consultoria financeira."""
    id: str
    full_name: str
    email: str
    phone: str
    objective: str
    preferred_date: str
    preferred_period: PreferredPeriod
    investor_profile: Optional[InvestorProfile] = None
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())

    def validate(self) -> None:
        """Regras de validação de domínio para o agendamento."""
        if not (2 <= len(self.full_name.strip()) <= 120):
            raise ValueError("O nome completo deve ter entre 2 e 120 caracteres.")
        if "@" not in self.email or len(self.email) > 254:
            raise ValueError("E-mail com formato inválido.")
        if not (8 <= len(self.phone.strip()) <= 30):
            raise ValueError("Número de telefone deve ter entre 8 e 30 caracteres.")
        if not (5 <= len(self.objective.strip()) <= 1000):
            raise ValueError("O objetivo deve conter entre 5 e 1000 caracteres.")
        if self.preferred_period not in ["morning", "afternoon", "evening"]:
            raise ValueError("Período preferido inválido.")

@dataclass
class ChatMessage:
    """Entidade que representa uma mensagem no diálogo."""
    role: Literal["user", "assistant", "system"]
    content: str

@dataclass
class FinBotReply:
    """Entidade de resposta consolidada do assistente virtual FinBot."""
    reply: str
    response: str
    action_trigger: Optional[FinBotAction] = None
    source: Literal["gemini", "rules"] = "gemini"

@dataclass
class YearlyBreakdown:
    """Detalhamento patrimonial por ano."""
    year: int
    invested: float
    balance: float

@dataclass
class CompoundInvestmentResult:
    """Resultado de uma projeção de juros compostos."""
    projected_patrimony: float
    total_invested: float
    total_interest: float
    yearly_breakdown: List[YearlyBreakdown]

@dataclass
class MonthlyBreakdown:
    """Detalhamento mensal da amortização de empréstimo."""
    month: int
    interest: float
    remaining_balance: float

@dataclass
class LoanSimulationResult:
    """Resultado da simulação de empréstimo (Tabela Price)."""
    monthly_payment: float
    total_cost: float
    total_interest_paid: float
    monthly_breakdown: List[MonthlyBreakdown]

@dataclass
class MarketRate:
    """Taxa de mercado obtida de indicadores macroeconômicos."""
    indicator_name: str
    annual_rate: float
    reference_date: str
    is_fallback: bool = False

