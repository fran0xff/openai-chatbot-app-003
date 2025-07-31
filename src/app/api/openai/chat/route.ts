import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages, model = "gpt-4o" } = await req.json();

    // Validate model selection
    const validModels = ["gpt-4o", "gpt-3.5-turbo"];
    const selectedModel = validModels.includes(model) ? model : "gpt-4o";

    const result = await streamText({
      model: openai(selectedModel),
      messages: convertToCoreMessages(messages),
      system: "You are a helpful AI assistant. Provide clear, accurate, and helpful responses.",
      maxTokens: 1000,
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
