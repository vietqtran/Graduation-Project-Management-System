'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { User } from '@/types/user.type'
import { toast } from 'sonner'
import { useAppSelector } from '@/hooks'
import useSupervisor from '@/hooks/useSupervisor'
import useInvite from '@/hooks/useInvite'
import { useProject } from '@/hooks'
const ListSupervisor = () => {
  const user = useAppSelector((state) => state.auth.user)
  const [supervisors, setSupervisors] = useState<User[]>([])
  const [selectedSupervisor, setSelectedSupervisor] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredSupervisors, setFilteredSupervisors] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1) // Trạng thái trang hiện tại
  const [itemsPerPage] = useState(5) // Số mục mỗi trang
  const { getSupervisor } = useSupervisor()
  const { sendInvite } = useInvite()
  const { project, isLoading } = useProject()
  useEffect(() => {
    const fetchSupervisor = async () => {
      try {
        const response = await getSupervisor()
        setSupervisors(response.data)
        setFilteredSupervisors(response.data)
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error fetching supervisors')
      }
    }
    fetchSupervisor()
  }, [])

  const closeModal = () => {
    setSelectedSupervisor(null)
  }
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)
    if (term) {
      const result = supervisors.filter(
        (supervisor) =>
          supervisor.display_name?.toLowerCase().includes(term) || supervisor.email.toLowerCase().includes(term)
      )
      setFilteredSupervisors(result)
    } else {
      setFilteredSupervisors(supervisors)
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredSupervisors.slice(indexOfFirstItem, indexOfLastItem)

  const handleNext = () => {
    if (currentPage < Math.ceil(filteredSupervisors.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleFirst = () => {
    setCurrentPage(1)
  }

  const handleLast = () => {
    setCurrentPage(Math.ceil(filteredSupervisors.length / itemsPerPage))
  }
  const handleInvite = async () => {
    try {
      if (!user) {
        toast.error('User information is missing')
        return
      }
      if (!selectedSupervisor) {
        toast.error('Supervisor information is missing')
        return
      }
      if (!project) {
        toast.error('You need to create a project before inviting a supervisor')
        return
      }
      await sendInvite(user._id, selectedSupervisor.email, project?._id)
      // console.log(user._id, selectedSupervisor.email, project?._id);
    } catch (error: any) {
      toast.error(error)
    }
  }
  return (
    <div className='w-full min-h-screen bg-gray-100 p-6'>
      <div className='w-full max-w-7xl mx-auto bg-white p-6 rounded-md shadow-md border border-gray-300'>
        <h2 className='text-xl font-semibold text-blue-700'>The list of Supervisor in this Semester</h2>

        <div className='mt-4 flex items-center space-x-2 w-full'>
          <label className='text-gray-700 font-medium'>FE Email Or Name:</label>
          <input
            type='text'
            className='border p-2 rounded-md flex-1'
            placeholder='FE Email or Name'
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className='mt-4 overflow-x-auto'>
          <table className='w-full border-collapse border border-gray-300'>
            <thead>
              <tr className='bg-gray-100 text-gray-700 text-left'>
                <th className='border p-3'>No.</th>
                <th className='border p-3'>FullName</th>
                <th className='border p-3'>Email</th>
                <th className='border p-3 text-center'>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSupervisors.map((supervisor, index) => (
                <tr key={supervisor._id} className='border-t hover:bg-gray-50'>
                  <td className='border p-3'>{index + 1}</td>
                  <td className='border p-3'>{supervisor.display_name}</td>
                  <td className='border p-3'>{supervisor.email}</td>
                  <td className='border p-3 text-center'>
                    <Button
                      className='bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600'
                      onClick={() => setSelectedSupervisor(supervisor)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='mt-6 flex justify-center space-x-2'>
          <Button
            className='text-gray-500 border border-gray-300 px-4 py-2 rounded-md bg-transparent'
            onClick={handleFirst}
          >
            First
          </Button>
          <Button
            className='text-gray-500 border border-gray-300 px-4 py-2 rounded-md bg-transparent'
            onClick={handlePrev}
          >
            Prev
          </Button>
          <Button className='bg-blue-500 text-white px-4 py-2 rounded-md'>{currentPage}</Button>
          <Button
            className='text-gray-500 border border-gray-300 px-4 py-2 rounded-md bg-transparent'
            onClick={handleNext}
          >
            Next
          </Button>
          <Button
            className='text-gray-500 border border-gray-300 px-4 py-2 rounded-md bg-transparent'
            onClick={handleLast}
          >
            Last
          </Button>
        </div>
      </div>

      {/* Modal */}
      {selectedSupervisor && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
          <div className='bg-gray-200 p-6 rounded-md shadow-lg w-96'>
            <div className='flex items-center gap-4'>
              <Avatar className='w-16 h-16'>
                <AvatarImage src={selectedSupervisor.avatar} alt='User Avatar' />
                <AvatarFallback>
                  {selectedSupervisor.first_name[0]}
                  {selectedSupervisor.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className='text-2xl font-semibold text-purple-700'>{selectedSupervisor.display_name}</h3>
                <p className='text-sm text-gray-500'>
                  {selectedSupervisor.roles
                    .map((role) => role.charAt(0).toUpperCase() + role.slice(1).toLowerCase())
                    .join(', ')}
                </p>
              </div>
            </div>

            <div className='mt-6 space-y-4'>
              <div>
                <p className='font-semibold text-gray-700'>Email:</p>
                <p className='italic text-gray-600'>{selectedSupervisor.email}</p>
              </div>
              <div>
                <p className='font-semibold text-gray-700'>User Name:</p>
                <p className='italic text-gray-600'>{selectedSupervisor.username}</p>
              </div>
              <div>
                <p className='font-semibold text-gray-700'>Campus:</p>
                <p className='italic text-gray-600'>{selectedSupervisor.campus?.name}</p>
              </div>
            </div>

            {/* Đóng modal */}
            <div className='flex items-center justify-between mt-6'>
              <Button
                className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-200 ease-in-out'
                onClick={closeModal}
              >
                Close
              </Button>
              <Button
                className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-200 ease-in-out'
                onClick={handleInvite}
              >
                Invite To Supervisor
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ListSupervisor
