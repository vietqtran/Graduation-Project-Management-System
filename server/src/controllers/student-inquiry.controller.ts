import { asyncHandler } from '@/helpers/async-handler'
import { getUser } from '@/helpers/auth-helper'
import { ResponseHandler } from '@/middlewares/response-handler.middleware'
import { StudentInquiryService } from '@/services/student-inquiry.service'
import { NextFunction, Request, Response } from 'express'

export class StudentInquiryController {
  private readonly studentInquiryService: StudentInquiryService

  constructor() {
    this.studentInquiryService = new StudentInquiryService()
  }

  studentCreateInquiry = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body
    const tokenPayload = getUser(req)
    await this.studentInquiryService.studentCreateInquiry(body, tokenPayload)
    ResponseHandler.sendSuccess(res, null, 'Create inquiry successfully')
  })

  studentGetListInquiries = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body
    const inquiries = await this.studentInquiryService.studentGetListInquiries(body)
    ResponseHandler.sendSuccess(res, inquiries)
  })

  staffAnswerStudentInquiry = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body
    const tokenPayload = getUser(req)
    await this.studentInquiryService.staffAnswerStudentInquiry(body, tokenPayload)
    ResponseHandler.sendSuccess(res, null, 'Answer inquiry successfully')
  })

  staffGetListStudentInquiries = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body
    const inquiries = await this.studentInquiryService.staffGetListStudentInquiries(body)
    ResponseHandler.sendSuccess(res, inquiries)
  })
}
