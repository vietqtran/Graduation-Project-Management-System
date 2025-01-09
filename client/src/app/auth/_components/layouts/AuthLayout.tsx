'use client'

import React, { useEffect } from 'react'

import ThemeSwitcher from '../ui/ThemeSwitcher'
import { useAuth } from '@/hooks'
import { useRouter } from '@/hooks/useRouter'

type Props = {
  children: React.ReactNode
}

const AuthLayout = ({ children }: Props) => {
  const { me } = useAuth()
  const { replace } = useRouter()
  const [isPending, setIsPending] = React.useState(true)

  useEffect(() => {
    const fetchMe = async () => {
      const res = await me()
      if (res) {
        replace('/')
      } else {
        setIsPending(false)
      }
    }
    fetchMe()
  }, [])

  return isPending ? null : (
    <main className='grid md:grid-cols-2 relative min-h-screen min-w-full'>
      <div className='p-3 hidden md:block lg:pr-0 col-span-1 size-full '>
        <div className="bg-neutral-700 size-full rounded-lg overflow-hidden bg-[url('/images/auth-cover.jpg')] bg-no-repeat bg-center bg-cover">
          <div className='size-full bg-black/40'></div>
        </div>
      </div>
      <div className='col-span-1 size-full grid place-items-center py-3 lg:py-10 px-3'>{children}</div>
      <div className='fixed top-3 right-3'>
        <ThemeSwitcher />
      </div>
    </main>
  )
}

export default AuthLayout
