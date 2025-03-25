import { CreateDocumentDto, UpdateDocumentDto } from '@/dtos/project/document.dto'
import ProjectModel, { IProject } from '@/models/project.model'
import UploadDocument, { IUploadDocument } from '@/models/document.model'

import { HttpException } from '@/shared/exceptions/http.exception'
import { Model } from 'mongoose'
import { STATUS_MASTER } from '@/constants/status'
import { runTransaction } from '@/helpers/transaction-helper'

export class UploadDocumentService {
  private readonly uploadDocumentModel: Model<IUploadDocument>
  private readonly projectModel: Model<IProject>

  constructor() {
    this.uploadDocumentModel = UploadDocument
    this.projectModel = ProjectModel
  }
  /**
   * Create a new document
   */
  async createDocument(documentData: CreateDocumentDto): Promise<IUploadDocument> {
    return runTransaction(async (session) => {
      const document = new this.uploadDocumentModel(documentData)
      const savedDocument = await document.save()
      await this.projectModel.findByIdAndUpdate(documentData.project_id, { $push: { documents: savedDocument._id } })
      return savedDocument
    })
  }

  /**
   * Get document by ID
   */
  async getDocumentById(id: string): Promise<IUploadDocument | null> {
    return runTransaction(async (session) => {
      const document = await UploadDocument.findById(id)
        .populate('user', 'username email display_name')
        .populate('project_id', 'name')
        .session(session)

      if (!document) {
        throw new HttpException('Document not found', 404)
      }
      return document
    })
  }

  /**
   * Get documents by user ID
   */
  async getDocumentsByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ documents: IUploadDocument[]; total: number }> {
    return runTransaction(async (session) => {
      const skip = (page - 1) * limit

      const [documents, total] = await Promise.all([
        UploadDocument.find({ user: userId })
          .populate('user', 'username email display_name')
          .populate('project_id', 'name')
          .skip(skip)
          .limit(limit)
          .sort({ created_at: -1 })
          .session(session),
        UploadDocument.countDocuments({ user: userId }).session(session)
      ])

      return { documents, total }
    })
  }

  /**
   * Get documents by project ID
   */
  async getDocumentsByProjectId(
    projectId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ documents: IUploadDocument[]; total: number }> {
    return runTransaction(async (session) => {
      const skip = (page - 1) * limit

      const [documents, total] = await Promise.all([
        UploadDocument.find({ project_id: projectId })
          .populate('user', 'username email display_name avatar display_name')
          .populate('project_id', 'name')
          .skip(skip)
          .limit(limit)
          .sort({ created_at: -1 })
          .session(session),
        UploadDocument.countDocuments({ project_id: projectId }).session(session)
      ])

      return { documents, total }
    })
  }

  /**
   * Update document by ID
   */
  async updateDocument(id: string, updateData: UpdateDocumentDto): Promise<IUploadDocument | null> {
    return runTransaction(async (session) => {
      const document = await UploadDocument.findByIdAndUpdate(id, { $set: updateData }, { new: true })
        .populate('user', 'username email display_name')
        .populate('project_id', 'name')
        .session(session)

      if (!document) {
        throw new HttpException('Document not found', 404)
      }

      return document
    })
  }

  /**
   * Delete document by ID
   */
  async deleteDocument(id: string): Promise<void> {
    return runTransaction(async (session) => {
      const document = await UploadDocument.findByIdAndDelete(id).session(session)

      if (!document) {
        throw new HttpException('Document not found', 404)
      }
    })
  }

  /**
   * Delete multiple documents by IDs
   */
  async deleteMultipleDocuments(ids: string[]): Promise<void> {
    try {
      await UploadDocument.deleteMany({ _id: { $in: ids } })
    } catch (error) {
      throw new HttpException('Failed to delete documents', 400)
    }
  }

  /**
   * Delete all documents by project ID
   */
  async deleteDocumentsByProjectId(projectId: string): Promise<void> {
    return runTransaction(async (session) => {
      await UploadDocument.deleteMany({ project_id: projectId }).session(session)
    })
  }
}
