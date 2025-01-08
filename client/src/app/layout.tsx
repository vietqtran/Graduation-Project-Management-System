import './globals.css'

import { DM_Sans } from 'next/font/google'
import type { Metadata } from 'next'
import StoreProvider from '@/components/providers/StoreProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

const dmSans = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning={true}>
      <body className={`antialiased ${dmSans.className}`}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <StoreProvider>{children}</StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
