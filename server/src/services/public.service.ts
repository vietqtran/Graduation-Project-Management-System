import { runTransaction } from '@/helpers/transaction-helper'
import CampusModel, { ICampus } from '@/models/campus.model'
import FieldModel, { IField } from '@/models/field.model'
import MajorModel, { IMajor } from '@/models/major.model'
import { HttpException } from '@/shared/exceptions/http.exception'
import { Model } from 'mongoose'

export class PublicService {
  private readonly campusModel: Model<ICampus>
  private readonly fieldModel: Model<IField>
  private readonly majorModel: Model<IMajor>

  constructor() {
    this.campusModel = CampusModel
    this.fieldModel = FieldModel
    this.majorModel = MajorModel
  }

  async getAllCampuses() {
    return runTransaction(async (session) => {
      const campuses = await this.campusModel.find().session(session)
      if (!campuses) {
        throw new HttpException('Error at getting campuses', 400)
      }
      return campuses
    })
  }

  async getAllFields() {
    return runTransaction(async (session) => {
      const fields = await this.fieldModel.find().session(session)
      if (!fields) {
        throw new HttpException('Error at getting fields', 400)
      }
      return fields
    })
  }

  async getAllMajors() {
    return runTransaction(async (session) => {
      const majors = await this.majorModel.find().session(session)
      if (!majors) {
        throw new HttpException('Error at getting majors', 400)
      }
      return majors
    })
  }
}
