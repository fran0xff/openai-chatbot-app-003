export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export type ModelType = "gpt-4o" | "gpt-3.5-turbo";

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  model: ModelType;
}

export interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  model: ModelType;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  setModel: (model: ModelType) => void;
  stopGeneration: () => void;
}

export interface ApiError {
  error: string;
  details?: string;
} 