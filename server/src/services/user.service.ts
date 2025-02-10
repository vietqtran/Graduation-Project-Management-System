import * as bcrypt from 'bcrypt'

import UserModel, { IUser } from '@/models/user.model'

import { CreateUserDto } from '@/dtos/user/create-user.dto'
import { HttpException } from '@/shared/exceptions/http.exception'
import { Model } from 'mongoose'
import { GetListStudentsDto } from '@/dtos/user/staff-manage-students.dto'
import { runTransaction } from '@/helpers/transaction-helper'
import ProjectModel, { IProject } from '@/models/project.model'
import { GetListTeachersDto } from '@/dtos/user/staff-manage-teachers.dto'
require('../models/field.model')
require('../models/major.model')
require('../models/campus.model')
// 🔥 Đảm bảo đã import model

export class UserService {
  private readonly userModel: Model<IUser>
  private readonly projectModel: Model<IProject>
  constructor() {
    ;(this.userModel = UserModel), (this.projectModel = ProjectModel)
  }

  async getAllUsers() {
    return await this.userModel.find()
  }

  async createUser(createUserDto: CreateUserDto) {
    const isExisted = await this.userModel.findOne({
      $or: [{ email: createUserDto.email }, { username: createUserDto.username }]
    })

    if (isExisted) {
      throw new HttpException('User already exists.', 400)
    }

    const hashed_password = await this.hashPassword(createUserDto.password)
    if (!hashed_password) {
      throw new HttpException('Error hashing password', 500)
    }

    const createdUser = await this.userModel.create({
      ...createUserDto,
      hashed_password
    })

    if (!createdUser) {
      throw new HttpException('Error at creating user', 400)
    }

    return createdUser
  }

  private async hashPassword(password: string) {
    try {
      return await bcrypt.hash(password, 10)
    } catch (err) {
      console.error('Error while hash password.', err)
      return null
    }
  }

  async staffGetListStudents(body: GetListStudentsDto) {
    return runTransaction(async (session) => {
      const {
        display_name,
        email,
        status,
        code,
        campus,
        field,
        major,
        project_name,
        is_leader,
        page = 1,
        limit = 10,
        sort
      } = body

      const filter: any = { roles: 'student' }

      if (display_name) filter.display_name = { $regex: display_name, $options: 'i' }
      if (email) filter.email = { $regex: email, $options: 'i' }
      if (status !== undefined) filter.status = status
      if (code) filter.code = code
      if (campus) filter.campus = campus
      if (field) filter.field = { $in: field }
      if (major) filter.major = { $in: major }

      const userProjectsMap = new Map<string, { _id: string; isLeader: boolean; projectName: string }>()

      const projectFilter: any = {}

      // 🔹 Nếu lọc theo project_name, tìm project có chứa `project_name`
      if (project_name) {
        projectFilter.name = { $regex: project_name, $options: 'i' }
      }

      // 🔹 Lấy danh sách leader + members trong cùng một truy vấn
      const projects = await this.projectModel.find(projectFilter).select('leader members name _id').session(session)

      // log(projects)
      if (is_leader) {
        projects.forEach((project: any) => {
          const projectName = project.name

          const leaderId = project.leader.toString()
          if (!userProjectsMap.has(leaderId)) {
            userProjectsMap.set(leaderId, { _id: project._id.toString(), isLeader: true, projectName: projectName })
          } else {
            userProjectsMap.get(leaderId)!.isLeader = true
          }
        })
      } else {
        projects.forEach((project: any) => {
          const projectName = project.name

          project.members.forEach((memberId: string) => {
            if (!userProjectsMap.has(memberId)) {
              userProjectsMap.set(memberId.toString(), { _id: project._id.toString(), isLeader: false, projectName })
            }
            // Không ghi đè nếu người này đã thuộc một dự án khác
            // nhưng vẫn đảm bảo giữ nguyên projectName của lần đầu tiên
          })

          const leaderId = project.leader.toString()
          if (!userProjectsMap.has(leaderId)) {
            userProjectsMap.set(leaderId, { _id: project._id.toString(), isLeader: true, projectName })
          } else {
            const userData = userProjectsMap.get(leaderId)!
            userData.isLeader = true // 🔥 Cập nhật leader thành true nếu chưa có
          }
        })
      }
      filter._id = { $in: Array.from(userProjectsMap.keys()) }

      const students = await this.userModel
        .find(filter)
        .populate({ path: 'campus', select: 'name' }) // ✅ Lấy tên campus
        .populate({ path: 'field', select: 'name' }) // ✅ Lấy tên field
        .populate({ path: 'major', select: 'name' }) // ✅ Lấy tên major
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .select('display_name email status code campus field major') // ✅ Chỉ trả về các trường cần thiết
        .lean()
        .session(session)

      // ✅ Chuyển đổi dữ liệu để trả về format mong muốn

      // console.log(students)

      const formattedStudents = students.map((student: any) => {
        const userProjectData = userProjectsMap.get(student._id.toString()) || {
          _id: null,
          isLeader: false,
          projectName: null
        }
        console.log(userProjectData)

        return {
          _id: student._id,
          display_name: student.display_name,
          email: student.email,
          code: student.code,
          campus: student.campus ? student.campus.name : undefined, // ✅ Chỉ lấy tên campus
          field: student.field ? student.field.name : undefined, // ✅ Chỉ lấy tên field
          major: student.major ? student.major.name : undefined, // ✅ Chỉ lấy tên major
          project: { name: userProjectData.projectName, _id: userProjectData._id }, // ✅ Danh sách tên dự án mà student tham gia
          is_leader: userProjectData.isLeader // ✅ Đánh dấu student có phải leader không
        }
      })

      // log(formattedStudents)

      return {
        list: formattedStudents,
        total: formattedStudents.length
      }
    })
  }

