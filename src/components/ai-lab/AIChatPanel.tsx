import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  thought?: string; // thought process or explanation
}

const mockHistory: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I\'m Scalper AI. How can I assist you today?",
  },
];

const AIChatPanel = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockHistory);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"chat" | "analyze">("chat");

  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: mode === "chat" ? "Here\'s my quick answer." : "Analyzing the market...",
        thought: mode === "chat" ? undefined : "I considered EMA crossovers, RSI levels, and order book depth.",
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Mode toggle */}
      <Tabs value={mode} onValueChange={(val) => setMode(val as any)} className="mb-2">
        <TabsList className="grid grid-cols-2 gap-1 bg-gray-200 rounded-full p-1">
          <TabsTrigger value="chat" className="text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900">Chat</TabsTrigger>
          <TabsTrigger value="analyze" className="text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900">Analyze</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Chat history */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`text-sm max-w-[85%] px-3 py-2 rounded-lg whitespace-pre-line ${
              msg.role === "user" ? "bg-tw-blue text-white self-end" : "bg-gray-100 text-gray-900"
            }`}
          >
            {msg.content}
            {msg.thought && (
              <details className="mt-1 text-xs text-gray-300 cursor-pointer">
                <summary>Why?</summary>
                <p>{msg.thought}</p>
              </details>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="mt-2 flex gap-2">
        <Input
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 bg-gray-100 border border-gray-300 text-sm text-gray-900 px-3 py-2 rounded-md"
        />
        <Button size="sm" onClick={sendMessage} disabled={!input.trim()} className="bg-tw-blue text-white hover:bg-tw-blue/90">
          Send
        </Button>
      </div>
    </div>
  );
};

export default AIChatPanel;
