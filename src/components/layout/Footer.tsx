import { TrendingUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 py-12 text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 lg:px-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500">
              <TrendingUp className="h-5 w-5 text-white" aria-hidden="true" />
            </span>
            <span className="text-base font-bold text-white">FinFlow Capital</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            Gestão financeira inteligente, investimentos e planejamento patrimonial.
          </p>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-slate-500">
          Aviso legal: as respostas automatizadas do FinBot e as simulações desta página não constituem
          recomendação formal de compra ou venda de ativos segundo a CVM e demais reguladores. Rentabilidades
          passadas não garantem resultados futuros.
        </p>
      </div>
      <p className="mx-auto mt-10 max-w-6xl px-6 text-xs text-slate-500 lg:px-8">
        © {new Date().getFullYear()} FinFlow Capital. Todos os direitos reservados.
      </p>
    </footer>
  );
}
