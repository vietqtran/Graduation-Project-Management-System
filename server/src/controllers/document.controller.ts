import { Request, Response } from 'express'

import { HttpException } from '@/shared/exceptions/http.exception'
import { ResponseHandler } from '../middlewares/response-handler.middleware'
import { Types } from 'mongoose'
import { UploadDocumentService } from '@/services/document.service'
import { asyncHandler } from '../helpers/async-handler'

export class UploadDocumentController {
  private readonly documentService: UploadDocumentService

  constructor() {
    this.documentService = new UploadDocumentService()
  }

  /**
   * Create a new document
   */
  createDocument = asyncHandler(async (req: Request, res: Response) => {
    const documentData = req.body

    if (!documentData.user || !documentData.project_id) {
      throw new HttpException('User and project ID are required', 400)
    }

    const document = await this.documentService.createDocument(documentData)
    ResponseHandler.sendSuccess(res, document)
  })

  /**
   * Get document by ID
   */
  getDocumentById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid document ID', 400)
    }

    const document = await this.documentService.getDocumentById(id)
    ResponseHandler.sendSuccess(res, document)
  })

  /**
   * Get documents by user ID with pagination
   */
  getDocumentsByUserId = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    if (!Types.ObjectId.isValid(userId)) {
      throw new HttpException('Invalid user ID', 400)
    }

    const result = await this.documentService.getDocumentsByUserId(userId, page, limit)
    ResponseHandler.sendSuccess(res, result)
  })

  /**
   * Get documents by project ID with pagination
   */
  getDocumentsByProjectId = asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    if (!Types.ObjectId.isValid(projectId)) {
      throw new HttpException('Invalid project ID', 400)
    }

    const result = await this.documentService.getDocumentsByProjectId(projectId, page, limit)
    ResponseHandler.sendSuccess(res, result)
  })

  /**
   * Update document by ID
   */
  updateDocument = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const updateData = req.body

    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid document ID', 400)
    }

    const document = await this.documentService.updateDocument(id, updateData)
    ResponseHandler.sendSuccess(res, document)
  })

  /**
   * Delete document by ID
   */
  deleteDocument = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid document ID', 400)
    }

    await this.documentService.deleteDocument(id)
    ResponseHandler.sendSuccess(res, { message: 'Document deleted successfully' })
  })

  /**
   * Delete multiple documents by IDs
   */
  deleteMultipleDocuments = asyncHandler(async (req: Request, res: Response) => {
    const { ids } = req.body

    if (!Array.isArray(ids) || !ids.every((id) => Types.ObjectId.isValid(id))) {
      throw new HttpException('Invalid document IDs', 400)
    }

    await this.documentService.deleteMultipleDocuments(ids)
    ResponseHandler.sendSuccess(res, { message: 'Documents deleted successfully' })
  })

  /**
   * Delete all documents by project ID
   */
  deleteDocumentsByProjectId = asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params

    if (!Types.ObjectId.isValid(projectId)) {
      throw new HttpException('Invalid project ID', 400)
    }

    await this.documentService.deleteDocumentsByProjectId(projectId)
    ResponseHandler.sendSuccess(res, { message: 'Project documents deleted successfully' })
  })
}
