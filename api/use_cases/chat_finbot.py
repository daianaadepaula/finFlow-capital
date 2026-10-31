import unicodedata
from typing import List, Optional
from domain.entities import ChatMessage, FinBotReply, FinBotAction
from domain.interfaces import IGeminiService

SYSTEM_PROMPT = """Você é o "FinBot", o assistente virtual especializado da FinFlow Capital — uma empresa de gestão financeira inteligente, investimentos e planejamento patrimonial.

SUA MISSÃO:
Ajudar clientes e potenciais investidores a entenderem nossos serviços, simularem metas de investimento, organizarem seus orçamentos e agendarem consultorias especializadas.

DIRETRIZES DE RESPOSTA:
1. Tom de voz: Profissional, analítico, seguro, educativo e transparente.
2. Áreas de Atuação:
   - Planejamento Financeiro Pessoal e Familiar.
   - Análise de Perfil de Investidor (Conservador, Moderado, Arrojado).
   - Simulações de Rendimento e Juros Compostos.
   - Diagnóstico e Gestão de Dívidas / Empréstimos Inteligentes.
3. Formatação: Use marcadores (bullet points), tabelas simples para comparativos e números destacados.
4. Segurança e AVISO LEGAL: Sempre inclua um aviso discreto lembrando que "respostas automatizadas não constituem recomendação formal de compra/venda de ativos segundo a CVM/reguladores".
5. Ações Especiais: Quando o usuário quiser agendar uma consultoria, termine a resposta com o comando `[ACTION: OPEN_SCHEDULER]`. Quando solicitar uma calculadora, inclua `[ACTION: OPEN_CALCULATOR]`.
"""

LEGAL_NOTICE = "_Aviso: respostas automatizadas não constituem recomendação formal de compra/venda de ativos segundo a CVM/reguladores._"

class ChatFinBotUseCase:
    """Caso de uso de conversação financeira com IA e contingência de regras."""

    def __init__(self, gemini_service: IGeminiService):
        self.gemini_service = gemini_service

    def execute(self, messages: List[ChatMessage]) -> FinBotReply:
        if not messages:
            raise ValueError("O histórico de mensagens não pode ser vazio.")

        last_user_msg = messages[-1].content
        reply_raw: Optional[str] = None
        source: str = "gemini"

        # 1. Tentar gerar com a IA
        try:
            reply_raw = self.gemini_service.generate_chat_response(messages)
        except Exception:
            reply_raw = None

        # 2. Se falhar ou estiver indisponível, acionar regras determinísticas locais
        if not reply_raw or not reply_raw.strip():
            reply_raw = self._local_rules_reply(last_user_msg)
            source = "rules"

        # 3. Detectar e extrair ações do assistente
        action = self._extract_action(reply_raw)

        # 4. Limpar as tags de comando do texto para exibição limpa
        clean_text = (
            reply_raw.replace("[ACTION: OPEN_SCHEDULER]", "")
            .replace("[ACTION: OPEN_CALCULATOR]", "")
            .strip()
        )

        return FinBotReply(
            reply=reply_raw,
            response=clean_text,
            action_trigger=action,
            source=source  # type: ignore
        )

    def _extract_action(self, text: str) -> Optional[FinBotAction]:
        if "[ACTION: OPEN_SCHEDULER]" in text:
            return "OPEN_SCHEDULER"
        if "[ACTION: OPEN_CALCULATOR]" in text:
            return "OPEN_CALCULATOR"
        return None

    def _local_rules_reply(self, last_message: str) -> str:
        """Regras locais de contingência financeira quando a IA estiver inacessível."""
        normalized = last_message.lower()
        normalized = "".join(
            c for c in unicodedata.normalize("NFD", normalized)
            if unicodedata.category(c) != "Mn"
        )

        if any(w in normalized for w in ["agendar", "consultori", "reuniao", "reunir", "especialista", "consultor"]):
            return "\n\n".join([
                "Será um prazer conectar você a um dos nossos consultores de investimentos da FinFlow Capital.",
                "- Escolha uma data e o período de sua preferência.\n- Conte brevemente seu objetivo para que nosso time prepare uma análise personalizada.",
                "[ACTION: OPEN_SCHEDULER]",
                LEGAL_NOTICE,
            ])

        if any(w in normalized for w in ["juros", "composto", "rendimento", "investir", "investimento", "meta", "poupar", "poupanca"]):
            return "\n\n".join([
                "Juros compostos representam a multiplicação patrimonial ao longo do tempo (juros sobre juros).",
                "- **Fórmula básica**: Montante = Capital × (1 + taxa)^tempo\n- Aporte constante e prazo são os principais aceleradores do patrimônio.\n- Diversificação é indispensável para balancear risco e retorno.",
                "Simule seu cenário agora em nossa calculadora interativa:",
                "[ACTION: OPEN_CALCULATOR]",
                LEGAL_NOTICE,
            ])

        if any(w in normalized for w in ["emprestimo", "divida", "financiamento", "parcela", "cartao", "financiar"]):
            return "\n\n".join([
                "Ao analisar um empréstimo ou financiamento, considere sempre o Custo Efetivo Total (CET):",
                "- **Comprometimento de Renda**: Idealmente, parcelas não devem ultrapassar 30% da sua renda mensal.\n- **Taxa vs. Prazo**: Prazos maiores reduzem a parcela, mas aumentam significativamente o total pago de juros.\n- **Amortização**: Sempre que possível, amortize o saldo devedor para abater juros futuros.",
                "Utilize nosso simulador de empréstimos para visualizar o custo detalhado:",
                "[ACTION: OPEN_CALCULATOR]",
                LEGAL_NOTICE,
            ])

        if any(w in normalized for w in ["perfil", "conservador", "moderado", "arrojado", "risco"]):
            return "\n\n".join([
                "Compreender seu perfil de investidor é a base de uma estratégia consistente:",
                "| Perfil | Objetivo Principal | Tolerância à Oscilação |\n| --- | --- | --- |\n| Conservador | Preservação de Capital | Baixa (Foco em Renda Fixa) |\n| Moderado | Equilíbrio Risco x Retorno | Média (Renda Fixa + Multimercado) |\n| Arrojado | Ganho de Capital no Longo Prazo | Alta (Renda Variável / Ações) |",
                "Quer descobrir sua carteira ideal? Agende uma sessão com nossos especialistas:",
                "[ACTION: OPEN_SCHEDULER]",
                LEGAL_NOTICE,
            ])

        return "\n\n".join([
            "Olá! Sou o **FinBot**, o assistente virtual da FinFlow Capital. Estou à sua disposição para:",
            "- Planejamento financeiro patrimonial\n- Análise de perfil de investidor\n- Simulação de investimentos e juros compostos\n- Avaliação de dívidas e financiamentos\n- Agendamento de consultoria especializada",
            "Sobre qual tema financeiro você gostaria de conversar hoje?",
            LEGAL_NOTICE,
        ])

