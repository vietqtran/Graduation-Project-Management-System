import { asyncHandler } from "@/helpers/async-handler"
import { ResponseHandler } from "@/middlewares/response-handler.middleware"
import { PublicService } from "@/services/public.service"
import { NextFunction, Request, Response } from "express"

export class PublicController {
    private readonly publicService: PublicService
    constructor() {
        this.publicService = new PublicService()
    }

    getAllCampuses = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const campuses = await this.publicService.getAllCampuses()
        return ResponseHandler.sendSuccess(res, campuses)
    })

    getAllFields = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const fields = await this.publicService.getAllFields()
        return ResponseHandler.sendSuccess(res, fields)
    })

    getAllMajors = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const majors = await this.publicService.getAllMajors()
        return ResponseHandler.sendSuccess(res, majors)
    })
}