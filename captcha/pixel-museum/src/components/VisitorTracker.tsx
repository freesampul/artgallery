'use client';

import { useEffect, useState } from 'react';

interface VisitorTrackerProps {
  showCount?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function VisitorTracker({ showCount = false, className = '', style = {} }: VisitorTrackerProps) {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Track this visit
        const response = await fetch('/api/visitor-count', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        
        if (data.success) {
          setVisitorCount(data.totalGuests);
        }
      } catch (error) {
        console.error('Error tracking visitor:', error);
        // Fallback to just getting the count
        try {
          const response = await fetch('/api/visitor-count');
          const data = await response.json();
          if (data.success) {
            setVisitorCount(data.totalGuests);
          }
        } catch (fallbackError) {
          console.error('Error fetching visitor count:', fallbackError);
          setVisitorCount(1337); // Fallback to the meme number
        }
      } finally {
        setLoading(false);
      }
    };

    trackVisitor();
  }, []);

  if (!showCount) {
    return null; // Just track, don't display
  }

  return (
    <div className={className} style={style}>
      <span className="animate-pulse">
        🔥 THE MUSEUM HAS HOSTED {loading ? '...' : visitorCount.toLocaleString()} GUESTS! 🔥
      </span>
    </div>
  );
} 