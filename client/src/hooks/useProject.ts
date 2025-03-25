import { useEffect, useState } from 'react'

import { Project } from '@/types/project.type'
import { RootState } from '@/types/store.type'
import instance from '@/utils/axios'
import { useAppSelector } from './useStore'

export const useProject = (id = '') => {
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAppSelector((state: RootState) => state.auth)
  const [project, setProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  useEffect(() => {
    console.log('-----------------------', id)
    getProject()
  }, [id])

  const getProject = async () => {
    try {
      if (!user?._id) return
      if (user.roles.includes('supervisor') && !id) {
        const { data } = await instance.get(`/project/get-projects-by-supervisor`, { withCredentials: true })
        setProjects(data.data)
      } else {
        if (id) {
          const { data } = await instance.get(`/project/detail-topic/${id}`, { withCredentials: true })
          setProject(data.data)
        } else {
          const { data } = await instance.get(`/project/?userIds=${user?._id}`, { withCredentials: true })
          setProject(data.data)
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => setIsLoading(false), 2500)
    }
  }

  return { getProject, project, isLoading, projects }
}
