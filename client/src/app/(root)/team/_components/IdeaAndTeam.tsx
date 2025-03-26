// team/_components/IdeaAndTeam.tsx
'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'
import { AxiosError } from 'axios'
import { Button } from '@/components/ui/button'
import { Field } from '@/types/field.type'
import FieldBadge from '@/components/common/FieldBadge'
import LeaderStar from '@/components/common/LeaderStar'
import { Major } from '@/types/major.type'
import MajorBadge from '@/components/common/MajorBadge'
import { Project } from '@/types/project.type'
import { User } from '@/types/user.type'
import { toast } from 'sonner'
import { useAppSelector } from '@/hooks'
import useIdea from '@/hooks/useIdea'
import { useRouter } from '@/hooks/useRouter'

interface IdeaDetailsProps {
  project: Project | null
  isExpanded?: boolean
  onToggleExpand?: () => void
}

const IdeaAndTeam: React.FC<IdeaDetailsProps> = ({ project, isExpanded = false, onToggleExpand }) => {
  const user = useAppSelector((state) => state.auth.user)
  const [loading, setLoading] = useState(false)
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false)

  const router = useRouter()
  const { leaveGroup } = useIdea()

  const handleLeaveGroupClick = () => {
    setShowLeaveConfirmation(true)
  }

  const confirmLeaveGroup = async () => {
    if (!project || !user) return
    setShowLeaveConfirmation(false)
    try {
      const response = await leaveGroup(project._id, user._id)
      if (response && response.status === 200) {
        router.push('/')
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Lỗi ở page')
      }
    } finally {
      setLoading(false)
    }
  }
  if (!project) {
    return <div className='p-6 text-center text-red-600'>Project not found.</div>
  }
  return (
    <div className='w-full'>
      <Card
        className={`transition-all duration-300 ${isExpanded ? 'bg-gray-50' : 'bg-white'} shadow-md hover:shadow-lg max-w-full ${!isExpanded ? 'min-h-[150px]' : ''}`}
      >
        <CardContent className='p-6'>
          <div className='flex items-center gap-4 h-full'>
            <Avatar className='w-14 h-14'>
              <AvatarImage src='https://avatar.iran.liara.run/public/boy' alt='Group Avatar' />
              <AvatarFallback>G</AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <h3 className='text-xl font-semibold line-clamp-2 h-14'>{project?.name || 'Unnamed Project'}</h3>
              <p className='text-sm text-gray-500'>
                Created at: {project?.created_at ? new Date(project?.created_at).toLocaleDateString() : 'N/A'}
              </p>
              {!isExpanded && (
                <div className='mt-2 flex gap-3'>
                  <p className='text-base text-gray-600'>Members: {project?.members?.length || 0}/5</p>
                  <p className='text-base text-gray-600'>Available Slot: {5 - (project?.members?.length ?? 0)}</p>
                </div>
              )}
            </div>
            <div className='flex gap-2'>
              <Button
                onClick={onToggleExpand}
                className='border border-purple-600 text-purple-600 hover:bg-purple-400 hover:text-white bg-transparent text-sm px-4 py-2'
              >
                {isExpanded ? 'Collapse' : 'View Details'}
              </Button>
              <Button
                onClick={handleLeaveGroupClick}
                className={`border border-red-500 text-red-500 hover:bg-red-400 hover:text-white bg-transparent text-sm px-4 py-2 ${loading ? 'cursor-not-allowed' : ''}`}
              >
                {loading ? 'Leaving...' : 'Leave Group'}
              </Button>
            </div>
          </div>

          {isExpanded && (
            <div className='mt-2'>
              <div className='grid grid-cols-2 gap-1'>
                <div>
                  <p className='font-bold text-lg'>Description</p>
                  <p className='italic text-base line-clamp-3 h-[70px]'>{project?.description || 'No description'}</p>
                </div>
                <div>
                  <p className='font-bold text-lg'>Campus</p>
                  <p className='italic text-base'>{project?.campus?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className='font-bold text-lg'>Field</p>
                  <div className='flex flex-wrap gap-2'>
                    {project?.field && project.field.length > 0 ? (
                      project?.field.map((f: Field) => (
                        <FieldBadge key={f?._id} name={f?.name || 'Unknown'} description={f?.description || ''} />
                      ))
                    ) : (
                      <p className='text-gray-500'>No fields</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className='font-bold text-lg'>Major</p>
                  <div className='flex flex-wrap gap-2'>
                    {project?.major && project.major.length > 0 ? (
                      project?.major.map((m: Major) => (
                        <MajorBadge key={m?._id} name={m?.name || 'Unknown'} description={m?.description || ''} />
                      ))
                    ) : (
                      <p className='text-gray-500'>No majors</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className='font-bold text-lg'>Total Members</p>
                  <p className='text-base'>{project?.members?.length || 0} members</p>
                </div>
                <div>
                  <p className='font-bold text-lg'>Available Slot</p>
                  <p className='text-base'>{5 - (project?.members?.length ?? 0)} members</p>
                </div>
              </div>
              <div className='mt-2'>
                <p className='font-bold text-lg'>Members</p>
                <div className='mt-2 grid grid-cols-2 gap-7 h-[180px] overflow-y-auto'>
                  {(project?.members?.length ?? 0) > 0 ? (
                    project?.members.map((member: User) => (
                      <div key={member?._id} className='flex items-start gap-2'>
                        <Avatar className='w-12 h-12'>
                          <AvatarImage src={member?.avatar || ''} alt='User Avatar' />
                          <AvatarFallback>
                            {(member?.first_name && member.first_name.length > 0 ? member.first_name[0] : 'N') +
                              (member?.last_name && member.last_name.length > 0 ? member.last_name[0] : 'A')}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex justify-self-start w-full'>
                          <div className='flex flex-col'>
                            <div className='flex items-center gap-2'>
                              <p className='font-semibold text-base line-clamp-1'>
                                {member?.display_name || 'Unknown'}
                              </p>
                              {member?._id === project?.leader?._id && <LeaderStar />}
                            </div>
                            <p className='text-sm text-gray-600 line-clamp-1'>{member?.email || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className='text-gray-500'>No members</p>
                  )}
                </div>
              </div>
              <div className='mt-6'>
                <p className='font-bold text-lg'>Supervisor</p>
                <div className='mt-2 flex items-center gap-6 h-20 overflow-y-auto'>
                  {(project?.supervisor ?? []).length > 0 ? (
                    project?.supervisor.map((sup: User) => (
                      <div key={sup?._id} className='flex items-start gap-2'>
                        <Avatar className='w-12 h-12'>
                          <AvatarImage src={sup?.avatar || ''} alt='User Avatar' />
                          <AvatarFallback>
                            {(sup?.first_name && sup.first_name.length > 0 ? sup.first_name[0] : 'N') +
                              (sup?.last_name && sup.last_name.length > 0 ? sup.last_name[0] : 'A')}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                          <p className='font-semibold text-base line-clamp-1'>{sup?.display_name || 'Unknown'}</p>
                          <p className='text-sm text-gray-600 line-clamp-1'>{sup?.email || 'N/A'}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className='text-gray-500'>No supervisors assigned</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {showLeaveConfirmation && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
          <div className='bg-white p-6 rounded-md'>
            <h3 className='text-lg font-semibold'>Are you sure you want to leave this group?</h3>
            <div className='mt-4 flex gap-4'>
              <Button
                onClick={confirmLeaveGroup}
                className='border border-red-500 text-red-500 hover:bg-red-400 hover:text-white bg-transparent text-sm px-4 py-2'
              >
                Yes, Leave
              </Button>
              <Button
                onClick={() => setShowLeaveConfirmation(false)}
                className='border border-gray-500 text-gray-500 hover:bg-gray-400 hover:text-white bg-transparent text-sm px-4 py-2'
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default IdeaAndTeam
