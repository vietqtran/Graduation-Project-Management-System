'use client'
import React from 'react'
import IdeaAndTeam from './IdeaAndTeam'
import Image from 'next/image'
import { LineMdLoadingLoop } from '@/components/icons/Loading'
import useIdea from '@/hooks/useIdea'

export default function TeamPage() {
  const { project, isLoading } = useIdea()

  if (project) {
    return <IdeaAndTeam project={project} />
  }
  return isLoading ? (
    <div className='size-full min-h-[80vh] grid place-items-center'>
      <LineMdLoadingLoop />
    </div>
  ) : (
    <div className='w-full flex items-center justify-center flex-col'>
      <Image width={500} height={500} src='/images/empty-box.png' alt='loading' />
      <p className='text-center text-red-600'>
        You don&apos;t have any projects yet. Search for members and create together!
      </p>
    </div>
  )
}
