import { Message as MessageType } from "../lib/types";
import { format } from "date-fns";
import { User, Bot } from "lucide-react";
import { cn } from "../lib/utils";

interface MessageProps {
  message: MessageType;
}

const Message = ({ message }: MessageProps) => {
  const isUser = message.role === "user";
  const formattedTime = format(message.timestamp, "h:mm a");

  return (
    <div
      className={cn(
        "flex w-full gap-3 p-4",
        isUser ? "bg-background" : "bg-muted/30"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-purple-600 text-white"
        )}
      >
        {isUser ? (
          <User className="h-5 w-5" />
        ) : (
          <Bot className="h-5 w-5" />
        )}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="font-medium">{isUser ? "You" : "Claude IA 3/7"}</p>
          <span className="text-xs text-muted-foreground">{formattedTime}</span>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {message.content.split("\n").map((paragraph, i) => (
            <p key={i} className={i > 0 ? "mt-1" : ""}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Message;