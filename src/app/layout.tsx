import type { Metadata } from 'next'
import { Space_Mono } from 'next/font/google'
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
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
