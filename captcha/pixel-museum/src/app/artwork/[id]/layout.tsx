import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const artworkId = resolvedParams.id;
  
  try {
    // Try to fetch artwork data for metadata
    // Note: In a production app, you might want to create a separate API endpoint
    // or fetch this data server-side for better SEO
    
    return {
      title: `Digital Junk - Artwork`,
      description: `Check out this amazing digital art creation from our chaotic collection!`,
      openGraph: {
        title: `Digital Junk - Artwork`,
        description: `Check out this amazing digital art creation from our chaotic collection!`,
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/artwork/${artworkId}`,
        siteName: 'Digital Junk',
        images: [
          {
            url: '/frames/frame.png', // Fallback image
            width: 1200,
            height: 630,
            alt: 'Pixel Art Gallery',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `Digital Junk - Artwork`,
        description: `Check out this amazing digital art creation from our chaotic collection!`,
        images: ['/frames/frame.png'],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        },
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    
    // Fallback metadata
    return {
      title: 'Digital Junk',
      description: 'Discover amazing digital art treasures from our chaotic collection',
    };
  }
}

export default function ArtworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 