import { CmsConfig } from './schema';
import { localCmsAdapter } from './adapters/local';
import { createContentfulAdapter } from './adapters/contentful';
import { createContentstackAdapter } from './adapters/contentstack';

export interface CmsAdapter {
  getConfig(): Promise<CmsConfig>;
  updateConfig(config: Partial<CmsConfig>): Promise<void>;
}

export type CmsProvider = 'local' | 'contentful' | 'contentstack';

export function createCmsAdapter(provider: CmsProvider = 'local', options?: any): CmsAdapter {
  switch (provider) {
    case 'local':
      return localCmsAdapter;
    case 'contentful':
      if (!options?.spaceId || !options?.accessToken) {
        throw new Error('Contentful requires spaceId and accessToken');
      }
      return createContentfulAdapter(options.spaceId, options.accessToken, options.environment);
    case 'contentstack':
      if (!options?.apiKey || !options?.deliveryToken) {
        throw new Error('Contentstack requires apiKey and deliveryToken');
      }
      return createContentstackAdapter(options.apiKey, options.deliveryToken, options.environment);
    default:
      throw new Error(`Unknown CMS provider: ${provider}`);
  }
}

// Default adapter for the application
export const cmsAdapter = createCmsAdapter(
  (process.env.CMS_PROVIDER as CmsProvider) || 'local',
  {
    // Contentful options
    spaceId: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    environment: process.env.CONTENTFUL_ENVIRONMENT,
    
    // Contentstack options
    apiKey: process.env.CONTENTSTACK_API_KEY,
    deliveryToken: process.env.CONTENTSTACK_DELIVERY_TOKEN,
  }
);

export * from './schema';
