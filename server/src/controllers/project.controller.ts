import { NextFunction, Request, Response } from 'express'

import { ProjectService } from '@/services/project.service'
import { ResponseHandler } from '@/middlewares/response-handler.middleware'
import { StaffGetListProjectsDto } from '@/dtos/project/staff-manage-projects.dto'
import { asyncHandler } from '@/helpers/async-handler'
import { getUser } from '@/helpers/auth-helper'

export class ProjectController {
  private readonly projectService: ProjectService

  constructor() {
    this.projectService = new ProjectService()
  }

  getProjectByUserId = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userIds = (req.query.userIds as unknown as string).split(',')
      const project = await this.projectService.getByUserIds(userIds)
      ResponseHandler.sendSuccess(res, project, 'Get project information successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  })

  staffGetListProjects = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const staffGetListProjectsDto: StaffGetListProjectsDto = req.body
    const projects = await this.projectService.staffGetListProjects(staffGetListProjectsDto)
    ResponseHandler.sendSuccess(res, projects)
  })

  staffGetDetailProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const staffGetDetailProjectDto = req.body
    const project = await this.projectService.staffGetDetailProject(staffGetDetailProjectDto)
    ResponseHandler.sendSuccess(res, project)
  })

  staffUpdateProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const staffUpdateProjectDto = req.body
    const tokenPayload = getUser(req)
    await this.projectService.staffUpdateProject(staffUpdateProjectDto, tokenPayload)
    ResponseHandler.sendSuccess(res, null, 'Update project successfully')
  })

  staffGetListAvailableSupervisors = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const staffGetListAvailableSupervisorsDto = req.body
    const supervisors = await this.projectService.staffGetListAvailableSupervisors(staffGetListAvailableSupervisorsDto)
    ResponseHandler.sendSuccess(res, supervisors)
  })

  staffGetListAvailableStudents = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const staffGetListAvailableStudentsDto = req.body
    const students = await this.projectService.staffGetListAvailableStudents(staffGetListAvailableStudentsDto)
    ResponseHandler.sendSuccess(res, students)
  })

  createProjectAsTopic = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const projectData = req.body
    const project = await this.projectService.createProjectAsTopic(projectData)
    ResponseHandler.sendSuccess(res, project, 'Create project as topic successfully')
  })

  getProjectsWithNullStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const projects = await this.projectService.getProjectsWithNullStatus()
    ResponseHandler.sendSuccess(res, projects)
  })

  updateTopic = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const projectData = req.body
    const tokenPayload = getUser(req)
    const project = await this.projectService.updateTopic(id, projectData, tokenPayload)
    ResponseHandler.sendSuccess(res, project, 'Update topic successfully')
  })

  getTopicDetail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const project = await this.projectService.getTopicDetail(id)
    ResponseHandler.sendSuccess(res, project)
  })

  deleteTopic = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    await this.projectService.deleteTopic(id)
    ResponseHandler.sendSuccess(res, null, 'Delete topic successfully')
  })

  getProjectsBySupervisor = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenPayload = getUser(req)
      const supervisorId = tokenPayload._id
      console.log('Token payload:', tokenPayload)
      console.log('Supervisor ID from token:', supervisorId)

      const projects = await this.projectService.getProjectsBySupervisor(supervisorId)
      ResponseHandler.sendSuccess(res, projects, 'Get projects by supervisor successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  })

  getProjectLeaderForSupervisor = asyncHandler(async (req: Request, res: Response) => {
    try {
      const tokenPayload = getUser(req)
      const leaders = await this.projectService.getProjectLeadersBySupervisor(tokenPayload._id)

      return ResponseHandler.sendSuccess(res, leaders, 'Get leaders from projects successfully')
    } catch (error) {
      return ResponseHandler.sendError(res, error)
    }
  })

  async getProjectMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params
      const members = await this.projectService.getProjectMembers(projectId)
      ResponseHandler.sendSuccess(res, members, 'Project members retrieved successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }
}
