import { TrendingUp, Loader2 } from "lucide-react";
import NumberField from "@/components/calculators/NumberField";
import { formatCurrency } from "@/lib/finance";
import { useCompoundCalculator } from "@/hooks/useCompoundCalculator";

export default function CompoundCalculator() {
  const {
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
  } = useCompoundCalculator();

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="space-y-5">
        <NumberField
          id="compound-initial"
          label="Valor inicial"
          prefix="R$"
          min={0}
          step={100}
          value={initial}
          onChange={setInitial}
        />
        <NumberField
          id="compound-monthly"
          label="Aporte mensal"
          prefix="R$"
          min={0}
          step={50}
          value={monthly}
          onChange={setMonthly}
        />
        <div>
          <NumberField
            id="compound-rate"
            label="Rentabilidade anual"
            suffix="% a.a."
            min={0}
            max={100}
            step={0.5}
            value={rate}
            onChange={setRate}
          />
          {selicLoaded && (
            <p className="mt-1 text-xs text-emerald-600 font-medium">
              Taxa Selic oficial sincronizada com o Banco Central.
            </p>
          )}
        </div>
        <NumberField
          id="compound-years"
          label="Prazo"
          suffix="anos"
          min={1}
          max={50}
          value={years}
          onChange={setYears}
        />
      </div>

      <div className="min-w-0">
        {loading && !result ? (
          <div className="flex items-center justify-center p-12 text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Calculando projeção patrimonial via Python...</span>
          </div>
        ) : error ? (
          <p role="alert" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-200">
            {error}
          </p>
        ) : result ? (
          <div className="space-y-6">
            <div className="rounded-2xl bg-slate-900 p-6 text-white">
              <p className="flex items-center gap-2 text-sm text-slate-300">
                <TrendingUp className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                Patrimônio acumulado estimado
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {formatCurrency(result.projected_patrimony)}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-800 pt-6">
                <div>
                  <p className="text-xs text-slate-400">Total investido do bolso</p>
                  <p className="mt-1 text-lg font-semibold text-slate-200">
                    {formatCurrency(result.total_invested)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Total em juros gerados</p>
                  <p className="mt-1 text-lg font-semibold text-emerald-400">
                    {formatCurrency(result.total_interest)}
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <h4 className="text-sm font-semibold text-slate-900">Evolução por ano</h4>
              </div>
              <div className="max-h-72 overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-600">
                    <tr>
                      <th scope="col" className="px-5 py-3 font-semibold">Ano</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Investido</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Saldo com juros</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {result.yearly_breakdown.map((row) => (
                      <tr key={row.year} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-slate-900">{row.year}º ano</td>
                        <td className="px-5 py-3">{formatCurrency(row.invested)}</td>
                        <td className="px-5 py-3 font-semibold text-emerald-600">{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
