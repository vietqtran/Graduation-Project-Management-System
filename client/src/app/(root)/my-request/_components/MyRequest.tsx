'use client'
import React, { useEffect, useState } from 'react'
import useInvite from '@/hooks/useInvite'
import { toast } from 'sonner'
import { useAppSelector } from '@/hooks'
import  { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Field } from '@/types/field.type'
import { Major } from '@/types/major.type'
import { User } from '@/types/user.type'
import { Project } from '@/types/project.type' 


const MyRequest = () => {
  const user = useAppSelector((state) => state.auth.user)
  const [invites, setInvites] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const { getInviteByUserId, acceptInvite, rejectInvite } = useInvite()

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        if (user?._id) {
          const response = await getInviteByUserId(user._id)
          if (response?.success) {
            setInvites(response.data)
          }
        } else {
          toast.error('User ID is not available')
        }
      } catch (error) {
        toast.error('Failed to fetch invites')
      }
    }
    fetchInvites()
  }, [user, getInviteByUserId, acceptInvite, rejectInvite])

  const getInviteType = (roles: string[]) => {
    if (roles.includes('student')) {
      return 'Invite to member of group'
    }
    if (roles.includes('supervisor')) {
      return 'Invite to supervisor of group'
    }
    return 'Invite to unknown role'
  }

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      await acceptInvite(inviteId) 
      setInvites((prevInvites) => prevInvites.filter((invite) => invite._id !== inviteId))
    } catch (error) {
      toast.error('Failed to accept invite')
    }
  }

  const handleRejectInvite = async (inviteId: string) => {
    try {
      await rejectInvite(inviteId) 
      setInvites((prevInvites) => prevInvites.filter((invite) => invite._id !== inviteId))
    } catch (error) {
      toast.error('Failed to reject invite')
    }
  }

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
  }

  const closeModal = () => {
    setSelectedProject(null)
  }

  return (
    <div className='w-full min-h-screen bg-gray-100 p-6'>
      <div className='w-full max-w-6xl mx-auto bg-white p-6 rounded-md shadow-md border border-gray-300'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-semibold text-purple-700'>Show groups that are inviting you</h2>
          <button className='bg-purple-200 text-purple-700 px-4 py-2 rounded-md hover:bg-purple-300'>
            Group You Are Invited
          </button>
        </div>
        <div className='mt-4 overflow-x-auto'>
          <table className='w-full border-collapse border border-gray-300'>
            <thead>
              <tr className='bg-gray-100 text-gray-700 text-left'>
                <th className='border p-3'>No.</th>
                <th className='border p-3'>Group</th>
                <th className='border p-3'>Description</th>
                <th className='border p-3'>Type</th>
                <th className='border p-3 text-center'>Action</th>
                <th className='border p-3'>Sent Time</th>
              </tr>
            </thead>
            <tbody>
              {invites.length > 0 ? (
                invites.map((invite, index) => (
                  <tr key={invite._id} className='border-t hover:bg-gray-50'>
                    <td className='border p-3'>{index + 1}</td>
                    <td
                      className='border p-3 text-blue-600 hover:underline cursor-pointer'
                      onClick={() => handleProjectClick(invite.project)} 
                    >
                      {invite.project.name}
                    </td>
                    <td className='border p-3'>{invite.project.description}</td>
                    <td className='border p-3'>{getInviteType(user?.roles || [])}</td>
                    <td className='border p-3 text-center'>
                      {invite.status === 'approved' ? (
                        <span className='text-green-500'>You have accepted the invite</span>
                      ) : invite.status === 'rejected' ? (
                        <span className='text-red-500'>You have rejected the invite</span>
                      ) : (
                        <>
                          <button
                            className='bg-purple-500 text-white px-4 py-1 rounded-md hover:bg-purple-600 mr-2'
                            onClick={() => handleAcceptInvite(invite._id)}
                          >
                            Agree
                          </button>
                          <button
                            className='bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600'
                            onClick={() => handleRejectInvite(invite._id)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                    <td className='border p-3'>{new Date(invite.updated_at).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className='border p-3 text-center'>
                    No invites available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal to display project details */}
      {selectedProject && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-md shadow-lg'>
            <h3 className='text-2xl font-bold text-purple-700'>{selectedProject.name}</h3>
            <div className='mt-4 grid grid-cols-2 gap-4'>
              <div>
                <p className='font-bold'>Description</p>
                <p className='italic'>{selectedProject.description}</p>
              </div>
              <div>
                <p className='font-bold'>Campus</p>
                <p className='italic'>{selectedProject.campus.name}</p>
              </div>
              <div>
                <p className='font-bold'>Field</p>
                <p className='italic'>{selectedProject.field?.map((f: Field) => f.name).join(', ')}</p>
              </div>
              <div>
                <p className='font-bold'>Major</p>
                <p className='italic'>{selectedProject.major?.map((m: Major) => m.name).join(', ')}</p>
              </div>
              <div>
                <p className='font-bold'>Total Members</p>
                <p>{selectedProject.members.length} members</p>
              </div>
            </div>
            <div className='mt-6'>
              <p className='font-bold'>Members</p>
              <div className='mt-2'>
                {selectedProject.members.map((member: User) => (
                  <div key={member._id} className='flex items-center gap-3'>
                    <Avatar className='w-12 h-12'>
                      <AvatarImage src={member.avatar} alt='User Avatar' />
                      <AvatarFallback>
                        {member.first_name[0]}{member.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='font-semibold'>{member.display_name}</p>
                      <p className='text-sm text-gray-600'>{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              className='bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600'
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyRequest
