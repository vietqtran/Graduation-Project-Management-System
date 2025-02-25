import React from 'react'
import StudentUpdatePage from '../../_components/screens/edit/student-update-page'
import { Params } from 'next/dist/server/request/params'

const EditStudent = ({ params }: { params: Params }) => {
  const { id } = params
  return <StudentUpdatePage id={id as string} />
}

export default EditStudent
