import instance from '@/utils/axios'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
const useSupervisor = () => {
  const getSupervisor = async () => {
    try {
      const response = await instance.get('/supervisor/get-all', { withCredentials: true })
      return response.data
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }
  return { getSupervisor }
}
export default useSupervisor
