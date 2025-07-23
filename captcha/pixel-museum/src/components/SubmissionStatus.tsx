'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Trophy, Calendar } from 'lucide-react';
import type { GalleryArtwork } from '@/lib/firestore';

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
  const [randomArtwork, setRandomArtwork] = useState<GalleryArtwork | null>(null);
  const [artworkLoading, setArtworkLoading] = useState(false);

  const getTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    if (status === 'already-submitted') {
      const fetchRandomArtwork = async () => {
        try {
          setArtworkLoading(true);
          const response = await fetch('/api/artworks?type=gallery&limit=50');
          const data = await response.json();
          
          if (data.success && data.artworks.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.artworks.length);
            setRandomArtwork(data.artworks[randomIndex]);
          }
        } catch (error) {
          console.error('Error fetching random artwork:', error);
        } finally {
          setArtworkLoading(false);
        }
      };

      fetchRandomArtwork();
    }
  }, [status]);

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-light text-gray-800 mb-4">
            Submitted
          </h1>
          
          {artworkTitle && (
            <p className="text-gray-700 mb-8">
              "{artworkTitle}" is now in the competition
            </p>
          )}

          <p className="text-gray-600 mb-8">
            Resets in {getTimeUntilMidnight()}
          </p>

          <div className="space-y-2">
            <a
              href="/today"
              className="block bg-black text-white px-4 py-2 hover:bg-gray-800"
            >
              View Competition
            </a>
            
            <a
              href="/"
              className="block border border-gray-300 px-4 py-2 hover:border-gray-500"
            >
              Back to Gallery
            </a>
          </div>

          <p className="text-xs text-gray-500 mt-8">
            One submission per day.
          </p>
        </div>
      </div>
    );
  }

  // Already submitted state
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-light text-gray-800 mb-4">
          Already Submitted
        </h1>
        
        <p className="text-gray-700 mb-8">
          You've submitted today. Come back tomorrow.
        </p>

        {/* Random Artwork Display */}
        {artworkLoading ? (
          <div className="mb-8">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : randomArtwork ? (
          <div className="mb-8">
            <div className="shadow-md mb-4 inline-block">
              <div className="h-48 w-48 flex items-center justify-center p-6 mx-auto">
                <img
                  src={randomArtwork.artwork}
                  alt={randomArtwork.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-medium">{randomArtwork.title}</p>
              <p>by {randomArtwork.author}</p>
            </div>
          </div>
        ) : null}

        <p className="text-gray-600 mb-8">
          Next submission in {getTimeUntilMidnight()}
        </p>

        <div className="space-y-2">
          <a
            href="/today"
            className="block bg-black text-white px-4 py-2 hover:bg-gray-800"
          >
            Vote on Today's Art
          </a>
          
          <a
            href="/"
            className="block border border-gray-300 px-4 py-2 hover:border-gray-500"
          >
            Back to Gallery
          </a>
        </div>
      </div>
    </div>
  );
} 