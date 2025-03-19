import mongoose, { Model } from 'mongoose'

import UserModel, { IUser } from '@/models/user.model'
import { HttpException } from '@/shared/exceptions/http.exception'
import { runTransaction } from '@/helpers/transaction-helper'
import ProjectModel, { IProject } from '@/models/project.model'
import { USER_STATUS } from '@/constants/status'

export class SupervisorService {
  private userModel: Model<IUser>
  private projectModel: Model<IProject>

  constructor() {
    this.userModel = UserModel
    this.projectModel = ProjectModel
  }
  async getAllSupervisors() {
    const supervisors = await this.userModel.find({ roles: { $in: ['supervisor'] } }).populate('campus')
    return supervisors
  }
}
