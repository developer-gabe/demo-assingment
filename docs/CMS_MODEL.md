# CMS Integration Model

## Overview

The Drata AI Assistant uses a flexible CMS integration pattern that allows marketing teams to configure the assistant's behavior, appearance, and content without requiring code changes. The system supports multiple CMS providers through an adapter pattern.

## Content Model

### AiAssistantModule Schema

The core content type that defines all configurable aspects of the AI assistant:

```typescript
interface AiAssistantModule {
  // Basic Configuration
  enabled: boolean;                    // Toggle assistant on/off
  variant: 'inline' | 'floating' | 'drawer'; // Display mode
  title: string;                       // Assistant title
  intro: string;                       // Description text
  placeholder: string;                 // Input placeholder text
  
  // Content Configuration
  suggestedPrompts: string[];          // Initial question suggestions
  primaryCta: Cta;                     // Main call-to-action
  secondaryCtas: Cta[];               // Additional CTAs
  disclaimer: string;                  // Legal/compliance text
  
  // Design Configuration
  theme: {
    tone: 'brand' | 'neutral';         // Visual style
    accentHex: string;                 // Primary color (#1C64F2)
  };
  
  // Placement Configuration
  position: 'heroTop' | 'heroBottom' | 'contentBlockId';
  
  // Operational Configuration
  rateLimitPerMinute: number;          // Usage limits
  allowedCountries?: string[];         // Geographic restrictions
}
```

### Supporting Types

```typescript
interface Cta {
  label: string;                       // Button text
  href: string;                        // Destination URL
}

interface Theme {
  tone: 'brand' | 'neutral';
  accentHex: string;                   // Must be valid hex color
}
```

## CMS Provider Adapters

### Local JSON (Development)

The simplest adapter reads configuration from a local JSON file:

```json
{
  "AiAssistantModule": {
    "enabled": true,
    "variant": "drawer",
    "title": "Ask about Drata",
    "intro": "Get quick, trusted answers about Drata's compliance automation platform with citations.",
    "placeholder": "e.g., How does Drata help with SOC 2?",
    "suggestedPrompts": [
      "What frameworks does Drata support?",
      "How do integrations work?",
      "Is there a startup plan?"
    ],
    "primaryCta": {
      "label": "Book a demo",
      "href": "/demo"
    },
    "secondaryCtas": [
      {
        "label": "Pricing",
        "href": "/pricing"
      }
    ],
    "theme": {
      "tone": "brand",
      "accentHex": "#1C64F2"
    },
    "position": "heroBottom",
    "rateLimitPerMinute": 12,
    "disclaimer": "Answers may be AI-generated. Always verify with Sales."
  }
}
```

### Contentful Integration

For Contentful CMS, create a content type with the following fields:

#### Content Type: `aiAssistantModule`

| Field Name | Field Type | Validation | Description |
|------------|------------|------------|-------------|
| `enabled` | Boolean | Required | Enable/disable assistant |
| `variant` | Short Text | Required, Options: inline, floating, drawer | Display variant |
| `title` | Short Text | Required, Max 100 chars | Assistant title |
| `intro` | Long Text | Required, Max 500 chars | Introduction text |
| `placeholder` | Short Text | Required, Max 200 chars | Input placeholder |
| `suggestedPrompts` | Short Text, List | Required, Min 3, Max 5 items | Initial questions |
| `primaryCta` | JSON Object | Required | Main CTA button |
| `secondaryCtas` | JSON Object, List | Optional, Max 3 items | Additional CTAs |
| `theme` | JSON Object | Required | Theme configuration |
| `position` | Short Text | Required, Options: heroTop, heroBottom | Placement |
| `rateLimitPerMinute` | Integer | Required, Min 1, Max 60 | Rate limit |
| `allowedCountries` | Short Text, List | Optional | Country codes |
| `disclaimer` | Long Text | Required, Max 1000 chars | Legal disclaimer |

#### JSON Field Schemas

**primaryCta / secondaryCtas:**
```json
{
  "label": "Book a demo",
  "href": "/demo"
}
```

**theme:**
```json
{
  "tone": "brand",
  "accentHex": "#1C64F2"
}
```

### Contentstack Integration

For Contentstack, create a content type with equivalent fields:

#### Content Type: `ai_assistant_module`

```json
{
  "title": "AI Assistant Module",
  "uid": "ai_assistant_module",
  "schema": [
    {
      "display_name": "Enabled",
      "uid": "enabled",
      "data_type": "boolean",
      "mandatory": true
    },
    {
      "display_name": "Variant",
      "uid": "variant",
      "data_type": "select",
      "choices": [
        {"value": "inline", "display": "Inline"},
        {"value": "floating", "display": "Floating"},
        {"value": "drawer", "display": "Drawer"}
      ],
      "mandatory": true
    },
    // ... additional fields following the same pattern
  ]
}
```

## Marketing Workflow

### Content Creation Process

1. **Access CMS**: Marketing team logs into their CMS platform
2. **Create/Edit Content**: Navigate to AI Assistant Module content type
3. **Configure Settings**: Update title, prompts, CTAs, and styling
4. **Preview Changes**: Use CMS preview functionality
5. **Publish**: Deploy changes to production
6. **Monitor**: Track usage and performance metrics

### A/B Testing Workflow

1. **Create Variants**: Duplicate the assistant module with different configurations
2. **Traffic Splitting**: Use CMS or feature flags to control traffic distribution
3. **Measure Performance**: Track conversion rates, engagement, and user feedback
4. **Analyze Results**: Compare variant performance in analytics dashboard
5. **Deploy Winner**: Promote the best-performing variant to 100% traffic

### Approval Process

For enterprise deployments, implement content approval workflows:

