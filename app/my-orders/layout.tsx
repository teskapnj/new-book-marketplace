import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders | SellBookMedia",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function MyOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
