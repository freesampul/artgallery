import { NextRequest, NextResponse } from 'next/server';
import { getArtworkById } from '@/lib/firestore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const artworkId = resolvedParams.id;

    if (!artworkId) {
      return NextResponse.json(
        { error: 'Artwork ID is required' },
        { status: 400 }
      );
    }

    const artwork = await getArtworkById(artworkId);

    if (!artwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      artwork: {
        id: artwork.id,
        title: artwork.title,
        author: artwork.author,
        artwork: artwork.artwork,
        votes: artwork.votes,
        submissionDate: artwork.submissionDate,
        competitionDate: (artwork as any).competitionDate || null,
        votesToWin: (artwork as any).votesToWin || null,
      }
    });

  } catch (error) {
    console.error('Error fetching artwork:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch artwork' },
      { status: 500 }
    );
  }
} 