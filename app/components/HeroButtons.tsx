'use client';

import React from 'react';

export function HeroButtons() {
  const handleTrialClick = () => {
    alert('🚀 Start Free Trial\n\nThanks for your interest in Drata! In a real implementation, this would:\n• Start a free trial signup process\n• Create your account\n• Set up your first compliance framework\n\nFor now, try the AI assistant below to learn more about Drata!');
  };

  const handlePricingClick = () => {
    alert('💰 View Pricing\n\nIn a production app, this would show:\n• Detailed pricing tiers\n• Feature comparisons\n• ROI calculator\n• Custom enterprise quotes\n\nTry asking the AI assistant "Is there a startup plan?" for pricing info!');
  };

  return (
    <div className="flex gap-4 items-center justify-center flex-col sm:flex-row mb-12">
      <button
        className="rounded-lg bg-blue-600 text-white font-semibold px-8 py-4 hover:bg-blue-700 transition-colors text-lg shadow-lg hover:shadow-xl"
        onClick={handleTrialClick}
      >
        Start Free Trial
      </button>
      <button
        className="rounded-lg border-2 border-gray-300 text-gray-700 font-semibold px-8 py-4 hover:bg-gray-50 transition-colors text-lg"
        onClick={handlePricingClick}
      >
        View Pricing
      </button>
    </div>
  );
}
