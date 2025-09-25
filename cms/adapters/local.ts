import { readFileSync } from 'fs';
import { join } from 'path';
import { CmsConfig, CmsConfigSchema } from '../schema';

export class LocalCmsAdapter {
  private configPath: string;

  constructor(configPath: string = join(process.cwd(), 'cms', 'config.json')) {
    this.configPath = configPath;
  }

  async getConfig(): Promise<CmsConfig> {
    try {
      const configData = readFileSync(this.configPath, 'utf-8');
      const rawConfig = JSON.parse(configData);
      
      // Validate with Zod schema
      const config = CmsConfigSchema.parse(rawConfig);
      return config;
    } catch (error) {
      console.error('Failed to load CMS config:', error);
      throw new Error('Invalid CMS configuration');
    }
  }

  async updateConfig(config: Partial<CmsConfig>): Promise<void> {
    // In a real implementation, this would update the config
    // For demo purposes, we'll just validate the input
    CmsConfigSchema.partial().parse(config);
    console.log('Config update requested:', config);
  }
}

export const localCmsAdapter = new LocalCmsAdapter();
