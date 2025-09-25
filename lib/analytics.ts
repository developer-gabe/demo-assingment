import { AnalyticsEvent } from './types';

export class AnalyticsTracker {
  private events: AnalyticsEvent[] = [];

  track(event: string, properties: Record<string, any> = {}): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      },
      timestamp: new Date(),
    };

    this.events.push(analyticsEvent);
    
    // Console logging for development
    console.log('Analytics Event:', analyticsEvent);
    
    // Send to dataLayer for Google Analytics/Tag Manager
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: analyticsEvent.event,
        ...analyticsEvent.properties,
      });
    }
    
    // Send to external analytics service (e.g., Segment, Mixpanel)
    this.sendToExternalService(analyticsEvent);
  }

  private sendToExternalService(event: AnalyticsEvent): void {
    // Stub for external analytics service
    // In production, this would send to Segment, Mixpanel, etc.
    if (process.env.NODE_ENV === 'development') {
      return;
    }
    
    // Example: Send to Segment
    // analytics.track(event.event, event.properties);
  }

  // Get events for debugging/testing
  getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  // Clear events (useful for testing)
  clearEvents(): void {
    this.events = [];
  }
}

// Global analytics instance
export const analytics = new AnalyticsTracker();

// Convenience functions for common events
export const trackAssistantInteraction = (action: string, properties: Record<string, any> = {}) => {
  analytics.track('assistant_interaction', {
    action,
    ...properties,
  });
};

export const trackAssistantResponse = (query: string, responseTime: number, citationCount: number) => {
  analytics.track('assistant_response', {
    query_length: query.length,
    response_time_ms: responseTime,
    citation_count: citationCount,
    query_hash: hashString(query), // Don't store actual query for privacy
  });
};

export const trackCtaClick = (ctaLabel: string, ctaHref: string, context: string = 'assistant') => {
  analytics.track('cta_click', {
    cta_label: ctaLabel,
    cta_href: ctaHref,
    context,
  });
};

export const trackAssistantToggle = (action: 'open' | 'close' | 'dismiss', variant: string) => {
  analytics.track('assistant_toggle', {
    action,
    variant,
  });
};

export const trackFollowUpClick = (followUpText: string, originalQuery: string) => {
  analytics.track('followup_click', {
    followup_text: followUpText,
    original_query_hash: hashString(originalQuery),
  });
};

// Simple hash function for privacy
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}
