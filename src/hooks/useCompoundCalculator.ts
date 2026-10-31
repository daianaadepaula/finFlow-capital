import { useEffect, useState } from "react";
import {
  calculateCompoundInterest,
  getMarketSelicRate,
  type CompoundApiResponse,
} from "@/services/calculatorService";

export function useCompoundCalculator() {
  const [initial, setInitial] = useState("10000");
  const [monthly, setMonthly] = useState("500");
  const [rate, setRate] = useState("10");
  const [years, setYears] = useState("10");

  const [result, setResult] = useState<CompoundApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selicLoaded, setSelicLoaded] = useState(false);

  // Busca a Selic oficial do Banco Central no início
  useEffect(() => {
    async function fetchSelic() {
      try {
        const data = await getMarketSelicRate();
        if (data.selic_annual_rate) {
          setRate(String(data.selic_annual_rate));
          setSelicLoaded(true);
        }
      } catch (err) {
        console.warn("Selic indisponível, mantendo taxa padrão.", err);
      }
    }
    fetchSelic();
  }, []);

  // Re-calcula automaticamente sempre que os inputs mudam
  useEffect(() => {
    const initialNum = Number(initial);
    const monthlyNum = Number(monthly);
    const rateNum = Number(rate);
    const yearsNum = Number(years);

    if (isNaN(initialNum) || isNaN(monthlyNum) || isNaN(rateNum) || isNaN(yearsNum)) {
      setError("Preencha todos os campos corretamente.");
      setResult(null);
      return;
    }

    if (yearsNum < 1 || yearsNum > 50) {
      setError("O prazo deve ficar entre 1 e 50 anos.");
      setResult(null);
      return;
    }

    setError(null);
    setLoading(true);

    const controller = new AbortController();

    calculateCompoundInterest(
      {
        initial: initialNum,
        monthly: monthlyNum,
        rate_annual: rateNum,
        years: yearsNum,
      },
      controller.signal
    )
      .then((data) => {
        setResult(data);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message || "Erro ao calcular no servidor Python.");
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, [initial, monthly, rate, years]);

  return {
    initial,
    setInitial,
    monthly,
    setMonthly,
    rate,
    setRate,
    years,
    setYears,
    result,
    loading,
    error,
    selicLoaded,
  };
}

