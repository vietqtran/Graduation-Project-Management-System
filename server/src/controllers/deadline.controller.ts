import { GetDeadlinesDto, UpdateDeadlineDto } from "@/dtos/deadline/deadline.dto";
import { asyncHandler } from "@/helpers/async-handler";
import { ResponseHandler } from "@/middlewares/response-handler.middleware";
import { DeadlineService } from "@/services/deadline.service";
import { NextFunction, Request, Response } from "express";

export class DeadlineController {
    private readonly deadlineService: DeadlineService
    constructor() {
        this.deadlineService = new DeadlineService()
    }

    getAllDeadlinesBySemester = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const dto : GetDeadlinesDto= req.body;
        const deadlines = this.deadlineService.getAllDeadlinesBySemester(dto);
        ResponseHandler.sendSuccess(res, deadlines)
    })

    updateDeadline = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const dto : UpdateDeadlineDto = req.body;
        const deadline = this.deadlineService.updateDeadline(dto);
        ResponseHandler.sendSuccess(res, deadline)
    })


}