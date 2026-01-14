import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ id: string; type: "bot" | "user"; text: string }>>([
    {
      id: "1",
      type: "bot",
      text: "Taking a moment this afternoon? Perhaps I can help plan a cozy fall",
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    setMessages([
      ...messages,
      { id: Date.now().toString(), type: "user", text: message },
    ]);
    setMessage("");
    
    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "bot",
          text: "I'd be happy to help you find the perfect getaway! Where are you thinking of going?",
        },
      ]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[hsl(217,91%,50%)] hover:bg-[hsl(217,91%,45%)] shadow-xl"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
      {/* Header */}
      <div className="bg-[hsl(217,91%,50%)] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <span className="font-semibold">Penny</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20 h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="h-48 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                msg.type === "user"
                  ? "bg-[hsl(217,91%,50%)] text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-100 flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 h-10 rounded-full"
        />
        <Button
          onClick={handleSend}
          size="icon"
          className="h-10 w-10 rounded-full bg-[hsl(217,91%,50%)] hover:bg-[hsl(217,91%,45%)]"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AIChatWidget;
