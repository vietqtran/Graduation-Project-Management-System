'use client'

import React, { useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import { Invite } from '@/types/invite.type'
import { Project } from '@/types/project.type'
import { toast } from 'sonner'
import { useAppSelector } from '@/hooks'
import useInvite from '@/hooks/useInvite'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import ProjectDetailsDialog from './ProjectDetailsDialog'

const MyRequest = () => {
  const user = useAppSelector((state) => state.auth.user)
  const [invites, setInvites] = useState<Invite[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const { getInviteByUserId, acceptInvite, rejectInvite } = useInvite()

  const fetchInvites = async () => {
    try {
      setLoading(true)
      if (user?._id) {
        const response = await getInviteByUserId(user._id)
        if (response?.success) {
          setInvites(response.data ?? [])
        }
      } else {
        toast.error('User ID is not available')
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvites()
  }, [])

  const getInviteType = (roles: string[]) => {
    if (roles.includes('student')) {
      return 'Member'
    }
    if (roles.includes('supervisor')) {
      return 'Supervisor'
    }
    return 'Unknown'
  }

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      await acceptInvite(inviteId)
      await fetchInvites()
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  const handleRejectInvite = async (inviteId: string) => {
    try {
      await rejectInvite(inviteId)
      fetchInvites()
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
  }

  const closeModal = () => {
    setSelectedProject(null)
  }

  return (
    <div className='p-6'>
      <Card>
        <CardHeader>
          <CardTitle>Group Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='space-y-4'>
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-12 w-full' />
            </div>
          ) : (
            <ScrollArea className='h-[600px]'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                    <TableHead>Sent Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invites?.length > 0 ? (
                    invites.map((invite, index) => (
                      <TableRow key={invite?._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Button
                            variant='link'
                            className='p-0 h-auto'
                            onClick={() => handleProjectClick(invite?.project)}
                          >
                            {invite?.project?.name}
                          </Button>
                        </TableCell>
                        <TableCell className='max-w-[300px] truncate'>{invite?.project?.description}</TableCell>
                        <TableCell>
                          <Badge variant='outline'>{getInviteType(user?.roles || [])}</Badge>
                        </TableCell>
                        <TableCell>
                          {invite.status === 'approved' ? (
                            <Badge variant='default'>Accepted</Badge>
                          ) : invite.status === 'rejected' ? (
                            <Badge variant='destructive'>Rejected</Badge>
                          ) : (
                            <Badge variant='secondary'>Pending</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {invite.status === 'pending' && (
                            <div className='flex gap-2'>
                              <Button size='sm' onClick={() => handleAcceptInvite(invite?._id)}>
                                Accept
                              </Button>
                              <Button size='sm' variant='destructive' onClick={() => handleRejectInvite(invite?._id)}>
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {invite.updated_at ? new Date(invite?.updated_at).toLocaleDateString() : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className='text-center'>
                        No invites available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <ProjectDetailsDialog project={selectedProject} onOpenChange={closeModal} />
    </div>
  )
}

export default MyRequest
