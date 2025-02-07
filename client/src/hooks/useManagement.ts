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
  return { getDeadlines, updateDeadline, getParameters, createParameter, updateParameter, deleteParameter }
}

export default useManagement
