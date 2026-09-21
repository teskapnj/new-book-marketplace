import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Subscription | SellBookMedia',

  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function SubscriptionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}