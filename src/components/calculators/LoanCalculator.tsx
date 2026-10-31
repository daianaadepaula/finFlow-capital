import { Wallet, Loader2 } from "lucide-react";
import NumberField from "@/components/calculators/NumberField";
import { formatCurrency } from "@/lib/finance";
import { useLoanCalculator } from "@/hooks/useLoanCalculator";

export default function LoanCalculator() {
  const {
    amount,
    setAmount,
    rate,
    setRate,
    months,
    setMonths,
    result,
    loading,
    error,
  } = useLoanCalculator();

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="space-y-5">
        <NumberField
          id="loan-amount"
          label="Valor desejado"
          prefix="R$"
          min={1}
          step={500}
          value={amount}
          onChange={setAmount}
        />
        <NumberField
          id="loan-rate"
          label="Taxa de juros anual"
          suffix="% a.a."
          min={0}
          max={500}
          step={0.5}
          value={rate}
          onChange={setRate}
        />
        <NumberField
          id="loan-months"
          label="Prazo"
          suffix="meses"
          min={1}
          max={360}
          value={months}
          onChange={setMonths}
        />
      </div>

      <div className="min-w-0">
        {loading && !result ? (
          <div className="flex items-center justify-center p-12 text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Simulando parcelas via Python...</span>
          </div>
        ) : error ? (
          <p role="alert" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-200">
            {error}
          </p>
        ) : result ? (
          <div className="space-y-6">
            <div className="rounded-2xl bg-slate-900 p-6 text-white">
              <p className="flex items-center gap-2 text-sm text-slate-300">
                <Wallet className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                Parcela mensal estimada
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {formatCurrency(result.monthly_payment)}
                <span className="text-base font-normal text-slate-400">/mês</span>
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-800 pt-6">
                <div>
                  <p className="text-xs text-slate-400">Total pago ao final</p>
                  <p className="mt-1 text-lg font-semibold text-slate-200">
                    {formatCurrency(result.total_cost)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Total pago só em juros</p>
                  <p className="mt-1 text-lg font-semibold text-amber-400">
                    {formatCurrency(result.total_interest_paid)}
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <h4 className="text-sm font-semibold text-slate-900">Primeiros meses da simulação</h4>
              </div>
              <div className="max-h-72 overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-600">
                    <tr>
                      <th scope="col" className="px-5 py-3 font-semibold">Mês</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Juros no mês</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Saldo devedor restante</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {result.monthly_breakdown.slice(0, 12).map((row) => (
                      <tr key={row.month} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-slate-900">{row.month}º mês</td>
                        <td className="px-5 py-3 text-amber-600 font-medium">{formatCurrency(row.interest)}</td>
                        <td className="px-5 py-3">{formatCurrency(row.remaining_balance)}</td>
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
