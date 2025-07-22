'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PixelArtEditor from '@/components/PixelArtEditor';
import SubmissionStatus from '@/components/SubmissionStatus';
import { Palette, Calendar } from 'lucide-react';

export default function Submission() {
  const [artworkData, setArtworkData] = useState<string>('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [submissionState, setSubmissionState] = useState<'form' | 'success' | 'already-submitted' | 'loading'>('loading');
  const [submittedArtworkTitle, setSubmittedArtworkTitle] = useState<string>('');

  // Check if user has already submitted today when component mounts
  useEffect(() => {
    const checkSubmissionStatus = async () => {
      try {
        const response = await fetch('/api/check-submission');
        const data = await response.json();
        
        if (data.success) {
          setSubmissionState(data.hasSubmittedToday ? 'already-submitted' : 'form');
        } else {
          setSubmissionState('form'); // If there's an error, allow them to try submitting
        }
      } catch (error) {
        console.error('Error checking submission status:', error);
        setSubmissionState('form'); // If there's an error, allow them to try submitting
      }
    };

    checkSubmissionStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !author.trim() || !artworkData) {
      alert('Please fill in all fields and create some artwork!');
      return;
    }

    try {
      const response = await fetch('/api/submit-artwork', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim(),
          artwork: artworkData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Show success screen
        setSubmittedArtworkTitle(title);
        setSubmissionState('success');
      } else {
        if (result.code === 'DAILY_LIMIT_EXCEEDED') {
          // User has already submitted today
          setSubmissionState('already-submitted');
        } else {
          alert(`❌ ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('❌ Failed to submit artwork. Please check your connection and try again.');
    }
  };

  // Handle different submission states
  if (submissionState === 'loading') {
    return (
      <div className="min-h-screen gallery-gradient">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-gallery-accent border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="gallery-body text-lg text-gallery-dark/70">Checking submission status...</p>
          </div>
        </div>
      </div>
    );
  }

  if (submissionState === 'success') {
    return <SubmissionStatus status="success" artworkTitle={submittedArtworkTitle} />;
  }

  if (submissionState === 'already-submitted') {
    return <SubmissionStatus status="already-submitted" />;
  }

  // Normal form state
  return (
    <div className="min-h-screen gallery-gradient">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="text-center mb-8 sm:mb-16 animate-fade-in">
          <h1 className="gallery-title text-3xl sm:text-4xl lg:text-6xl text-gallery-charcoal mb-4 sm:mb-8 animate-slide-up">
            Create Your Masterpiece
          </h1>
          <p className="gallery-subtitle text-lg sm:text-xl text-gallery-dark/80 max-w-3xl mx-auto leading-relaxed mb-4 sm:mb-6 px-4">
            Design your pixel art and enter today's competition. Each artist may submit one piece per day 
            to compete for a place in our permanent collection.
          </p>
          <div className="gallery-label text-gallery-dark/60 text-sm sm:text-base">
            Competition resets daily at midnight Eastern Time
          </div>
        </div>

        <div className="max-w-5xl mx-auto animate-fade-in">
          <div className="gallery-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-12">
            {/* Pixel Art Canvas */}
            <div className="mb-8 sm:mb-12">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="gallery-title text-2xl sm:text-3xl text-gallery-charcoal mb-3 sm:mb-4">Digital Canvas</h2>
                <p className="gallery-body text-gallery-dark/70 text-sm sm:text-base px-4">
                  Create your pixel art using the tools below
                </p>
              </div>
              <PixelArtEditor onArtworkChange={setArtworkData} />
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="gallery-title text-2xl sm:text-3xl text-gallery-charcoal mb-3 sm:mb-4">Artwork Details</h2>
                <p className="gallery-body text-gallery-dark/70 text-sm sm:text-base px-4">
                  Provide information about your creation
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                <div>
                  <label htmlFor="title" className="gallery-label block text-gallery-charcoal mb-2 sm:mb-3 text-sm sm:text-base">
                    Artwork Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-gallery-light rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-gallery-accent/50 focus:border-gallery-accent transition-all duration-300 gallery-body bg-gallery-off-white text-sm sm:text-base"
                    placeholder="Enter your artwork title"
                    maxLength={100}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="author" className="gallery-label block text-gallery-charcoal mb-2 sm:mb-3 text-sm sm:text-base">
                    Artist Name
                  </label>
                  <input
                    type="text"
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-gallery-light rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-gallery-accent/50 focus:border-gallery-accent transition-all duration-300 gallery-body bg-gallery-off-white text-sm sm:text-base"
                    placeholder="Enter your name"
                    maxLength={50}
                    required
                  />
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 sm:px-12 py-3 sm:py-4 bg-gallery-charcoal text-gallery-white rounded-xl sm:rounded-2xl hover:bg-gallery-black transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 text-base sm:text-lg w-full sm:w-auto"
                >
                  <Palette className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                  Submit to Competition
                </button>
              </div>
            </form>

            {/* Daily Limit Info */}
            <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-gallery-accent/5 border border-gallery-accent/20 rounded-xl sm:rounded-2xl">
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 sm:space-x-3 mb-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gallery-accent" />
                  <span className="gallery-label text-gallery-charcoal text-sm sm:text-base">Daily Competition Rules</span>
                </div>
                <p className="gallery-body text-gallery-dark/70 text-sm sm:text-base px-2">
                  One submission per artist per day. Make your entry count—it will compete for inclusion in our permanent Hall of Fame.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 