  async staffGetListTeachers(body: GetListTeachersDto) {
    return runTransaction(async (session) => {
      const { display_name, email, status, code, campus, major, noProjects, role, page = 1, limit = 10, sort } = body

      const filter: any = { roles: { $in: ['lecturer', 'supervisor'] } }

      if (display_name) filter.display_name = { $regex: display_name, $options: 'i' }
      if (email) filter.email = { $regex: email, $options: 'i' }
      if (status !== undefined) filter.status = status
      if (code) filter.code = code
      if (campus) filter.campus = campus
      if (major) filter.major = { $in: major }
      if (role) filter.roles = role

      const teachers = await this.userModel
        .find(filter)
        .populate({ path: 'campus', select: 'name' })
        .populate({ path: 'major', select: 'name' })
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .select('display_name email status code campus major noProjects roles')
        .lean()
        .session(session)

      const teacherIds = teachers.map((teacher) => teacher._id.toString())

      // 🔹 Lấy số lượng project mà mỗi teacher là supervisor
      const projectsCount = await this.projectModel.aggregate([
        { $match: { supervisor: { $in: teacherIds } } },
        { $group: { _id: '$supervisor', count: { $sum: 1 } } }
      ]).session(session)

      // 🔹 Tạo map teacherId -> số lượng project
      const supervisorProjectCountMap = new Map<string, number>()
      projectsCount.forEach((item) => {
        supervisorProjectCountMap.set(item._id.toString(), item.count)
      })

      // ✅ Chuyển đổi dữ liệu để trả về format mong muốn
      let formattedTeachers = teachers.map((teacher: any) => {
        const projectCount = supervisorProjectCountMap.get(teacher._id.toString()) || 0
        return {
          _id: teacher._id,
          display_name: teacher.display_name,
          email: teacher.email,
          code: teacher.code,
          roles: teacher.roles.join(', '),
          campus: teacher.campus ? teacher.campus.name : undefined, // ✅ Chỉ lấy tên campus
          major: teacher.major ? teacher.major.name : undefined, // ✅ Chỉ lấy tên major
          noProjects: projectCount
        }
      })

      if (noProjects !== undefined) {
        formattedTeachers = formattedTeachers.filter((teacher) => teacher.noProjects === noProjects)
      }

      //sort by noProjects
      if (sort && sort.noProjects) {
        formattedTeachers.sort((a, b) => {
          if (sort.noProjects === 1) {
            return a.noProjects - b.noProjects
          } else {
            return b.noProjects - a.noProjects
          }
        })
      }

      return {
        list: formattedTeachers,
        total: formattedTeachers.length
      }
    })
  }
}
