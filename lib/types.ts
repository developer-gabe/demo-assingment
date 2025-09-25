// Core types for the application

export interface KnowledgeItem {
  id: string;
  title: string;
  url: string;
  category: 'product' | 'security' | 'pricing' | 'integrations' | 'compliance';
  summary: string;
  content: string;
}

export interface SearchResult extends KnowledgeItem {
  score: number;
  highlights?: string[];
}

export interface Citation {
  id: string;
  title: string;
  url: string;
  snippet: string;
  score: number;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: Date;
}

export interface ChatResponse {
  content: string;
  citations: Citation[];
  followUps: string[];
}

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: Date;
}
