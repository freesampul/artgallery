import { NextRequest, NextResponse } from 'next/server';
import { submitArtwork } from '@/lib/firestore';
import { rateLimit, RATE_LIMITS } from '@/lib/rateLimit';
import { validateTitle, validateAuthor, validateArtwork, sanitizeString } from '@/lib/validation';

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
    const submitterIP = getClientIP(request);
    
    // Apply rate limiting
    if (!rateLimit(submitterIP, RATE_LIMITS.SUBMIT)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { title, author, artwork } = body;

    // Validate and sanitize inputs
    const titleValidation = validateTitle(title);
    if (!titleValidation.valid) {
      return NextResponse.json(
        { error: titleValidation.error },
        { status: 400 }
      );
    }

    const authorValidation = validateAuthor(author);
    if (!authorValidation.valid) {
      return NextResponse.json(
        { error: authorValidation.error },
        { status: 400 }
      );
    }

    const artworkValidation = validateArtwork(artwork);
    if (!artworkValidation.valid) {
      return NextResponse.json(
        { error: artworkValidation.error },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedTitle = sanitizeString(title);
    const sanitizedAuthor = sanitizeString(author);

    // Submit to Firestore with sanitized data
    const artworkId = await submitArtwork(sanitizedTitle, sanitizedAuthor, artwork, submitterIP);

    return NextResponse.json({
      success: true,
      message: 'Artwork submitted successfully!',
      artworkId
    });

  } catch (error) {
    console.error('API Error submitting artwork:', error);
    
    if (error instanceof Error) {
      // Check if it's a daily limit error
      if (error.message.includes('already submitted artwork today')) {
        return NextResponse.json(
          { error: error.message, code: 'DAILY_LIMIT_EXCEEDED' },
          { status: 429 } // Too Many Requests
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to submit artwork' },
      { status: 500 }
    );
  }
} 