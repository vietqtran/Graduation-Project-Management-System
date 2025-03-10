'use client'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import useIdea from '@/hooks/useIdea'
import { AxiosError } from 'axios'
import { Project } from '@/types/project.type'
const ListIdeaSupervisor = () => {
  const [ideas, setIdeas] = useState<Project[]>([])
  const { getIdeaOfSupervisor } = useIdea()

  useEffect(() => {
    const fetchIdeaSupervisor = async () => {
      try {
        const response = await getIdeaOfSupervisor()
        setIdeas(response.data)
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
          toast.error(error.response.data.message)
        } else {
          toast.error('An unexpected error occurred')
        }
      }
    }
    fetchIdeaSupervisor()
  }, [])
  return (
    <div className='w-full min-h-screen bg-gray-100 p-6'>
      <div className='w-full max-w-6xl mx-auto bg-white p-6 rounded-md shadow-md border border-gray-300'>
        <h2 className='text-xl font-semibold text-blue-700'>View Ideas of Other Supervisors</h2>
        <div className='mt-4 overflow-x-auto'>
          <table className='w-full border-collapse border border-gray-300'>
            <thead>
              <tr className='bg-gray-100 text-gray-700 text-left'>
                <th className='border p-3'>No</th>
                <th className='border p-3'>Project Name</th>
                <th className='border p-3'>Description</th>
                <th className='border p-3'>Mentor</th>
                {/* <th className='border p-3 text-center'>Action</th> */}
              </tr>
            </thead>
            <tbody>
              {ideas.map((idea, index) => (
                <tr key={idea._id} className='border-t hover:bg-gray-50'>
                  <td className='border p-3'>{index + 1}</td>
                  <td className='border p-3'>{idea.name}</td>
                  <td className='border p-3'>{idea.description}</td>
                  <td className='border p-3'>
                    {idea.supervisor.length > 0 ? idea.supervisor[0].email : 'No Supervisor'}
                  </td>
                  {/* <td className='border p-3 text-center'>
                    <Button
                      className='bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600'
                      //   onClick={() => setSelectedSupervisor(supervisor)}
                    >
                      View
                    </Button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
export default ListIdeaSupervisor
