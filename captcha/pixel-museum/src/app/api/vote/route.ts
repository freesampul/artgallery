import { NextRequest, NextResponse } from 'next/server';
import { voteForArtwork, hasVoted, getArtworkById } from '@/lib/firestore';
import { rateLimit, RATE_LIMITS } from '@/lib/rateLimit';

// Get user IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const cloudfrontIP = request.headers.get('cloudfront-viewer-address');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (real) {
    return real.trim();
  }
  if (cloudfrontIP) {
    return cloudfrontIP.split(':')[0].trim();
  }
  
  return 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP first for rate limiting
    const voterIP = getClientIP(request);
    
    // Apply rate limiting
    if (!rateLimit(voterIP, RATE_LIMITS.VOTE)) {
      return NextResponse.json(
        { error: 'Too many votes. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { artworkId } = body;

    if (!artworkId) {
      return NextResponse.json(
        { error: 'Artwork ID is required' },
        { status: 400 }
      );
    }

    // Check if artwork exists
    const artwork = await getArtworkById(artworkId);
    if (!artwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }

    // Try to vote
    await voteForArtwork(artworkId, voterIP);

    return NextResponse.json({
      success: true,
      message: 'Vote cast successfully!'
    });

  } catch (error) {
    console.error('API Error voting:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('already voted')) {
        return NextResponse.json(
          { error: 'You have already voted for this artwork' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to cast vote' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const artworkId = searchParams.get('artworkId');

    if (!artworkId) {
      return NextResponse.json(
        { error: 'Artwork ID is required' },
        { status: 400 }
      );
    }

    // Get client IP
    const voterIP = getClientIP(request);

    // Check if user has voted
    const hasUserVoted = await hasVoted(artworkId, voterIP);

    return NextResponse.json({
      success: true,
      hasVoted: hasUserVoted
    });

  } catch (error) {
    console.error('API Error checking vote status:', error);
    
    return NextResponse.json(
      { error: 'Failed to check vote status' },
      { status: 500 }
    );
  }
} 