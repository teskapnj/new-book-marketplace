import type { Metadata } from 'next'

const PAGE_URL =
  'https://www.sellbookmedia.com/guides/what-to-do-with-old-dvds-and-cds'

export const metadata: Metadata = {
  alternates: {
    canonical: PAGE_URL,
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default function OldDVDsAndCDsGuideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
