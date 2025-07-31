"use client";

import React from "react";
import { Trash2, Settings } from "lucide-react";
import { useChat } from "../lib/chat-context";
import MessageList from "./MessageList";
import InputField from "./InputField";
import ErrorDisplay from "./ErrorDisplay";
import ModelSelector from "./ModelSelector";

export default function ChatInterface() {
  const {
    messages,
    isLoading,
    error,
    model,
    sendMessage,
    clearMessages,
    setModel,
    stopGeneration,
  } = useChat();

  const handleClearMessages = () => {
    if (confirm("Are you sure you want to clear all messages? This action cannot be undone.")) {
      clearMessages();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Chat Assistant
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Powered by OpenAI
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ModelSelector
              selectedModel={model}
              onModelChange={setModel}
              disabled={isLoading}
            />
            
            <button
              onClick={handleClearMessages}
              disabled={messages.length === 0 || isLoading}
              className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="px-4 pt-4">
          <ErrorDisplay
            error={error}
            onRetry={() => {
              // Retry logic could be implemented here
              console.log("Retry clicked");
            }}
          />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      {/* Input */}
      <InputField
        onSendMessage={sendMessage}
        isLoading={isLoading}
        onStopGeneration={stopGeneration}
        disabled={false}
      />
    </div>
  );
} 