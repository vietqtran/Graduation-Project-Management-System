"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Field } from '@/types/field.type'
import FieldBadge from '@/components/common/FieldBadge'
import LeaderStar from '@/components/common/LeaderStar'
import { Major } from '@/types/major.type'
import MajorBadge from '@/components/common/MajorBadge'
import { Project } from '@/types/project.type'
import { User } from '@/types/user.type'
import { useRouter } from '@/hooks/useRouter'
import instance from '@/utils/axios'

interface IdeaDetailsProps {
  project: Project | null
}

const IdeaAndTeam: React.FC<IdeaDetailsProps> = ({ project }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false) 
  const router = useRouter()
  const handleInviteClick = () => {
    // Thực hiện hành động khi nhấn nút "Invite"
    console.log('Invite sent to:', email)
  }
  const handleDeleteClick = async () => {
    if (!project) return

    // Hiển thị modal xác nhận xóa
    setShowDeleteConfirmation(true)
  }
  const confirmDelete  = async () => {
    if (!project) return
    setLoading(true)
    setShowSuccessModal(false)
    try {
      const  response  = await instance.delete(`/ideas/delete-idea/?projectId=${project._id}`, { withCredentials: true })

      if (response.data.success) {
        setShowSuccessModal(true)
      }
    } catch (error) {
      console.error('Error deleting idea:', error)
      alert('Something went wrong while deleting the idea.')
    } finally {
      setLoading(false)
    }
  }
  const closeSuccessModal = () => {
    setShowSuccessModal(false)
    router.push('/create-idea')

  }

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <h2 className='text-2xl font-bold text-purple-700'>My Group</h2>
      <Card className='mt-4'>
        <CardContent className='p-6'>
          <div className='flex items-center gap-4'>
            <Avatar className='w-16 h-16'>
              <AvatarImage src='https://via.placeholder.com/150' alt='Group Avatar' />
              <AvatarFallback>G</AvatarFallback>
            </Avatar>
            <div>
              <h3 className='text-xl font-semibold'>{project?.name}</h3>
              <p className='text-sm text-gray-500'>
                Created at: {project?.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className='flex gap-3 p-6 ml-auto'>
              <Button className='border border-purple-600 text-purple-600 hover:bg-purple-400 hover:text-white bg-transparent'>
                + Update Idea
              </Button>
              <Button
                onClick={handleDeleteClick}
                className={`border border-red-500 text-red-500 hover:bg-red-400 hover:text-white bg-transparent ${loading ? 'cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Idea'}
              </Button>
            </div>
          </div>
          <div className='mt-4 grid grid-cols-2 gap-4'>
            <div>
              <p className='font-bold'>Description</p>
              <p className='italic'>{project?.description}</p>
            </div>
            <div>
              <p className='font-bold'>Campus</p>
              <p className='italic'>{project?.campus.name}</p>
            </div>
            <div>
              <p className='font-bold'>Field</p>
              <div className='flex flex-wrap gap-2'>
                {project?.field.map((f: Field) => <FieldBadge key={f._id} name={f.name} description={f.description} />)}
              </div>
            </div>
            <div>
              <p className='font-bold'>Major</p>
              <div className='flex flex-wrap gap-2'>
                {project?.major.map((m: Major) => <MajorBadge key={m._id} name={m.name} description={m.description} />)}
              </div>
            </div>
            <div>
              <p className='font-bold'>Total Members</p>
              <p>{project?.members.length} members</p>
            </div>
            <div>
              <p className='font-bold'>Available Slot</p>
              <p>{5 - (project?.members?.length ?? 0)} members</p>
            </div>
          </div>
          <div className='mt-6'>
            <p className='font-bold'>Members</p>
            <div className='mt-2 flex items-center gap-3'>
              {project?.members.map((member: User) => (
                <div key={member._id} className='flex items-center gap-3'>
                  <Avatar className='w-12 h-12'>
                    <AvatarImage src={member.avatar} alt='User Avatar' />
                    <AvatarFallback>
                      {member.first_name[0]}
                      {member.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className='flex items-center gap-3'>
                      <p className='font-semibold'>{member.display_name}</p>
                      {member._id === project.leader._id && <LeaderStar />}
                    </div>
                    <p className='text-sm text-gray-600'>{member.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex items-center justify-between p-6'>
          <CardTitle className='text-lg font-semibold w-max'>Invite Member</CardTitle>{' '}
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
    </div>
  )
}

export default IdeaAndTeam
