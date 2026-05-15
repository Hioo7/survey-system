import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { PWAServiceWorkerRegistration } from '@/components/providers/PWAServiceWorkerRegistration'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const viewport: Viewport = {
  themeColor: '#1e293b',
}

export const metadata: Metadata = {
  title: 'Staff Portal',
  description: 'Build surveys, manage your team, and collect responses.',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Staff Portal' },
  formatDetection: { telephone: false },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PWAServiceWorkerRegistration />
        {children}
      </body>
    </html>
  )
}
