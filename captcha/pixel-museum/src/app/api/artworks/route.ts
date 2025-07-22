import { NextRequest, NextResponse } from 'next/server';
import { getTodaysArtworks, getTopArtworks, getGalleryArtworks } from '@/lib/firestore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'today';
    const limit = parseInt(searchParams.get('limit') || '6');

    let artworks;

    if (type === 'today') {
      artworks = await getTodaysArtworks();
    } else if (type === 'top') {
      artworks = await getTopArtworks(limit);
    } else if (type === 'gallery') {
      artworks = await getGalleryArtworks(limit);
    } else {
      return NextResponse.json(
        { error: 'Invalid type parameter. Use "today", "top", or "gallery"' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      artworks
    });

  } catch (error) {
    console.error('API Error fetching artworks:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch artworks' },
      { status: 500 }
    );
  }
} 