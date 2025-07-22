'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, User } from 'lucide-react';
import type { Artwork } from '@/lib/firestore';

interface ArtworkCardProps {
  artwork: Artwork;
  onVoteUpdate?: (artworkId: string, newVoteCount: number) => void;
}

export default function ArtworkCard({ artwork, onVoteUpdate }: ArtworkCardProps) {
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
      className="group cursor-pointer max-w-64"
      onClick={handleCardClick}
    >
      {/* Flat artwork image */}
      <div className="relative">
        <div className="w-64 h-64 bg-gallery-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <img
            src={artwork.artwork}
            alt={artwork.title}
            className="w-full h-full object-contain p-4"
          />
        </div>
      </div>

      {/* Artwork info */}
      <div className="mt-4 space-y-2">
        <h3 className="gallery-title text-lg font-bold text-gallery-charcoal leading-tight" title={artwork.title}>
          {artwork.title}
        </h3>
        
        <p className="gallery-body text-gallery-dark/80 text-sm" title={artwork.author}>
          {artwork.author}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gallery-dark text-sm">
            <Heart className={`h-4 w-4 mr-1 transition-colors duration-200 ${hasVoted ? 'fill-red-500 text-red-500' : 'text-gallery-accent'}`} />
            <span className="gallery-body font-medium">{currentVotes} votes</span>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleVote();
            }}
            disabled={isVoting || hasVoted}
            className={`
              flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105
              ${hasVoted 
                ? 'bg-gallery-light text-gallery-dark cursor-not-allowed' 
                : isVoting
                ? 'bg-gallery-mid text-gallery-dark/60 cursor-not-allowed'
                : 'bg-gallery-accent text-white hover:bg-gallery-accent-dark shadow-sm'
              }
            `}
          >
            <Heart className="h-3 w-3 mr-1" fill={hasVoted ? 'currentColor' : 'none'} />
            {isVoting ? 'Voting...' : hasVoted ? 'Voted' : 'Vote'}
          </button>
        </div>
        
        <p className="gallery-label text-gallery-dark/50 text-xs">
          {artwork.submissionDate}
        </p>
      </div>
    </div>
  );
} 