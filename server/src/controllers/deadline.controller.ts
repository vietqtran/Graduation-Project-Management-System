import { GetDeadlinesDto, UpdateDeadlineDto } from "@/dtos/deadline/deadline.dto";
import { asyncHandler } from "@/helpers/async-handler";
import { getUser } from "@/helpers/auth-helper";
import { ResponseHandler } from "@/middlewares/response-handler.middleware";
import { DeadlineService } from "@/services/deadline.service";
import { TokenPayload } from "@/shared/interfaces/token-payload.interface";
import { NextFunction, Request, Response } from "express";


export class DeadlineController {
    private readonly deadlineService: DeadlineService
    constructor() {
        this.deadlineService = new DeadlineService()
    }

    getAllDeadlinesBySemester = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const dto : GetDeadlinesDto= req.body;
        const user = getUser(req);
        const deadlines = await this.deadlineService.getAllDeadlinesBySemester(dto, user);
        return ResponseHandler.sendSuccess(res, deadlines, "Get list successfully")
    })

    updateDeadline = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const dto : UpdateDeadlineDto = req.body;
        const user : TokenPayload = req.user as TokenPayload;
        const deadline = await this.deadlineService.updateDeadline(dto, user);
        return ResponseHandler.sendSuccess(res, deadline)
    })


}