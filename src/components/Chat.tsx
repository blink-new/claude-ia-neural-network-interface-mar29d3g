import { useState, useRef, useEffect } from "react";
import { Send, Settings, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Message as MessageType, ModelParameters } from "../lib/types";
import Message from "./Message";
import NetworkVisualizer from "./NetworkVisualizer";
import { cn } from "../lib/utils";

const Chat = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "system-1",
      role: "assistant",
      content: "👋 Hello! I'm Claude IA 3/7, an AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [modelParams, setModelParams] = useState<ModelParameters>({
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 1000,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // Add user message
    const userMessage: MessageType = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      // Mock Claude's response - in a real app, this would call an API
      const aiResponse: MessageType = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: getSimulatedResponse(input.trim()),
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
      setLoading(false);
    }, 1500);
  };

  const getSimulatedResponse = (userInput: string): string => {
    const responses = [
      "I understand you're asking about: " + userInput + ". That's an interesting topic! I'd be happy to explore this further with you.",
      "Thanks for your message. While I'm simulating responses right now, in a completed app I would connect to Claude's API to give you helpful and accurate information.",
      "That's a great question! As a neural network, I process information by analyzing patterns in text. I can help with a wide range of tasks from answering questions to creative writing.",
      "I appreciate your input. This interface is designed to demonstrate how you might interact with Claude. In a full implementation, I would provide more detailed and contextual responses.",
      "I notice you're interested in " + userInput + ". I'm designed to be helpful, harmless, and honest in my responses while providing useful information.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const clearChat = () => {
    setMessages([
      {
        id: "system-1",
        role: "assistant",
        content: "Chat cleared. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-12 gap-4 p-4">
        <NetworkVisualizer />
      </div>
      
      <div className="flex-1 overflow-y-auto px-4">
        <div className="space-y-4 py-4">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          {loading && (
            <div className="flex items-center justify-center py-4">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="border-t bg-background p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            className="min-h-[60px] flex-1 resize-none"
            placeholder="Send a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="flex flex-col gap-2">
            <Button type="submit" size="icon" disabled={loading}>
              <Send className="h-5 w-5" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Model Settings</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 py-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Temperature: {modelParams.temperature}</Label>
                    </div>
                    <Slider
                      value={[modelParams.temperature]}
                      min={0}
                      max={1}
                      step={0.1}
                      onValueChange={(value) =>
                        setModelParams({
                          ...modelParams,
                          temperature: value[0],
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Controls randomness: Lower values are more deterministic, higher values more creative.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Top P: {modelParams.topP}</Label>
                    </div>
                    <Slider
                      value={[modelParams.topP]}
                      min={0}
                      max={1}
                      step={0.1}
                      onValueChange={(value) =>
                        setModelParams({
                          ...modelParams,
                          topP: value[0],
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Controls diversity: Higher values consider more token options.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Max Tokens: {modelParams.maxTokens}</Label>
                    </div>
                    <Slider
                      value={[modelParams.maxTokens]}
                      min={100}
                      max={4000}
                      step={100}
                      onValueChange={(value) =>
                        setModelParams({
                          ...modelParams,
                          maxTokens: value[0],
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum generation length.
                    </p>
                  </div>
                  
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={clearChat}
                  >
                    Clear Chat History
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </form>
        <p className={cn("mt-2 text-xs text-center text-muted-foreground", input ? "opacity-0" : "opacity-100")}>
          For best results, ask specific questions or provide clear instructions
        </p>
      </div>
    </div>
  );
};

export default Chat;