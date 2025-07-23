'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ArtworkCard from '@/components/ArtworkCard';
import GalleryCard from '@/components/GalleryCard';
import VisitorTracker from '@/components/VisitorTracker';
import { Trophy, Palette } from 'lucide-react';
import type { Artwork, GalleryArtwork } from '@/lib/firestore';

export default function Home() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [galleryArtworks, setGalleryArtworks] = useState<GalleryArtwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/artworks?type=top&limit=6');
        const data = await response.json();
        
        if (data.success) {
          setArtworks(data.artworks);
        } else {
          setError(data.error || 'Failed to fetch artworks');
        }
      } catch (err) {
        console.error('Error fetching artworks:', err);
        setError('Failed to load artworks');
      } finally {
        setLoading(false);
      }
    };

    const fetchGalleryArtworks = async () => {
      try {
        setGalleryLoading(true);
        const response = await fetch('/api/artworks?type=gallery&limit=6');
        const data = await response.json();
        
        if (data.success) {
          setGalleryArtworks(data.artworks);
        }
      } catch (err) {
        console.error('Error fetching gallery artworks:', err);
      } finally {
        setGalleryLoading(false);
      }
    };

    fetchArtworks();
    fetchGalleryArtworks();
  }, []);

  const handleVoteUpdate = (artworkId: string, newVoteCount: number) => {
    setArtworks(prev =>
      prev.map(artwork =>
        artwork.id === artworkId
          ? { ...artwork, votes: newVoteCount }
          : artwork
      )
    );
  };

  return (
    <div className="min-h-screen gallery-gradient">
      <VisitorTracker showCount={false} />
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center mb-20 animate-fade-in">
          <div className="space-y-6">
            <div className="relative mb-12">
              <div className="flex items-baseline justify-center space-x-6">
                <h1 className="gallery-title text-6xl lg:text-8xl font-light tracking-wide text-gallery-charcoal/90 leading-none">
                  digital
                </h1>
                <h1 className="gallery-title text-6xl lg:text-8xl font-extralight italic text-gallery-charcoal/70 tracking-wider leading-none">
                  junk
                </h1>
              </div>
            </div>
              <div className="gallery-label text-gallery-dark/60">
              One person's trash is another's treasure.
            </div>
          </div>
        </div>

        {/* Daily Winners Gallery */}
        <div className="animate-fade-in mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-12 h-0.5 bg-gallery-gold"></div>
              <h2 className="gallery-title text-4xl text-gallery-charcoal">
                The Vault
              </h2>
              <div className="w-12 h-0.5 bg-gallery-gold"></div>
            </div>
            <p className="gallery-subtitle text-lg text-gallery-dark/70">
              The finest treasures salvaged from the pit
            </p>
          </div>

          {galleryLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="gallery-card rounded-3xl p-8 animate-pulse">
                  <div className="h-80 bg-gallery-mid rounded-2xl mb-6"></div>
                  <div className="h-6 bg-gallery-mid rounded mb-4"></div>
                  <div className="h-4 bg-gallery-mid rounded mb-4 w-3/4"></div>
                  <div className="h-10 bg-gallery-mid rounded"></div>
                </div>
              ))}
            </div>
          ) : galleryArtworks.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gallery-light rounded-full mb-8">
                <Trophy className="h-12 w-12 text-gallery-dark/40" />
              </div>
              <h3 className="gallery-title text-3xl text-gallery-charcoal mb-4">
                Awaiting Our First Treasure
              </h3>
              <p className="gallery-subtitle text-lg text-gallery-dark/70 mb-12 max-w-md mx-auto">
                The first daily winner will be preserved in the vault forever.
              </p>
              <a
                href="/today"
                className="inline-flex items-center px-8 py-4 bg-gallery-charcoal text-gallery-white rounded-xl hover:bg-gallery-black transition-all duration-300 font-medium shadow-lg hover:scale-105"
              >
                <Trophy className="h-5 w-5 mr-2" />
                Vote Today
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {galleryArtworks.map((artwork) => (
                <GalleryCard
                  key={artwork.id}
                  artwork={artwork}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Submissions */}
        <div className="animate-fade-in">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-12 h-0.5 bg-gallery-accent"></div>
              <h2 className="gallery-title text-4xl text-gallery-charcoal">
                Fresh Junk
              </h2>
              <div className="w-12 h-0.5 bg-gallery-accent"></div>
            </div>
            <p className="gallery-subtitle text-lg text-gallery-dark/70">
              Latest additions to the pile
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="gallery-card rounded-3xl p-8 animate-pulse">
                  <div className="aspect-square bg-gallery-mid rounded-2xl mb-6"></div>
                  <div className="h-6 bg-gallery-mid rounded mb-4"></div>
                  <div className="h-4 bg-gallery-mid rounded mb-4 w-3/4"></div>
                  <div className="h-10 bg-gallery-mid rounded"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-red-50 rounded-full mb-8">
                <div className="text-red-500 text-3xl">⚠</div>
              </div>
              <h3 className="gallery-title text-2xl text-gallery-charcoal mb-4">
                Unable to Load Junk
              </h3>
              <p className="gallery-subtitle text-gallery-dark/70 mb-8">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-8 py-4 bg-gallery-charcoal text-gallery-white rounded-xl hover:bg-gallery-black transition-all duration-300 font-medium shadow-lg hover:scale-105"
              >
                Try Again
              </button>
            </div>
          ) : artworks.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gallery-light rounded-full mb-8 animate-float">
                <Palette className="h-12 w-12 text-gallery-dark/40" />
              </div>
              <h3 className="gallery-title text-3xl text-gallery-charcoal mb-4">
                Your Junk Awaits
              </h3>
              <p className="gallery-subtitle text-lg text-gallery-dark/70 mb-12 max-w-md mx-auto">
                Be the first to dump something beautiful into our digital chaos. 
                Create something extraordinary.
              </p>
              <a href="/submission" className="inline-flex items-center px-8 py-4 bg-gallery-charcoal text-gallery-white rounded-xl hover:bg-gallery-black transition-all duration-300 font-medium shadow-lg hover:scale-105">
                <Palette className="h-5 w-5 mr-2" />
                Start Creating
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {artworks.map((artwork) => (
                <ArtworkCard
                  key={artwork.id}
                  artwork={artwork}
                  onVoteUpdate={handleVoteUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 