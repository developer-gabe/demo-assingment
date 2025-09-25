import { Citation } from './types';

export function buildSystemPrompt(citations: Citation[]): string {
  const contextSections = citations.map((citation, index) => 
    `[${index + 1}] ${citation.title}\nURL: ${citation.url}\nContent: ${citation.snippet}`
  ).join('\n\n');

  return `You are Drata's AI assistant, designed to help users understand Drata's compliance automation platform. You provide accurate, helpful answers based on the provided context.

INSTRUCTIONS:
- Answer questions about Drata's products, features, pricing, integrations, and compliance capabilities
- Base your responses on the provided context documents
- Always cite your sources using the format [1], [2], etc. that correspond to the numbered context sections
- If you cannot answer based on the provided context, say so clearly
- Keep responses concise but comprehensive
- Use a helpful, professional tone
- Focus on how Drata solves compliance challenges

CONTEXT DOCUMENTS:
${contextSections}

Remember to cite your sources and provide actionable information that helps users understand how Drata can solve their compliance needs.`;
}

export function buildUserPrompt(question: string): string {
  return `Question: ${question}

Please provide a helpful answer based on the context provided in the system prompt. Remember to cite your sources using [1], [2], etc.`;
}

export function generateFollowUpQuestions(question: string, category?: string): string[] {
  const baseQuestions = [
    "How does Drata compare to other compliance tools?",
    "What integrations does Drata support?",
    "How long does it take to get SOC 2 certified with Drata?",
    "What frameworks does Drata support?",
    "Is there a free trial available?",
  ];

  // Category-specific follow-ups
  const categoryQuestions: Record<string, string[]> = {
    pricing: [
      "What's included in the startup plan?",
      "Are there any setup fees?",
      "How does pricing scale with company size?",
    ],
    product: [
      "How does automated evidence collection work?",
      "What kind of reporting does Drata provide?",
      "Can Drata help with multiple frameworks simultaneously?",
    ],
    security: [
      "How does Drata ensure data security?",
      "What access controls does Drata have?",
      "How does Drata handle sensitive compliance data?",
    ],
    integrations: [
      "Which cloud providers does Drata integrate with?",
      "How do integrations collect evidence automatically?",
      "Can Drata integrate with custom tools?",
    ],
    compliance: [
      "What's the difference between SOC 2 Type I and Type II?",
      "How does Drata help with ISO 27001?",
      "What evidence is needed for HIPAA compliance?",
    ],
  };

  const relevantQuestions = category ? categoryQuestions[category] || [] : [];
  const allQuestions = [...relevantQuestions, ...baseQuestions];
  
  // Return 3-4 unique questions, avoiding the original question
  return allQuestions
    .filter(q => !q.toLowerCase().includes(question.toLowerCase().split(' ')[0]))
    .slice(0, 4);
}
