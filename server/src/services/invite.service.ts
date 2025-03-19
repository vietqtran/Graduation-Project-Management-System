import mongoose, { Model } from 'mongoose'

import InviteModel, { IInvite } from '@/models/invite.model'
import { InviteDto } from '@/dtos/invite/invite.dto'
import { HttpException } from '@/shared/exceptions/http.exception'
import { runTransaction } from '@/helpers/transaction-helper'
import { InviteStatus } from '@/constants/invite-status-enum'
import UserModel, { IUser } from '@/models/user.model'
import ProjectModel, { IProject } from '@/models/project.model'
import { USER_STATUS } from '@/constants/status'
import { EmailQueue } from '@/queues/email.queue'
import { MailService } from './mail.service'
import { format } from 'date-fns'

export class InviteService {
  private readonly inviteModel: Model<IInvite>
  private readonly userModel: Model<IUser>
  private readonly projectModel: Model<IProject>
  private readonly emailQueue: EmailQueue
  private readonly mailService: MailService

  constructor() {
    this.inviteModel = InviteModel
    this.userModel = UserModel
    this.projectModel = ProjectModel
    this.mailService = new MailService()
    this.emailQueue = new EmailQueue(this.mailService)
  }
  async sendInvite(inviteData: InviteDto) {
    const maxNumberOfSupervisorJoin = 5
    const requiredFields: (keyof InviteDto)[] = ['from_user', 'to_user', 'project']
    const missingFields = requiredFields.filter((field) => !inviteData[field])

    if (missingFields.length > 0) {
      throw new HttpException(`${missingFields.join(', ')} are required`, 400)
    }
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const { from_user, to_user, project } = inviteData
      const existingUser = await this.userModel.findOne({ email: to_user }).session(session)
      const fromUser = await this.userModel.findOne({ _id: { $eq: from_user } }).session(session)
      if (!existingUser) {
        throw new HttpException('User with the provided email does not exist', 404) // Kiểm tra xem user đã tồn tại trong ứng dụng chưa
      }
      const existingProject = await this.projectModel.findById(project).session(session)
      if (!existingProject) {
        throw new HttpException('Project not found', 404) // Kiểm tra xem project đó có tồn tại không
      }
      if (existingUser.roles?.includes('student')) {
        if (from_user === existingUser._id) {
          throw new HttpException('You cannot invite yourself', 400) // Kiểm tra xem người gửi có phải là người nhận không
        }
        if (existingProject.members.includes(existingUser._id)) {
          throw new HttpException('User is already a member of the project', 400) // Kiểm tra xem user đã là thành viên của project đó chưa
        }
        const checkInOtherProject = await this.projectModel
          .findOne({
            members: { $in: [existingUser?._id] }
          })
          .session(session)
        if (checkInOtherProject) {
          throw new HttpException('User is already a member of another project', 400) // Kiểm tra xem user đã là thành viên của project khác chưa
        }
      } else if (existingUser.roles?.includes('supervisor')) {
        if (from_user === existingUser._id) {
          throw new HttpException('You cannot invite yourself', 400) // Kiểm tra xem người gửi có phải là người nhận không
        }
        if (existingProject.supervisor.includes(existingUser._id)) {
          throw new HttpException('User is already a supervisor of the project', 400) // Kiểm tra xem user là người hướng dẫn của project đó chưa
        }
        const numberOfSupervisorJoin = await this.projectModel.find({
          supervisor: { $in: [existingUser?._id] }
        })
        if (numberOfSupervisorJoin.length >= maxNumberOfSupervisorJoin) {
          throw new HttpException('The supervisor has reached the maximum number of projects', 400)
        }
      }
      const existingInvite = await this.inviteModel
        .findOne({
          from_user,
          to_user: existingUser._id,
          project: existingProject._id,
          status: InviteStatus.PENDING
        })
        .session(session)

      if (existingInvite) {
        existingInvite.set('status', InviteStatus.PENDING)
        existingInvite.set('updated_at', new Date())
        await existingInvite.save({ session }) // Mongoose sẽ tự động cập nhật `updated_at`
        await session.commitTransaction()
        this.emailQueue.addEmailJob({
          to: existingUser.email, // Gửi đến người được mời
          subject: 'You have been invited to join a project',
          templateName: 'invite-project', // Tên template sẽ được sử dụng
          context: {
            from_user_name: fromUser?.display_name,
            to_user_name: existingUser.display_name,
            project_name: existingProject.name, // Tên dự án
            inviteUrl: `${process.env.CLIENT_URL}/my-request`, // URL mời tham gia
            sentTime: format(new Date(), 'h:mm a dd/MM/yyyy') // Thời gian gửi
          }
        })
        return existingInvite
      } else {
        const createInvite = await this.inviteModel.create(
          [
            {
              from_user,
              to_user: existingUser._id,
              project: existingProject._id,
              status: InviteStatus.PENDING
            }
          ],
          { session }
        )
        if (!createInvite[0]) {
          throw new HttpException("Can't create invite", 500)
        }
        await session.commitTransaction()
        this.emailQueue.addEmailJob({
          to: existingUser.email, // Gửi đến người được mời
          subject: 'You have been invited to join a project',
          templateName: 'invite-project', // Tên template sẽ được sử dụng
          context: {
            from_user_name: fromUser?.display_name,
            to_user_name: existingUser.display_name,
            project_name: existingProject.name, // Tên dự án
            inviteUrl: `${process.env.CLIENT_URL}/my-request`, // URL mời tham gia
            sentTime: format(new Date(), 'h:mm a dd/MM/yyyy') // Thời gian gửi
          }
        })
        return createInvite[0]
      }
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }
  async getAllInvites(status?: InviteStatus) {
    const query = status ? { status } : {}
    return this.inviteModel.find(query).populate('from_user').populate('to_user').populate('project')
  }

  async getInvitesOfUser(userId: string, status?: InviteStatus) {
    const query = status ? { status } : {}
    return this.inviteModel
      .find({ to_user: userId }, query)
      .populate('from_user')
      .populate({
        path: 'project',
        populate: [
          { path: 'members' },
          { path: 'major' },
          { path: 'field' },
          { path: 'campus' },
          { path: 'supervisor' }
        ]
      })
  }
  async acceptInvite(inviteId: string) {
    const maxMember = 5
    const maxSupervisor = 2
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
      if (user.roles && user.roles?.includes('student')) {
        if (project.members.length >= maxMember) {
          invite.status = InviteStatus.REJECTED
          await invite.save({ session })
          throw new HttpException('Project has reached the maximum number of members', 400)
        } else {
          project.members.push(user._id)
        }
      } else if (user.roles && user.roles?.includes('supervisor')) {
        if (project.supervisor.length >= maxSupervisor) {
          invite.status = InviteStatus.REJECTED
          await invite.save({ session })
          throw new HttpException('Project has reached the maximum number of supervisors', 400)
        } else {
          project.supervisor.push(user._id)
        }
      }
      await project.save({ session })
      await this.userModel.updateOne({ _id: invite.to_user }, { $set: { status: USER_STATUS.ACTIVATED } }, { session })

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
