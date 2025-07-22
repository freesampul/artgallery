// Simple in-memory rate limiting (for production, use Redis)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

export function rateLimit(ip: string, options: RateLimitOptions): boolean {
  const now = Date.now();
  const key = `${ip}`;
  
  // Clean up expired entries
  if (rateLimitMap.size > 1000) { // Prevent memory leaks
    for (const [k, v] of rateLimitMap.entries()) {
      if (v.resetTime < now) {
        rateLimitMap.delete(k);
      }
    }
  }
  
  const entry = rateLimitMap.get(key);
  
  if (!entry || entry.resetTime < now) {
    // Reset or create new entry
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + options.windowMs
    });
    return true;
  }
  
  if (entry.count >= options.maxRequests) {
    return false; // Rate limit exceeded
  }
  
  entry.count++;
  return true;
}

// Preset configurations
export const RATE_LIMITS = {
  SUBMIT: { maxRequests: 2, windowMs: 24 * 60 * 60 * 1000 }, // 2 per day
  VOTE: { maxRequests: 50, windowMs: 60 * 60 * 1000 }, // 50 per hour
  GENERAL: { maxRequests: 100, windowMs: 15 * 60 * 1000 } // 100 per 15 minutes
}; 