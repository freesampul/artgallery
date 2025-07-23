'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, User, Calendar, Heart } from 'lucide-react';
import type { GalleryArtwork } from '@/lib/firestore';

interface GalleryCardProps {
  artwork: GalleryArtwork;
}

export default function GalleryCard({ artwork }: GalleryCardProps) {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    router.push(`/artwork/${artwork.id}`);
  };

  return (
    <div 
      className="group cursor-pointer relative max-w-64"
      onClick={handleCardClick}
    >
      {/* Winner Badge positioned above the image */}
      <div className="absolute -top-2 -left-2 z-10">
        <div className="inline-flex items-center px-3 py-1.5 bg-gallery-gold text-gallery-charcoal rounded-full text-sm font-medium shadow-lg">
          <Trophy className="h-4 w-4 mr-1" />
          Winner
        </div>
      </div>

      {/* Flat artwork image */}
      <div className="relative">
        <div className="w-64 h-64 bg-gallery-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border-2 border-gallery-gold/20">
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
            <Heart className="h-4 w-4 mr-1 fill-gallery-gold text-gallery-gold" />
            <span className="gallery-body font-medium">{artwork.votesToWin} votes</span>
          </div>

          <div className="px-3 py-1.5 bg-gallery-gold/20 text-gallery-charcoal rounded-lg text-sm shadow-sm">
            <span className="gallery-label font-medium">The Vault</span>
          </div>
        </div>
        
        {artwork.competitionDate && (
          <p className="gallery-label text-gallery-dark/50 text-xs">
            Winner • {artwork.competitionDate}
          </p>
        )}
      </div>
    </div>
  );
} 