'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Get current time in Eastern timezone
      const now = new Date();
      const easternTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
      
      // Calculate midnight Eastern time (start of next day)
      const easternMidnight = new Date(easternTime);
      easternMidnight.setHours(24, 0, 0, 0); // Set to midnight of next day
      
      // Calculate difference in milliseconds
      const timeDiff = easternMidnight.getTime() - easternTime.getTime();
      
      if (timeDiff > 0) {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="inline-flex items-center space-x-3 px-4 py-2 bg-gallery-charcoal/10 border border-gallery-charcoal/20 rounded-xl">
      <Clock className="h-4 w-4 text-gallery-accent" />
      <span className="gallery-body text-sm text-gallery-charcoal">
        Ends in {timeLeft.hours.toString().padStart(2, '0')}:
        {timeLeft.minutes.toString().padStart(2, '0')}:
        {timeLeft.seconds.toString().padStart(2, '0')}
      </span>
      <div className="w-2 h-2 bg-gallery-accent rounded-full animate-pulse"></div>
    </div>
  );
} 