'use client'

import Header from './Header'
import React from 'react'
import SideBar from './SideBar'

type Props = {
  children: React.ReactNode
}

const MainLayout = ({ children }: Props) => {
  return (
    <main className='size-full flex items-start min-h-screen relative'>
      <SideBar />
      <Header />
      <div className='overflow-hidden pt-16 size-full relative flex-1'>{children}</div>
    </main>
  )
}

export default MainLayout
