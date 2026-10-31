from typing import List
from domain.entities import (
    CompoundInvestmentResult,
    YearlyBreakdown,
    LoanSimulationResult,
    MonthlyBreakdown
)

class CalculateCompoundInterestUseCase:
    """Calcula a evolução patrimonial por juros compostos com aportes mensais."""

    def execute(
        self,
        initial: float,
        monthly: float,
        rate_annual: float,
        years: int
    ) -> CompoundInvestmentResult:
        if initial < 0 or monthly < 0 or rate_annual < 0 or years < 1:
            raise ValueError("Parâmetros de investimento inválidos.")

        # Conversão da taxa anual para taxa mensal equivalente
        monthly_rate = ((1 + rate_annual / 100) ** (1 / 12)) - 1
        total_months = years * 12
        yearly_breakdown: List[YearlyBreakdown] = []

        balance = initial
        for month in range(1, total_months + 1):
            balance = balance * (1 + monthly_rate) + monthly
            if month % 12 == 0:
                year_num = month // 12
                total_invested_so_far = initial + (monthly * month)
                yearly_breakdown.append(
                    YearlyBreakdown(
                        year=year_num,
                        invested=round(total_invested_so_far, 2),
                        balance=round(balance, 2)
                    )
                )

        total_invested = round(initial + (monthly * total_months), 2)
        final_balance = round(balance, 2)
        total_interest = round(final_balance - total_invested, 2)

        return CompoundInvestmentResult(
            projected_patrimony=final_balance,
            total_invested=total_invested,
            total_interest=total_interest,
            yearly_breakdown=yearly_breakdown
        )

class SimulateLoanUseCase:
    """Calcula parcelas e amortização de empréstimos segundo a Tabela Price."""

    def execute(
        self,
        amount: float,
        rate_annual: float,
        months: int
    ) -> LoanSimulationResult:
        if amount <= 0 or rate_annual < 0 or months < 1:
            raise ValueError("Parâmetros de empréstimo inválidos.")

        monthly_rate = ((1 + rate_annual / 100) ** (1 / 12)) - 1

        if monthly_rate == 0:
            payment = amount / months
        else:
            payment = (amount * monthly_rate) / (1 - ((1 + monthly_rate) ** (-months)))

        monthly_breakdown: List[MonthlyBreakdown] = []
        balance = amount

        for month in range(1, months + 1):
            interest = balance * monthly_rate
            amortization = payment - interest
            balance = 0.0 if month == months else max(0.0, balance - amortization)

            monthly_breakdown.append(
                MonthlyBreakdown(
                    month=month,
                    interest=round(interest, 2),
                    remaining_balance=round(balance, 2)
                )
            )

        total_cost = round(payment * months, 2)
        total_interest_paid = round(total_cost - amount, 2)

        return LoanSimulationResult(
            monthly_payment=round(payment, 2),
            total_cost=total_cost,
            total_interest_paid=total_interest_paid,
            monthly_breakdown=monthly_breakdown
        )

