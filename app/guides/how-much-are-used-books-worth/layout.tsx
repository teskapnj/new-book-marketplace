import type { Metadata } from 'next'

const PAGE_URL =
  'https://www.sellbookmedia.com/guides/how-much-are-used-books-worth'

export const metadata: Metadata = {
  alternates: {
    canonical: PAGE_URL,
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default function UsedBooksValueGuideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
