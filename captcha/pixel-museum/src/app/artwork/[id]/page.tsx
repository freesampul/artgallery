'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { ArrowLeft, Share2, Heart, Calendar, Trophy } from 'lucide-react';
import type { GalleryArtwork, Artwork } from '@/lib/firestore';

interface ArtworkWithId extends Partial<GalleryArtwork & Artwork> {
  id: string;
  title: string;
  author: string;
  artwork: string;
}

export default function ArtworkPage() {
  const params = useParams();
  const artworkId = params?.id as string;
  const [artwork, setArtwork] = useState<ArtworkWithId | null>(null);
  const [loading, setLoading] = useState(true);

  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    const fetchArtwork = async () => {
      if (!artworkId) return;
      
      try {
        setLoading(true);
        
        // Try to fetch from gallery first, then from regular artworks
        const galleryResponse = await fetch(`/api/artworks?type=gallery&limit=50`);
        const galleryData = await galleryResponse.json();
        
        if (galleryData.success) {
          const galleryArtwork = galleryData.artworks.find((art: any) => art.id === artworkId);
          if (galleryArtwork) {
            setArtwork({ ...galleryArtwork, id: artworkId });
            return;
          }
        }
        
        // If not in gallery, try regular artworks
        const topResponse = await fetch(`/api/artworks?type=top&limit=50`);
        const topData = await topResponse.json();
        
        if (topData.success) {
          const topArtwork = topData.artworks.find((art: any) => art.id === artworkId);
          if (topArtwork) {
            setArtwork({ ...topArtwork, id: artworkId });
            return;
          }
        }
        
        // Try today's artworks
        const todayResponse = await fetch(`/api/artworks?type=today`);
        const todayData = await todayResponse.json();
        
        if (todayData.success && todayData.artworks) {
          const todayArtwork = todayData.artworks.find((art: any) => art.id === artworkId);
          if (todayArtwork) {
            setArtwork({ ...todayArtwork, id: artworkId });
            return;
          }
        }
        
      } catch (error) {
        console.error('Error fetching artwork:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [artworkId]);

  const handleShare = async () => {
    setSharing(true);
    
    const shareData = {
      title: `${artwork?.title} by ${artwork?.author}`,
      text: `Come check out this junk: "${artwork?.title}" by ${artwork?.author} - Digital Junk Gallery`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError);
      }
    } finally {
      setSharing(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gallery-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center py-20">
            <div className="gallery-body text-gallery-dark/60">Loading artwork...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-gallery-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center py-20">
            <h1 className="gallery-title text-3xl text-gallery-charcoal mb-4">Artwork Not Found</h1>
            <p className="gallery-body text-gallery-dark/70 mb-8">
              The artwork you're looking for doesn't exist or may have been removed.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gallery-charcoal text-gallery-white rounded-2xl hover:bg-gallery-black transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gallery-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-gallery-dark/70 hover:text-gallery-charcoal transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Junk
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Artwork Display */}
          <div className="flex justify-center">
            <div className="w-96 h-96 bg-gallery-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
              <img
                src={artwork.artwork}
                alt={artwork.title}
                className="w-full h-full object-contain p-14"
              />
            </div>
          </div>

          {/* Artwork Info */}
          <div className="space-y-6">
            {/* Title and Author */}
            <div>
              <h1 className="gallery-title text-4xl text-gallery-charcoal mb-3">
                {artwork.title}
              </h1>
              <p className="gallery-subtitle text-xl text-gallery-dark/80 mb-4">
                by {artwork.author}
              </p>
            </div>

            {/* Stats */}
            <div className="space-y-4">
                             <div className="flex items-center text-gallery-dark">
                 <Heart className="h-5 w-5 mr-3 text-gallery-accent" />
                 <span className="gallery-body">
                   {artwork.votes || artwork.votesToWin || 0} vote{(artwork.votes || artwork.votesToWin || 0) !== 1 ? 's' : ''}
                 </span>
               </div>

               {artwork.submissionDate && (
                 <div className="flex items-center text-gallery-dark">
                   <Calendar className="h-5 w-5 mr-3 text-gallery-dark/60" />
                   <span className="gallery-body">
                     Submitted {artwork.submissionDate}
                   </span>
                 </div>
               )}

               {artwork.competitionDate && (
                 <div className="flex items-center text-gallery-dark">
                   <Trophy className="h-5 w-5 mr-3 text-gallery-gold" />
                   <span className="gallery-body">
                     Winner from {artwork.competitionDate}
                   </span>
                 </div>
               )}


            </div>

            {/* Actions */}
            <div className="flex justify-center pt-6">
              <button
                onClick={handleShare}
                disabled={sharing}
                className="inline-flex items-center justify-center px-8 py-3 bg-gallery-charcoal text-gallery-white rounded-2xl hover:bg-gallery-black transition-colors duration-200 disabled:opacity-50"
              >
                <Share2 className="h-5 w-5 mr-2" />
                {sharing ? 'Sharing...' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 