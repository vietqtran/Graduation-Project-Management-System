import React from 'react'
import EditProjectPage from '../../_components/screens/edit/edit-project-page'

const EditProject = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return <EditProjectPage id={id} />
}

export default EditProject
