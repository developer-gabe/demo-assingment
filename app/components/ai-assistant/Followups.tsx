'use client';

import React from 'react';
import { Button } from '../ui/button';
import { trackFollowUpClick } from '@/lib/analytics';
import { MessageCircle, ChevronRight } from 'lucide-react';

interface FollowupsProps {
  followUps: string[];
  onFollowUpClick: (followUp: string) => void;
  originalQuery?: string;
  className?: string;
}

export function Followups({ 
  followUps, 
  onFollowUpClick, 
  originalQuery = '', 
  className 
}: FollowupsProps) {
  if (followUps.length === 0) return null;

  const handleFollowUpClick = (followUp: string) => {
    trackFollowUpClick(followUp, originalQuery);
    onFollowUpClick(followUp);
  };

  return (
    <div 
      className={`mt-4 ${className}`}
      role="complementary"
      aria-label="Suggested follow-up questions"
    >
      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
        <MessageCircle className="w-4 h-4" aria-hidden="true" />
        Ask more about:
      </h3>
      
      <div className="space-y-2">
        {followUps.map((followUp, index) => (
          <Button
            key={index}
            onClick={() => handleFollowUpClick(followUp)}
            variant="ghost"
            className="w-full justify-between text-left h-auto p-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-300 rounded-lg transition-colors"
            aria-label={`Ask: ${followUp}`}
          >
            <span className="text-left flex-1">{followUp}</span>
            <ChevronRight className="w-4 h-4 flex-shrink-0 ml-2" aria-hidden="true" />
          </Button>
        ))}
      </div>
    </div>
  );
}
