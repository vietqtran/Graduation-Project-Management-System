'use client'
import { useAppSelector } from '@/hooks'
import React from 'react'
import StudentInquiry from './student/student-inquiry'
import StaffInquiry from './staff/staff-inquiry'

const InquiryPage = () => {
  const { user } = useAppSelector((state) => state.auth)

  const renderer = user?.roles.includes('student') ? <StudentInquiry /> : <StaffInquiry />

  return renderer
}

export default InquiryPage
