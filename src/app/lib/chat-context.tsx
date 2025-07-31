"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { Message, ModelType, ChatState, ChatContextType } from "./types";
import { generateId, saveToLocalStorage, loadFromLocalStorage } from "./utils";

type ChatAction =
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "UPDATE_LAST_MESSAGE"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_MODEL"; payload: ModelType }
  | { type: "CLEAR_MESSAGES" }
  | { type: "LOAD_MESSAGES"; payload: Message[] };

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  model: "gpt-4o",
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
        error: null,
      };
    case "UPDATE_LAST_MESSAGE":
      return {
        ...state,
        messages: state.messages.map((msg, index) =>
          index === state.messages.length - 1
            ? { ...msg, content: action.payload }
            : msg
        ),
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "SET_MODEL":
      return { ...state, model: action.payload };
    case "CLEAR_MESSAGES":
      return { ...state, messages: [], error: null };
    case "LOAD_MESSAGES":
      return { ...state, messages: action.payload };
    default:
      return state;
  }
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  // Load messages and model from localStorage on mount
  useEffect(() => {
    const savedMessages = loadFromLocalStorage<Message[]>("chat-messages", []);
    const savedModel = loadFromLocalStorage<ModelType>("chat-model", "gpt-4o");
    
    // Convert timestamp strings back to Date objects
    const messagesWithDates = savedMessages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
    
    dispatch({ type: "LOAD_MESSAGES", payload: messagesWithDates });
    dispatch({ type: "SET_MODEL", payload: savedModel });
  }, []);

  // Save messages and model to localStorage when they change
  useEffect(() => {
    saveToLocalStorage("chat-messages", state.messages);
  }, [state.messages]);

  useEffect(() => {
    saveToLocalStorage("chat-model", state.model);
  }, [state.model]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    dispatch({ type: "ADD_MESSAGE", payload: userMessage });
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    // Create assistant message placeholder
    const assistantMessage: Message = {
      id: generateId(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    dispatch({ type: "ADD_MESSAGE", payload: assistantMessage });

    // Abort previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/openai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...state.messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          model: state.model,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        accumulatedContent += chunk;
        dispatch({ type: "UPDATE_LAST_MESSAGE", payload: accumulatedContent });
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        // Request was aborted, remove the last message
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }
      
      console.error("Chat error:", error);
      dispatch({ 
        type: "SET_ERROR", 
        payload: error instanceof Error ? error.message : "Failed to send message" 
      });
      
      // Remove the assistant message if there was an error
      dispatch({ type: "UPDATE_LAST_MESSAGE", payload: "Sorry, I encountered an error. Please try again." });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
      abortControllerRef.current = null;
    }
  }, [state.messages, state.model]);

  const clearMessages = useCallback(() => {
    dispatch({ type: "CLEAR_MESSAGES" });
  }, []);

  const setModel = useCallback((model: ModelType) => {
    dispatch({ type: "SET_MODEL", payload: model });
  }, []);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    dispatch({ type: "SET_LOADING", payload: false });
  }, []);

  const value: ChatContextType = {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    model: state.model,
    sendMessage,
    clearMessages,
    setModel,
    stopGeneration,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
} 