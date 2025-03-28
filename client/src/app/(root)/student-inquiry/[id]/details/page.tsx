import React from 'react'
import InquiryDetailsPage from '../../_components/inquiry-details'

const InquiryDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return <InquiryDetailsPage id={id} />
}

export default InquiryDetails
