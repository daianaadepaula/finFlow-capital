export type CompoundInput = {
  initialAmount: number;
  monthlyContribution: number;
  annualRate: number;
  years: number;
};

export type CompoundResult = {
  finalAmount: number;
  totalInvested: number;
  totalInterest: number;
  yearly: { year: number; balance: number; invested: number }[];
};

export type LoanInput = {
  amount: number;
  annualRate: number;
  months: number;
};

export type LoanResult = {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  schedule: { month: number; payment: number; interest: number; balance: number }[];
};

const round2 = (value: number) => Math.round(value * 100) / 100;

export function simulateCompound({
  initialAmount,
  monthlyContribution,
  annualRate,
  years,
}: CompoundInput): CompoundResult {
  const monthlyRate = Math.pow(1 + annualRate / 100, 1 / 12) - 1;
  const totalMonths = Math.round(years * 12);
  const yearly: CompoundResult["yearly"] = [];

  let balance = initialAmount;
  for (let month = 1; month <= totalMonths; month++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    if (month % 12 === 0) {
      const year = month / 12;
      yearly.push({
        year,
        balance: round2(balance),
        invested: round2(initialAmount + monthlyContribution * month),
      });
    }
  }

  const totalInvested = initialAmount + monthlyContribution * totalMonths;
  return {
    finalAmount: round2(balance),
    totalInvested: round2(totalInvested),
    totalInterest: round2(balance - totalInvested),
    yearly,
  };
}

export function simulateLoan({ amount, annualRate, months }: LoanInput): LoanResult {
  const monthlyRate = Math.pow(1 + annualRate / 100, 1 / 12) - 1;
  const payment =
    monthlyRate === 0
      ? amount / months
      : (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

  const schedule: LoanResult["schedule"] = [];
  let balance = amount;
  for (let month = 1; month <= months; month++) {
    const interest = balance * monthlyRate;
    balance = month === months ? 0 : balance + interest - payment;
    schedule.push({
      month,
      payment: round2(payment),
      interest: round2(interest),
      balance: round2(Math.max(balance, 0)),
    });
  }

  const totalPaid = payment * months;
  return {
    monthlyPayment: round2(payment),
    totalPaid: round2(totalPaid),
    totalInterest: round2(totalPaid - amount),
    schedule,
  };
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const formatCurrency = (value: number) => currencyFormatter.format(value);
