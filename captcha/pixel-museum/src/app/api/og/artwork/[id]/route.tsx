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
      return new NextResponse('Artwork ID is required', { status: 400 });
    }

    const artwork = await getArtworkById(artworkId);

    if (!artwork) {
      return new NextResponse('Artwork not found', { status: 404 });
    }

    // For SMS compatibility, serve the artwork directly with proper headers
    // This is more compatible than trying to generate complex images
    const base64Data = artwork.artwork.split(',')[1];
    const imageBuffer = Buffer.from(base64Data, 'base64');

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': imageBuffer.length.toString(),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'X-Content-Type-Options': 'nosniff',
      },
    });

  } catch (error) {
    console.error('Error serving artwork image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 