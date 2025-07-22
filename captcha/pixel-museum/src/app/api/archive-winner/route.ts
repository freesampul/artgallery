import { NextRequest, NextResponse } from 'next/server';
import { getTodaysArtworks, addToGallery } from '@/lib/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { competitionDate } = body;

    // Get today's artworks
    const artworks = await getTodaysArtworks();
    
    if (artworks.length === 0) {
      return NextResponse.json(
        { error: 'No artworks found for today' },
        { status: 404 }
      );
    }

    // Get the winner (highest votes, first in sorted array)
    const winner = artworks[0];
    
    if (!winner.id) {
      return NextResponse.json(
        { error: 'Winner artwork missing ID' },
        { status: 500 }
      );
    }

    // Add to gallery
    const galleryId = await addToGallery(winner, competitionDate);

    return NextResponse.json({
      success: true,
      message: 'Winner archived to gallery successfully!',
      galleryId,
      winner: {
        title: winner.title,
        author: winner.author,
        votes: winner.votes,
      }
    });

  } catch (error) {
    console.error('API Error archiving winner:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to archive winner' },
      { status: 500 }
    );
  }
} 