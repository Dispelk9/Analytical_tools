export type D9Response = {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
      role: string;
    };
    finishReason: string;
    avgLogprobs: number;
  }>;
};

export type ChatRole = 'user' | 'bot' | 'system';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  createdAt: number;
};
