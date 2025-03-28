import { User } from './user.type'
import { STUDENT_INQUIRY_STATUS } from '@/constants/status.enum'
export interface StudentInquiry {
  _id: string
  studentId: string
  student: User
  title: string
  content: string
  status: STUDENT_INQUIRY_STATUS.PROCESSING | STUDENT_INQUIRY_STATUS.APPROVED
  created_at: string
  updated_at: string
  answer?: string
  answered_at?: string
}

export interface StudentInquiryResponse {
  success: boolean
  message: string
  data: StudentInquiry
}

export interface StudentInquiryListResponse {
  success: boolean
  message: string
  data: {
    list: StudentInquiry[]
    total: number
  }
}

export interface CreateStudentInquiryRequest {
  title: string
  content: string
}

export interface UpdateStudentInquiryRequest {
  title?: string
  content?: string
  status?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'
}

export interface StudentInquiryQueryParams {
  page?: number
  limit?: number
  status?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'
  sort?: Record<'created_at' | 'answered_at', 1 | -1>
}
