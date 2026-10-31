import { request } from "./apiClient";

export type ChatRole = "user" | "assistant" | "system";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type FinBotAction = "OPEN_SCHEDULER" | "OPEN_CALCULATOR";

export type FinBotReply = {
  reply: string;
  response: string;
  action_trigger: FinBotAction | null;
  source: "gemini" | "rules";
};

export type ParsedFinBotReply = {
  text: string;
  actions: FinBotAction[];
};

const ACTION_PATTERN = /\[ACTION:\s*(OPEN_SCHEDULER|OPEN_CALCULATOR)\]/g;

export function parseFinBotReply(rawText: string, serverAction?: FinBotAction | null): ParsedFinBotReply {
  const actions = [...rawText.matchAll(ACTION_PATTERN)].map((m) => m[1] as FinBotAction);
  if (serverAction && !actions.includes(serverAction)) {
    actions.push(serverAction);
  }

  const cleanText = rawText
    .replace(ACTION_PATTERN, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return {
    text: cleanText,
    actions: [...new Set(actions)],
  };
}

export async function sendChatMessages(messages: ChatMessage[]): Promise<ParsedFinBotReply> {
  const data = await request<FinBotReply>("/api/chat", {
    method: "POST",
    body: JSON.stringify({ messages }),
  });

  const rawText = data.reply || data.response || "";
  return parseFinBotReply(rawText, data.action_trigger);
}

