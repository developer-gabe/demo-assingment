'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { Button } from '../ui/button';
import { MessageBubble } from './MessageBubble';
import { Citations } from './Citations';
import { Followups } from './Followups';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Citation, AssistantMessage } from '@/lib/types';
import { trackAssistantInteraction } from '@/lib/analytics';

interface ChatProps {
  placeholder: string;
  suggestedPrompts: string[];
  className?: string;
}

export function Chat({ placeholder, suggestedPrompts, className }: ChatProps) {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
  } = useChat({
    api: '/api/assistant',
    onResponse: (response: Response) => {
      setError(null);
      
      // Extract citations and follow-ups from response headers
      const citationsHeader = response.headers.get('X-Citations');
      const followUpsHeader = response.headers.get('X-Follow-Ups');
      
      if (citationsHeader) {
        try {
          setCitations(JSON.parse(citationsHeader));
        } catch (e) {
          console.warn('Failed to parse citations:', e);
        }
      }
      
      if (followUpsHeader) {
        try {
          setFollowUps(JSON.parse(followUpsHeader));
        } catch (e) {
          console.warn('Failed to parse follow-ups:', e);
        }
      }
    },
    onError: (error: Error) => {
      console.error('Chat error:', error);
      setError('Sorry, something went wrong. Please try again.');
      trackAssistantInteraction('error', { error: error.message });
    },
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSuggestedPromptClick = (prompt: string) => {
    setInput(prompt);
    trackAssistantInteraction('suggested_prompt_click', { prompt });
    // Auto-submit the suggested prompt
    setTimeout(() => {
      const form = inputRef.current?.form;
      if (form) {
        form.requestSubmit();
      }
    }, 100);
  };

  const handleFollowUpClick = (followUp: string) => {
    setInput(followUp);
    trackAssistantInteraction('followup_click', { followUp });
    // Auto-submit the follow-up
    setTimeout(() => {
      const form = inputRef.current?.form;
      if (form) {
        form.requestSubmit();
      }
    }, 100);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    trackAssistantInteraction('message_send', { 
      message_length: input.length,
      has_previous_messages: messages.length > 0
    });
    
    handleSubmit(e);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e as any);
    }
  };

  // Convert messages to our format
  const formattedMessages: AssistantMessage[] = messages.map((msg: any, index: number) => ({
    id: `${index}`,
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
    timestamp: new Date(),
  }));

  const showSuggestedPrompts = messages.length === 0;
  const lastMessage = messages[messages.length - 1];
  const showCitations = citations.length > 0 && lastMessage?.role === 'assistant';
  const showFollowUps = followUps.length > 0 && lastMessage?.role === 'assistant' && !isLoading;

  return (
    <div className={cn('flex flex-col h-full bg-white', className)}>
      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 chat-container" 
        role="log" 
        aria-label="Chat messages" 
        aria-live="polite"
      >
        {showSuggestedPrompts && (
          <div className="p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              How can I help you learn about Drata?
            </h3>
            <div className="grid gap-2 max-w-md mx-auto">
              {suggestedPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  onClick={() => handleSuggestedPromptClick(prompt)}
                  variant="outline"
                  className="text-left justify-start h-auto p-3 text-sm hover:bg-blue-50 hover:border-blue-300"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}

        {formattedMessages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isStreaming={isLoading && index === messages.length - 1}
          />
        ))}

        {showCitations && (
          <div className="px-4">
            <Citations citations={citations} />
          </div>
        )}

        {showFollowUps && (
          <div className="px-4">
            <Followups
              followUps={followUps}
              onFollowUpClick={handleFollowUpClick}
              originalQuery={lastMessage?.content}
            />
          </div>
        )}

        {error && (
          <div className="px-4 py-3 mx-4 my-2 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleFormSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isLoading}
              rows={1}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: '48px', maxHeight: '120px' }}
              aria-label="Ask a question about Drata"
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            size="lg"
            className="px-4 bg-blue-600 hover:bg-blue-700 text-white"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
