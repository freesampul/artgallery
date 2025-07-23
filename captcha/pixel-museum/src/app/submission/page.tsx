'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PixelArtEditor from '@/components/PixelArtEditor';
import SubmissionStatus from '@/components/SubmissionStatus';
import VisitorTracker from '@/components/VisitorTracker';
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
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
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
    <div className="min-h-screen bg-white">
      <VisitorTracker showCount={false} />
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-gray-800 mb-4">
            Dump Your Junk
          </h1>
          <p className="text-gray-700 max-w-lg mx-auto">
            Create something. Submit once per day.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="border border-gray-200 p-6 mb-8">
            {/* Pixel Art Canvas */}
            <div className="mb-8">
              <div className="mb-4">
                <h2 className="text-xl text-gray-800 mb-2">Canvas</h2>
              </div>
              <PixelArtEditor onArtworkChange={setArtworkData} />
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div className="mb-4">
                <h2 className="text-xl text-gray-800 mb-2">Details</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-gray-700 mb-1 text-sm">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                    placeholder="untitled"
                    maxLength={100}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="author" className="block text-gray-700 mb-1 text-sm">
                    Name
                  </label>
                  <input
                    type="text"
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                    placeholder="anonymous"
                    maxLength={50}
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            </form>

            <div className="text-xs text-gray-500 border-t pt-4 mt-8">
              Rules: One submission per day. Winner picked at midnight EST.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 