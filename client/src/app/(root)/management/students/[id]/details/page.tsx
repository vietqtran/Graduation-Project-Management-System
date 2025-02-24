import { Params } from 'next/dist/server/request/params'
import React from 'react'
import StudentDetailsPage from '../../_components/screens/details/student-details-page'

const StudentDetails = ({ params }: { params: Params }) => {
  const { id } = params
  return <StudentDetailsPage id={id} />
}

export default StudentDetails
