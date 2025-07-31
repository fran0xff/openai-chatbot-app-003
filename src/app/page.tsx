import { ChatProvider } from "./lib/chat-context";
import ChatInterface from "./components/ChatInterface";

export default function Home() {
  return (
    <ChatProvider>
      <ChatInterface />
    </ChatProvider>
  );
}
