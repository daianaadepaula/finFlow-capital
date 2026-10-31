import { useEffect, useState } from "react";
import {
  simulateLoan,
  type LoanApiResponse,
} from "@/services/calculatorService";

export function useLoanCalculator() {
  const [amount, setAmount] = useState("20000");
  const [rate, setRate] = useState("18");
  const [months, setMonths] = useState("36");

  const [result, setResult] = useState<LoanApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const amountNum = Number(amount);
    const rateNum = Number(rate);
    const monthsNum = Number(months);

    if (isNaN(amountNum) || isNaN(rateNum) || isNaN(monthsNum)) {
      setError("Preencha todos os campos para ver a simulação.");
      setResult(null);
      return;
    }

    if (amountNum <= 0) {
      setError("O valor do empréstimo precisa ser maior que zero.");
      setResult(null);
      return;
    }

    if (monthsNum < 1 || monthsNum > 360) {
      setError("O prazo deve ser de 1 a 360 meses.");
      setResult(null);
      return;
    }

    setError(null);
    setLoading(true);

    const controller = new AbortController();

    simulateLoan(
      {
        amount: amountNum,
        rate_annual: rateNum,
        months: monthsNum,
      },
      controller.signal
    )
      .then((data) => {
        setResult(data);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message || "Erro ao simular empréstimo no servidor Python.");
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, [amount, rate, months]);

  return {
    amount,
    setAmount,
    rate,
    setRate,
    months,
    setMonths,
    result,
    loading,
    error,
  };
}

