import { AlertCircle, CalendarCheck, CheckCircle2, Loader2 } from "lucide-react";
import { useBooking, todayIsoDate, type FormState } from "@/hooks/useBooking";
import type { Period, InvestorProfile } from "@/services/bookingService";

const PERIOD_OPTIONS: { value: Period; label: string; hint: string }[] = [
  { value: "morning", label: "Manhã", hint: "09h às 12h" },
  { value: "afternoon", label: "Tarde", hint: "13h às 17h" },
  { value: "evening", label: "Noite", hint: "18h às 20h" },
];

export default function ConsultationScheduler() {
  const {
    form,
    errors,
    status,
    errorMessage,
    updateField,
    handleSubmit,
    resetForm,
  } = useBooking();

  if (status === "success") {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-emerald-200 bg-emerald-50 p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-600" aria-hidden="true" />
        <h3 className="mt-4 text-xl font-semibold text-slate-900">Solicitação recebida com sucesso!</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-700">
          Seus dados foram registrados com segurança em nossa base local. Um consultor da FinFlow Capital entrará em contato em até 1 dia útil para confirmar o agendamento.
        </p>
        <button
          type="button"
          onClick={resetForm}
          className="mt-6 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          Agendar outra consultoria
        </button>
      </div>
    );
  }

  const inputClass = (field: keyof FormState) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 transition focus:outline-none focus:ring-2 ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
        : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/30"
    }`;

  const fieldError = (field: keyof FormState) =>
    errors[field] ? (
      <p className="mt-1.5 text-xs font-medium text-red-700">{errors[field]}</p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-6 md:grid-cols-2">
      <div>
        <label htmlFor="booking-name" className="mb-2 block text-sm font-medium text-slate-700">
          Nome completo
        </label>
        <input
          id="booking-name"
          className={inputClass("fullName")}
          value={form.fullName}
          maxLength={120}
          onChange={(e) => updateField("fullName", e.target.value)}
        />
        {fieldError("fullName")}
      </div>

      <div>
        <label htmlFor="booking-email" className="mb-2 block text-sm font-medium text-slate-700">
          E-mail profissional / pessoal
        </label>
        <input
          id="booking-email"
          type="email"
          className={inputClass("email")}
          value={form.email}
          maxLength={254}
          onChange={(e) => updateField("email", e.target.value)}
        />
        {fieldError("email")}
      </div>

      <div>
        <label htmlFor="booking-phone" className="mb-2 block text-sm font-medium text-slate-700">
          Telefone / WhatsApp
        </label>
        <input
          id="booking-phone"
          type="tel"
          placeholder="(11) 90000-0000"
          className={inputClass("phone")}
          value={form.phone}
          maxLength={30}
          onChange={(e) => updateField("phone", e.target.value)}
        />
        {fieldError("phone")}
      </div>

      <div>
        <label htmlFor="booking-profile" className="mb-2 block text-sm font-medium text-slate-700">
          Perfil de investidor (opcional)
        </label>
        <select
          id="booking-profile"
          className={inputClass("investorProfile")}
          value={form.investorProfile}
          onChange={(e) => updateField("investorProfile", e.target.value as InvestorProfile)}
        >
          <option value="">Ainda não sei meu perfil</option>
          <option value="conservative">Conservador (Preservação)</option>
          <option value="moderate">Moderado (Equilíbrio)</option>
          <option value="aggressive">Arrojado (Crescimento)</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <label htmlFor="booking-objective" className="mb-2 block text-sm font-medium text-slate-700">
          Qual é o seu objetivo financeiro ou dúvida principal?
        </label>
        <textarea
          id="booking-objective"
          rows={3}
          maxLength={1000}
          placeholder="Ex: Gostaria de montar uma carteira para aposentadoria ou reestruturar investimentos."
          className={inputClass("objective")}
          value={form.objective}
          onChange={(e) => updateField("objective", e.target.value)}
        />
        {fieldError("objective")}
      </div>

      <div>
        <label htmlFor="booking-date" className="mb-2 block text-sm font-medium text-slate-700">
          Data preferida
        </label>
        <input
          id="booking-date"
          type="date"
          min={todayIsoDate()}
          className={inputClass("preferredDate")}
          value={form.preferredDate}
          onChange={(e) => updateField("preferredDate", e.target.value)}
        />
        {fieldError("preferredDate")}
      </div>

      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-slate-700">Melhor período</legend>
        <div className="grid grid-cols-3 gap-2">
          {PERIOD_OPTIONS.map((option) => {
            const selected = form.preferredPeriod === option.value;
            return (
              <label
                key={option.value}
                className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center transition focus-within:ring-2 focus-within:ring-emerald-500/40 ${
                  selected
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-slate-300 bg-white text-slate-800 hover:border-emerald-500"
                }`}
              >
                <input
                  type="radio"
                  name="preferredPeriod"
                  value={option.value}
                  checked={selected}
                  onChange={() => updateField("preferredPeriod", option.value)}
                  className="sr-only"
                />
                <span className="block text-sm font-semibold">{option.label}</span>
                <span className={`block text-[11px] ${selected ? "text-emerald-50" : "text-slate-600"}`}>
                  {option.hint}
                </span>
              </label>
            );
          })}
        </div>
        {fieldError("preferredPeriod")}
      </fieldset>

      {status === "error" && (
        <div role="alert" className="flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-800 ring-1 ring-red-200 md:col-span-2">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {errorMessage || "Não foi possível enviar sua solicitação agora. Verifique os dados e tente novamente."}
        </div>
      )}

      <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center md:col-span-2">
        <p className="text-xs leading-relaxed text-slate-600">
          🔒 Seus dados serão utilizados estritamente para o contato de nossa consultoria especializada.
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "submitting" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
          )}
          {status === "submitting" ? "Enviando solicitação..." : "Solicitar consultoria"}
        </button>
      </div>
    </form>
  );
}
