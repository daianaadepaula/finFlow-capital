from fastapi import APIRouter, Depends, HTTPException
from presentation.schemas import (
    CompoundInterestRequestDTO,
    CompoundInterestResponseDTO,
    YearlyBreakdownDTO,
    LoanSimulationRequestDTO,
    LoanSimulationResponseDTO,
    MonthlyBreakdownDTO
)
from presentation.dependencies import (
    get_compound_calculator_use_case,
    get_loan_simulator_use_case
)
from use_cases.calculate_finance import (
    CalculateCompoundInterestUseCase,
    SimulateLoanUseCase
)

router = APIRouter(prefix="/api/calculator", tags=["Calculadoras Financeiras"])

@router.post("/compound-interest", response_model=CompoundInterestResponseDTO)
async def calculate_compound_interest(
    request: CompoundInterestRequestDTO,
    use_case: CalculateCompoundInterestUseCase = Depends(get_compound_calculator_use_case)
):
    """
    Projeta o patrimônio futuro com aportes mensais e juros compostos.
    """
    try:
        result = use_case.execute(
            initial=request.initial,
            monthly=request.monthly,
            rate_annual=request.rate_annual,
            years=request.years
        )
        return CompoundInterestResponseDTO(
            projected_patrimony=result.projected_patrimony,
            total_invested=result.total_invested,
            total_interest=result.total_interest,
            yearly_breakdown=[
                YearlyBreakdownDTO(year=y.year, invested=y.invested, balance=y.balance)
                for y in result.yearly_breakdown
            ]
        )
    except ValueError as val_err:
        raise HTTPException(status_code=400, detail=str(val_err))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Erro no cálculo de juros compostos: {str(exc)}")

@router.post("/loan-simulation", response_model=LoanSimulationResponseDTO)
async def simulate_loan(
    request: LoanSimulationRequestDTO,
    use_case: SimulateLoanUseCase = Depends(get_loan_simulator_use_case)
):
    """
    Simula valor de parcelas, juros acumulados e cronograma de amortização (Tabela Price).
    """
    try:
        result = use_case.execute(
            amount=request.amount,
            rate_annual=request.rate_annual,
            months=request.months
        )
        return LoanSimulationResponseDTO(
            monthly_payment=result.monthly_payment,
            total_cost=result.total_cost,
            total_interest_paid=result.total_interest_paid,
            monthly_breakdown=[
                MonthlyBreakdownDTO(
                    month=m.month,
                    interest=m.interest,
                    remaining_balance=m.remaining_balance
                )
                for m in result.monthly_breakdown
            ]
        )
    except ValueError as val_err:
        raise HTTPException(status_code=400, detail=str(val_err))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Erro na simulação de empréstimo: {str(exc)}")

