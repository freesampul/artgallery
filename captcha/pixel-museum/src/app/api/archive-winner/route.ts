import { NextRequest, NextResponse } from 'next/server';
import { getTodaysArtworks, addToGallery } from '@/lib/firestore';
import { 
  collection, 
  getDocs, 
  query, 
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Artwork } from '@/lib/firestore';

// Helper function to get artworks for a specific date
async function getArtworksForDate(date: string): Promise<Artwork[]> {
  try {
    console.log('Fetching artworks for date:', date);
    
    const q = query(
      collection(db, 'artworks'),
      where('submissionDate', '==', date)
    );
    
    const querySnapshot = await getDocs(q);
    console.log('Found artworks:', querySnapshot.size);
    
    const artworks: Artwork[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      artworks.push({
        id: doc.id,
        ...data
      } as Artwork);
    });
    
    // Sort by votes in memory to avoid Firestore index issues
    artworks.sort((a, b) => {
      if (b.votes !== a.votes) {
        return b.votes - a.votes; // Sort by votes descending
      }
      // If votes are equal, sort by creation time ascending
      return a.createdAt.toMillis() - b.createdAt.toMillis();
    });
  
    return artworks;
  } catch (error) {
    console.error('Error fetching artworks for date:', error);
    throw new Error('Failed to fetch artworks for date');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { competitionDate, targetDate } = body;

    let artworks: Artwork[];
    
    if (targetDate) {
      // Get artworks for a specific date
      artworks = await getArtworksForDate(targetDate);
    } else {
      // Get today's artworks (existing behavior)
      artworks = await getTodaysArtworks();
    }
    
    if (artworks.length === 0) {
      return NextResponse.json(
        { error: `No artworks found for ${targetDate || 'today'}` },
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

    console.log(`Archiving winner: ${winner.title} by ${winner.author} with ${winner.votes} votes`);

    // Add to gallery
    const galleryId = await addToGallery(winner, competitionDate || targetDate || 'Unknown Date');

    return NextResponse.json({
      success: true,
      message: 'Winner archived to gallery successfully!',
      galleryId,
      winner: {
        id: winner.id,
        title: winner.title,
        author: winner.author,
        votes: winner.votes,
        submissionDate: winner.submissionDate,
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

// GET endpoint to see who would win for a specific date
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetDate = searchParams.get('date');
    
    let artworks: Artwork[];
    
    if (targetDate) {
      artworks = await getArtworksForDate(targetDate);
    } else {
      artworks = await getTodaysArtworks();
    }
    
    if (artworks.length === 0) {
      return NextResponse.json({
        success: false,
        message: `No artworks found for ${targetDate || 'today'}`,
        artworks: []
      });
    }

    return NextResponse.json({
      success: true,
      date: targetDate || 'today',
      totalSubmissions: artworks.length,
      winner: artworks[0],
      allArtworks: artworks.map(art => ({
        id: art.id,
        title: art.title,
        author: art.author,
        votes: art.votes,
        submissionDate: art.submissionDate
      }))
    });

  } catch (error) {
    console.error('Error previewing winner:', error);
    return NextResponse.json(
      { error: 'Failed to preview winner' },
      { status: 500 }
    );
  }
} 