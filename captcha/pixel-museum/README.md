
# 🗑️ [Digital Junk](https://digitaljunk.art)

**A chaotic dump of digital art treasures. Dive into the beautiful mess where creativity meets entropy and every pixel tells a story.**

🌐 **Live Site:** [https://digitaljunk.art](https://digitaljunk.art)  
📊 **Status:** Live & Accepting Submissions  
🎨 **Current Theme:** Minimalist gallery meets cobbled-together aesthetic

---

## ✨ Features

### 🎨 **Art Gallery & Daily Competition**
- Browse today's pixel art submissions in the **Fresh Garbage** section
- Vote on your favorite artworks with one-click voting
- View winning artworks preserved forever in **The Vault**
- Built-in pixel art editor for creating 32x32 masterpieces

### 📱 **Social Sharing & Previews**
- Click any artwork to view it in detail with proper framing
- Share button with "Check this shit out" messaging (our signature touch)
- Rich link previews with actual artwork images on social media
- Works across Twitter, Facebook, Discord, SMS, and more

### 🏆 **Daily Competition System**
- Automatic daily competition with midnight EST resets
- One submission per person per day to maintain quality
- Winner archiving system preserves the best art forever
- Vote tracking with IP-based rate limiting

### 🧹 **Smart Cleanup & Management**
- Non-winning submissions automatically cleaned after 2 days
- Winners are permanently preserved in the gallery
- Efficient database management to control costs
- Manual archive system for missed winners

### 🎭 **Dual Aesthetic Design**
- **Modern art gallery** feel with clean, minimalist pages
- **Cobbled-together** aesthetic that feels intentionally rough
- Special "shitty early 2000s" Patreons page with marquee animations
- Consistent "Digital Junk" branding throughout

---

## 🚀 Tech Stack

- **Framework:** Next.js 15 with App Router
- **Styling:** Tailwind CSS with custom gallery themes
- **Database:** Firebase Firestore
- **Hosting:** Netlify with serverless functions
- **Domain:** Custom domain with SSL
- **Features:** Rate limiting, input validation, timezone handling

---

## 🎯 Getting Started

1. **Visit the site:** [https://digitaljunk.art](https://digitaljunk.art)
2. **Create pixel art:** Use our built-in 32x32 editor
3. **Submit daily:** One masterpiece per day
4. **Vote & share:** Help decide the daily winner
5. **Explore the vault:** See all past winners

---

## 🗂️ API Endpoints

### Public APIs
- `GET /api/artworks?type=today` - Today's submissions
- `GET /api/artworks?type=gallery` - Hall of fame winners  
- `GET /api/artworks?type=top` - Top voted artworks
- `GET /artwork/[id]` - Individual artwork pages
- `GET /api/og/artwork/[id]` - Open Graph preview images

### Submission & Voting
- `POST /api/submit-artwork` - Submit new artwork (rate limited)
- `POST /api/vote` - Vote on artwork (rate limited)
- `GET /api/check-submission` - Check daily submission status

### Admin & Maintenance
- `GET /api/archive-winner?date=YYYY-MM-DD` - Preview daily winner
- `POST /api/archive-winner` - Archive winner to gallery
- `GET /api/cleanup` - Preview cleanup candidates
- `POST /api/cleanup` - Execute cleanup of old submissions

---

## 🔧 Local Development

```bash
# Clone and install
git clone <your-repo-url>
cd pixel-museum
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Firebase config

# Run development server
npm run dev
# Visit http://localhost:3000
```

### Environment Variables Required
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_BASE_URL=https://digitaljunk.art
```

---

## 📝 License

MIT License - One person's trash is another's treasure.

---

**Est. 2025** - *Where creativity meets entropy and every pixel tells a story.*
