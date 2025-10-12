// app/contact/layout.tsx
import { Metadata } from 'next'

// ✅ CONTACT PAGE METADATA
export const metadata: Metadata = {
  title: 'Contact Us - Customer Support',
  description: 'Get in touch with SellBook Media. Questions about selling, shipping, or payment? Contact our customer support team for help.',
  
  openGraph: {
    title: 'Contact SellBook Media - Customer Support',
    description: 'Have questions? Get in touch with our support team.',
    url: 'https://www.sellbookmedia.com/contact',
  },
  
  alternates: {
    canonical: 'https://www.sellbookmedia.com/contact',
  },
  
  robots: {
    index: true,  // ✅ Google indexlesin
    follow: true,
  },
}

// ✅ CONTACT PAGE SCHEMA (Optional but recommended)
const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  mainEntity: {
    '@type': 'Organization',
    name: 'SellBook Media',
    url: 'https://www.sellbookmedia.com',
    // İletişim bilgileriniz varsa ekleyin:
    email: 'support@sellbookmedia.com',
    
  }
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Schema markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      
      {/* Page content */}
      {children}
    </>
  )
}