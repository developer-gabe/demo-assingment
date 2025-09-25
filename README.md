# Drata AI Homepage Assistant

A production-ready Next.js prototype demonstrating an AI-powered homepage assistant for Drata's compliance automation platform. This project showcases streaming chat interfaces, RAG (Retrieval Augmented Generation), CMS integration, and enterprise-ready architecture patterns.

## 🚀 Quick Start

### Prerequisites

- Node.js 18.18.0+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 🎯 Demo Experience

### What You'll See

- **Homepage**: Modern Drata landing page with integrated AI assistant
- **AI Assistant**: Dismissible component with three variants:
  - **Drawer**: Slides in from the right (default)
  - **Floating**: Modal dialog with floating launcher
  - **Inline**: Embedded directly in the page
- **Interactive Chat**: 
  - Ask questions about Drata's platform
  - Get streaming responses with citations
  - See suggested follow-up questions
  - Click citations to view sources
- **CTA Integration**: "Book a demo" and secondary CTAs
- **Accessibility**: Full keyboard navigation and screen reader support

### Try These Questions

- "What does Drata do?"
- "How does automated evidence collection work?"
- "What frameworks does Drata support?"
- "Is there a startup plan?"
- "How do integrations work?"

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: TailwindCSS + shadcn/ui components
- **AI/Streaming**: Vercel AI SDK + OpenAI GPT-4o-mini
- **Search**: MiniSearch (BM25) for document retrieval
- **CMS**: Configurable adapter pattern (Local JSON, Contentful, Contentstack)
- **State Management**: React hooks + Zustand-like patterns
- **Analytics**: Event tracking with console/dataLayer integration

### Project Structure

```
├── app/
│   ├── api/assistant/route.ts     # Streaming chat endpoint
│   ├── components/
│   │   ├── ai-assistant/          # Main assistant components
│   │   └── ui/                    # shadcn/ui primitives
│   ├── layout.tsx
│   └── page.tsx                   # Homepage with assistant
├── cms/
│   ├── config.json               # Marketer-configurable settings
│   ├── schema.ts                 # Zod validation schemas
│   └── adapters/                 # CMS provider adapters
├── data/
│   ├── corpus.json              # Knowledge base (20 Drata docs)
│   └── build-index.ts           # Search indexing
├── lib/
│   ├── rag.ts                   # Retrieval-augmented generation
│   ├── rank.ts                  # BM25 search ranking
│   ├── prompt.ts                # LLM prompt templates
│   └── analytics.ts             # Event tracking
└── docs/                        # Architecture documentation
```

## 🎛️ CMS Configuration

Marketing teams can configure the assistant without code changes:

```json
{
  "AiAssistantModule": {
    "enabled": true,
    "variant": "drawer",
    "title": "Ask about Drata",
    "intro": "Get quick, trusted answers...",
    "placeholder": "e.g., How does Drata help with SOC 2?",
    "suggestedPrompts": [...],
    "primaryCta": { "label": "Book a demo", "href": "/demo" },
    "secondaryCtas": [...],
    "theme": { "tone": "brand", "accentHex": "#1C64F2" },
    "position": "heroBottom",
    "rateLimitPerMinute": 12,
    "disclaimer": "Answers may be AI-generated..."
  }
}
```

### Switching CMS Providers

Set environment variables to use different CMS providers:

```env
# Use Contentful
CMS_PROVIDER=contentful
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_token

# Use Contentstack  
CMS_PROVIDER=contentstack
CONTENTSTACK_API_KEY=your_api_key
CONTENTSTACK_DELIVERY_TOKEN=your_token
```

## 🔍 Knowledge System

### Current Implementation (Prototype)

- **Source**: 20 curated Drata documents in `data/corpus.json`
- **Search**: MiniSearch with BM25 ranking
- **Retrieval**: Top-k document chunks with highlights
- **Citations**: Source title, URL, snippet, and relevance score

### Production Scaling Path

The system is designed to scale to multiple real sources:

1. **Source Adapters**: Website crawling, docs, Salesforce, Gong calls
2. **ETL Pipeline**: Scheduled content ingestion and processing  
3. **Vector Search**: OpenAI embeddings with pgvector/Typesense
4. **Chunking**: Semantic document splitting with metadata
5. **Freshness**: Cache invalidation and incremental updates

## 🚦 Performance & Caching

### Current Caching Strategy

- **Answer Cache**: In-memory (60-min TTL) - Redis in production
- **Retrieval Cache**: Document search results (10-min TTL)
- **Static Assets**: CDN caching for corpus and index files
- **Rate Limiting**: IP-based with graceful degradation

