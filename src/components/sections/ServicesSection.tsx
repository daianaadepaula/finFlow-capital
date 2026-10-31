import { LineChart, Target, Wallet, Landmark } from "lucide-react";
import SectionHeading from "@/components/layout/SectionHeading";

const SERVICES = [
  {
    icon: Wallet,
    title: "Planejamento pessoal e familiar",
    description: "Organize receitas, despesas e reservas com metas claras para cada fase da vida.",
  },
  {
    icon: Target,
    title: "Perfil de investidor",
    description: "Entenda se você é conservador, moderado ou arrojado antes de tomar decisões.",
  },
  {
    icon: LineChart,
    title: "Simulações de rendimento",
    description: "Visualize o efeito dos juros compostos e dos aportes regulares ao longo do tempo.",
  },
  {
    icon: Landmark,
    title: "Dívidas e empréstimos",
    description: "Compare parcelas, custo total e prazos antes de contratar qualquer crédito.",
  },
];

export default function ServicesSection() {
  return (
    <section id="servicos" className="scroll-mt-20 bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Nossos serviços"
          title="Tudo o que você precisa para cuidar do seu patrimônio"
          description="Da organização do orçamento à escolha de investimentos, a FinFlow Capital acompanha cada etapa com análises transparentes."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
