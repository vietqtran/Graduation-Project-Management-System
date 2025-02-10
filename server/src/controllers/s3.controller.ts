import { Request, Response } from 'express'

import { FileInfo } from '@/types/upload.type'
import { ResponseHandler } from '@/middlewares/response-handler.middleware'
import { S3Service } from '../services/s3.service'
import { asyncHandler } from '@/helpers/async-handler'

export class S3Controller {
  private readonly s3Service: S3Service

  constructor() {
    this.s3Service = new S3Service()
  }

  getPresignedUrl = asyncHandler(async (req: Request, res: Response) => {
    const { files, currentDateTime, userLogin } = req.body

    if (!files || !currentDateTime || !userLogin) {
      ResponseHandler.sendError(res, 'Invalid request body')
      return
    }

    const fileInfos: { [key: string]: FileInfo } = {}
    for (const [key, value] of Object.entries(files)) {
      if (typeof value !== 'object') {
        ResponseHandler.sendError(res, 'Invalid request body')
        return
      }
      fileInfos[key] = value as FileInfo
    }

    const presignedUrls = await this.s3Service.generatePresignedUrls(fileInfos, userLogin)

    ResponseHandler.sendSuccess(res, presignedUrls)
  })
}
