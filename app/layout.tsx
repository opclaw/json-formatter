import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://jsonformatter.vercel.app'),
  title: 'JSON Formatter & Validator — Free Online Tool',
  description: 'Format, validate, and beautify JSON data online. Free JSON formatter with syntax highlighting, tree view, and error detection.',
  keywords: ['json formatter', 'json validator', 'json beautifier', 'json parser', 'format json', 'validate json'],
  authors: [{ name: 'JSON Formatter' }],
  alternates: {
    canonical: 'https://jsonformatter.vercel.app',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jsonformatter.vercel.app',
    siteName: 'JSON Formatter',
    title: 'JSON Formatter & Validator — Free Online Tool',
    description: 'Format, validate, and beautify JSON data online.',
    images: [{
      url: '/og-image.svg',
      width: 1200,
      height: 630,
      alt: 'JSON Formatter - Free Online Tool',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Formatter & Validator',
    description: 'Format, validate, and beautify JSON data online.',
    images: ['/og-image.svg'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'JSON Formatter',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Any',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              featureList: 'JSON formatting, Validation, Syntax highlighting, Tree view, Minification',
            })
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}