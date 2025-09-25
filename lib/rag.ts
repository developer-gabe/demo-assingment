import { readFileSync } from 'fs';
import { join } from 'path';
import { SearchRanker } from './rank';
import { KnowledgeItem, Citation, ChatResponse } from './types';
import { buildSystemPrompt, buildUserPrompt, generateFollowUpQuestions } from './prompt';

// Global search ranker instance (in production, this might be cached in Redis)
let searchRanker: SearchRanker | null = null;

export function getSearchRanker(): SearchRanker {
  if (!searchRanker) {
    try {
      const corpusPath = join(process.cwd(), 'data', 'corpus.json');
      const corpusData = readFileSync(corpusPath, 'utf-8');
      const documents: KnowledgeItem[] = JSON.parse(corpusData);
      searchRanker = new SearchRanker(documents);
    } catch (error) {
      console.error('Failed to initialize search ranker:', error);
      throw new Error('Search system unavailable');
    }
  }
  return searchRanker;
}

export function retrieveRelevantDocs(query: string, k: number = 4): Citation[] {
  const ranker = getSearchRanker();
  const results = ranker.search(query, k);
  
  return results.map(result => ({
    id: result.id,
    title: result.title,
    url: result.url,
    snippet: result.highlights?.[0] || result.summary,
    score: result.score,
  }));
}

export function buildPromptWithContext(query: string, citations: Citation[]): {
  systemPrompt: string;
  userPrompt: string;
} {
  return {
    systemPrompt: buildSystemPrompt(citations),
    userPrompt: buildUserPrompt(query),
  };
}

export function createChatResponse(
  content: string, 
  citations: Citation[], 
  originalQuery: string
): ChatResponse {
  // Determine the primary category from citations for better follow-ups
  const categories = citations.map(c => {
    const doc = getSearchRanker().getDocumentById(c.id);
    return doc?.category;
  }).filter(Boolean);
  
  const primaryCategory = categories[0]; // Use the highest-scoring result's category
  
  return {
    content,
    citations,
    followUps: generateFollowUpQuestions(originalQuery, primaryCategory),
  };
}

// Utility function to normalize queries for caching
export function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ');
}

// Cache key generator for Redis caching
export function generateCacheKey(query: string, sourceHash?: string): string {
  const normalizedQuery = normalizeQuery(query);
  const hash = sourceHash || 'default';
  return `chat:${hash}:${normalizedQuery}`;
}
