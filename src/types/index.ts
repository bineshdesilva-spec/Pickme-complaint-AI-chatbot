export type MessageRole = 'user' | 'model' | 'system';

export interface ChatMessage {
  role: MessageRole;
  text: string;
  timestamp: Date;
}

export interface ComplaintCategory {
  id: string;
  title: string;
  templateSinhala: string;
  templateEnglish: string;
}