'use client'

import Image from 'next/image'
import useManagement from '@/hooks/useManagement'
import { Teacher } from '@/types/management.type'
import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { FiArrowLeft } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

const TeacherDetailsPage = ({ id }: { id: string | string[] | undefined }) => {
  const { getTeacherDetails } = useManagement()
  const [teacherDetails, setTeacherDetails] = useState<Teacher | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  const fetchTeacherDetails = async () => {
    setLoading(true)
    const res = await getTeacherDetails({ _id: id as string })
    setTeacherDetails(res)
    setLoading(false)
  }

  useEffect(() => {
    fetchTeacherDetails()
  }, [id])

  return (
    <div className='p-6'>
      <Button variant='ghost' className='mb-4' onClick={() => router.back()}>
        <FiArrowLeft className='mr-2' size={16} />
        Back
      </Button>
      {loading || !teacherDetails ? (
        <Skeleton className='h-40 w-full' />
      ) : (
        <Card className='w-full mx-auto shadow-lg'>
          <CardHeader>
            <div className='flex items-center space-x-4'>
              <div className='relative w-24 h-24 rounded-full overflow-hidden bg-gray-100'>
                {teacherDetails.url ? (
                  <Image src={teacherDetails.url} alt={teacherDetails.display_name} fill className='object-cover' />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-gray-400 text-2xl'>
                    {teacherDetails.display_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <CardTitle className='text-2xl font-bold'>{teacherDetails.display_name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label>Email</Label>
                  <p className='text-sm text-gray-700'>{teacherDetails.email}</p>
                </div>
                <div>
                  <Label>Campus</Label>
                  <p className='text-sm text-gray-700'>{teacherDetails.campus}</p>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label>Code</Label>
                  <p className='text-sm text-gray-700'>{teacherDetails.code || '-'}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p className='text-sm text-gray-700'>{teacherDetails.status}</p>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label>Major</Label>
                  <p className='text-sm text-gray-700'>
                    {teacherDetails.major && teacherDetails.major.length > 0 ? teacherDetails.major.join(', ') : '-'}
                  </p>
                </div>
                <div>
                  <Label>Number of Projects</Label>
                  <p className='text-sm text-gray-700'>{teacherDetails.noProjects}</p>
                </div>
              </div>
              <div>
                <Label>Roles</Label>
                <div className='flex gap-2 mt-1'>
                  {teacherDetails.roles.map((role) => (
                    <Badge key={role} variant={role === 'lecturer' ? 'outline' : 'default'}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default TeacherDetailsPage
