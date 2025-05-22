import { useState, useRef, useEffect } from 'react'
import { SendHorizontal, Loader2, User, Bot } from 'lucide-react'
import { generateId } from '../lib/utils'

type MessageType = {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

// Mock function to simulate API call to Claude AI
const mockClaudeResponse = async (message: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
  
  if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
    return "Hello! I'm Claude, an AI assistant created by Anthropic. How can I help you today?"
  }
  
  if (message.toLowerCase().includes('who are you') || message.toLowerCase().includes('what are you')) {
    return "I'm Claude, an AI assistant built by Anthropic to be helpful, harmless, and honest. I'm based on a large language model called Claude 3/7, which means I've been trained on a diverse range of text from the internet to be able to understand and generate human-like responses. How can I assist you today?"
  }
  
  if (message.toLowerCase().includes('can you')) {
    return "I can help with a wide range of tasks including answering questions, generating creative content, summarizing information, and having thoughtful conversations. I do have certain limitations though - I can't browse the internet or access real-time information beyond my training data, and I have certain safety guidelines I need to follow."
  }
  
  return "I understand you're trying to communicate with me, but I'm currently running in a demonstration mode with limited responses. In a fully implemented version, I would be connected to the actual Claude AI API to provide more helpful and contextual responses to your questions."
}

const Message = ({ message }: { message: MessageType }) => {
  const isUser = message.role === 'user'
  
  return (
    <div className={`flex gap-4 p-4 transition-all ease-in-out duration-200 ${isUser ? "bg-muted/50" : "bg-background"}`}>
      <div className="flex-shrink-0">
        <div className={`flex items-center justify-center w-8 h-8 rounded-md ${isUser ? "bg-primary-500/10 text-primary-600" : "bg-purple-500/10 text-purple-600"}`}>
          {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </div>
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            {isUser ? 'You' : 'Claude AI'}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(message.timestamp)}
          </span>
        </div>
        
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    </div>
  )
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date)
}

export default function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: generateId(),
      content: "Hello! I'm Claude, an AI assistant built by Anthropic. How can I help you today?",
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim()) return
    
    // Add user message
    const userMessage: MessageType = {
      id: generateId(),
      content: input,
      role: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    try {
      // Get response from Claude (mock function)
      const response = await mockClaudeResponse(input)
      
      // Add Claude's response
      const assistantMessage: MessageType = {
        id: generateId(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-15rem)]">
      <div className="flex-1 overflow-y-auto rounded-t-lg border border-border bg-card">
        <div className="divide-y divide-border">
          {messages.map(message => (
            <Message key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="p-4 flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Claude is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="relative">
          <textarea
            placeholder="Ask Claude something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="resize-none w-full min-h-[80px] border rounded-md p-3 pr-14"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <button 
            type="submit" 
            className="absolute right-2 bottom-2 rounded-md p-2 bg-blue-500 text-white"
            disabled={isLoading || !input.trim()}
          >
            <SendHorizontal className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Press Enter to send, Shift+Enter for a new line
        </div>
      </form>
    </div>
  )
}