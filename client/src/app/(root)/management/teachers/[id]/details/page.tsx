import React from 'react'
import TeacherDetailPage from '../../_components/screens/details/teacher-detail-page'

const TeacherDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return <TeacherDetailPage id={id} />
}

export default TeacherDetails
