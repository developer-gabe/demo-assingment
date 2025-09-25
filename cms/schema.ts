import { z } from 'zod';

// CMS Content Model Schema
export const CtaSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const ThemeSchema = z.object({
  tone: z.enum(['brand', 'neutral']),
  accentHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const AiAssistantModuleSchema = z.object({
  enabled: z.boolean(),
  variant: z.enum(['inline', 'floating', 'drawer']),
  title: z.string(),
  intro: z.string(),
  placeholder: z.string(),
  suggestedPrompts: z.array(z.string()),
  primaryCta: CtaSchema,
  secondaryCtas: z.array(CtaSchema),
  theme: ThemeSchema,
  position: z.enum(['heroTop', 'heroBottom', 'contentBlockId']),
  rateLimitPerMinute: z.number().positive(),
  allowedCountries: z.array(z.string()).optional(),
  disclaimer: z.string(),
});

export const HomepageModuleSchema = z.object({
  type: z.literal('AiAssistantModule'),
  data: AiAssistantModuleSchema,
});

export const HomepageSchema = z.object({
  modules: z.array(HomepageModuleSchema),
});

export const CmsConfigSchema = z.object({
  AiAssistantModule: AiAssistantModuleSchema,
});

// Type exports
export type Cta = z.infer<typeof CtaSchema>;
export type Theme = z.infer<typeof ThemeSchema>;
export type AiAssistantModule = z.infer<typeof AiAssistantModuleSchema>;
export type HomepageModule = z.infer<typeof HomepageModuleSchema>;
export type Homepage = z.infer<typeof HomepageSchema>;
export type CmsConfig = z.infer<typeof CmsConfigSchema>;
