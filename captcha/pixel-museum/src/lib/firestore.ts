import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  increment, 
  query, 
  orderBy, 
  limit as limitQuery, 
  where,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';

export interface Artwork {
  id?: string;
  title: string;
  author: string;
  artwork: string; // base64 image data
  votes: number;
  createdAt: Timestamp;
  submissionDate: string; // YYYY-MM-DD format for daily competition
}

export interface GalleryArtwork {
  id?: string;
  title: string;
  author: string;
  artwork: string; // base64 encoded image
  votesToWin: number;
  dateWon: Timestamp;
  competitionDate: string; // Human readable date like "December 15, 2024"
}

export interface Vote {
  id?: string;
  artworkId: string;
  voterIP: string;
  createdAt: Timestamp;
}

export interface Submission {
  id?: string;
  submitterIP: string;
  submissionDate: string; // YYYY-MM-DD format
  artworkId: string;
  createdAt: Timestamp;
}

// Get today's date in YYYY-MM-DD format
export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Check if IP has already submitted today
export const hasSubmittedToday = async (submitterIP: string): Promise<boolean> => {
  try {
    const today = getTodayString();
    const submissionsQuery = query(
      collection(db, 'submissions'),
      where('submitterIP', '==', submitterIP),
      where('submissionDate', '==', today)
    );
    
    const existingSubmissions = await getDocs(submissionsQuery);
    return !existingSubmissions.empty;
  } catch (error) {
    console.error('Error checking submission status:', error);
    return false; // If there's an error, allow submission
  }
};

// Submit a new artwork
export const submitArtwork = async (
  title: string, 
  author: string, 
  artwork: string,
  submitterIP: string
): Promise<string> => {
  try {
    // Check if IP has already submitted today
    const alreadySubmitted = await hasSubmittedToday(submitterIP);
    if (alreadySubmitted) {
      throw new Error('You have already submitted artwork today. You can submit again tomorrow!');
    }

    const today = getTodayString();
    const artworkData: Omit<Artwork, 'id'> = {
      title: title.trim(),
      author: author.trim(),
      artwork,
      votes: 0,
      createdAt: Timestamp.now(),
      submissionDate: today
    };

    // Submit the artwork
    const artworkDocRef = await addDoc(collection(db, 'artworks'), artworkData);
    
    // Record the submission
    const submissionData: Omit<Submission, 'id'> = {
      submitterIP,
      submissionDate: today,
      artworkId: artworkDocRef.id,
      createdAt: Timestamp.now()
    };
    
    await addDoc(collection(db, 'submissions'), submissionData);
    
    return artworkDocRef.id;
  } catch (error) {
    console.error('Error submitting artwork:', error);
    if (error instanceof Error) {
      throw error; // Re-throw the original error message
    }
    throw new Error('Failed to submit artwork');
  }
};

// Get all artworks for today
export const getTodaysArtworks = async (): Promise<Artwork[]> => {
  try {
    const today = getTodayString();
    console.log('Fetching artworks for date:', today);
    
    // First, let's try a simple query without ordering to debug
    const q = query(
      collection(db, 'artworks'),
      where('submissionDate', '==', today)
    );
    
    const querySnapshot = await getDocs(q);
    console.log('Found artworks:', querySnapshot.size);
    
    const artworks: Artwork[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('Artwork data:', data);
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
    console.error('Error fetching today\'s artworks:', error);
    throw new Error('Failed to fetch artworks');
  }
};

// Get top artworks (for museum display)
export const getTopArtworks = async (limitCount: number = 6): Promise<Artwork[]> => {
  try {
    // Simplified query to avoid Firestore index requirements
    const q = query(
      collection(db, 'artworks'),
      orderBy('votes', 'desc'),
      limitQuery(limitCount * 3) // Get more to sort properly in memory
    );
    
    const querySnapshot = await getDocs(q);
    const artworks: Artwork[] = [];
    
    querySnapshot.forEach((doc) => {
      artworks.push({
        id: doc.id,
        ...doc.data()
      } as Artwork);
    });
    
    // Sort in memory to avoid Firestore index requirement
    artworks.sort((a, b) => {
      if (b.votes !== a.votes) {
        return b.votes - a.votes; // Sort by votes descending
      }
      // If votes are equal, sort by creation time descending (newest first)
      return b.createdAt.toMillis() - a.createdAt.toMillis();
    });
    
    // Return only the requested number
    return artworks.slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching top artworks:', error);
    throw new Error('Failed to fetch top artworks');
  }
};

// Vote for an artwork
export const voteForArtwork = async (
  artworkId: string, 
  voterIP: string
): Promise<boolean> => {
  try {
    // Check if this IP has already voted for this artwork
    const votesQuery = query(
      collection(db, 'votes'),
      where('artworkId', '==', artworkId),
      where('voterIP', '==', voterIP)
    );
    
    const existingVotes = await getDocs(votesQuery);
    
    if (!existingVotes.empty) {
      throw new Error('You have already voted for this artwork');
    }

    // Add the vote
    await addDoc(collection(db, 'votes'), {
      artworkId,
      voterIP,
      createdAt: Timestamp.now()
    });

    // Increment the vote count on the artwork
    const artworkRef = doc(db, 'artworks', artworkId);
    await updateDoc(artworkRef, {
      votes: increment(1)
    });

    return true;
  } catch (error) {
    console.error('Error voting for artwork:', error);
    throw error;
  }
};

// Check if IP has voted for an artwork
export const hasVoted = async (
  artworkId: string, 
  voterIP: string
): Promise<boolean> => {
  try {
    const votesQuery = query(
      collection(db, 'votes'),
      where('artworkId', '==', artworkId),
      where('voterIP', '==', voterIP)
    );
    
    const existingVotes = await getDocs(votesQuery);
    return !existingVotes.empty;
  } catch (error) {
    console.error('Error checking vote status:', error);
    return false;
  }
};

// Get artwork by ID
export const getArtworkById = async (artworkId: string): Promise<Artwork | null> => {
  try {
    const artworkRef = doc(db, 'artworks', artworkId);
    const artworkSnap = await getDoc(artworkRef);
    
    if (artworkSnap.exists()) {
      return {
        id: artworkSnap.id,
        ...artworkSnap.data()
      } as Artwork;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching artwork:', error);
    throw new Error('Failed to fetch artwork');
  }
};

// Gallery functions for permanent artwork storage
export async function addToGallery(artwork: Artwork, competitionDate: string): Promise<string> {
  if (!artwork.id) {
    throw new Error('Artwork must have an ID to add to gallery');
  }

  const galleryItem: GalleryArtwork = {
    title: artwork.title,
    author: artwork.author,
    artwork: artwork.artwork,
    votesToWin: artwork.votes,
    dateWon: Timestamp.now(),
    competitionDate: competitionDate,
  };

  const docRef = await addDoc(collection(db, 'gallery'), galleryItem);
  return docRef.id;
}

export async function getGalleryArtworks(limitCount: number = 20): Promise<GalleryArtwork[]> {
  try {
    const q = query(
      collection(db, 'gallery'),
      orderBy('dateWon', 'desc'),
      limitQuery(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as GalleryArtwork[];
  } catch (error) {
    console.error('Error fetching gallery artworks:', error);
    throw new Error('Failed to fetch gallery artworks');
  }
} 