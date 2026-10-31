import { AlertCircle, Bot, CalendarDays, Calculator, Loader2, Send, Sparkles } from "lucide-react";
import FormattedText from "@/components/chat/FormattedText";
import { useChat } from "@/hooks/useChat";
import { scrollToSection } from "@/lib/scrollToSection";
import type { FinBotAction } from "@/services/chatService";

const MAX_INPUT_LENGTH = 1000;

const SUGGESTIONS = [
  "Como funcionam os juros compostos?",
  "Quero simular um empréstimo",
  "Qual é o meu perfil de investidor?",
  "Quero agendar uma consultoria",
];

const ACTION_BUTTONS: Record<FinBotAction, { label: string; sectionId: string; icon: typeof Calculator }> = {
  OPEN_CALCULATOR: { label: "Abrir calculadora", sectionId: "calculadoras", icon: Calculator },
  OPEN_SCHEDULER: { label: "Agendar consultoria", sectionId: "agendar", icon: CalendarDays },
};

export default function ChatAssistant() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    scrollRef,
    sendMessage,
    handleSubmit,
    isEmpty,
  } = useChat();

  return (
    <div className="flex h-[640px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
      <header className="flex items-center gap-3 border-b border-slate-200 bg-slate-900 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500">
          <Bot className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">FinBot</p>
          <p className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
            Assistente virtual FinFlow (Gemini AI)
          </p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-slate-50 px-5 py-6">
        {isEmpty && (
          <div className="space-y-5">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900">
                <Bot className="h-4 w-4 text-white" aria-hidden="true" />
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-relaxed text-slate-800 shadow-sm">
                Olá! Sou o FinBot. Posso ajudar com planejamento financeiro, perfil de investidor,
                simulações de juros e agendamento de consultorias. Por onde começamos?
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pl-11">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => sendMessage(suggestion)}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => {
          if (message.role === "user") {
            return (
              <div key={message.id} className="flex justify-end">
                <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-emerald-600 px-4 py-3 text-sm leading-relaxed text-white shadow-sm">
                  {message.content}
                </div>
              </div>
            );
          }

          if (message.isError) {
            return (
              <div key={message.id} className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-4 w-4 text-red-700" aria-hidden="true" />
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {message.content}
                </div>
              </div>
            );
          }

          return (
            <div key={message.id} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900">
                <Bot className="h-4 w-4 text-white" aria-hidden="true" />
              </div>
              <div className="max-w-[85%] space-y-3">
                <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-slate-800 shadow-sm">
                  <FormattedText text={message.content} />
                </div>
                {message.actions && message.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {message.actions.map((action) => {
                      const target = ACTION_BUTTONS[action];
                      if (!target) return null;
                      const Icon = target.icon;
                      return (
                        <button
                          key={action}
                          type="button"
                          onClick={() => scrollToSection(target.sectionId)}
                          className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200 transition hover:bg-emerald-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        >
                          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                          {target.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900">
              <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-600" aria-hidden="true" />
              FinBot está analisando com IA...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-200 bg-white p-4">
        <label htmlFor="finbot-input" className="sr-only">
          Mensagem para o FinBot
        </label>
        <input
          id="finbot-input"
          type="text"
          value={input}
          maxLength={MAX_INPUT_LENGTH}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Digite sua dúvida financeira..."
          className="flex-1 rounded-full border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        />
        <button
          type="submit"
          disabled={isLoading || input.trim().length === 0}
          aria-label="Enviar mensagem"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
