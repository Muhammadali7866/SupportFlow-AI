export interface SupportTicket {
  ticketId: string;
  title: string;
  description: string;
  description_embedding?: string;
  status: string;
  ai_state: string;
  category?: string | null;
  priority?: string | null;
  assignedTo?: string | null;
  tags?: string[];
  sentiment?: string | null;
  ai_confidence?: number | null;
  solution?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TicketClassification {
  category: 'authentication' | 'billing' | 'technical' | 'feature_request';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  tags: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  ai_confidence: number;
  solution: string;
}

