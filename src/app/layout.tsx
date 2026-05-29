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
  title: 'BTS Bookmark — Info Concert untuk ARMY Indonesia',
  description: 'Kurasi info konser BTS dari berbagai sumber untuk ARMY Indonesia',
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
