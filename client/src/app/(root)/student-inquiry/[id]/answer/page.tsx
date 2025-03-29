import React from 'react'
import AnswerInquiry from '../../_components/staff/answer-inquiry'

const StaffAnswerInquiry = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return <AnswerInquiry id={id} />
}

export default StaffAnswerInquiry
