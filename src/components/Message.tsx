import { User, Bot } from 'lucide-react'
import { cn } from '../lib/utils'

export type MessageType = {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface MessageProps {
  message: MessageType
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === 'user'
  
  return (
    <div className={cn(
      "flex gap-4 p-4 transition-all ease-in-out duration-200",
      isUser ? "bg-muted/50" : "bg-background",
    )}>
      <div className="flex-shrink-0">
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-md",
          isUser ? "bg-primary-500/10 text-primary-600" : "bg-purple-500/10 text-purple-600"
        )}>
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