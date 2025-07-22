import { NextRequest, NextResponse } from 'next/server';
import { collection, doc, getDoc, setDoc, updateDoc, increment, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

// Get today's date string
function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export async function POST(request: NextRequest) {
  try {
    const visitorIP = getClientIP(request);
    const today = getTodayString();
    
    // Check if this IP has already visited today
    const visitsQuery = query(
      collection(db, 'dailyVisits'),
      where('visitorIP', '==', visitorIP),
      where('date', '==', today)
    );
    
    const existingVisits = await getDocs(visitsQuery);
    
    // If this IP hasn't visited today, count it as a new visitor
    if (existingVisits.empty) {
      // Record this visit
      await addDoc(collection(db, 'dailyVisits'), {
        visitorIP,
        date: today,
        timestamp: Timestamp.now()
      });
      
      // Increment the total visitor count
      const counterRef = doc(db, 'siteStats', 'visitorCount');
      const counterDoc = await getDoc(counterRef);
      
      if (counterDoc.exists()) {
        await updateDoc(counterRef, {
          totalGuests: increment(1),
          lastUpdated: Timestamp.now()
        });
      } else {
        await setDoc(counterRef, {
          totalGuests: 1,
          lastUpdated: Timestamp.now()
        });
      }
    }
    
    // Return the current count
    const counterRef = doc(db, 'siteStats', 'visitorCount');
    const counterDoc = await getDoc(counterRef);
    const totalGuests = counterDoc.exists() ? counterDoc.data().totalGuests : 0;
    
    return NextResponse.json({
      success: true,
      totalGuests
    });
    
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json(
      { error: 'Failed to track visitor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Just return the current count without incrementing
    const counterRef = doc(db, 'siteStats', 'visitorCount');
    const counterDoc = await getDoc(counterRef);
    const totalGuests = counterDoc.exists() ? counterDoc.data().totalGuests : 0;
    
    return NextResponse.json({
      success: true,
      totalGuests
    });
    
  } catch (error) {
    console.error('Error fetching visitor count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visitor count' },
      { status: 500 }
    );
  }
} 