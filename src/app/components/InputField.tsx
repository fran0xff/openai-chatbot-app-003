"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, StopCircle } from "lucide-react";

interface InputFieldProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  onStopGeneration: () => void;
  disabled?: boolean;
}

export default function InputField({ 
  onSendMessage, 
  isLoading, 
  onStopGeneration, 
  disabled = false 
}: InputFieldProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading || disabled) return;

    const trimmedMessage = message.trim();
    setMessage("");
    await onSendMessage(trimmedMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="w-full resize-none border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            rows={1}
            disabled={isLoading || disabled}
            style={{ minHeight: "44px", maxHeight: "120px" }}
          />
        </div>
        
        <button
          type="submit"
          disabled={!message.trim() || isLoading || disabled}
          className={`flex-shrink-0 p-3 rounded-lg transition-colors ${
            message.trim() && !isLoading && !disabled
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <StopCircle className="w-5 h-5" onClick={onStopGeneration} />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
      
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
} 