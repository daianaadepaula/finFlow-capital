import { ArrowRight, CalendarDays, MessageSquare, ShieldCheck } from "lucide-react";
import { formatCurrency, simulateCompound } from "@/lib/finance";
import { scrollToSection } from "@/lib/scrollToSection";

const HERO_IMAGE =
  "https://images.pexels.com/photos/8441820/pexels-photo-8441820.jpeg?auto=compress&cs=tinysrgb&h=650&w=940";

const HIGHLIGHTS = [
  { value: "4 áreas", label: "de planejamento financeiro" },
  { value: "3 perfis", label: "de investidor analisados" },
  { value: "24/7", label: "atendimento do FinBot" },
];

const PREVIEW = simulateCompound({ initialAmount: 0, monthlyContribution: 500, annualRate: 10, years: 10 });

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-slate-900 pb-24 pt-32 text-white lg:pb-32 lg:pt-40">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-emerald-500/20 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div className="animate-[fade-up_0.7s_ease-out_both]">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-emerald-200 ring-1 ring-white/15">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Gestão financeira inteligente
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
            Seu dinheiro com <span className="text-emerald-400">direção clara</span> e planejamento de verdade.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            Simule metas, entenda seu perfil de investidor e converse com o FinBot, nosso assistente
            que combina inteligência artificial e regras financeiras transparentes.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => scrollToSection("finbot")}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              Conversar com o FinBot
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("agendar")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Agendar consultoria
            </button>
          </div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {HIGHLIGHTS.map((item) => (
              <div key={item.label}>
                <dt className="text-2xl font-bold text-white">{item.value}</dt>
                <dd className="mt-1 text-xs leading-snug text-slate-400">{item.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative animate-[fade-up_0.9s_ease-out_both]">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-emerald-500/30 to-transparent blur-2xl" aria-hidden="true" />
          <img
            src={HERO_IMAGE}
            alt="Consultora da FinFlow Capital conversando com clientes sobre planejamento financeiro"
            className="relative h-[420px] w-full rounded-3xl object-cover shadow-2xl ring-1 ring-white/10 lg:h-[520px]"
          />
          <div className="absolute -bottom-6 left-6 right-6 rounded-2xl bg-white p-5 text-slate-900 shadow-xl sm:left-auto sm:right-8 sm:w-72">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Patrimônio projetado</p>
            <p className="mt-1 text-2xl font-bold">{formatCurrency(PREVIEW.finalAmount)}</p>
            <p className="mt-1 text-xs text-slate-600">Em 10 anos com aportes mensais de R$ 500 a 10% a.a.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
