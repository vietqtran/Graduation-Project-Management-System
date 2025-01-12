import './globals.css'
import 'simplebar-react/dist/simplebar.min.css'

import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import StoreProvider from '@/components/providers/StoreProvider'
import { Toaster } from '@/components/ui/sonner'

const dmSans = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: {
    default: 'GPMS',
    template: '%s | GPMS'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning={true}>
      <body className={`antialiased ${dmSans.className}`}>
        <StoreProvider>{children}</StoreProvider>
        <Toaster richColors position='bottom-center' />
      </body>
    </html>
  )
}
