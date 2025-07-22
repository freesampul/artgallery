// Input validation and sanitization utilities

export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML/XSS
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, '') // Remove control characters
    .substring(0, 1000); // Limit length
}

export function validateTitle(title: string): { valid: boolean; error?: string } {
  const sanitized = sanitizeString(title);
  
  if (!sanitized || sanitized.length === 0) {
    return { valid: false, error: 'Title cannot be empty' };
  }
  
  if (sanitized.length > 100) {
    return { valid: false, error: 'Title must be 100 characters or less' };
  }
  
  // Check for spam patterns
  if (/(.)\1{10,}/.test(sanitized)) { // More than 10 repeated characters
    return { valid: false, error: 'Title contains invalid patterns' };
  }
  
  return { valid: true };
}

export function validateAuthor(author: string): { valid: boolean; error?: string } {
  const sanitized = sanitizeString(author);
  
  if (!sanitized || sanitized.length === 0) {
    return { valid: false, error: 'Author name cannot be empty' };
  }
  
  if (sanitized.length > 50) {
    return { valid: false, error: 'Author name must be 50 characters or less' };
  }
  
  return { valid: true };
}

export function validateArtwork(artwork: string): { valid: boolean; error?: string } {
  if (!artwork || typeof artwork !== 'string') {
    return { valid: false, error: 'Artwork data is required' };
  }
  
  if (!artwork.startsWith('data:image/')) {
    return { valid: false, error: 'Invalid artwork format' };
  }
  
  // Check image size (base64 encoded)
  const sizeInBytes = (artwork.length * 3) / 4;
  const maxSizeInMB = 5;
  
  if (sizeInBytes > maxSizeInMB * 1024 * 1024) {
    return { valid: false, error: `Image too large. Maximum size is ${maxSizeInMB}MB` };
  }
  
  return { valid: true };
} 