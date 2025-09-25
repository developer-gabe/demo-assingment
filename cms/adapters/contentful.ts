import { CmsConfig, AiAssistantModule } from '../schema';

// Example Contentful adapter (not required to run)
export class ContentfulCmsAdapter {
  private spaceId: string;
  private accessToken: string;
  private environment: string;

  constructor(spaceId: string, accessToken: string, environment: string = 'master') {
    this.spaceId = spaceId;
    this.accessToken = accessToken;
    this.environment = environment;
  }

  async getConfig(): Promise<CmsConfig> {
    // Example implementation - would fetch from Contentful API
    const response = await fetch(
      `https://cdn.contentful.com/spaces/${this.spaceId}/environments/${this.environment}/entries?content_type=aiAssistantModule`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Contentful');
    }

    const data = await response.json();
    
    // Transform Contentful response to our schema
    const aiAssistantData = data.items[0]?.fields;
    
    if (!aiAssistantData) {
      throw new Error('No AI Assistant module found in Contentful');
    }

    const config: CmsConfig = {
      AiAssistantModule: {
        enabled: aiAssistantData.enabled,
        variant: aiAssistantData.variant,
        title: aiAssistantData.title,
        intro: aiAssistantData.intro,
        placeholder: aiAssistantData.placeholder,
        suggestedPrompts: aiAssistantData.suggestedPrompts,
        primaryCta: aiAssistantData.primaryCta,
        secondaryCtas: aiAssistantData.secondaryCtas,
        theme: aiAssistantData.theme,
        position: aiAssistantData.position,
        rateLimitPerMinute: aiAssistantData.rateLimitPerMinute,
        allowedCountries: aiAssistantData.allowedCountries,
        disclaimer: aiAssistantData.disclaimer,
      },
    };

    return config;
  }

  async updateConfig(config: Partial<CmsConfig>): Promise<void> {
    // Implementation would use Contentful Management API
    console.log('Contentful update requested:', config);
  }
}

export const createContentfulAdapter = (spaceId: string, accessToken: string, environment?: string) => 
  new ContentfulCmsAdapter(spaceId, accessToken, environment);
