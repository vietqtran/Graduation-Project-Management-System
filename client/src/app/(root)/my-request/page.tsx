'use client'

import MyRequest from './_components/MyRequest'
import React from 'react'
import SubmitRequest from './_components/SubmitRequest'
import { useAppSelector } from '@/hooks'

export default function Team() {
  const { user } = useAppSelector((state) => state.auth)

  if (user?.roles.includes('student')) {
    return (
      <div>
        <SubmitRequest />
      </div>
    )
  }
  return (
    <div>
      <MyRequest />
    </div>
  )
}
