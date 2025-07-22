import { NextRequest, NextResponse } from 'next/server';
import { hasSubmittedToday } from '@/lib/firestore';

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

export async function GET(request: NextRequest) {
  try {
    const submitterIP = getClientIP(request);
    const hasSubmitted = await hasSubmittedToday(submitterIP);

    return NextResponse.json({
      success: true,
      hasSubmittedToday: hasSubmitted
    });
  } catch (error) {
    console.error('API Error checking submission status:', error);
    
    return NextResponse.json(
      { error: 'Failed to check submission status' },
      { status: 500 }
    );
  }
} 