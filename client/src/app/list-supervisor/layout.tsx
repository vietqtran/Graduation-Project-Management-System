import MainLayout from './_components/layouts/MainLayout'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return <MainLayout>{children}</MainLayout>
}

export default Layout
