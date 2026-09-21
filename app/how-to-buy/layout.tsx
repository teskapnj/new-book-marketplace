import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Buy | SellBookMedia',

  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function HowToBuyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}