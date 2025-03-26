import instance from '@/utils/axios'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { Project } from '@/types/project.type'
import { RootState } from '@/types/store.type'
import { useAppSelector } from './useStore'

const useIdea = () => {
  const [project, setProject] = useState<Project | null>(null)
  const [supervisorProjects, setSupervisorProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAppSelector((state: RootState) => state.auth)
  useEffect(() => {
    // if (user?._id) {
    //   getIdea(user?._id)
    // }
    const fetchData = async () => {
      if (!user?._id) return
      setIsLoading(true)
      try {
        if (user.roles.includes('student')) {
          await getIdea(user?._id)
        } else if (user.roles.includes('supervisor')) {
          getIdeaSupervisorJoined(user?._id)
        }
      } catch (error) {
        console.error('Error fetching idea:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [user])

  const getIdeaOfSupervisor = async () => {
    try {
      const response = await instance.get('/ideas/get-idea-supervisor', { withCredentials: true })
      return response.data
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }
  const getIdeaSupervisorJoined = async (supervisedId: string) => {
    try {
      const response = await instance.get(`/ideas/supervisor-join/?supervisedId=${supervisedId}`, {
        withCredentials: true
      })
      setSupervisorProjects(response.data.data)
      return response.data
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => setIsLoading(false), 1000)
    }
  }
  const deleteIdea = async (projectId: string, userId: string) => {
    try {
      const response = await instance.delete(`/ideas/delete-idea/?projectId=${projectId}&userId=${userId}`, {
        withCredentials: true
      })
      return response
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }
  const changeIdea = async (projectId: string, userId: string, name: string, description: string) => {
    try {
      const response = await instance.patch(
        `/ideas/change-idea/?projectId=${projectId}&userId=${userId}`,
        { name, description },
        { withCredentials: true }
      )
      return response
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }
  const getUpdateIdea = async (userId: string) => {
    try {
      const response = await instance.get(`/ideas/get-idea-student/?userIds=${userId}`, { withCredentials: true })
      return response
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }
  const getIdea = async (userId: string) => {
    try {
      const response = await instance.get(`/ideas/get-idea-student/?userIds=${userId}`, { withCredentials: true })
      setProject(response.data.data)
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => setIsLoading(false), 1000)
    }
  }
  const leaveGroup = async (projectId: string, userId: string) => {
    try {
      const response = await instance.patch(
        `/ideas/member-leave-group`,
        { projectId, userId },
        { withCredentials: true }
      )
      toast.success('You have left the group', response.data.message)
      return response
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Lỗi ở custom hook')
      }
    }
  }
  const kickMember = async (projectId: string, memberId: string, leaderId: string) => {
    try {
      const response = await instance.patch(
        `/ideas/leader-kick-member`,
        { projectId, memberId, leaderId },
        { withCredentials: true }
      )
      toast.success('You have kicked the member', response.data.message)
      return response
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Lỗi ở custom hook')
      }
    }
  }
  return {
    getIdeaOfSupervisor,
    deleteIdea,
    changeIdea,
    getUpdateIdea,
    leaveGroup,
    kickMember,
    getIdea,
    isLoading,
    project,
    getIdeaSupervisorJoined,
    supervisorProjects
  }
}
export default useIdea
