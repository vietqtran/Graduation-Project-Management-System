import instance from '@/utils/axios'
import { toast } from 'sonner'
import { AxiosError } from 'axios'

const useInvite = () => {
  const getInviteByUserId = async (userId: string) => {
    try {
      const response = await instance.get(`/invite/get-invites/${userId}`, { withCredentials: true })
      return response.data
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  const sendInvite = async (from_user: string, to_user: string, project: string) => {
    try {
      const response = await instance.post(
        '/invite/invite-member',
        { from_user, to_user, project },
        { withCredentials: true }
      )
      toast.success('Invite sent successfully', response.data.message)
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }
  const acceptInvite = async (inviteId: string) => {
    try {
      const response = await instance.get(`/invite/accept-invite/${inviteId}`, { withCredentials: true })
      toast.success('Invite accepted', response.data.message)
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }
  const rejectInvite = async (inviteId: string) => {
    try {
      const response = await instance.get(`/invite/reject-invite/${inviteId}`, { withCredentials: true })
      toast.success('Invite rejected', response.data.message)
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Something went wrong')
      }
    }
  }
  return { getInviteByUserId, sendInvite, acceptInvite, rejectInvite }
}
export default useInvite
