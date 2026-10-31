import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/layout/SectionHeading";
import Hero from "@/components/sections/Hero";
import ServicesSection from "@/components/sections/ServicesSection";
import CalculatorSection from "@/components/calculators/CalculatorSection";
import ChatAssistant from "@/components/chat/ChatAssistant";
import ConsultationScheduler from "@/components/scheduler/ConsultationScheduler";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      <Navbar />
      <main>
        <Hero />
        <ServicesSection />

        <section id="calculadoras" className="scroll-mt-20 bg-slate-50 py-24 lg:py-32">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <SectionHeading
              eyebrow="Ferramentas"
              title="Simule antes de decidir"
              description="Projete o crescimento do seu patrimônio ou avalie o custo real de um empréstimo em poucos segundos."
            />
            <div className="mt-14 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
              <CalculatorSection />
            </div>
          </div>
        </section>

        <section id="finbot" className="scroll-mt-20 bg-white py-24 lg:py-32">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">Atendimento</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Converse com o FinBot a qualquer hora
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Tire dúvidas sobre investimentos, dívidas e planejamento. Quando fizer sentido, o FinBot
                abre a calculadora certa ou te leva direto ao agendamento com um consultor.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-slate-700">
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" aria-hidden="true" />
                  Respostas educativas, com linguagem simples e transparente.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" aria-hidden="true" />
                  Sugestões de simulação integradas à conversa.
                </li>
              </ul>
            </div>
            <ChatAssistant />
          </div>
        </section>

        <section id="agendar" className="scroll-mt-20 bg-slate-50 py-24 lg:py-32">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <SectionHeading
              eyebrow="Consultoria"
              title="Agende uma conversa com um consultor"
              description="Conte seu objetivo e escolha o melhor horário. Um especialista da FinFlow Capital retorna para confirmar."
            />
            <div className="mt-14 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
              <ConsultationScheduler />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
