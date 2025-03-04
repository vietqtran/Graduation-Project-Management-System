'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import IdeaPagination from './IdeaPagination'
import IdeaSearchBar from './IdeaSearchBar'
import IdeaSelect from './IdeaSelect'
import IdeaTable from './IdeaTable'
import instance from '@/utils/axios'

export interface ProjectIdea {
  _id: string
  name: string
  field: string
  status: string
}

const ReviewIdeas = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [groupFilter, setGroupFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [hasData, setHasData] = useState(true)
  const itemsPerPage = 5
  const availableSlots = 10

  useEffect(() => {
    const fetchProjectIdeas = async () => {
      try {
        const response = await instance.get('/project/get-projects-by-supervisor', { withCredentials: true })
        if (response.data && response.data.data && response.data.data.length > 0) {
          setProjectIdeas(response.data)
          setHasData(true)
        } else {
          setHasData(false)
          setProjectIdeas([])
        }
      } catch (error) {
        console.error('Error fetching project ideas:', error)
        setHasData(false)
        setProjectIdeas([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjectIdeas()
  }, [])

  const filteredIdeas = hasData
    ? (Array.isArray(projectIdeas) ? projectIdeas : []).filter((idea) => {
        if (!idea || !idea.name || !idea.field || !idea.status) return false

        const matchesSearch =
          idea.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          idea.field.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesGroup = !groupFilter || idea.status === groupFilter
        const matchesStatus = !statusFilter || idea.status === statusFilter

        return matchesSearch && matchesGroup && matchesStatus
      })
    : [] // If no data, return an empty array

  const totalPages = Math.ceil(filteredIdeas.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentIdeas = filteredIdeas.slice(startIndex, startIndex + itemsPerPage)

  const groupOptions = [
    { value: 'pending', label: 'No Group' },
    { value: 'assigned', label: 'Has Group' }
  ]

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ]

  return (
    <div className='p-6 space-y-4'>
      <div className='flex gap-4 items-center mb-6 flex-wrap'>
        <div className='w-[250px]'>
          <IdeaSearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <IdeaSelect value={groupFilter} onChange={setGroupFilter} options={groupOptions} placeholder='All Groups' />
        <IdeaSelect value={statusFilter} onChange={setStatusFilter} options={statusOptions} placeholder='All Status' />
        <div className='text-yellow-500 font-semibold'>Available Slots: {availableSlots}</div>
      </div>

      {loading ? (
        <div className='text-center text-gray-500'>Loading...</div>
      ) : hasData ? (
        <>
          <IdeaTable ideas={currentIdeas} startIndex={startIndex} />
          <IdeaPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </>
      ) : (
        <div className='flex flex-col items-center justify-center mt-10'>
          <Image src='/gif/no-data.gif' alt='No data' width={100} height={100} />
          <p className='text-gray-500 mt-2'>No Data</p>
        </div>
      )}
    </div>
  )
}

export default ReviewIdeas
