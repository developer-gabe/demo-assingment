import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { KnowledgeItem } from '../lib/types';
import { SearchRanker } from '../lib/rank';

export function buildSearchIndex() {
  try {
    // Load corpus data
    const corpusPath = join(process.cwd(), 'data', 'corpus.json');
    const corpusData = readFileSync(corpusPath, 'utf-8');
    const documents: KnowledgeItem[] = JSON.parse(corpusData);

    // Create search index
    const ranker = new SearchRanker(documents);

    // For demo purposes, we'll keep the ranker in memory
    // In production, you might serialize the MiniSearch index
    console.log(`Built search index with ${documents.length} documents`);
    
    // Optionally save processed documents for faster loading
    const indexPath = join(process.cwd(), 'data', 'processed-corpus.json');
    writeFileSync(indexPath, JSON.stringify(documents, null, 2));
    
    return ranker;
  } catch (error) {
    console.error('Failed to build search index:', error);
    throw error;
  }
}

// For build-time execution
if (require.main === module) {
  buildSearchIndex();
}
