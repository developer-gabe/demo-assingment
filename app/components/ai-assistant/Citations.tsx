'use client';

import React from 'react';
import { Citation } from '@/lib/types';
import { ExternalLink, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CitationsProps {
  citations: Citation[];
  onCitationClick?: (citation: Citation) => void;
}

export function Citations({ citations, onCitationClick }: CitationsProps) {
  if (citations.length === 0) return null;

  return (
    <div className="mt-4 border-t pt-4" role="complementary" aria-label="Sources and citations">
      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
        <FileText className="w-4 h-4" aria-hidden="true" />
        Sources ({citations.length})
      </h3>
      
      <div className="space-y-2">
        {citations.map((citation, index) => (
          <CitationCard
            key={citation.id}
            citation={citation}
            index={index + 1}
            onClick={onCitationClick}
          />
        ))}
      </div>
    </div>
  );
}

interface CitationCardProps {
  citation: Citation;
  index: number;
  onClick?: (citation: Citation) => void;
}

function CitationCard({ citation, index, onClick }: CitationCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(citation);
    } else {
      // Default behavior: open in new tab
      window.open(citation.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={cn(
        'group p-3 bg-gray-50 rounded-lg border border-gray-200',
        'hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer',
        'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2'
      )}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Citation ${index}: ${citation.title}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
          {index}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
              {citation.title}
            </h4>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" aria-hidden="true" />
          </div>
          
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {citation.snippet}
          </p>
          
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <span className="truncate">{new URL(citation.url).hostname}</span>
            {citation.score && (
              <span className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600">
                {Math.round(citation.score * 100)}% match
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
