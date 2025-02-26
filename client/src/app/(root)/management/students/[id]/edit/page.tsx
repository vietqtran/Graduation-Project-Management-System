import React from 'react'
import StudentUpdatePage from '../../_components/screens/edit/student-update-page'

const EditStudent = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return <StudentUpdatePage id={id as string} />
}

export default EditStudent
