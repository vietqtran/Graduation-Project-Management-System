import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Review idea'
}

export default function ReviewIdeaLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
