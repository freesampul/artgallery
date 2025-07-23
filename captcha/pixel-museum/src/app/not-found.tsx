'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import type { GalleryArtwork } from '@/lib/firestore';

export default function NotFound() {
  const [randomWinner, setRandomWinner] = useState<GalleryArtwork | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomWinner = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/artworks?type=gallery&limit=50');
        const data = await response.json();
        
        if (data.success && data.artworks.length > 0) {
          // Pick a random winner from the gallery
          const randomIndex = Math.floor(Math.random() * data.artworks.length);
          setRandomWinner(data.artworks[randomIndex]);
        }
      } catch (error) {
        console.error('Error fetching random winner:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomWinner();
  }, []);

  return (
    <div className="min-h-screen bg-gallery-white">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 py-20">
        {/* Simple 404 Message */}
        <div className="text-center mb-16">
          <p className="gallery-body text-gallery-dark/70 text-lg mb-8">
            This page does not exist.
          </p>
        </div>

        {/* Artwork Display */}
        {loading ? (
          <div className="text-center py-12">
            <div className="gallery-body text-gallery-dark/60">Loading...</div>
          </div>
        ) : randomWinner ? (
          <div className="text-center">
            {/* Artwork */}
            <div className="mb-8 inline-block">
              <div className="shadow-md">
                <div className="h-64 w-64 flex items-center justify-center p-9 mx-auto">
                  <img
                    src={randomWinner.artwork}
                    alt={randomWinner.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Caption */}
            <div className="mb-12">
              <h2 className="gallery-title text-2xl text-gallery-charcoal mb-2">
                {randomWinner.title}
              </h2>
              <p className="gallery-body text-gallery-dark/70">
                by {randomWinner.author}
              </p>
              {randomWinner.competitionDate && (
                <p className="gallery-label text-gallery-dark/50 mt-1">
                  {randomWinner.competitionDate}
                </p>
              )}
            </div>

            {/* Return Home Button */}
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gallery-charcoal text-gallery-white rounded-2xl hover:bg-gallery-black transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Return Home
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gallery-charcoal text-gallery-white rounded-2xl hover:bg-gallery-black transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Return Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 