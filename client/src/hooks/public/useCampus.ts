import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import axios from '@/utils/axios'
import { Campus } from '@/types/campus.type'
/* eslint-disable @typescript-eslint/no-explicit-any */

const useCampus = () => {
  const [campuses, setCampuses] = useState<Campus[]>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const response = await axios.get('/public/campuses', {
          withCredentials: true
        })
        const { data } = response
        if (data && data?.success === true) {
          setCampuses(data?.data)
        }
      } catch (error: any) {
        setError(error)
        toast.error(error?.response?.data?.message ?? 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampuses()
  }, [])

  return { campuses, isLoading, error }
}

export default useCampus
