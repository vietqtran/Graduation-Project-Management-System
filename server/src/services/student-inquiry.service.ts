import { STUDENT_INQUIRY_STATUS } from '@/constants/status'
import {
  StaffAnswerStudentInquiryDto,
  StaffGetListStudentInquiriesDto
} from '@/dtos/student-inquiry/manage-student-inquiry.dto'
import { StudentCreateInquiryDto, StudentGetListInquiriesDto } from '@/dtos/student-inquiry/student-inquiry.dto'
import { runTransaction } from '@/helpers/transaction-helper'
import StudentInquiryModel, { IStudentInquiry } from '@/models/student-inquiry.model'
import { TokenPayload } from '@/shared/interfaces/token-payload.interface'
import { Model } from 'mongoose'

export class StudentInquiryService {
  private readonly studentInquiryModel: Model<IStudentInquiry>

  constructor() {
    this.studentInquiryModel = StudentInquiryModel
  }

  async studentCreateInquiry(body: StudentCreateInquiryDto, user: TokenPayload) {
    return runTransaction(async (session) => {
      const { content, title } = body
      await this.studentInquiryModel.create(
        { title, content, status: STUDENT_INQUIRY_STATUS.PROCESSING, created_by: user._id, updated_by: user._id },
        { session }
      )
    })
  }

  async studentGetListInquiries(body: StudentGetListInquiriesDto) {
    return runTransaction(async (session) => {
      const { status, page, limit, sort } = body
      const filter: any = {}

      if (status) filter.status = status

      const inquiries = await this.studentInquiryModel
        .find(filter)
        .populate({
          path: 'created_by',
          select: '_id display_name username email avatar'
        })
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .select('_id title content status created_at created_by answer answered_at')
        .session(session)

      return {
        list: inquiries,
        total: inquiries.length
      }
    })
  }

  async staffAnswerStudentInquiry(body: StaffAnswerStudentInquiryDto, user: TokenPayload) {
    return runTransaction(async (session) => {
      const { _id, answer } = body
      await this.studentInquiryModel.updateOne(
        { _id },
        {
          answer,
          status: STUDENT_INQUIRY_STATUS.APPROVED,
          answered_by: user._id,
          answered_at: Date.now(),
          updated_by: user._id
        },
        { session }
      )
    })
  }

  async staffGetListStudentInquiries(body: StaffGetListStudentInquiriesDto) {
    return runTransaction(async (session) => {
      const { status, page, limit, sort } = body
      const filter: any = {}

      if (status) filter.status = status

      const inquiries = await this.studentInquiryModel
        .find(filter)
        .populate({
          path: 'created_by',
          select: '_id display_name username email avatar'
        })
        .populate({
          path: 'answered_by',
          select: '_id display_name username email avatar'
        })
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .select('_id title content status answer answered_at answered_by created_at created_by')
        .session(session)

      return {
        list: inquiries,
        total: inquiries.length
      }
    })
  }
}
