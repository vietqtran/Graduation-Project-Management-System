'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React, { useEffect, useState } from 'react'

import { AxiosError } from 'axios'
import { Field } from '@/types/field.type'
import { Invite } from '@/types/invite.type'
import { Major } from '@/types/major.type'
import { Project } from '@/types/project.type'
import { User } from '@/types/user.type'
import { toast } from 'sonner'
import { useAppSelector } from '@/hooks'
import useInvite from '@/hooks/useInvite'

const MyRequest = () => {
  const user = useAppSelector((state) => state.auth.user)
  const [invites, setInvites] = useState<Invite[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const { getInviteByUserId, acceptInvite, rejectInvite } = useInvite()

  const fetchInvites = async () => {
    try {
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
    }
  }

  useEffect(() => {
    fetchInvites()
  }, [])

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
    <div className='w-full min-h-screen bg-gray-100 p-6'>
      <div className='w-full max-w-6xl mx-auto bg-white p-6 rounded-md shadow-md border border-gray-300'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-semibold text-purple-700'>Show groups that are inviting you</h2>
          <span className='bg-purple-200 text-purple-700 px-4 py-2 rounded-md '>Group You Are Invited</span>
        </div>
        <div className='overflow-x-auto rounded-lg shadow-md'>
          <table className='w-full border-collapse bg-white'>
            <thead>
              <tr className='bg-purple-50 text-purple-800 text-left'>
                <th className='p-4 font-semibold text-sm uppercase tracking-wide'>No.</th>
                <th className='p-4 font-semibold text-sm uppercase tracking-wide'>Group</th>
                <th className='p-4 font-semibold text-sm uppercase tracking-wide'>Description</th>
                <th className='p-4 font-semibold text-sm uppercase tracking-wide'>Type</th>
                <th className='p-4 font-semibold text-sm uppercase tracking-wide text-center'>Action</th>
                <th className='p-4 font-semibold text-sm uppercase tracking-wide'>Sent Time</th>
              </tr>
            </thead>
            <tbody>
              {invites?.length > 0 ? (
                invites.map((invite, index) => (
                  <tr
                    key={invite?._id}
                    className='border-t border-gray-200 hover:bg-gray-50 transition-colors duration-200'
                  >
                    <td className='p-4 text-gray-700'>{index + 1}</td>
                    <td
                      className='p-4 text-blue-600 hover:underline cursor-pointer'
                      onClick={() => handleProjectClick(invite?.project)}
                    >
                      {invite?.project?.name}
                    </td>
                    <td className='p-4 text-gray-600 line-clamp-2'>{invite?.project?.description}</td>
                    <td className='p-4 text-gray-600'>{getInviteType(user?.roles || [])}</td>
                    <td className='p-4 text-center'>
                      <div className='flex justify-center items-center gap-2 min-h-[40px]'>
                        {invite.status === 'approved' ? (
                          <span className='text-green-600 font-medium'>You have accepted the invite</span>
                        ) : invite.status === 'rejected' ? (
                          <span className='text-red-600 font-medium'>You have rejected the invite</span>
                        ) : (
                          <>
                            <button
                              className='bg-purple-600 text-white px-4 py-1 rounded-full hover:bg-purple-700 transition-colors duration-200 text-sm font-medium'
                              onClick={() => handleAcceptInvite(invite?._id)}
                            >
                              Agree
                            </button>
                            <button
                              className='bg-red-600 text-white px-4 py-1 rounded-full hover:bg-red-700 transition-colors duration-200 text-sm font-medium'
                              onClick={() => handleRejectInvite(invite?._id)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                    <td className='p-4 text-gray-600'>
                      {invite.updated_at ? new Date(invite?.updated_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className='p-4 text-center text-gray-500'>
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
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto transform transition-all duration-300 scale-100'>
            {/* Tiêu đề của modal */}
            <h3 className='text-2xl font-bold text-purple-700 mb-4'>{selectedProject?.name}</h3>

            {/* Thông tin chi tiết */}
            <div className='mt-4 grid grid-cols-2 gap-4'>
              <div>
                <p className='font-bold text-gray-800'>Description</p>
                <p className='italic text-gray-600 line-clamp-2'>{selectedProject?.description}</p>
              </div>
              <div>
                <p className='font-bold text-gray-800'>Campus</p>
                <p className='italic text-gray-600'>{selectedProject?.campus?.name}</p>
              </div>
              <div>
                <p className='font-bold text-gray-800'>Field</p>
                <p className='italic text-gray-600'>{selectedProject?.field?.map((f: Field) => f?.name).join(', ')}</p>
              </div>
              <div>
                <p className='font-bold text-gray-800'>Major</p>
                <p className='italic text-gray-600'>{selectedProject?.major?.map((m: Major) => m?.name).join(', ')}</p>
              </div>
              <div>
                <p className='font-bold text-gray-800'>Total Members</p>
                <p className='text-gray-600'>{selectedProject?.members?.length} members</p>
              </div>
            </div>

            {/* Danh sách thành viên */}
            <div className='mt-6'>
              <p className='font-bold text-gray-800'>Members</p>
              <div className='mt-2 space-y-3'>
                {selectedProject?.members.map((member: User) => (
                  <div key={member?._id} className='flex items-center gap-3'>
                    <Avatar className='w-12 h-12'>
                      <AvatarImage src={member?.avatar} alt='User Avatar' />
                      <AvatarFallback>
                        {member?.first_name?.[0] ?? ''}
                        {member?.last_name?.[0] ?? ''}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                      <p className='font-semibold text-gray-800'>{member?.display_name}</p>
                      <p className='text-sm text-gray-600 truncate'>{member?.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nút đóng modal */}
            <button
              className='mt-6 w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200'
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
