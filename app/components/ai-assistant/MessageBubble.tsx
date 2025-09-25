'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { AssistantMessage } from '@/lib/types';
import { User, Bot } from 'lucide-react';

interface MessageBubbleProps {
  message: AssistantMessage;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <div
      className={cn(
        'flex w-full gap-3 px-4 py-3',
        isUser ? 'justify-end' : 'justify-start'
      )}
      role="article"
      aria-label={`${isUser ? 'User' : 'Assistant'} message`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" aria-hidden="true" />
        </div>
      )}
      
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-3 text-sm',
          isUser
            ? 'bg-blue-600 text-white ml-auto'
            : 'bg-gray-100 text-gray-900 border'
        )}
      >
        <div className="prose prose-sm max-w-none">
          {isStreaming ? (
            <div className="flex items-center gap-2">
              <span>{message.content}</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          ) : (
            <div 
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ 
                __html: formatMessageContent(message.content) 
              }}
            />
          )}
        </div>
        
        {message.timestamp && (
          <div className={cn(
            'text-xs mt-2 opacity-70',
            isUser ? 'text-blue-100' : 'text-gray-500'
          )}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

// Helper function to format message content with citations
function formatMessageContent(content: string): string {
  // Replace citation markers [1], [2], etc. with styled spans
  return content.replace(
    /\[(\d+)\]/g,
    '<span class="inline-flex items-center px-1.5 py-0.5 mx-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200 cursor-pointer hover:bg-blue-200 transition-colors" data-citation="$1" role="button" tabindex="0" aria-label="Citation $1">[$1]</span>'
  );
}
