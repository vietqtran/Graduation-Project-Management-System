/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from '@/utils/axios'
import { toast } from 'sonner'

const useManagement = () => {
  const getDeadlines = async ({ semester }: { semester: string }) => {
    try {
      const payload = { semester }
      const response = await axios.post(
        '/deadline/getAll',
        { ...payload },
        {
          withCredentials: true
        }
      )

      const { data } = response
      if (data && data?.success === true) {
        return data?.data
      }
      return null
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'An error occurred')
      return null
    }
  }

  const updateDeadline = async ({
    deadline_key,
    deadline_date,
    semester
  }: {
    deadline_key: string
    deadline_date: Date
    semester: string
  }) => {
    try {
      const payload = { deadline_key, deadline_date, semester }
      const response = await axios.post(
        '/deadline/update',
        { ...payload },
        {
          withCredentials: true
        }
      )

      const { data } = response
      if (data && data?.success === true) {
        toast.success(data?.message ?? 'Deadline updated successfully')
        return true
      }
      return null
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'An error occurred')
      return null
    }
  }

  const getParameters = async () => {
    try {
      const response = await axios.get('/parameter/getAll', { withCredentials: true })
      const { data } = response
      if (data && data?.success === true) {
        return data?.data
      }
      return null
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'An error occurred')
      return null
    }
  }

  const createParameter = async ({
    param_name,
    param_value,
    param_type,
    description
  }: {
    param_name: string
    param_value: string
    param_type: 'string' | 'number' | 'boolean' | 'date'
    description?: string
  }) => {
    try {
      const payload = { param_name, param_value, param_type, description }
      const response = await axios.post(
        '/parameter/create',
        { ...payload },
        {
          withCredentials: true
        }
      )

      const { data } = response
      if (data && data?.success === true) {
        toast.success(data?.message ?? 'Parameter created successfully')
        return true
      }
      return null
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'An error occurred')
      return null
    }
  }

  const updateParameter = async ({
    _id,
    param_value,
    param_type,
    description
  }: {
    _id: string
    param_value: string
    param_type: 'string' | 'number' | 'boolean' | 'date'
    description?: string
  }) => {
    try {
      const payload = { _id, param_value, param_type, description }
      const response = await axios.post(
        '/parameter/update',
        { ...payload },
        {
          withCredentials: true
        }
      )

      const { data } = response
      if (data && data?.success === true) {
        toast.success(data?.message ?? 'Parameter updated successfully')
        return true
      }
      return null
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'An error occurred')
      return null
    }
  }

  const deleteParameter = async ({ _id }: { _id: string }) => {
    try {
      const payload = { _id }
      const response = await axios.post(
        '/parameter/delete',
        { ...payload },
        {
          withCredentials: true
        }
      )

      const { data } = response
      if (data && data?.success === true) {
        toast.success(data?.message ?? 'Parameter deleted successfully')
        return true
      }
      return null
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'An error occurred')
      return null
    }
  }

  // Students
  const getStudents = async ({
    display_name,
    email,
    field,
    campus,
    code,
    is_leader,
    limit,
    major,
    page,
    project_name,
    sort,
    status
  }: {
    display_name?: string
    email?: string
    is_leader?: boolean
    status?: number
    code?: string
    campus?: string
    field?: string
    major?: string
    project_name?: string
    page?: number // default value: 1 (handled in implementation)
    limit?: number // default value: 10 (handled in implementation)
    sort?: Record<string, 1 | -1>
  }) => {
    try {
      const payload = {
        display_name,
        email,
        field,
        campus,
        code,
        is_leader,
        limit,
        major,
        page,
        project_name,
        sort,
        status
      }
      const response = await axios.post(
        '/manage-users/staff-get-list-students',
        { ...payload },
        {
          withCredentials: true
        }
      )

      const { data } = response
      if (data && data?.success === true) {
        return data?.data
      }
      return null
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'An error occurred')
      return null
    }
  }

  const getStudentDetails = async ({ _id }: { _id: string }) => {
    try {
      const payload = { _id }
      const response = await axios.post(
        '/manage-users/staff-get-detail-student',
        { ...payload },
        {
          withCredentials: true
        }
      )

      const { data } = response
      if (data && data?.success === true) {
        return data?.data
      }
      return null
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'An error occurred')
      return null
    }
  }

  const updateStudent = async ({
    _id,
    display_name,
    email,
    code,
    campus,
    field,
    major,
    status
  }: {
    _id: string
    display_name: string
    email: string
    code: string
    status: number
    campus: string
    field: string[]
    major: string[]
  }) => {
    try {
      const payload = { _id, display_name, email, code, campus, field, major, status }
      const response = await axios.post(
        '/manage-users/staff-update-student',
        { ...payload },
        {
          withCredentials: true
        }
      )

      const { data } = response
      if (data && data?.success === true) {
        toast.success(data?.message ?? 'Student updated successfully')
        return true
      }
      return null
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'An error occurred')
      return null
    }
  }

  // Teachers
  const getTeachers = async ({}: {
    display_name?: string
    email?: string
    status?: number
    code?: string
    campus?: string
    major?: [string] // Tuple containing a single string element
    noProjects?: number
    role?: 'lecturer' | 'supervisor'
    page?: number // default value: 1 (handled in implementation)
    limit?: number // default value: 10 (handled in implementation)
    sort?: Record<string, 1 | -1>
  }) => {
    try {
      const payload = {}
      const response = await axios.post(
        '/manage-users/staff-get-list-teachers',
        { ...payload },
        {
          withCredentials: true
        }
      )

      const { data } = response
      if (data && data?.success === true) {
        return data?.data
      }
      return null
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'An error occurred')
      return null
    }
  }

  const getTeacherDetails = async ({ _id }: { _id: string }) => {
    try {
      const payload = { _id }
      const response = await axios.post(
        '/manage-users/staff-get-detail-teacher',
        { ...payload },
        {
          withCredentials: true
        }
      )

      const { data } = response
      if (data && data?.success === true) {
        return data?.data
      }
      return null
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'An error occurred')
      return null
    }
  }

  const updateTeacher = async ({
    _id,
    campus,
    code,
    display_name,
    email,
    major,
    roles,
    status
  }: {
    _id: string
    display_name: string
    email: string
    status: number
    code: string
    campus: string
    major: string[]
    roles: ('lecturer' | 'supervisor')[]
  }) => {
    try {
      const payload = { _id, display_name, email, status, code, campus, major, roles }
      const response = await axios.post(
        '/manage-users/staff-update-teacher',
        { ...payload },
        {
          withCredentials: true
        }
      )

      const { data } = response
      if (data && data?.success === true) {
        toast.success(data?.message ?? 'Student updated successfully')
        return true
      }
      return null
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'An error occurred')
      return null
    }
  }

  return {
    getDeadlines,
    updateDeadline,
    getParameters,
    createParameter,
    updateParameter,
    deleteParameter,
    getStudents,
    getStudentDetails,
    updateStudent,
    getTeachers,
    getTeacherDetails,
    updateTeacher
  }
}

export default useManagement
