import instance from '@/utils/axios'
import { toast } from 'sonner'

const useSupervisor = () => {
    const getSupervisor = async () => {
        try {
            const response = await instance.get('/supervisor/get-all', { withCredentials: true })
            return response.data
        } catch (error : any) {
            toast.error(error.response.data.message)
        }
    }
    return{getSupervisor}
}   
export default useSupervisor 