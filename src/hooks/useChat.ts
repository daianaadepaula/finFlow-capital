import { useState, useRef, useEffect, type FormEvent } from "react";
import { sendChatMessages, type ChatMessage, type FinBotAction } from "@/services/chatService";

export type DisplayMessage = ChatMessage & {
  id: number;
  actions?: FinBotAction[];
  isError?: boolean;
};

const MAX_HISTORY_MESSAGES = 20;

export function useChat() {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const nextId = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isLoading]);

  async function sendMessage(text: string) {
    const content = text.trim();
    if (!content || isLoading) return;

    const userMessage: DisplayMessage = {
      id: nextId.current++,
      role: "user",
      content,
    };

    const history = [...messages, userMessage]
      .filter((m) => !m.isError)
      .slice(-MAX_HISTORY_MESSAGES)
      .map(({ role, content: msgContent }) => ({ role, content: msgContent }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const reply = await sendChatMessages(history);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId.current++,
          role: "assistant",
          content: reply.text,
          actions: reply.actions,
        },
      ]);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível obter resposta agora. Tente novamente.";
      setMessages((prev) => [
        ...prev,
        {
          id: nextId.current++,
          role: "assistant",
          content: message,
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(input);
  }

  return {
    messages,
    input,
    setInput,
    isLoading,
    scrollRef,
    sendMessage,
    handleSubmit,
    isEmpty: messages.length === 0,
  };
}

