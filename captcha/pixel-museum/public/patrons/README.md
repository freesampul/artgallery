# Patron Images Directory

This directory is for storing images of your generous patrons/donors.

## How to Add Patron Images:

1. **Upload donor images** to this `/public/patrons/` directory
2. **Update the patron data** in `/src/app/patreons/page.tsx`
3. **Replace the sample donors** array with your actual patron information

## Image Guidelines:

- **Format**: JPG, PNG, or WebP
- **Size**: Square images work best (e.g., 300x300px)
- **Naming**: Use descriptive names like `patron-john-doe.jpg`

## Example Patron Data Structure:

```javascript
const sampleDonors = [
  {
    id: '1',
    name: 'John Doe',
    image: '/patrons/patron-john-doe.jpg', // Your uploaded image
    donationTier: 'Gold', // Gold, Silver, or Bronze
    joinDate: '2024-01-15' // When they became a patron
  }
];
```

## Support Tiers:

- **Gold**: Top-tier supporters
- **Silver**: Mid-level supporters  
- **Bronze**: Entry-level supporters

Simply replace the placeholder data with your real patron information and their uploaded images! 