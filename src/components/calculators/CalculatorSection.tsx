import { useState } from "react";
import { Calculator, Landmark } from "lucide-react";
import CompoundCalculator from "@/components/calculators/CompoundCalculator";
import LoanCalculator from "@/components/calculators/LoanCalculator";

type Tab = "compound" | "loan";

const TABS: { id: Tab; label: string; icon: typeof Calculator }[] = [
  { id: "compound", label: "Juros compostos", icon: Calculator },
  { id: "loan", label: "Simulador de empréstimo", icon: Landmark },
];

export default function CalculatorSection() {
  const [tab, setTab] = useState<Tab>("compound");

  return (
    <div className="space-y-8">
      <div role="tablist" aria-label="Ferramentas de cálculo" className="inline-flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-1.5">
        {TABS.map((item) => {
          const selected = tab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => setTab(item.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                selected ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel">{tab === "compound" ? <CompoundCalculator /> : <LoanCalculator />}</div>
    </div>
  );
}
