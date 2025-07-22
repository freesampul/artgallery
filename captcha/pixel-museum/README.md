# Pixel Museum

A community-driven pixel art gallery where users can submit, vote on, and discover amazing pixel art creations.

## Features

### 🎨 Art Gallery & Voting
- Browse today's pixel art submissions
- Vote on your favorite artworks
- View top-rated artworks and hall of fame winners
- Pixel art editor for creating submissions

### 🔗 Shareable Artwork Pages
- Click any artwork to view it in detail
- Shareable links for social media
- Prominent artwork display with voting and sharing options
- Social media metadata for rich link previews

### 🧹 Automatic Cleanup
- Non-winning submissions are automatically eligible for cleanup after 2 days
- Winners are preserved in the gallery forever
- Cleanup API removes old submissions to save database space

## Getting Started

1. **Clone the repository**
```bash
git clone <repository-url>
cd pixel-museum
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Firebase**
- Create a Firebase project
- Enable Firestore
- Add your Firebase config to `.env.local`

4. **Run the development server**
```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)**

## API Endpoints

### Artwork Management
- `GET /api/artworks` - Fetch artworks (gallery, top, today)
- `POST /api/artworks` - Submit new artwork
- `POST /api/vote` - Vote on artwork
- `GET /api/vote` - Check vote status

### Individual Artwork
- `GET /artwork/[id]` - View individual artwork with sharing capabilities

### Admin/Maintenance
- `GET /api/cleanup` - Preview what would be cleaned up (dry run)
- `POST /api/cleanup` - Execute cleanup of old non-winning submissions

## Database Cleanup

To maintain database efficiency, use the cleanup API:

```bash
# Preview what will be cleaned up
curl http://localhost:3000/api/cleanup

# Execute cleanup (removes non-winning submissions older than 2 days)
curl -X POST http://localhost:3000/api/cleanup
```

**Note:** Winner artworks in the gallery are never deleted, regardless of age.

## Sharing Features

- **Individual Artwork Pages**: Click any artwork card to view it prominently
- **Social Media Ready**: Open Graph and Twitter Card metadata for rich previews
- **Direct Sharing**: Share button with native sharing API or clipboard fallback
- **SEO Friendly**: Proper metadata and URL structure for search engines

## Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Deployment**: Vercel (recommended)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
