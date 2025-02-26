import React from 'react'
import ProjectDetailsPage from '../../_components/screens/details/project-details-page'

const ProjectDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return <ProjectDetailsPage id={id} />
}

export default ProjectDetails
