import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign in'
}

export default function AuthPageLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
