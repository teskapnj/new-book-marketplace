import type { Metadata } from 'next'

const PAGE_URL =
  'https://www.sellbookmedia.com/guides/how-much-are-used-dvds-worth'

export const metadata: Metadata = {
  alternates: {
    canonical: PAGE_URL,
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default function UsedDVDsValueGuideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
