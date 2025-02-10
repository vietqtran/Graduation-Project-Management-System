'use client'

import React, { useEffect } from 'react'
import { useAuth, useRouter } from '@/hooks'

import Header from './Header'
import SideBar from './SideBar'

type Props = {
  children: React.ReactNode
}

const MainLayout = ({ children }: Props) => {
  const { me } = useAuth()
  const { replace } = useRouter()

  useEffect(() => {
    const fetchMe = async () => {
      const user = await me()
      if (!user) replace('/auth/sign-in')
    }
    fetchMe()
  }, [])

  return (
    <main className='size-full flex items-start min-h-screen relative'>
      <SideBar />
      <Header />
      <div className='overflow-hidden pt-16 size-full relative flex-1'>{children}</div>
    </main>
  )
}

export default MainLayout