1. **Draft Creation**: Marketing creates draft configurations
2. **Legal Review**: Compliance team reviews disclaimer text and CTAs
3. **Technical Review**: Engineering validates technical feasibility
4. **Stakeholder Approval**: Senior leadership approves changes
5. **Scheduled Publication**: Deploy changes during maintenance windows

## Configuration Examples

### Variant Configurations

#### Floating Launcher (High Engagement)
```json
{
  "variant": "floating",
  "title": "Need Help?",
  "intro": "Ask me anything about Drata!",
  "suggestedPrompts": [
    "What's the ROI of compliance automation?",
    "How fast can I get SOC 2 certified?",
    "What makes Drata different?"
  ]
}
```

#### Inline Hero (Content Marketing)
```json
{
  "variant": "inline",
  "position": "heroBottom",
  "title": "Explore Drata with AI",
  "intro": "Get personalized answers about our compliance platform",
  "theme": {
    "tone": "brand",
    "accentHex": "#1C64F2"
  }
}
```

#### Drawer Sidebar (Support Focus)
```json
{
  "variant": "drawer",
  "title": "Drata Support Assistant",
  "suggestedPrompts": [
    "How do I set up my first integration?",
    "What evidence do I need for SOC 2?",
    "Where can I find my audit reports?"
  ]
}
```

### Seasonal/Campaign Configurations

#### Product Launch Campaign
```json
{
  "title": "Discover Our New Features",
  "intro": "Learn about Drata's latest compliance automation capabilities",
  "suggestedPrompts": [
    "What's new in the latest release?",
    "How does the new risk assessment feature work?",
    "Can I migrate from my current solution?"
  ],
  "primaryCta": {
    "label": "Try New Features",
    "href": "/features/latest"
  }
}
```

#### Holiday Promotion
```json
{
  "theme": {
    "tone": "neutral",
    "accentHex": "#DC2626"
  },
  "primaryCta": {
    "label": "Get Holiday Discount",
    "href": "/pricing?promo=holiday2024"
  },
  "disclaimer": "Special pricing valid through December 31, 2024. Terms apply."
}
```

## Technical Implementation

### Adapter Pattern

The system uses an adapter pattern to support multiple CMS providers:

```typescript
interface CmsAdapter {
  getConfig(): Promise<CmsConfig>;
  updateConfig(config: Partial<CmsConfig>): Promise<void>;
}

// Factory function
function createCmsAdapter(provider: CmsProvider): CmsAdapter {
  switch (provider) {
    case 'local': return new LocalCmsAdapter();
    case 'contentful': return new ContentfulCmsAdapter();
    case 'contentstack': return new ContentstackCmsAdapter();
  }
}
```

### Environment Configuration

Switch between CMS providers using environment variables:

```bash
# Local development
CMS_PROVIDER=local

# Contentful production
CMS_PROVIDER=contentful
CONTENTFUL_SPACE_ID=abc123
CONTENTFUL_ACCESS_TOKEN=xyz789
CONTENTFUL_ENVIRONMENT=production

# Contentstack production  
CMS_PROVIDER=contentstack
CONTENTSTACK_API_KEY=abc123
CONTENTSTACK_DELIVERY_TOKEN=xyz789
```

### Caching Strategy

CMS content is cached for performance:

- **Development**: No caching (immediate updates)
- **Staging**: 5-minute cache (fast iteration)
- **Production**: 1-hour cache with manual invalidation

### Validation and Error Handling

All CMS content is validated using Zod schemas:

```typescript
import { CmsConfigSchema } from './schema';

async function loadCmsConfig(): Promise<CmsConfig> {
  try {
    const rawConfig = await cmsAdapter.getConfig();
    return CmsConfigSchema.parse(rawConfig);
  } catch (error) {
    // Log error and return safe defaults
    console.error('CMS validation failed:', error);
    return getDefaultConfig();
  }
}
```

## Best Practices

### Content Guidelines

1. **Keep It Concise**: Titles under 50 characters, intros under 200 characters
2. **Action-Oriented**: Use active voice and clear calls-to-action
3. **Brand Consistent**: Maintain consistent tone and terminology
4. **Accessible**: Ensure text is readable and inclusive
5. **Compliant**: Include necessary legal disclaimers

### Technical Guidelines

1. **Validate Input**: Always validate CMS content before use
2. **Handle Errors**: Gracefully degrade when CMS is unavailable
3. **Cache Appropriately**: Balance freshness with performance
4. **Monitor Usage**: Track configuration changes and their impact
5. **Version Control**: Keep backups of working configurations

### Performance Considerations

1. **Bundle Size**: Minimize CMS payload size
2. **Loading States**: Show loading indicators during CMS fetches
3. **Fallbacks**: Provide default configurations for reliability
4. **CDN Caching**: Cache CMS responses at the edge when possible
5. **Incremental Updates**: Only fetch changed content when possible

## Future Enhancements

### Advanced Features

1. **Multi-Language Support**: Localized content for different markets
2. **User Segmentation**: Different configurations for different user types
3. **Dynamic Content**: Real-time content updates based on user behavior
4. **Advanced Analytics**: A/B testing built into the CMS workflow
5. **Visual Editor**: WYSIWYG interface for non-technical users

### Integration Possibilities

1. **Marketing Automation**: Connect with HubSpot, Marketo, etc.
2. **Analytics Platforms**: Direct integration with Google Analytics, Mixpanel
3. **Customer Data**: Personalization based on CRM data
4. **Feature Flags**: Integration with LaunchDarkly, Split.io
5. **Approval Workflows**: Integration with Slack, Microsoft Teams

This CMS model provides marketing teams with powerful configuration capabilities while maintaining technical flexibility and performance.
