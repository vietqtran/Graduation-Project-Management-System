import AuthLayout from './_components/layouts/AuthLayout'

export default function AuthPageLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AuthLayout>{children}</AuthLayout>
}
