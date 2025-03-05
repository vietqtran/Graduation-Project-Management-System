import instance from '@/utils/axios'
import { toast } from 'sonner'
import { AxiosError } from 'axios'

const useIdea = () => { 
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
    return { getIdeaOfSupervisor }
}
export default useIdea