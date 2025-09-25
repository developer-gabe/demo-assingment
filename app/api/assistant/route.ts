import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextRequest } from 'next/server';
import { retrieveRelevantDocs, buildPromptWithContext, createChatResponse, normalizeQuery } from '@/lib/rag';
import { trackAssistantResponse } from '@/lib/analytics';

export const runtime = 'nodejs';

// Basic hardcoded responses for demo purposes
const basicResponses: Record<string, { content: string; citations: any[]; followUps: string[] }> = {
  'what frameworks does drata support?': {
    content: 'Drata supports a comprehensive range of compliance frameworks including:\n\n• **SOC 2** - Security, Availability, Processing Integrity, Confidentiality, and Privacy\n• **ISO 27001** - International standard for information security management\n• **PCI DSS** - Payment Card Industry Data Security Standard\n• **HIPAA** - Health Insurance Portability and Accountability Act\n• **GDPR** - General Data Protection Regulation\n• **FedRAMP** - Federal Risk and Authorization Management Program\n\nOur platform automatically maps your security controls to these frameworks and continuously monitors compliance status.',
    citations: [
      { id: 'frameworks', title: 'Supported Compliance Frameworks', url: 'https://drata.com/frameworks', snippet: 'SOC 2, ISO 27001, PCI DSS, HIPAA, GDPR, FedRAMP and more', score: 0.95 }
    ],
    followUps: ['How long does SOC 2 certification take?', 'What integrations are available?', 'Is there a startup plan?']
  },
  'how do integrations work?': {
    content: 'Drata integrates seamlessly with your existing tech stack through 100+ pre-built connectors:\n\n**Cloud Providers**: AWS, Google Cloud, Microsoft Azure\n**Identity Management**: Okta, Active Directory, OneLogin\n**Development Tools**: GitHub, GitLab, Jira, Slack\n**Monitoring**: DataDog, Splunk, New Relic\n**HR Systems**: BambooHR, Workday, Greenhouse\n\nIntegrations are:\n• **Automated** - No manual configuration required\n• **Real-time** - Continuous monitoring and evidence collection\n• **Secure** - Read-only access with OAuth authentication\n• **Comprehensive** - Cover all major compliance requirements',
    citations: [
      { id: 'integrations', title: 'Drata Integrations', url: 'https://drata.com/integrations', snippet: '100+ integrations with cloud providers, identity management, and development tools', score: 0.92 }
    ],
    followUps: ['What does automated evidence collection include?', 'How much does Drata cost?', 'What security certifications does Drata have?']
  },
  'is there a startup plan?': {
    content: 'Yes! Drata offers a **Startup Program** designed specifically for early-stage companies:\n\n**Benefits Include:**\n• **Significant discounts** on our platform (up to 50% off)\n• **Dedicated startup success manager**\n• **Compliance expert guidance** for first-time audits\n• **Resource library** with templates and best practices\n• **Community access** to connect with other startup founders\n\n**Eligibility:**\n• Companies with less than $10M in annual revenue\n• Seeking their first compliance certification\n• Series A or earlier funding stage\n\n**What\'s Included:**\n• Full platform access with unlimited users\n• All integrations and automated evidence collection\n• Audit preparation tools and documentation\n• Expert support throughout your compliance journey',
    citations: [
      { id: 'startup-plan', title: 'Drata for Startups', url: 'https://drata.com/startups', snippet: 'Special pricing and support for early-stage companies', score: 0.98 }
    ],
    followUps: ['How do I apply for the startup program?', 'What frameworks should startups prioritize?', 'How long does SOC 2 take for startups?']
  },
  'how does drata automate evidence collection?': {
    content: 'Drata\'s automated evidence collection works through intelligent integrations and continuous monitoring:\n\n**How it Works:**\n• **Smart Connectors** - Securely connect to your tools via APIs\n• **Continuous Scanning** - Monitor configurations 24/7\n• **Automatic Screenshots** - Capture evidence of security settings\n• **Log Collection** - Gather access logs, audit trails, and system events\n• **Policy Mapping** - Link evidence to specific compliance requirements\n\n**Types of Evidence Collected:**\n• User access reviews and permissions\n• System configurations and security settings\n• Vulnerability scan results\n• Backup and disaster recovery procedures\n• Security awareness training records\n• Vendor security assessments\n\n**Benefits:**\n• **90% reduction** in manual evidence gathering\n• **Real-time alerts** when controls drift out of compliance\n• **Audit-ready documentation** generated automatically\n• **Version control** for all evidence with timestamps',
    citations: [
      { id: 'evidence-collection', title: 'Automated Evidence Collection', url: 'https://drata.com/features/evidence-collection', snippet: 'Automatically collect and organize compliance evidence from your existing tools', score: 0.96 }
    ],
    followUps: ['What integrations support evidence collection?', 'How secure is the evidence collection process?', 'Can I customize what evidence is collected?']
  },
  'what security certifications does drata have?': {
    content: 'Drata maintains the highest security standards and holds multiple certifications:\n\n**Current Certifications:**\n• **SOC 2 Type II** - Independently audited for security, availability, and confidentiality\n• **ISO 27001** - International information security management standard\n• **PCI DSS Level 1** - Highest level of payment card security compliance\n• **GDPR Compliant** - European data protection regulation adherence\n\n**Security Practices:**\n• **End-to-end encryption** for all data in transit and at rest\n• **Zero-trust architecture** with principle of least privilege\n• **Regular penetration testing** by third-party security firms\n• **24/7 security monitoring** with automated threat detection\n• **Annual security audits** by Big 4 accounting firms\n\n**Data Protection:**\n• **Multi-region backups** with 99.9% uptime SLA\n• **Role-based access controls** with MFA requirements\n• **Data residency options** for international customers\n• **Right to deletion** and data portability features',
    citations: [
      { id: 'security-certs', title: 'Drata Security Certifications', url: 'https://drata.com/security', snippet: 'SOC 2 Type II, ISO 27001, PCI DSS Level 1 certified', score: 0.94 }
    ],
    followUps: ['How does Drata protect customer data?', 'What is Drata\'s uptime guarantee?', 'Where are Drata\'s data centers located?']
  }
};

