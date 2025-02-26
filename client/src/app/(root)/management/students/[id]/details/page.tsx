import React from 'react'
import StudentDetailsPage from '../../_components/screens/details/student-details-page'

const StudentDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return <StudentDetailsPage id={id} />
}

export default StudentDetails
