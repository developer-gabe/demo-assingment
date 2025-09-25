'use client';

import React from 'react';
import { Button } from '../ui/button';
import { Cta } from '@/cms/schema';
import { trackCtaClick } from '@/lib/analytics';
import { ArrowRight, Calendar } from 'lucide-react';

interface CtaBarProps {
  primaryCta: Cta;
  secondaryCtas: Cta[];
  className?: string;
}

export function CtaBar({ primaryCta, secondaryCtas, className }: CtaBarProps) {
  const handleCtaClick = (cta: Cta, isPrimary: boolean = false) => {
    trackCtaClick(cta.label, cta.href, 'assistant_cta_bar');
    
    // Demo mode - show alert instead of navigating
    if (cta.label.toLowerCase().includes('demo')) {
      alert('🚀 Demo Request\n\nThanks for your interest! In a real implementation, this would:\n• Open a demo booking form\n• Connect to your CRM\n• Schedule a meeting\n\nFor now, this is just a demo of the AI assistant functionality.');
    } else if (cta.label.toLowerCase().includes('pricing')) {
      alert('💰 Pricing Information\n\nIn a production app, this would show:\n• Detailed pricing tiers\n• Feature comparisons\n• Custom enterprise quotes\n\nThis is currently a demo environment.');
    } else if (cta.label.toLowerCase().includes('integration')) {
      alert('🔗 Integrations\n\nThis would typically show:\n• 100+ available integrations\n• Setup instructions\n• API documentation\n\nDemo mode active - no actual navigation.');
    } else {
      // Generic fallback for other CTAs
      alert(`📋 ${cta.label}\n\nIn a real implementation, this would navigate to:\n${cta.href}\n\nCurrently in demo mode to showcase the AI assistant.`);
    }
  };

  return (
    <div 
      className={`sticky bottom-0 bg-white border-t border-gray-200 p-4 ${className}`}
      role="complementary"
      aria-label="Call to action"
    >
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Primary CTA */}
        <Button
          onClick={() => handleCtaClick(primaryCta, true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          size="lg"
        >
          <Calendar className="w-4 h-4" aria-hidden="true" />
          {primaryCta.label}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Button>
        
        {/* Secondary CTAs */}
        {secondaryCtas.length > 0 && (
          <div className="flex gap-2 flex-1 justify-end">
            {secondaryCtas.slice(0, 2).map((cta, index) => (
              <Button
                key={index}
                onClick={() => handleCtaClick(cta)}
                variant="outline"
                className="text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                {cta.label}
              </Button>
            ))}
          </div>
        )}
      </div>
      
      {/* Optional disclaimer or additional info */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        Ready to automate your compliance? Our team is here to help.
      </div>
    </div>
  );
}
