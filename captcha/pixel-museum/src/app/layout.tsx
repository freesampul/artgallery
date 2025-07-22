import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pixel Museum',
  description: 'A virtual museum for pixel art creations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased gallery-pattern min-h-screen">
        {children}
      </body>
    </html>
  )
} 