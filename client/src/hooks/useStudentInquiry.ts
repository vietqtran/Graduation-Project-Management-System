/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from '@/utils/axios'
import { toast } from 'sonner'
import { STUDENT_INQUIRY_STATUS } from '@/constants/status.enum'
const useStudentInquiry = () => {
  const studentCreateInquiry = async ({ title, content }: { title: string; content: string }) => {
    try {
      const payload = { title, content }
      const response = await axios.post(
        '/student-inquiry/student-create-inquiry',
        { ...payload },
        {
          withCredentials: true
        }
      )

      const { data } = response
      if (data && data?.success === true) {
        toast.success(data?.message)
        return data?.success
      }
      return null
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'An error occurred')
      return null
    }
  }

  const studentGetListInquiries = async ({
    status,
    page,
    limit,
    sort
  }: {
    status?: STUDENT_INQUIRY_STATUS.PROCESSING | STUDENT_INQUIRY_STATUS.APPROVED
    page?: number
    limit?: number
    sort?: Record<'created_at' | 'answered_at', 1 | -1>
  }) => {
    try {
      const payload = { status, page, limit, sort }
      const response = await axios.post(
        '/student-inquiry/student-get-list-inquiries',
        { ...payload },
        {
          withCredentials: true
        }
      )

      const { data } = response
      if (data && data?.success === true) {
        return data?.data
      }
      return null
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'An error occurred')
      return null
    }
  }

  const staffAnswerStudentInquiry = async ({ _id, answer }: { _id: string; answer: string }) => {
    try {
      const payload = { _id, answer }
      const response = await axios.post(
        '/student-inquiry/staff-answer-student-inquiry',
        { ...payload },
        {
          withCredentials: true
        }
      )

      const { data } = response
      if (data && data?.success === true) {
        toast.success(data?.message)
        return data?.success
      }
      return null
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'An error occurred')
      return null
    }
  }

  const staffGetListStudentInquiries = async ({
    status,
    page,
    limit,
    sort
  }: {
    status?: STUDENT_INQUIRY_STATUS.PROCESSING | STUDENT_INQUIRY_STATUS.APPROVED
    page?: number
    limit?: number
    sort?: Record<'created_at' | 'answered_at', 1 | -1>
  }) => {
    try {
      const payload = { status, page, limit, sort }
      const response = await axios.post(
        '/student-inquiry/staff-get-list-student-inquiries',
        { ...payload },
        {
          withCredentials: true
        }
      )
      const { data } = response
      if (data && data?.success === true) {
        return data?.data
      }
      return null
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'An error occurred')
      return null
    }
  }

  const staffGetInquiryById = async ({ _id }: { _id: string }) => {
    try {
      const payload = { _id }
      const response = await axios.post(
        '/student-inquiry/staff-get-inquiry-by-id',
        { ...payload },
        { withCredentials: true }
      )
      const { data } = response
      if (data && data?.success === true) {
        return data?.data
      }
      return null
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'An error occurred')
      return null
    }
  }

  return {
    studentCreateInquiry,
    studentGetListInquiries,
    staffAnswerStudentInquiry,
    staffGetListStudentInquiries,
    staffGetInquiryById
  }
}
export default useStudentInquiry
