import { NextResponse } from 'next/server';
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc,
  query,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST() {
  try {
    console.log('Starting cleanup process...');
    
    // Calculate the cutoff date (2 days ago)
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const cutoffTimestamp = Timestamp.fromDate(twoDaysAgo);
    
    console.log(`Cleaning up artworks older than: ${twoDaysAgo.toISOString()}`);
    
    // Get all artworks older than 2 days
    const artworksRef = collection(db, 'artworks');
    const oldArtworksQuery = query(
      artworksRef,
      where('createdAt', '<', cutoffTimestamp)
    );
    
    const oldArtworksSnapshot = await getDocs(oldArtworksQuery);
    console.log(`Found ${oldArtworksSnapshot.size} old artworks to check`);
    
    // Get all gallery artworks (winners) to avoid deleting them
    const galleryRef = collection(db, 'gallery');
    const gallerySnapshot = await getDocs(galleryRef);
    const winnerIds = new Set(gallerySnapshot.docs.map(doc => doc.id));
    
    console.log(`Found ${winnerIds.size} winner artworks to preserve`);
    
    let deletedCount = 0;
    const deletionPromises = [];
    
    // Check each old artwork
    for (const artworkDoc of oldArtworksSnapshot.docs) {
      const artworkId = artworkDoc.id;
      
      // Skip if this artwork is a winner (in gallery)
      if (winnerIds.has(artworkId)) {
        console.log(`Skipping winner artwork: ${artworkId}`);
        continue;
      }
      
      // Delete the artwork
      console.log(`Marking for deletion: ${artworkId}`);
      deletionPromises.push(deleteDoc(doc(db, 'artworks', artworkId)));
      deletedCount++;
    }
    
    // Execute all deletions
    if (deletionPromises.length > 0) {
      await Promise.all(deletionPromises);
      console.log(`Successfully deleted ${deletedCount} old non-winning artworks`);
    } else {
      console.log('No artworks to delete');
    }
    
    // Also clean up old votes for deleted artworks
    const votesRef = collection(db, 'votes');
    const votesSnapshot = await getDocs(votesRef);
    
    let deletedVotesCount = 0;
    const votesDeletionPromises = [];
    
    for (const voteDoc of votesSnapshot.docs) {
      const voteData = voteDoc.data();
      const artworkId = voteData.artworkId;
      
      // Check if the artwork still exists
      const artworkExists = oldArtworksSnapshot.docs.some(doc => doc.id === artworkId) && !winnerIds.has(artworkId);
      
      if (!artworkExists) {
        // Try to find if artwork exists in current artworks or gallery
        try {
          const artworkDoc = await getDocs(query(
            collection(db, 'artworks'),
            where('__name__', '==', artworkId)
          ));
          
          const galleryDoc = await getDocs(query(
            collection(db, 'gallery'),
            where('__name__', '==', artworkId)
          ));
          
          if (artworkDoc.empty && galleryDoc.empty) {
            // Artwork doesn't exist, delete the vote
            votesDeletionPromises.push(deleteDoc(doc(db, 'votes', voteDoc.id)));
            deletedVotesCount++;
          }
        } catch (error) {
          console.error(`Error checking artwork existence for vote ${voteDoc.id}:`, error);
        }
      }
    }
    
    if (votesDeletionPromises.length > 0) {
      await Promise.all(votesDeletionPromises);
      console.log(`Successfully deleted ${deletedVotesCount} orphaned votes`);
    }
    
    return NextResponse.json({
      success: true,
      message: `Cleanup completed successfully`,
      deletedArtworks: deletedCount,
      deletedVotes: deletedVotesCount,
      preservedWinners: winnerIds.size
    });
    
  } catch (error) {
    console.error('Error during cleanup:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to perform cleanup',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check what would be cleaned up (dry run)
export async function GET() {
  try {
    // Calculate the cutoff date (2 days ago)
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const cutoffTimestamp = Timestamp.fromDate(twoDaysAgo);
    
    // Get all artworks older than 2 days
    const artworksRef = collection(db, 'artworks');
    const oldArtworksQuery = query(
      artworksRef,
      where('createdAt', '<', cutoffTimestamp)
    );
    
    const oldArtworksSnapshot = await getDocs(oldArtworksQuery);
    
    // Get all gallery artworks (winners)
    const galleryRef = collection(db, 'gallery');
    const gallerySnapshot = await getDocs(galleryRef);
    const winnerIds = new Set(gallerySnapshot.docs.map(doc => doc.id));
    
    const artworksToDelete = [];
    
    for (const artworkDoc of oldArtworksSnapshot.docs) {
      const artworkId = artworkDoc.id;
      const artworkData = artworkDoc.data();
      
      if (!winnerIds.has(artworkId)) {
        artworksToDelete.push({
          id: artworkId,
          title: artworkData.title,
          author: artworkData.author,
          createdAt: artworkData.createdAt.toDate().toISOString(),
          votes: artworkData.votes
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      cutoffDate: twoDaysAgo.toISOString(),
      totalOldArtworks: oldArtworksSnapshot.size,
      winnersToPreserve: winnerIds.size,
      artworksToDelete: artworksToDelete.length,
      artworksList: artworksToDelete
    });
    
  } catch (error) {
    console.error('Error during cleanup preview:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to preview cleanup',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 