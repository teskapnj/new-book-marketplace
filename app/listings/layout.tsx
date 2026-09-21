import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Listings | SellBookMedia',

  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function ListingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}