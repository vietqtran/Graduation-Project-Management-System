'use client'

import Image from 'next/image'
import { LineMdLoadingLoop } from '../icons/Loading'
import Link from 'next/link'
import React from 'react'
import { useProject } from '@/hooks'

type Props = {
  children: React.ReactNode
}

const CheckProjectExistsProvider = ({ children }: Props) => {
  const { project, isLoading } = useProject()
  if (project) {
    return children
  }
  return isLoading ? (
    <div className='size-full min-h-[80vh] grid place-items-center'>
      <LineMdLoadingLoop />
    </div>
  ) : (
    <div className='w-full flex items-center justify-center flex-col'>
      <Image width={500} height={500} src='/images/empty-box.png' alt='loading' />
      <p>You don&apos;t have any projects yet. Search for members and create together!</p>
      <Link href={'/create-idea'} className='underline text-blue-500'>
        Click here to create an idea.
      </Link>
    </div>
  )
}

export default CheckProjectExistsProvider
