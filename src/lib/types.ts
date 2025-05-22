// Define the message interface
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Define model parameters interface
export interface ModelParameters {
  temperature: number;
  topP: number;
  maxTokens: number;
}

// Define conversation interface
export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}