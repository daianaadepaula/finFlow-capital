from typing import List, Optional
from google import genai
from domain.entities import ChatMessage
from domain.interfaces import IGeminiService
from infrastructure.config import settings

SYSTEM_INSTRUCTION = """Você é o "FinBot", o assistente virtual especializado da FinFlow Capital — uma empresa de gestão financeira inteligente, investimentos e planejamento patrimonial.

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

class GeminiService(IGeminiService):
    """Cliente concreto para a API do Google Gemini."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.client = genai.Client(api_key=self.api_key) if self.api_key else None

    def generate_chat_response(self, messages: List[ChatMessage]) -> Optional[str]:
        if not self.client:
            return None

        # Montagem do prompt com instruções e histórico formatado
        contents = [SYSTEM_INSTRUCTION]
        for msg in messages:
            role_label = "USUÁRIO" if msg.role == "user" else "ASSISTENTE"
            contents.append(f"{role_label}: {msg.content}")

        full_prompt = "\n\n".join(contents)

        # Tentativa de geração com modelos em cascata (primário e fallback)
        models = [settings.GEMINI_PRIMARY_MODEL, settings.GEMINI_FALLBACK_MODEL]

        for model_name in models:
            try:
                response = self.client.models.generate_content(
                    model=model_name,
                    contents=full_prompt,
                )
                if response and response.text and response.text.strip():
                    return response.text.strip()
            except Exception as e:
                # Registra o erro internamente e prossegue para o próximo modelo/fallback
                continue

        return None

