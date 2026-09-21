import type { Metadata } from 'next'

const PAGE_URL =
  'https://www.sellbookmedia.com/guides/where-to-sell-books-and-dvds-for-cash'

export const metadata: Metadata = {
  alternates: {
    canonical: PAGE_URL,
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default function WhereToSellBooksAndDVDsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
