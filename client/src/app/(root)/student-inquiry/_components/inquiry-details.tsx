'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useStudentInquiry from '@/hooks/useStudentInquiry'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/hooks'
import { StudentInquiry } from '@/types/student-inquiry.type'
import { Badge } from '@/components/ui/badge'
import { STUDENT_INQUIRY_STATUS } from '@/constants/status.enum'
import { format, parseISO } from 'date-fns'
import { Button } from '@/components/ui/button'

const InquiryDetailsPage = ({ id }: { id: string }) => {
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)
  const isStaff = user?.roles.some((role) => role === 'staff')

  const { staffGetInquiryById } = useStudentInquiry()
  const [inquiry, setInquiry] = useState<StudentInquiry | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInquiry = async () => {
      if (!id) {
        router.push('/student-inquiry')
        return
      }

      try {
        const response = await staffGetInquiryById({ _id: id })
        if (response) {
          setInquiry(response)
        } else {
          toast.error('Inquiry not found')
          router.push('/student-inquiry')
        }
      } catch (error) {
        console.error('Error fetching inquiry:', error)
        toast.error('Error fetching inquiry')
        router.push('/student-inquiry')
      } finally {
        setLoading(false)
      }
    }

    fetchInquiry()
  }, [id, router])

  const getStatusColor = (status: StudentInquiry['status']) => {
    switch (status) {
      case STUDENT_INQUIRY_STATUS.PROCESSING:
        return 'bg-yellow-500'
      case STUDENT_INQUIRY_STATUS.APPROVED:
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className='container mx-auto py-6'>
        <Card>
          <CardHeader>
            <CardTitle>Loading Inquiry...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='animate-pulse space-y-4'>
              <div className='h-4 bg-gray-200 rounded w-3/4'></div>
              <div className='h-4 bg-gray-200 rounded w-1/2'></div>
              <div className='h-32 bg-gray-200 rounded'></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!inquiry) {
    return null
  }

  return (
    <div className='container mx-auto py-6'>
      <Card>
        <CardHeader>
          <div className='flex justify-between items-start'>
            <div>
              <CardTitle>Inquiry Details</CardTitle>
              <CardDescription>View the full details of the inquiry and its answer.</CardDescription>
            </div>
            <Badge className={getStatusColor(inquiry.status)}>
              {inquiry.status === STUDENT_INQUIRY_STATUS.PROCESSING ? 'Processing' : 'Answered'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Student's Inquiry Section */}
          <div className='mb-8'>
            <h3 className='text-lg font-semibold mb-2'>Student&apos;s Inquiry</h3>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h4 className='font-medium mb-2'>{inquiry.title}</h4>
              <p className='text-gray-600 whitespace-pre-wrap'>{inquiry.content}</p>
              <div className='mt-2 text-sm text-gray-500'>
                Created: {format(parseISO(inquiry.created_at), 'MMM dd, yyyy HH:mm')}
              </div>
            </div>
          </div>

          {/* Staff's Answer Section */}
          {inquiry.status === STUDENT_INQUIRY_STATUS.APPROVED && (
            <div className='mb-8'>
              <h3 className='text-lg font-semibold mb-2'>Answer</h3>
              <div className='bg-blue-50 p-4 rounded-lg'>
                <p className='text-gray-700 whitespace-pre-wrap'>{inquiry.answer}</p>
                <div className='mt-2 text-sm text-gray-500'>
                  Answered: {inquiry.answered_at ? format(parseISO(inquiry.answered_at), 'MMM dd, yyyy HH:mm') : '-'}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex justify-end space-x-4'>
            <Button type='button' variant='outline' onClick={() => router.push('/student-inquiry')}>
              Back to List
            </Button>
            {isStaff && inquiry.status === STUDENT_INQUIRY_STATUS.PROCESSING && (
              <Button type='button' onClick={() => router.push(`/student-inquiry/${id}/answer`)}>
                Answer Inquiry
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default InquiryDetailsPage
