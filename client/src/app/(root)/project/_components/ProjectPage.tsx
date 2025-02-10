'use client'

import Image from 'next/image'
import ProjectDetails from './ProjectDetails'
import React from 'react'
import { useProject } from '@/hooks'

const ProjectPage = () => {
  const { project } = useProject()
  if (project) {
    return <ProjectDetails project={project} />
  }
  return (
    <div className='w-full flex items-center justify-center flex-col'>
      <Image width={500} height={500} src='/images/empty-box.png' alt='loading' />
      <p>You don&apos;t have any projects yet. Search for members and create together!</p>
    </div>
  )
}

export default ProjectPage