### Production Optimizations

- **Edge Functions**: Initial classification and cache checks
- **Regional Compute**: Heavy retrieval operations
- **CDN**: Static assets and JSON index files
- **Redis**: Distributed caching with sliding window rate limits

## 🎨 Accessibility Features

### Implemented

- **Keyboard Navigation**: Full tab order, Enter/Escape handling
- **Screen Readers**: ARIA labels, live regions, semantic markup
- **Focus Management**: Trap focus in modals, visible focus indicators
- **Reduced Motion**: Respects `prefers-reduced-motion`
- **Color Contrast**: WCAG AA compliance (4.5:1 ratio)
- **Semantic HTML**: Proper landmarks, headings, lists

### Testing

```bash
# Run accessibility audits
npm run a11y:test

# Test with screen readers
# - macOS: VoiceOver (Cmd+F5)
# - Windows: NVDA (free)
# - Browser: Chrome Vox extension
```

## 📊 Analytics & Tracking

### Events Tracked

- `assistant_interaction`: Open/close, message send
- `assistant_response`: Query processing metrics
- `cta_click`: Conversion tracking
- `followup_click`: Engagement patterns
- `citation_click`: Source exploration

### Integration

```javascript
// Google Analytics/Tag Manager
window.dataLayer.push({
  event: 'assistant_response',
  query_length: 42,
  response_time_ms: 1250,
  citation_count: 3
});

// Segment (production)
analytics.track('assistant_response', {
  query_hash: 'abc123',
  response_time_ms: 1250
});
```

## 🔒 Security & Privacy

### Current Implementation

- **Input Sanitization**: HTML stripping, XSS prevention
- **Rate Limiting**: Per-IP request throttling
- **Query Privacy**: Hash queries for analytics (no storage)
- **Error Handling**: Generic error messages, detailed logging

### Production Hardening

- **Prompt Injection**: Input filtering and validation
- **PII Scrubbing**: Regex patterns for emails, SSNs, etc.
- **Domain Allow-list**: Restrict citation sources
- **Audit Logging**: Request/response tracking for compliance
- **Data Retention**: Configurable transcript deletion

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   npx vercel --prod
   ```

2. **Set Environment Variables**
   - `OPENAI_API_KEY`
   - Optional: CMS provider credentials

3. **Deploy**
   - Automatic deployment on git push
   - Preview deployments for PRs
   - Edge functions for optimal performance

### Alternative Platforms

- **Netlify**: Full support with edge functions
- **Railway**: Simple deployment with Redis add-on
- **AWS**: Amplify or custom EC2/ECS setup
- **Docker**: Multi-stage build included

## 🧪 Testing

```bash
# Unit tests (Vitest)
npm run test

# E2E tests (Playwright)
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📈 Performance Metrics

### Target Performance

- **Initial Load**: < 2s (LCP)
- **Chat Response**: < 2s p95
- **Streaming Start**: < 500ms
- **Accessibility**: 100% Lighthouse score
- **Bundle Size**: < 500KB gzipped

### Monitoring

```bash
# Bundle analysis
npm run analyze

# Performance testing
npm run perf:test
```

## 🛠️ Development

### Adding New Knowledge Sources

1. **Create Adapter**
   ```typescript
   // lib/adapters/salesforce.ts
   export async function fetchSalesforceData(): Promise<KnowledgeItem[]> {
     // Implementation
   }
   ```

2. **Update Build Process**
   ```typescript
   // data/build-index.ts
   import { fetchSalesforceData } from '../lib/adapters/salesforce';
   ```

3. **Configure Environment**
   ```env
   SALESFORCE_API_KEY=your_key
   ```

### Customizing UI Components

All components use shadcn/ui patterns and are fully customizable:

```typescript
// app/components/ai-assistant/Chat.tsx
import { Button } from '../ui/button';

// Customize appearance
<Button variant="outline" size="sm">
  Custom Button
</Button>
```

### Adding Analytics Events

```typescript
import { analytics } from '@/lib/analytics';

// Track custom events
analytics.track('custom_event', {
  property: 'value',
  timestamp: new Date()
});
```

## 📚 Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [CMS Integration](./docs/CMS_MODEL.md)  
- [LLM Integration](./docs/LLM_INTEGRATION.md)
- [Production Deployment](./docs/NEXT_STEPS.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: support@example.com

---

**Built with ❤️ for Drata's AI-powered compliance future.**