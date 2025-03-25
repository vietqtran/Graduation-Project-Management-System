'use client'

import { useAppSelector, useProject } from '@/hooks'

import Image from 'next/image'
import { LineMdLoadingLoop } from '@/components/icons/Loading'
import Link from 'next/link'
import ProjectDetails from './ProjectDetails'
import ProjectList from './ProjectList'
import React from 'react'

interface ProjectPageProps {
  id?: string
}

const ProjectPage = ({ id }: ProjectPageProps) => {
  const { project, isLoading, projects } = useProject(id)
  const { user } = useAppSelector((state) => state.auth)
  if (user?.roles.includes('supervisor') && !id) {
    return <ProjectList projects={projects} />
  } else if (project) {
    return <ProjectDetails project={project} />
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

export default ProjectPage
