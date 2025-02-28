import mongoose, { Model } from 'mongoose'

import InviteModel, { IInvite } from '@/models/invite.model'
import { InviteDto } from '@/dtos/invite/invite.dto'
import { HttpException } from '@/shared/exceptions/http.exception'
import { runTransaction } from '@/helpers/transaction-helper'
import { InviteStatus } from '@/constants/invite-status-enum'
import UserModel, { IUser } from '@/models/user.model'
import ProjectModel, { IProject } from '@/models/project.model'

export class InviteService {
  private readonly inviteModel: Model<IInvite>
  private readonly userModel: Model<IUser>
  private readonly projectModel: Model<IProject>

  constructor() {
    this.inviteModel = InviteModel
    this.userModel = UserModel
    this.projectModel = ProjectModel
  }

  async sendInvite(inviteData: InviteDto): Promise<IInvite> {
    const requiredFields: (keyof InviteDto)[] = ['from_user', 'to_user', 'project']
    const missingFields = requiredFields.filter((field) => !inviteData[field])

    if (missingFields.length > 0) {
      throw new HttpException(`${missingFields.join(', ')} are required`, 400)
    }
    return runTransaction(async (session) => {
      const { from_user, to_user, project } = inviteData

      // Kiểm tra xem to_user đã là thành viên của nhóm chưa
    const existingProject = await this.projectModel.findById(project).session(session)

    if (!existingProject) {
      throw new HttpException('Project not found', 404)
    }
    if(from_user === to_user) {
        throw new HttpException('You cannot invite yourself', 400)
      }
    if (existingProject.members.includes(to_user)) {
        throw new HttpException('User is already a member of the project', 400)
      }
      const invite = new this.inviteModel(inviteData)
      await invite.save({ session })
      return invite
    })
  }

  async getAllInvites(status?: InviteStatus) {
    const query = status ? { status } : {}
    return this.inviteModel.find(query).populate('from_user').populate('to_user').populate('project')
  }

  async getInvitesOfUser(userId: string, status?: InviteStatus) {
    const query = status ? { status } : {}
    return this.inviteModel.find({ to_user: userId }, query).populate('from_user').populate('project')
  }
  async acceptInvite(inviteId: string) {
    return runTransaction(async (session) => {
      const invite = await this.inviteModel.findById(inviteId).session(session)
      if (!invite) {
        throw new HttpException('Invite not found', 404)
      }
      if (invite.status !== InviteStatus.PENDING) {
        throw new HttpException('Request has already been processed', 400)
      }
      invite.status = InviteStatus.APPROVED
      await invite.save({ session })

      const project = await this.projectModel.findById(invite?.project).session(session)
      if (!project) {
        throw new HttpException('Project not found', 404)
      }
      const user = await this.userModel.findById(invite?.to_user).session(session)
      if (!user) {
        throw new HttpException('User not found', 404)
      }
      project.members.push(user._id)
      if (user.roles && user.roles.includes('supervisor')) {
        project.supervisor.push(user._id)
      }

      await project.save({ session })
      return invite
    })
  }
  async rejectInvite(inviteId: string) {
    return runTransaction(async (session) => {
      const invite = await this.inviteModel.findById(inviteId).session(session)
      if (!invite) {
        throw new HttpException('Invite not found', 404)
      }
      if (invite.status !== InviteStatus.PENDING) {
        throw new HttpException('Request has already been processed', 400)
      }
      invite.status = InviteStatus.REJECTED
      await invite.save({ session })
      return invite
    })
  }
}
