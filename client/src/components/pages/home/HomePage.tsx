'use client'

import React, { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from '@/hooks/useRouter'

const HomePage = () => {
  const { me, logOut } = useAuth()
  const { replace } = useRouter()
  const [currentUser, setCurrentUser] = React.useState(null)
  useEffect(() => {
    const fetchMe = async () => {
      const res = await me()
      setCurrentUser(res)
    }
    fetchMe()
  }, [])

  const handleLogOut = async () => {
    await logOut()
    replace('/auth/sign-in')
  }

  return (
    <div>
      {JSON.stringify(currentUser)}
      <Button onClick={handleLogOut}>Logout</Button>
    </div>
  )
}

export default HomePage
