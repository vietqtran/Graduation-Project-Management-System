'use client'

import useManagement from '@/hooks/useManagement'
import { Student } from '@/types/management.type'
import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { FiArrowLeft } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

const StudentDetailsPage = ({ id }: { id: string | string[] | undefined }) => {
  const { getStudentDetails } = useManagement()
  const [studentDetails, setStudentDetails] = useState<Student | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  const fetchStudentDetails = async () => {
    setLoading(true)
    const res = await getStudentDetails({ _id: id as string })
    setStudentDetails(res)
    setLoading(false)
  }

  useEffect(() => {
    fetchStudentDetails()
  }, [id])

  return (
    <div className='p-6'>
      <Button variant='ghost' className='mb-4' onClick={() => router.back()}>
        <FiArrowLeft className='mr-2' size={16} />
        Back
      </Button>
      {loading || !studentDetails ? (
        <Skeleton className='h-40 w-full' />
      ) : (
        <Card className='w-full mx-auto shadow-lg'>
          <CardHeader>
            <CardTitle className='text-2xl font-bold'>{studentDetails.display_name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label>Email</Label>
                  <p className='text-sm text-gray-700'>{studentDetails.email}</p>
                </div>
                <div>
                  <Label>Campus</Label>
                  <p className='text-sm text-gray-700'>{studentDetails.campus}</p>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label>Code</Label>
                  <p className='text-sm text-gray-700'>{studentDetails.code || '-'}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p className='text-sm text-gray-700'>{studentDetails.status}</p>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label>Field</Label>
                  <p className='text-sm text-gray-700'>
                    {studentDetails.field && studentDetails.field.length > 0 ? studentDetails.field.join(', ') : '-'}
                  </p>
                </div>
                <div>
                  <Label>Major</Label>
                  <p className='text-sm text-gray-700'>
                    {studentDetails.major && studentDetails.major.length > 0 ? studentDetails.major.join(', ') : '-'}
                  </p>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label>Project</Label>
                  <p className='text-sm text-gray-700'>{studentDetails.project?.name}</p>
                </div>
                <div>
                  <Label>Leader</Label>
                  <p>
                    {studentDetails.is_leader ? (
                      <Badge variant='default'>Yes</Badge>
                    ) : (
                      <Badge variant='secondary'>No</Badge>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default StudentDetailsPage
