import MiniSearch from 'minisearch';
import { KnowledgeItem, SearchResult } from './types';

export class SearchRanker {
  private miniSearch: MiniSearch<KnowledgeItem>;
  private documents: KnowledgeItem[];

  constructor(documents: KnowledgeItem[]) {
    this.documents = documents;
    this.miniSearch = new MiniSearch({
      fields: ['title', 'content', 'summary', 'category'],
      storeFields: ['id', 'title', 'url', 'category', 'summary', 'content'],
      searchOptions: {
        boost: {
          title: 3,
          summary: 2,
          content: 1,
          category: 1.5,
        },
        fuzzy: 0.2,
        prefix: true,
      },
    });

    this.miniSearch.addAll(documents);
  }

  search(query: string, k: number = 5): SearchResult[] {
    const results = this.miniSearch.search(query, {
      fuzzy: 0.2,
      prefix: true,
    });

    // Take only the top k results and map to our SearchResult format
    return results.slice(0, k).map((result) => {
      const doc = this.getDocumentById(result.id);
      if (!doc) {
        throw new Error(`Document not found: ${result.id}`);
      }
      
      return {
        ...doc,
        score: result.score,
        highlights: this.extractHighlights(query, doc.content, 2),
      };
    });
  }

  private extractHighlights(query: string, content: string, maxHighlights: number = 2): string[] {
    const words = query.toLowerCase().split(/\s+/);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const highlights: { sentence: string; score: number }[] = [];

    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      let score = 0;
      
      for (const word of words) {
        if (lowerSentence.includes(word)) {
          score += 1;
        }
      }
      
      if (score > 0) {
        highlights.push({ sentence: sentence.trim(), score });
      }
    }

    return highlights
      .sort((a, b) => b.score - a.score)
      .slice(0, maxHighlights)
      .map(h => h.sentence);
  }

  getDocumentById(id: string): KnowledgeItem | undefined {
    return this.documents.find(doc => doc.id === id);
  }

  getAllDocuments(): KnowledgeItem[] {
    return this.documents;
  }

  getDocumentsByCategory(category: string): KnowledgeItem[] {
    return this.documents.filter(doc => doc.category === category);
  }
}
