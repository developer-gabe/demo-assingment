'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Chat } from './Chat';
import { CtaBar } from './CtaBar';
import { AiAssistantModule } from '@/cms/schema';
import { trackAssistantToggle } from '@/lib/analytics';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssistantProps {
  config: AiAssistantModule;
  className?: string;
}

export function Assistant({ config, className }: AssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't render if disabled or dismissed
  if (!config.enabled || isDismissed) {
    return null;
  }

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    setIsMinimized(false); // Reset minimize state when toggling
    trackAssistantToggle(newState ? 'open' : 'close', config.variant);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsOpen(false);
    trackAssistantToggle('dismiss', config.variant);
  };

  // Render different variants
  switch (config.variant) {
    case 'floating':
      return <FloatingAssistant {...{ config, isOpen, onToggle: handleToggle, onDismiss: handleDismiss, className }} />;
    
    case 'drawer':
      return <DrawerAssistant {...{ config, isOpen, onToggle: handleToggle, onDismiss: handleDismiss, className }} />;
    
    case 'inline':
    default:
      return <InlineAssistant {...{ config, onDismiss: handleDismiss, className }} />;
  }
}

// Floating launcher variant
function FloatingAssistant({ 
  config, 
  isOpen, 
  onToggle, 
  onDismiss, 
  className 
}: {
  config: AiAssistantModule;
  isOpen: boolean;
  onToggle: () => void;
  onDismiss: () => void;
  className?: string;
}) {
  return (
    <>
      {/* Floating button */}
      <div className={cn('fixed bottom-6 right-6 z-50', className)}>
        <Button
          onClick={onToggle}
          size="lg"
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>

      {/* Dialog */}
      <Dialog open={isOpen} onOpenChange={onToggle}>
        <DialogContent className="sm:max-w-2xl h-[600px] max-h-[90vh] p-0 gap-0 flex flex-col">
          <DialogHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                {config.title}
              </DialogTitle>
              <Button
                onClick={onDismiss}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
                aria-label="Dismiss assistant"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">{config.intro}</p>
          </DialogHeader>
          
          <div className="flex-1 flex flex-col">
            <Chat
              placeholder={config.placeholder}
              suggestedPrompts={config.suggestedPrompts}
              className="flex-1"
            />
            <CtaBar
              primaryCta={config.primaryCta}
              secondaryCtas={config.secondaryCtas}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Drawer variant (slides in from right)
function DrawerAssistant({
  config,
  isOpen,
  onToggle,
  onDismiss,
  className
}: {
  config: AiAssistantModule;
  isOpen: boolean;
  onToggle: () => void;
  onDismiss: () => void;
  className?: string;
}) {
  return (
    <>
      {/* Trigger button */}
      <div className={cn('fixed bottom-6 right-6 z-50', className)}>
        <Button
          onClick={onToggle}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          {config.title}
        </Button>
      </div>

      {/* Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={onToggle}
            aria-hidden="true"
          />
          
          {/* Drawer content */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{config.title}</h2>
                  <p className="text-sm text-gray-600">{config.intro}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  onClick={onDismiss}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Dismiss assistant"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col">
              <Chat
                placeholder={config.placeholder}
                suggestedPrompts={config.suggestedPrompts}
                className="flex-1"
              />
              <CtaBar
                primaryCta={config.primaryCta}
                secondaryCtas={config.secondaryCtas}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

// Inline variant (embedded in page)
function InlineAssistant({
  config,
  onDismiss,
  className
}: {
  config: AiAssistantModule;
  onDismiss: () => void;
  className?: string;
}) {
  return (
    <div className={cn('w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg border', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{config.title}</h2>
            <p className="text-gray-600">{config.intro}</p>
          </div>
        </div>
        <Button
          onClick={onDismiss}
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700"
          aria-label="Dismiss assistant"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Chat area */}
      <div className="h-96 flex flex-col overflow-hidden">
        <Chat
          placeholder={config.placeholder}
          suggestedPrompts={config.suggestedPrompts}
          className="flex-1"
        />
        <CtaBar
          primaryCta={config.primaryCta}
          secondaryCtas={config.secondaryCtas}
        />
      </div>
    </div>
  );
}
