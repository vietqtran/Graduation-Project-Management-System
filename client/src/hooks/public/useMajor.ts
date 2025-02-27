import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import axios from '@/utils/axios'
import { Major } from '@/types/major.type'
/* eslint-disable @typescript-eslint/no-explicit-any */

const useMajor = () => {
  const [majors, setMajors] = useState<Major[]>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await axios.get('/public/majors', {
          withCredentials: true
        })
        const { data } = response
        if (data && data?.success === true) {
          setMajors(data?.data)
        }
      } catch (error: any) {
        setError(error)
        toast.error(error?.response?.data?.message ?? 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMajors()
  }, [])

  return { majors, isLoading, error }
}

export default useMajor
