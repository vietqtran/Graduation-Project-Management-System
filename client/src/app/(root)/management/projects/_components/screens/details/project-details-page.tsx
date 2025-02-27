'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FiArrowLeft, FiCalendar, FiFlag, FiUsers, FiCheckSquare } from 'react-icons/fi'
import useManagement from '@/hooks/useManagement'
import { Project } from '@/types/management.type'
import { Progress } from '@/components/ui/progress'

const ProjectDetailsPage = ({ id }: { id: string | string[] | undefined }) => {
  const { getDetailsProjects } = useManagement()
  const [projectDetails, setProjectDetails] = useState<Project | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  const fetchProjectDetails = async () => {
    setLoading(true)
    const res = await getDetailsProjects({ _id: id as string })
    console.log('Project details:', res) // Add logging to inspect the data
    setProjectDetails(res)
    setLoading(false)
  }

  useEffect(() => {
    fetchProjectDetails()
  }, [id])

  // Helper function to get status label
  const getStatusLabel = (status: number | null | undefined) => {
    if (status === null || status === undefined) return 'Unknown'
    switch (status) {
      case 0:
        return 'Inactive'
      case 1:
        return 'Active'
      case 2:
        return 'Completed'
      default:
        return 'Unknown'
    }
  }

  // Helper function to get stage label
  const getStageLabel = (stage: number) => {
    switch (stage) {
      case 0:
        return 'Forming'
      case 1:
        return 'Development'
      case 2:
        return 'Defense'
      case 3:
        return 'Completed'
      default:
        return `Stage ${stage}`
    }
  }

  return (
    <div className='p-6 space-y-6'>
      <Button variant='ghost' className='mb-4' onClick={() => router.back()}>
        <FiArrowLeft className='mr-2' size={16} />
        Back
      </Button>

      {loading || !projectDetails ? (
        <div className='space-y-4'>
          <Skeleton className='h-40 w-full' />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Skeleton className='h-60 w-full' />
            <Skeleton className='h-60 w-full' />
          </div>
        </div>
      ) : (
        <div className='space-y-6'>
          {/* Main project info */}
          <Card className='w-full shadow-lg'>
            <CardHeader className='pb-2'>
              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-2'>
                <div>
                  <p className='text-sm text-muted-foreground'>Project ID: {projectDetails._id}</p>
                  <CardTitle className='text-2xl font-bold'>{projectDetails.name}</CardTitle>
                </div>
                <div className='flex flex-wrap gap-2'>
                  <Badge variant='outline'>Category {projectDetails.category}</Badge>
                  <Badge variant={projectDetails.status === 1 ? 'default' : 'secondary'}>
                    {getStatusLabel(projectDetails.status)}
                  </Badge>
                  <Badge variant='outline' className='bg-blue-50'>
                    {getStageLabel(projectDetails.stage)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <div>
                    <Label className='flex items-center gap-2'>
                      <FiFlag size={14} />
                      Major & Field
                    </Label>
                    <div className='mt-1 flex flex-wrap gap-2'>
                      {projectDetails.major && projectDetails.major.length > 0 ? (
                        projectDetails.major.map((m, index) => (
                          <Badge key={`major-${index}`} variant='outline' className='bg-green-50'>
                            {typeof m === 'object' && m !== null ? m.name : m}
                          </Badge>
                        ))
                      ) : (
                        <p className='text-sm text-muted-foreground'>No majors assigned</p>
                      )}
                      {projectDetails.field && projectDetails.field.length > 0
                        ? projectDetails.field.map((f, index) => (
                            <Badge key={`field-${index}`} variant='outline' className='bg-blue-50'>
                              {typeof f === 'object' && f !== null ? f.name : f}
                            </Badge>
                          ))
                        : null}
                    </div>
                  </div>

                  <div>
                    <Label className='flex items-center gap-2'>
                      <FiCalendar size={14} />
                      Created at
                    </Label>
                    <p className='text-sm mt-1'>
                      {new Date(projectDetails.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  {/* {projectDetails.campus && (
                    <div>
                      <Label>Campus</Label>
                      <p className='text-sm mt-1'>{projectDetails.campus}</p>
                    </div>
                  )} */}

                  <div>
                    <Label className='flex items-center gap-2'>
                      <FiCheckSquare size={14} />
                      Project Status
                    </Label>
                    <div className='grid grid-cols-2 gap-4 mt-2'>
                      <div>
                        <p className='text-xs text-muted-foreground'>Mark</p>
                        <p className='text-sm font-medium'>
                          {projectDetails.mark !== null ? projectDetails.mark : 'Not marked'}
                        </p>
                      </div>
                      <div>
                        <p className='text-xs text-muted-foreground'>Late submissions</p>
                        <p className='text-sm font-medium'>{projectDetails.slow_count}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team information */}
                <div className='space-y-4'>
                  <div>
                    <Label className='flex items-center gap-2'>
                      <FiUsers size={14} />
                      Team Information
                    </Label>
                    <div className='mt-2 p-3 bg-muted rounded-md'>
                      <p className='text-sm mb-2'>
                        <span className='font-medium'>Members:</span> {projectDetails.noMembers}
                      </p>

                      {projectDetails.supervisor && projectDetails.supervisor.length > 0 ? (
                        <div className='space-y-2'>
                          <p className='text-sm font-medium'>Supervisors:</p>
                          <div className='flex flex-wrap gap-2'>
                            {projectDetails.supervisor.map((supervisor, idx) => (
                              <div
                                key={`supervisor-${idx}`}
                                className='flex items-center gap-2 p-2 bg-background rounded-md border'
                              >
                                <Avatar className='h-6 w-6'>
                                  <AvatarImage src={supervisor.avatar} alt={supervisor.display_name} />
                                  <AvatarFallback>{supervisor.display_name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className='text-xs font-medium'>{supervisor.display_name}</p>
                                  <p className='text-xs text-muted-foreground'>{supervisor.email}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className='text-sm text-muted-foreground'>No supervisors assigned</p>
                      )}
                    </div>
                  </div>

                  {projectDetails.created_by && (
                    <div>
                      <Label>Created by</Label>
                      <div className='flex items-center gap-2 mt-1'>
                        <Avatar className='h-5 w-5'>
                          <AvatarImage
                            src={projectDetails.created_by.avatar}
                            alt={projectDetails.created_by.display_name}
                          />
                          <AvatarFallback>
                            {projectDetails.created_by.display_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <p className='text-sm'>{projectDetails.created_by.display_name}</p>
                      </div>
                    </div>
                  )}

                  {projectDetails.updated_by && projectDetails.updated_at && (
                    <div>
                      <Label>Last updated</Label>
                      <div className='flex items-center gap-2 mt-1'>
                        <Avatar className='h-5 w-5'>
                          <AvatarImage
                            src={projectDetails.updated_by.avatar}
                            alt={projectDetails.updated_by.display_name}
                          />
                          <AvatarFallback>
                            {projectDetails.updated_by.display_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <p className='text-sm'>
                          {projectDetails.updated_by.display_name}{' '}
                          <span className='text-muted-foreground'>
                            on{' '}
                            {new Date(projectDetails.updated_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional project details */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Project Timeline Card */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Project Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className=''>
                  <div className='flex justify-between align-center'>
                    <Label>Current Stage</Label>
                    <Badge variant={projectDetails.stage >= 3 ? 'default' : 'outline'}>
                      {getStageLabel(projectDetails.stage)}
                    </Badge>
                  </div>

                  <div className='mt-4'>
                    <Progress value={(projectDetails.stage / 3) * 100} />
                    <div className='flex justify-between mt-3'>
                      <p className='text-xs'>Forming</p>
                      <p className='text-xs'>Development</p>
                      <p className='text-xs'>Defense</p>
                      <p className='text-xs'>Completed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Statistics Card */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Project Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='p-3 border rounded-md'>
                    <p className='text-sm text-muted-foreground'>Category</p>
                    <p className='text-xl font-medium'>
                      {typeof projectDetails.category === 'object' ? 'Complex Category' : projectDetails.category}
                    </p>
                  </div>
                  <div className='p-3 border rounded-md'>
                    <p className='text-sm text-muted-foreground'>Team Size</p>
                    <p className='text-xl font-medium'>{projectDetails.noMembers} members</p>
                  </div>
                  <div className='p-3 border rounded-md'>
                    <p className='text-sm text-muted-foreground'>Late Submissions</p>
                    <p className='text-xl font-medium'>{projectDetails.slow_count}</p>
                  </div>
                  <div className='p-3 border rounded-md'>
                    <p className='text-sm text-muted-foreground'>Mark</p>
                    <p className='text-xl font-medium'>
                      {projectDetails.mark !== null
                        ? typeof projectDetails.mark === 'object'
                          ? 'Complex Mark'
                          : projectDetails.mark
                        : '-'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action buttons */}
          <div className='flex justify-end space-x-2'>
            <Button variant='outline' onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={() => router.push(`/management/projects/edit/${id}`)}>Edit Project</Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectDetailsPage
