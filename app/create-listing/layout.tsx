// app/create-listing/layout.tsx
import { Metadata } from 'next'

// ✅ CREATE LISTING METADATA (NOINDEX!)
export const metadata: Metadata = {
  title: 'Create Listing - Sell Your Items',
  description: 'Create a listing to sell your books, CDs, DVDs, or games. Scan items and get instant quotes.',
  
  robots: {
    index: false,  // ❌ Private tool - Google indexlemesin!
    follow: true,  // ✅ Ama linkleri takip etsin
    nocache: true, // ❌ Cache yapmasın
  },
}

export default function CreateListingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}