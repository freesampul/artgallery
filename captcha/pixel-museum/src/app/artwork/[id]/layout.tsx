import { Metadata } from 'next';
import { getArtworkById } from '@/lib/firestore';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const artworkId = resolvedParams.id;
  
  try {
    // Fetch artwork data directly from Firestore for metadata
    const artwork = await getArtworkById(artworkId);
    
    if (artwork) {
      const title = `"${artwork.title}" by ${artwork.author} - Digital Junk`;
      const description = `Check this shit out: "${artwork.title}" by ${artwork.author}. Pure digital junk from our chaotic collection!`;
      const artworkUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://digitaljunk.art'}/artwork/${artworkId}`;
      
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          type: 'website',
          url: artworkUrl,
          siteName: 'Digital Junk',
          images: [
            {
              url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://digitaljunk.art'}/api/og/artwork/${artworkId}`,
              width: 512,
              height: 512,
              alt: `${artwork.title} by ${artwork.author}`,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [`${process.env.NEXT_PUBLIC_BASE_URL || 'https://digitaljunk.art'}/api/og/artwork/${artworkId}`],
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
    }
    
    // Fallback if artwork not found
    return {
      title: `Digital Junk - Artwork Not Found`,
      description: `This piece of junk seems to have disappeared from our digital dumpster!`,
      openGraph: {
        title: `Digital Junk - Artwork Not Found`,
        description: `This piece of junk seems to have disappeared from our digital dumpster!`,
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://digitaljunk.art'}/artwork/${artworkId}`,
        siteName: 'Digital Junk',
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