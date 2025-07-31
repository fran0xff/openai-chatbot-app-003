import { Message, ModelType } from "./types";

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const formatTimestamp = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

export const saveToLocalStorage = (key: string, data: any): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window !== "undefined") {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
      return defaultValue;
    }
  }
  return defaultValue;
};

export const clearLocalStorage = (key: string): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
};

export const modelConfig = {
  "gpt-4o": {
    name: "GPT-4o",
    description: "Most capable model, best for complex tasks",
    maxTokens: 4096,
  },
  "gpt-3.5-turbo": {
    name: "GPT-3.5 Turbo",
    description: "Fast and efficient, good for most tasks",
    maxTokens: 4096,
  },
} as const; 