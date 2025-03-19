'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import instance from '@/utils/axios'
import IdeaPagination from './IdeaPagination'
import IdeaTable from './IdeaTable'
import ProjectSearchAndFilter from './IdeaSearchBar'

export interface ProjectIdea {
  _id: string
  name: string
  field: Array<{ _id: string; name: string; description: string }>
  major: Array<{ _id: string; name: string; description: string }>
  campus: { _id: string; name: string; description: string }
  description: string
  created_at: string
  updated_at: string
  status: string
  leader: { username: string; _id: string }  // Modify to match the structure of the leader object
  username: string
}


const ReviewIdeas = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [originalIdeas, setOriginalIdeas] = useState<ProjectIdea[]>([])
  const [filteredIdeas, setFilteredIdeas] = useState<ProjectIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [hasData, setHasData] = useState(false)

  const itemsPerPage = 5
  const availableSlots = 10

  useEffect(() => {
    const fetchProjectIdeas = async () => {
      try {
        const response = await instance.get('/project/get-projects-by-supervisor', { withCredentials: true })
        if (response.data) {
          setOriginalIdeas(response.data.data)
          setFilteredIdeas(response.data.data)
          setHasData(true)
        } else {
          setHasData(false)
        }
      } catch (error) {
        console.error('Error fetching project ideas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjectIdeas()
  }, [])

  const totalPages = Math.ceil(filteredIdeas.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentIdeas = filteredIdeas.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className='p-6 space-y-4'>
      <div className='flex gap-4 items-center mb-6 flex-wrap'>
        <div className='flex-grow max-w-[500px]'>
          <ProjectSearchAndFilter projects={originalIdeas} onFilteredProjects={setFilteredIdeas} />
        </div>
        <div className='text-yellow-500 font-semibold'>Available Slots: {availableSlots}</div>
      </div>

      {loading ? (
        <div className='text-center text-gray-500'>Loading...</div>
      ) : hasData && filteredIdeas.length > 0 ? (
        <>
          <IdeaTable ideas={currentIdeas} startIndex={startIndex} />
          <IdeaPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </>
      ) : (
        <div className='flex flex-col items-center justify-center mt-10'>
          <Image src='/gif/no-data.gif' alt='No data' width={100} height={100} />
          <p className='text-gray-500 mt-2'>{filteredIdeas.length === 0 ? 'No matching projects' : 'No Projects'}</p>
        </div>
      )}
    </div>
  )
}

export default ReviewIdeas