export async function POST(req: NextRequest) {
  try {
    const startTime = Date.now();
    const { messages } = await req.json();
    
    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      return new Response('Invalid message format', { status: 400 });
    }

    const query = lastMessage.content;
    const normalizedQuery = normalizeQuery(query);
    
    // Check if we have a basic response for this query
    const basicResponse = basicResponses[normalizedQuery.toLowerCase()];
    
    if (basicResponse) {
      // Return a basic response for demo purposes
      const response = new Response(
        new ReadableStream({
          start(controller) {
            // Simulate streaming by sending the response in chunks
            const chunks = basicResponse.content.split(' ');
            let index = 0;
            
            const sendChunk = () => {
              if (index < chunks.length) {
                const chunk = chunks[index] + ' ';
                controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(chunk)}\n`));
                index++;
                setTimeout(sendChunk, 50); // Simulate typing speed
              } else {
                controller.close();
              }
            };
            
            sendChunk();
          }
        }),
        {
          headers: {
            'Content-Type': 'text/plain',
            'X-Citations': JSON.stringify(basicResponse.citations),
            'X-Follow-Ups': JSON.stringify(basicResponse.followUps),
          }
        }
      );
      
      return response;
    }

    // If no basic response is available and no OpenAI key, return helpful message
    if (!process.env.OPENAI_API_KEY) {
      const fallbackResponse = {
        content: `I'd be happy to help answer questions about Drata! For now, I have detailed responses ready for these specific questions:\n\n• "What frameworks does Drata support?"\n• "How do integrations work?"\n• "Is there a startup plan?"\n• "How does Drata automate evidence collection?"\n• "What security certifications does Drata have?"\n\nPlease click on one of the suggested questions above to see a detailed response, or set up an OpenAI API key for more comprehensive answers.`,
        citations: [],
        followUps: ['What frameworks does Drata support?', 'How do integrations work?', 'Is there a startup plan?']
      };

      const response = new Response(
        new ReadableStream({
          start(controller) {
            const chunks = fallbackResponse.content.split(' ');
            let index = 0;
            
            const sendChunk = () => {
              if (index < chunks.length) {
                const chunk = chunks[index] + ' ';
                controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(chunk)}\n`));
                index++;
                setTimeout(sendChunk, 30);
              } else {
                controller.close();
              }
            };
            
            sendChunk();
          }
        }),
        {
          headers: {
            'Content-Type': 'text/plain',
            'X-Citations': JSON.stringify(fallbackResponse.citations),
            'X-Follow-Ups': JSON.stringify(fallbackResponse.followUps),
          }
        }
      );
      
      return response;
    }

    // If OpenAI key is available, proceed with original logic
    // Rate limiting check (simplified - in production use Redis)
    // const rateLimitKey = `rate_limit:${req.ip}`;
    // await checkRateLimit(rateLimitKey);
    
    // Retrieve relevant documents
    const citations = retrieveRelevantDocs(query, 4);
    
    if (citations.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'No relevant information found. Please try rephrasing your question.',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Build prompts with context
    const { systemPrompt, userPrompt } = buildPromptWithContext(query, citations);

    // Stream response from OpenAI
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0.7,
    });

    // Track analytics
    const responseTime = Date.now() - startTime;
    trackAssistantResponse(query, responseTime, citations.length);

    // Create simple stream response
    const response = result.toAIStreamResponse();

    // Add citations and follow-ups to the response headers
    const chatResponse = createChatResponse('', citations, query);
    
    // Add custom headers with metadata
    response.headers.set('X-Citations', JSON.stringify(chatResponse.citations));
    response.headers.set('X-Follow-Ups', JSON.stringify(chatResponse.followUps));
    
    return response;
    
  } catch (error) {
    console.error('Assistant API error:', error);
    
    if (error instanceof Error && error.message.includes('API key')) {
      return new Response(
        JSON.stringify({
          error: 'AI service unavailable. Please try again later.',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({
        error: 'An unexpected error occurred. Please try again.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Simplified rate limiting (in production, use Redis with sliding window)
async function checkRateLimit(key: string): Promise<void> {
  // Implementation would use Redis or similar
  // For demo, we'll just add a small delay
  await new Promise(resolve => setTimeout(resolve, 100));
}
