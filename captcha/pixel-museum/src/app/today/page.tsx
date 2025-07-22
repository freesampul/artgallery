'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ArtworkCard from '@/components/ArtworkCard';
import CompactArtworkCard from '@/components/CompactArtworkCard';
import CountdownTimer from '@/components/CountdownTimer';
import type { Artwork } from '@/lib/firestore';
import { Calendar, Trophy } from 'lucide-react';

export default function TodaysArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodaysArtworks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/artworks?type=today');
        const data = await response.json();
        
        if (data.success) {
          setArtworks(data.artworks);
        } else {
          setError(data.error || 'Failed to fetch today\'s artworks');
        }
      } catch (err) {
        console.error('Error fetching artworks:', err);
        setError('Failed to load today\'s artworks');
      } finally {
        setLoading(false);
      }
    };

    fetchTodaysArtworks();
  }, []);

  const handleVoteUpdate = (artworkId: string, newVoteCount: number) => {
    setArtworks(prev =>
      prev.map(artwork =>
        artwork.id === artworkId
          ? { ...artwork, votes: newVoteCount }
          : artwork
      ).sort((a, b) => b.votes - a.votes) // Re-sort by votes
    );
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen gallery-gradient">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center space-x-4 mb-6">
            <Calendar className="h-8 w-8 text-gallery-accent" />
            <h1 className="gallery-title text-5xl lg:text-6xl text-gallery-charcoal">
              Today's Competition
            </h1>
          </div>
          
          {/* Small countdown timer under title */}
          <div className="mb-6">
            <CountdownTimer />
          </div>
          
          <p className="gallery-subtitle text-2xl text-gallery-dark/80 mb-4">
            {today}
          </p>
          
          <p className="gallery-body text-lg text-gallery-dark/70 max-w-3xl mx-auto leading-relaxed mb-8">
            Cast your vote for today's most exceptional pixel art. The winning piece will be permanently 
            archived in our Hall of Fame at midnight Eastern Time.
          </p>
          
          {artworks.length > 0 && (
            <div className="inline-flex items-center px-8 py-4 bg-gallery-gold/10 border border-gallery-gold/30 rounded-2xl shadow-lg">
              <Trophy className="h-5 w-5 mr-3 text-gallery-gold" />
              <span className="gallery-body text-gallery-charcoal">
                <strong>{artworks[0]?.title}</strong> by <strong>{artworks[0]?.author}</strong> leads with <strong>{artworks[0]?.votes}</strong> votes
              </span>
            </div>
          )}
        </div>

        <div>
        </div>

        {/* Today's Artworks */}
        <div className="animate-fade-in">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2 w-2/3"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-3 bg-gray-200 rounded w-8"></div>
                      <div className="h-6 bg-gray-200 rounded w-8"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-lg mb-4">❌ {error}</div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-pixel-500 text-white rounded-xl hover:bg-pixel-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : artworks.length === 0 ? (
            <div className="text-center py-12 max-w-md mx-auto">
              <div className="text-6xl mb-6">🎨</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No submissions yet today!
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Be the first to submit your pixel art for today's competition.
              </p>
              <a
                href="/submission"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pixel-500 to-museum-500 text-white rounded-xl hover:scale-105 transition-all font-medium shadow-lg"
              >
                ✨ Submit Your Art
              </a>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Winner/Leader section if there are votes */}
              {artworks[0]?.votes > 0 && (
                <div className="bg-gallery-gold/5 border border-gallery-gold/20 rounded-3xl p-12 mb-16 animate-fade-in">
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gallery-gold/20 rounded-full mb-6">
                      <Trophy className="h-10 w-10 text-gallery-gold" />
                    </div>
                    <h2 className="gallery-title text-4xl text-gallery-charcoal mb-4">
                      Current Leader
                    </h2>
                    <p className="gallery-subtitle text-lg text-gallery-dark/70">
                      Leading the competition with {artworks[0].votes} votes
                    </p>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="max-w-md">
                      <ArtworkCard
                        artwork={artworks[0]}
                        onVoteUpdate={handleVoteUpdate}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* All artworks grid - Compact */}
              <div>
                <div className="text-center mb-12">
                  <div className="inline-flex items-center space-x-3 mb-6">
                    <div className="w-12 h-0.5 bg-gallery-accent"></div>
                    <h2 className="gallery-title text-4xl text-gallery-charcoal">
                      All Submissions
                    </h2>
                    <div className="w-12 h-0.5 bg-gallery-accent"></div>
                  </div>
                  <p className="gallery-label text-gallery-dark/60">
                    {artworks.length} {artworks.length === 1 ? 'entry' : 'entries'} competing today
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                  {artworks.map((artwork, index) => (
                    <CompactArtworkCard
                      key={artwork.id}
                      artwork={artwork}
                      onVoteUpdate={handleVoteUpdate}
                      rank={index + 1}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 