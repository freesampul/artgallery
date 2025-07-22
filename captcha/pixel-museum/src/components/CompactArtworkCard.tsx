'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, User } from 'lucide-react';
import type { Artwork } from '@/lib/firestore';

interface CompactArtworkCardProps {
  artwork: Artwork;
  onVoteUpdate?: (artworkId: string, newVoteCount: number) => void;
  rank?: number;
}

export default function CompactArtworkCard({ artwork, onVoteUpdate, rank }: CompactArtworkCardProps) {
  const router = useRouter();
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [currentVotes, setCurrentVotes] = useState(artwork.votes);

  // Check if user has already voted when component mounts
  useEffect(() => {
    const checkVoteStatus = async () => {
      try {
        const response = await fetch(`/api/vote?artworkId=${artwork.id}`);
        const data = await response.json();
        if (data.success) {
          setHasVoted(data.hasVoted);
        }
      } catch (error) {
        console.error('Error checking vote status:', error);
      }
    };

    if (artwork.id) {
      checkVoteStatus();
    }
  }, [artwork.id]);

  const handleVote = async () => {
    if (!artwork.id || hasVoted || isVoting) return;

    setIsVoting(true);

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artworkId: artwork.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setHasVoted(true);
        const newVoteCount = currentVotes + 1;
        setCurrentVotes(newVoteCount);
        onVoteUpdate?.(artwork.id, newVoteCount);
      } else {
        if (data.error.includes('already voted')) {
          setHasVoted(true);
        } else {
          alert(`❌ ${data.error}`);
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('❌ Failed to cast vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if user clicked on a button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    router.push(`/artwork/${artwork.id}`);
  };

  return (
    <div 
      className="group cursor-pointer relative"
      onClick={handleCardClick}
    >
      {rank && rank <= 3 && (
        <div className="absolute -top-1 -left-1 bg-gallery-gold text-gallery-charcoal rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold z-10 shadow-lg">
          {rank}
        </div>
      )}
      
      {/* Compact flat artwork */}
      <div className="relative">
        <div className="w-64 h-64 bg-gallery-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <img
            src={artwork.artwork}
            alt={artwork.title}
            className="w-full h-full object-contain p-4"
          />
        </div>
      </div>

      {/* Compact artwork info */}
      <div className="mt-3 space-y-1 max-w-64">
        {/* Title - truncated */}
        <h3 className="gallery-title text-sm font-bold text-gallery-charcoal truncate text-center" title={artwork.title}>
          {artwork.title}
        </h3>

        {/* Author - truncated */}
        <div className="flex items-center justify-center text-gallery-dark/60 mb-2">
          <User className="h-2 w-2 mr-1" />
          <span className="text-xs truncate" title={artwork.author}>{artwork.author}</span>
        </div>

        {/* Vote section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gallery-dark">
            <Heart className={`h-3 w-3 mr-1 transition-colors duration-200 ${hasVoted ? 'fill-red-500 text-red-500' : 'text-gallery-accent'}`} />
            <span className="text-xs font-medium">{currentVotes}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleVote();
            }}
            disabled={hasVoted || isVoting}
            className={`px-1 py-0.5 rounded text-xs font-medium transition-colors duration-200 ${
              hasVoted
                ? 'bg-gallery-light text-gallery-dark/60 cursor-not-allowed'
                : isVoting
                ? 'bg-gallery-mid text-gallery-dark/60 cursor-not-allowed'
                : 'bg-gallery-accent text-white hover:bg-gallery-accent-dark'
            }`}
          >
            {isVoting ? '...' : hasVoted ? '✓' : '♡'}
          </button>
        </div>
      </div>
    </div>
  );
} 