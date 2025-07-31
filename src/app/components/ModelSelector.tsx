"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { ModelType } from "../lib/types";
import { modelConfig } from "../lib/utils";

interface ModelSelectorProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  disabled?: boolean;
}

export default function ModelSelector({ 
  selectedModel, 
  onModelChange, 
  disabled = false 
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleModelSelect = (model: ModelType) => {
    onModelChange(model);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <span className="font-medium">{modelConfig[selectedModel].name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
          <div className="p-2">
            {Object.entries(modelConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handleModelSelect(key as ModelType)}
                className={`w-full text-left p-3 rounded-md transition-colors ${
                  selectedModel === key
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <div className="font-medium">{config.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {config.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 