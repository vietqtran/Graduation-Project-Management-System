'use client'

import { useAppSelector, useRouter } from '@/hooks'
import UseIdea from '@/hooks/useIdea'
import CreateIdeaStudent from './CreateIdeaStudent'
import Image from 'next/image'
import React from 'react'
import { toast } from 'sonner'

export default function CreateIdeaPage() {
  const { project, isLoading } = UseIdea()
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)

  if (!user?.roles.includes('student')) {
    toast.error('You are not a student')
    router.back()
    return null
  }

  if (isLoading) {
    return (
      <div className='text-center'>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md border border-gray-300'>
      {project ? (
        <div className='w-full flex items-center justify-center flex-col'>
          <Image width={500} height={500} src='/images/empty-box.png' alt='loading' />
          <p className='text-center text-red-600'>Please leave the current group if you want to create a new idea</p>
        </div>
      ) : (
        <CreateIdeaStudent />
      )}
    </div>
  )
}
