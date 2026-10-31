from abc import ABC, abstractmethod
from typing import List, Optional
from domain.entities import ConsultationBooking, ChatMessage, MarketRate

class IBookingRepository(ABC):
    """Contrato de persistência para agendamentos de consultoria."""
    
    @abstractmethod
    def save(self, booking: ConsultationBooking) -> ConsultationBooking:
        """Persiste um novo agendamento."""
        pass

    @abstractmethod
    def find_all(self) -> List[ConsultationBooking]:
        """Recupera todos os agendamentos cadastrados."""
        pass

class IGeminiService(ABC):
    """Contrato para comunicação com o provedor de Inteligência Artificial."""
    
    @abstractmethod
    def generate_chat_response(self, messages: List[ChatMessage]) -> Optional[str]:
        """Gera resposta baseada no histórico de mensagens."""
        pass

class IBCBService(ABC):
    """Contrato para consulta de dados abertos do Banco Central do Brasil."""
    
    @abstractmethod
    def get_latest_selic_rate(self) -> MarketRate:
        """Obtém a taxa Selic anualizada vigente."""
        pass

