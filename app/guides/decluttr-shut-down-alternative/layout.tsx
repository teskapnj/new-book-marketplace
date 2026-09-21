import type { Metadata } from 'next'

const PAGE_URL =
  'https://www.sellbookmedia.com/guides/decluttr-shut-down-alternative'

export const metadata: Metadata = {
  alternates: {
    canonical: PAGE_URL,
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default function DecluttrAlternativeGuideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
