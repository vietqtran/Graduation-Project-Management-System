import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import axios from '@/utils/axios'
import { Field } from '@/types/field.type'
/* eslint-disable @typescript-eslint/no-explicit-any */

const useField = () => {
  const [fields, setFields] = useState<Field[]>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await axios.get('/public/fields', {
          withCredentials: true
        })
        const { data } = response
        if (data && data?.success === true) {
          setFields(data?.data)
        }
      } catch (error: any) {
        setError(error)
        toast.error(error?.response?.data?.message ?? 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFields()
  }, [])

  return { fields, isLoading, error }
}

export default useField
