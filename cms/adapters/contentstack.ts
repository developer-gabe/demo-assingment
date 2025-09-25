import { CmsConfig } from '../schema';

// Example Contentstack adapter (not required to run)
export class ContentstackCmsAdapter {
  private apiKey: string;
  private deliveryToken: string;
  private environment: string;

  constructor(apiKey: string, deliveryToken: string, environment: string = 'production') {
    this.apiKey = apiKey;
    this.deliveryToken = deliveryToken;
    this.environment = environment;
  }

  async getConfig(): Promise<CmsConfig> {
    // Example implementation - would fetch from Contentstack API
    const response = await fetch(
      `https://cdn.contentstack.io/v3/content_types/ai_assistant_module/entries?environment=${this.environment}`,
      {
        headers: {
          'api_key': this.apiKey,
          'access_token': this.deliveryToken,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Contentstack');
    }

    const data = await response.json();
    
    // Transform Contentstack response to our schema
    const entry = data.entries[0];
    
    if (!entry) {
      throw new Error('No AI Assistant module found in Contentstack');
    }

    const config: CmsConfig = {
      AiAssistantModule: {
        enabled: entry.enabled,
        variant: entry.variant,
        title: entry.title,
        intro: entry.intro,
        placeholder: entry.placeholder,
        suggestedPrompts: entry.suggested_prompts,
        primaryCta: entry.primary_cta,
        secondaryCtas: entry.secondary_ctas,
        theme: entry.theme,
        position: entry.position,
        rateLimitPerMinute: entry.rate_limit_per_minute,
        allowedCountries: entry.allowed_countries,
        disclaimer: entry.disclaimer,
      },
    };

    return config;
  }

  async updateConfig(config: Partial<CmsConfig>): Promise<void> {
    // Implementation would use Contentstack Management API
    console.log('Contentstack update requested:', config);
  }
}

export const createContentstackAdapter = (apiKey: string, deliveryToken: string, environment?: string) => 
  new ContentstackCmsAdapter(apiKey, deliveryToken, environment);
