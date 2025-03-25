'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
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
import useInvite from '@/hooks/useInvite'
import { useRouter } from '@/hooks/useRouter'

interface IdeaDetailsProps {
  project: Project | null
}

const IdeaAndTeam: React.FC<IdeaDetailsProps> = ({ project }) => {
  const user = useAppSelector((state) => state.auth.user)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [idea, setIdea] = useState(project)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showChangeModal, setShowChangeModal] = useState(false)
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false)
  const [showKickConfirmation, setShowKickConfirmation] = useState(false)
  const [memberToKick, setMemberToKick] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || ''
  })
  const router = useRouter()
  const { sendInvite } = useInvite()
  const { deleteIdea, changeIdea, getUpdateIdea, leaveGroup, kickMember } = useIdea()
  const handleInviteClick = async () => {
    if (email && project?._id) {
      if (user?._id) {
        await sendInvite(user._id, email, project._id) // Gọi hàm sendInvite từ hook
        setEmail('')
      } else {
        toast.error('User not found')
      }
    } else {
      toast.error('Please enter a valid email')
    }
  }
  const handleDeleteClick = async () => {
    if (!project) return

    // Hiển thị modal xác nhận xóa
    setShowDeleteConfirmation(true)
  }
  const confirmDelete = async () => {
    if (!project) return
    setShowSuccessModal(false)
    try {
      if (user?._id) {
        const response = await deleteIdea(project._id, user._id)
        if (response && response.status === 200) {
          setShowSuccessModal(true)
        }
      } else {
        toast.error('User ID is not defined')
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
  const closeSuccessModal = () => {
    setShowSuccessModal(false)
    router.push('/create-idea')
  }
  const handleChangeIdeaClick = () => {
    setShowChangeModal(true)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmitChangeIdea = async () => {
    if (!project) return
    setLoading(true)
    try {
      if (project?._id && user?._id) {
        const response = await changeIdea(project._id, user._id, formData.name, formData.description)
        if (response && response.status === 200) {
          setShowChangeModal(false)
          toast.success('Change Idea successfully!')
          const updatedProjectResponse = await getUpdateIdea(user?._id)
          if (updatedProjectResponse && updatedProjectResponse.status === 200) {
            // Cập nhật lại state project
            setIdea(updatedProjectResponse.data.data)
          }
        }
      } else {
        toast.error('Project ID or User ID is not defined')
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        const errorMessage = error.response.data.error.message.split('name: ')[1] || error.response.data.error.message
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }
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
  const handleKickMemberClick = (memberId: string) => {
    if (!project || !user) return
    if (project.leader?._id !== user._id) return

    setMemberToKick(memberId)
    setShowKickConfirmation(true)
  }
  const confirmKickMember = async () => {
    if (!project || !user || !memberToKick) return
    setShowKickConfirmation(false)
    try {
      const response = await kickMember(project._id, memberToKick, user._id)
      if (response && response.status === 200) {
        toast.success(response.data.message)
        const updatedProjectResponse = await getUpdateIdea(user._id)
        if (updatedProjectResponse && updatedProjectResponse.status === 200) {
          // Cập nhật lại state project
          setIdea(updatedProjectResponse.data.data)
        }
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Lỗi ở page')
      }
    }
  }
  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <h2 className='text-2xl font-bold text-purple-700'>My Group</h2>

      <Card className='mt-4'>
        <CardContent className='p-6'>
          <div className='flex items-center gap-4'>
            <Avatar className='w-16 h-16'>
              <AvatarImage src='https://avatar.iran.liara.run/public/boy' alt='Group Avatar' />
              <AvatarFallback>G</AvatarFallback>
            </Avatar>
            <div>
              <h3 className='text-xl font-semibold'>{idea?.name}</h3>
              <p className='text-sm text-gray-500'>
                Created at: {idea?.created_at ? new Date(idea.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>

            <div className='flex gap-3 p-6 ml-auto'>
              {user?._id === idea?.leader?._id && (
                <>
                  <Button
                    onClick={handleChangeIdeaClick}
                    className='border border-purple-600 text-purple-600 hover:bg-purple-400 hover:text-white bg-transparent'
                  >
                    Change Idea
                  </Button>
                  <Button
                    onClick={handleDeleteClick}
                    className={`border border-red-500 text-red-500 hover:bg-red-400 hover:text-white bg-transparent ${loading ? 'cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Deleting...' : 'Delete Idea'}
                  </Button>
                </>
              )}
              <Button
                onClick={handleLeaveGroupClick}
                className={`border border-red-500 text-red-500 hover:bg-red-400 hover:text-white bg-transparent ${loading ? 'cursor-not-allowed' : ''}`}
              >
                {loading ? 'Leaving...' : 'Leave Group'}
              </Button>
            </div>
          </div>
          <div className='mt-4 grid grid-cols-2 gap-4'>
            <div>
              <p className='font-bold'>Description</p>
              <p className='italic'>{idea?.description}</p>
            </div>
            <div>
              <p className='font-bold'>Campus</p>
              <p className='italic'>{idea?.campus.name}</p>
            </div>
            <div>
              <p className='font-bold'>Field</p>
              <div className='flex flex-wrap gap-2'>
                {idea?.field.map((f: Field) => <FieldBadge key={f?._id} name={f?.name} description={f?.description} />)}
              </div>
            </div>
            <div>
              <p className='font-bold'>Major</p>
              <div className='flex flex-wrap gap-2'>
                {idea?.major.map((m: Major) => <MajorBadge key={m?._id} name={m?.name} description={m?.description} />)}
              </div>
            </div>
            <div>
              <p className='font-bold'>Total Members</p>
              <p>{idea?.members?.length} members</p>
            </div>
            <div>
              <p className='font-bold'>Available Slot</p>
              <p>{5 - (idea?.members?.length ?? 0)} members</p>
            </div>
          </div>
          <div className='mt-6'>
            <p className='font-bold'>Members</p>
            <div
              className='mt-2 grid grid-cols-2 gap-4' // Giữ cấu trúc 2 cột cho members
              style={{
                maxHeight: '200px',
                overflowY: 'auto'
              }}
            >
              {idea?.members.map((member: User) => (
                <div key={member?._id} className='flex items-center gap-3'>
                  <Avatar className='w-12 h-12'>
                    <AvatarImage src={member?.avatar} alt='User Avatar' />
                    <AvatarFallback>
                      {member?.first_name[0]}
                      {member?.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex justify-self-start w-full'>
                    <div className='flex flex-col'>
                      <p className='font-semibold'>{member?.display_name}</p>
                      <p className='text-sm text-gray-600'>{member?.email}</p>
                    </div>
                    {user?._id === idea?.leader?._id && member?._id !== idea?.leader?._id && (
                      <Button
                        onClick={() => handleKickMemberClick(member?._id)}
                        className='border border-red-500 text-red-500 hover:bg-red-400 hover:text-white bg-transparent rounded-full w-5 h-5 flex items-center justify-center p-0' // Giảm kích thước nút
                        aria-label='Kick Member'
                      >
                        <span className='text-xs font-bold'>X</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='mt-6'>
            <p className='font-bold'>Supervisor</p>
            <div className='mt-2 flex items-center gap-3'>
              {idea?.supervisor.map((sup: User) => (
                <div key={sup?._id} className='flex items-center gap-3'>
                  <Avatar className='w-12 h-12'>
                    <AvatarImage src={sup?.avatar} alt='User Avatar' />
                    <AvatarFallback>
                      {sup?.first_name[0]}
                      {sup?.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className='flex items-center gap-3'>
                      <p className='font-semibold'>{sup?.display_name}</p>
                      {sup?._id === idea?.leader?._id && <LeaderStar />}
                    </div>
                    <p className='text-sm text-gray-600'>{sup?.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex items-center justify-between p-6 bg-purple-100  rounded-lg border-gray-200'>
          <CardTitle className='text-lg font-semibold w-max'>Invite Member Or Supervisor</CardTitle>{' '}
          <div className='flex items-center gap-2 w-5/6'>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='border p-2 rounded-md w-80'
              placeholder='Example@fpt.edu.vn'
            />
            <Button
              onClick={handleInviteClick}
              className='border border-purple-600 text-purple-600 hover:bg-purple-400 hover:text-white bg-transparent'
            >
              Invite
            </Button>
          </div>
        </CardFooter>
      </Card>
      {showChangeModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
          <div className='bg-white p-6 rounded-md w-96'>
            <h3 className='text-lg font-semibold text-center'>Change Project Idea</h3>

            {/* Project Name */}
            <div className='mt-4'>
              <label className='font-semibold text-gray-700'>New Idea Name</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className='w-full border p-2 rounded-md mt-1'
                placeholder='New Project Name'
              />
            </div>

            {/* Description */}
            <div className='mt-4'>
              <label className='font-semibold text-gray-700'>New Description</label>
              <textarea
                name='description'
                value={formData.description}
                onChange={handleChange}
                className='w-full border p-2 rounded-md mt-1 h-24'
                placeholder='Describe the new idea'
              ></textarea>
            </div>

            <div className='mt-4 flex justify-between'>
              <Button
                onClick={handleSubmitChangeIdea}
                className='border border-blue-600 text-blue-600 hover:bg-blue-400 hover:text-white bg-transparent w-1/3'
              >
                Save Changes
              </Button>
              <Button
                onClick={() => setShowChangeModal(false)}
                className='border border-gray-500 text-gray-500 hover:bg-gray-400 hover:text-white bg-transparent w-1/3'
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showDeleteConfirmation && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
          <div className='bg-white p-6 rounded-md'>
            <h3 className='text-lg font-semibold'>Are you sure you want to delete this idea?</h3>
            <div className='mt-4 flex gap-4'>
              <Button
                onClick={confirmDelete}
                className='border border-red-500 text-red-500 hover:bg-red-400 hover:text-white bg-transparent'
              >
                Yes, Delete
              </Button>
              <Button
                onClick={() => setShowDeleteConfirmation(false)}
                className='border border-gray-500 text-gray-500 hover:bg-gray-400 hover:text-white bg-transparent'
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Success Modal */}
      {showSuccessModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
          <div className='bg-white p-6 rounded-md'>
            <h3 className='text-lg font-semibold text-green-500'>Idea Deleted Successfully!</h3>
            <div className='mt-4'>
              <Button
                onClick={closeSuccessModal}
                className='border border-green-500 text-green-500 hover:bg-green-400 hover:text-white bg-transparent'
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      {showLeaveConfirmation && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
          <div className='bg-white p-6 rounded-md'>
            <h3 className='text-lg font-semibold'>Are you sure you want to leave this group?</h3>
            <div className='mt-4 flex gap-4'>
              <Button
                onClick={confirmLeaveGroup}
                className='border border-red-500 text-red-500 hover:bg-red-400 hover:text-white bg-transparent'
              >
                Yes, Leave
              </Button>
              <Button
                onClick={() => setShowLeaveConfirmation(false)}
                className='border border-gray-500 text-gray-500 hover:bg-gray-400 hover:text-white bg-transparent'
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {showKickConfirmation && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
          <div className='bg-white p-6 rounded-md'>
            <h3 className='text-lg font-semibold'>Are you sure you want to kick this member?</h3>
            <div className='mt-4 flex gap-4'>
              <Button
                onClick={confirmKickMember}
                className='border border-red-500 text-red-500 hover:bg-red-400 hover:text-white bg-transparent'
              >
                Yes, I want to kick
              </Button>
              <Button
                onClick={() => setShowKickConfirmation(false)}
                className='border border-gray-500 text-gray-500 hover:bg-gray-400 hover:text-white bg-transparent'
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
