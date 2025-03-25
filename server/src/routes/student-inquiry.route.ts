import { StudentInquiryController } from '@/controllers/student-inquiry.controller'
import {
  StaffAnswerStudentInquiryDto,
  StaffGetListStudentInquiriesDto
} from '@/dtos/student-inquiry/manage-student-inquiry.dto'
import { StudentCreateInquiryDto, StudentGetListInquiriesDto } from '@/dtos/student-inquiry/student-inquiry.dto'
import { validateDto } from '@/middlewares/validate.middleware'
import { Router } from 'express'

const router = Router()
const studentInquiryController = new StudentInquiryController()

router.post(
  '/student-create-inquiry',
  validateDto(StudentCreateInquiryDto),
  studentInquiryController.studentCreateInquiry
)
router.post(
  '/student-get-list-inquiries',
  validateDto(StudentGetListInquiriesDto),
  studentInquiryController.studentGetListInquiries
)
router.post(
  '/staff-answer-student-inquiry',
  validateDto(StaffAnswerStudentInquiryDto),
  studentInquiryController.staffAnswerStudentInquiry
)
router.post(
  '/staff-get-list-student-inquiries',
  validateDto(StaffGetListStudentInquiriesDto),
  studentInquiryController.staffGetListStudentInquiries
)

export { router as studentInquiryRoutes }
