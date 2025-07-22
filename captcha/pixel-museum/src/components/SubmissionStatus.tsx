'use client';

import React from 'react';
import { CheckCircle, Clock, Trophy, Calendar } from 'lucide-react';

interface SubmissionStatusProps {
  status: 'success' | 'already-submitted';
  artworkTitle?: string;
  onCreateAnother?: () => void;
}

export default function SubmissionStatus({ 
  status, 
  artworkTitle,
  onCreateAnother 
}: SubmissionStatusProps) {
  const getTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen gallery-gradient flex items-center justify-center p-6">
        <div className="max-w-3xl w-full gallery-card rounded-3xl p-16 text-center">
          {/* Success Icon */}
          <div className="relative mb-12">
            <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mx-auto shadow-lg animate-float">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-gallery-gold rounded-full flex items-center justify-center animate-pulse">
              ✨
            </div>
          </div>

          {/* Success Message */}
          <h1 className="gallery-title text-5xl text-gallery-charcoal mb-6 animate-slide-up">
            Submission Complete
          </h1>
          
          {artworkTitle && (
            <p className="gallery-subtitle text-2xl text-gallery-dark/80 mb-8 animate-slide-up">
              "<span className="text-gallery-charcoal font-medium">{artworkTitle}</span>" is now competing for today's crown
            </p>
          )}

          {/* Competition Info */}
          <div className="bg-gallery-accent/5 border border-gallery-accent/20 rounded-2xl p-8 mb-12">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="h-6 w-6 text-gallery-gold mr-3" />
              <h3 className="gallery-label text-gallery-charcoal">Competition Entry</h3>
            </div>
            <p className="gallery-body text-gallery-dark/70 mb-6">
              Your artwork has been successfully entered into today's competition. 
              The community will vote on their favorites throughout the day.
            </p>
            <div className="flex items-center justify-center text-sm text-gallery-dark/60">
              <Clock className="h-4 w-4 mr-2" />
              <span>Competition resets in {getTimeUntilMidnight()}</span>
            </div>
          </div>

          {/* Next Steps */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <a
              href="/today"
              className="inline-flex items-center px-8 py-4 bg-gallery-charcoal text-gallery-white rounded-2xl hover:bg-gallery-black transition-all duration-300 font-medium shadow-lg hover:scale-105"
            >
              <Trophy className="h-5 w-5 mr-3" />
              View Competition
            </a>
            
            <a
              href="/"
              className="inline-flex items-center px-8 py-4 bg-gallery-light text-gallery-charcoal rounded-2xl hover:bg-gallery-mid transition-all duration-300 font-medium"
            >
              🏛️ Visit Gallery
            </a>
          </div>

          {/* Daily Limit Notice */}
          <div className="bg-gallery-gold/10 border border-gallery-gold/30 rounded-2xl p-6">
            <p className="gallery-body text-gallery-dark/70">
              <strong className="text-gallery-charcoal">Daily Competition:</strong> Each artist may submit one masterpiece per day. 
              Return tomorrow to share your next creation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Already submitted state
  return (
    <div className="min-h-screen gallery-gradient flex items-center justify-center p-6">
      <div className="max-w-3xl w-full gallery-card rounded-3xl p-16 text-center">
        {/* Clock Icon */}
        <div className="relative mb-12">
          <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Clock className="h-16 w-16 text-orange-500" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-gallery-gold rounded-full flex items-center justify-center">
            📅
          </div>
        </div>

        {/* Already Submitted Message */}
        <h1 className="gallery-title text-5xl text-gallery-charcoal mb-6">
          Daily Limit Reached
        </h1>
        
        <p className="gallery-subtitle text-2xl text-gallery-dark/80 mb-12">
          You've submitted your masterpiece for today's competition. Each artist may contribute one piece per day to maintain our gallery's exclusivity.
        </p>

        {/* Time Until Reset */}
        <div className="bg-orange-50/50 border border-orange-200/50 rounded-2xl p-8 mb-12">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="h-6 w-6 text-orange-600 mr-3" />
            <h3 className="gallery-label text-orange-800">Next Submission Window</h3>
          </div>
          <p className="gallery-body text-gallery-dark/70 mb-4">
            Your next opportunity to submit opens in:
          </p>
          <div className="text-3xl font-bold text-orange-600">
            {getTimeUntilMidnight()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          <a
            href="/today"
            className="inline-flex items-center px-8 py-4 bg-gallery-charcoal text-gallery-white rounded-2xl hover:bg-gallery-black transition-all duration-300 font-medium shadow-lg hover:scale-105"
          >
            <Trophy className="h-5 w-5 mr-3" />
            Vote on Today's Art
          </a>
          
          <a
            href="/"
            className="inline-flex items-center px-8 py-4 bg-gallery-light text-gallery-charcoal rounded-2xl hover:bg-gallery-mid transition-all duration-300 font-medium"
          >
            🏛️ Browse Gallery
          </a>
        </div>

        {/* Artist Quote */}
        <div className="bg-green-50/50 border border-green-200/50 rounded-2xl p-6">
          <p className="gallery-body text-green-800 italic">
            "Art is not what you see, but what you make others see. Every pixel carries the weight of possibility, 
            and tomorrow's canvas awaits your vision."
          </p>
          <p className="gallery-label text-green-700 mt-2 text-right">— Claude Monet-Pierre (probably)</p>
        </div>
      </div>
    </div>
  );
} 