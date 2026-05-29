import type { Metadata } from 'next'
import { Space_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-mono',
})

export const metadata: Metadata = {
  title: 'Army Bookmark - info seputar konser untuk ARMY Indonesia',
  description: 'Kurasi manual info konser BTS dari berbagai sumber untuk ARMY Indonesia',
  openGraph: {
    type: 'website',
    url: 'https://army-bookmark.github.io/',
    title: 'Army Bookmark - info seputar konser untuk ARMY Indonesia',
    description: 'Kurasi manual info konser BTS dari berbagai sumber untuk ARMY Indonesia',
    images: [{ url: 'https://army-bookmark.github.io/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: 'army-bookmark.github.io',
    title: 'Army Bookmark - info seputar konser untuk ARMY Indonesia',
    description: 'Kurasi manual info konser BTS dari berbagai sumber untuk ARMY Indonesia',
    images: ['https://army-bookmark.github.io/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={spaceMono.variable}>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1BTFQD5SL4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1BTFQD5SL4');
          `}
        </Script>
      </body>
    </html>
  )
}