import React from 'react'
import TeacherUpdatePage from '../../_components/screens/edit/teacher-update-page'

const UpdateTeacher = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return <TeacherUpdatePage id={id} />
}

export default UpdateTeacher
