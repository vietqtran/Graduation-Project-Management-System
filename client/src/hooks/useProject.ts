import { useEffect, useState } from 'react'

import { Project } from '@/types/project.type'
import { RootState } from '@/types/store.type'
import instance from '@/utils/axios'
import { useAppSelector } from './useStore'

export const useProject = () => {
  const { user } = useAppSelector((state: RootState) => state.auth)
  const [project, setProject] = useState<Project | null>(null)
  useEffect(() => {
    getProject()
  }, [])

  const getProject = async () => {
    if (!user?._id) return
    const { data } = await instance.get(`/project/?userIds=${user?._id}`, { withCredentials: true })
    setProject(data.data)
  }

  return { getProject, project }
}
