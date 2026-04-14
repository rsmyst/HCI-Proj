import type { Metadata } from 'next'
import { Space_Grotesk, Fraunces } from 'next/font/google'
import { ThemeProvider } from './context/ThemeContext'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'IRCTC — Indian Railway Catering and Tourism Corporation',
  description: 'Book train tickets, check PNR status, and explore holiday packages on India\'s official railway booking platform.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${fraunces.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
