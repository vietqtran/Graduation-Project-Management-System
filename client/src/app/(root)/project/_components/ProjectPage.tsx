'use client'

import ProjectDetails from './ProjectDetails'
import React from 'react'
import { useProject } from '@/hooks'

const ProjectPage = () => {
  const { project } = useProject()
  return <ProjectDetails project={project} />
}

export default ProjectPage
