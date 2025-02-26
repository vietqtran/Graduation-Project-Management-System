'use client'

import { useEffect, useState } from 'react'
import IdeaPagination from './IdeaPagination'
import IdeaSearchBar from './IdeaSearchBar'
import IdeaSelect from './IdeaSelect'
import IdeaTable from './IdeaTable'

export interface ProjectIdea {
  _id: string
  remark: string
  type: string
  status: string
}

const mockProjectIdeas: ProjectIdea[] = [
  { _id: '1', remark: 'AI Chatbot for Education', type: 'Technology', status: 'pending' },
  { _id: '2', remark: 'E-commerce Website', type: 'Business', status: 'approved' },
  { _id: '3', remark: 'Smart Traffic Light System', type: 'Engineering', status: 'pending' },
  { _id: '4', remark: 'Blockchain Voting System', type: 'Technology', status: 'rejected' },
  { _id: '5', remark: 'Mental Health Mobile App', type: 'Healthcare', status: 'approved' },
  { _id: '6', remark: 'IoT-based Smart Home', type: 'Technology', status: 'pending' },
  { _id: '7', remark: 'Food Waste Management System', type: 'Environment', status: 'approved' },
  { _id: '8', remark: 'Autonomous Delivery Robot', type: 'Engineering', status: 'pending' },
  { _id: '9', remark: 'AI-Powered Resume Screener', type: 'Technology', status: 'approved' },
  { _id: '10', remark: 'Fitness Tracking Wearable', type: 'Healthcare', status: 'rejected' }
]

const ReviewIdeas = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [groupFilter, setGroupFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>(mockProjectIdeas)
  const itemsPerPage = 5
  const availableSlots = 10

  useEffect(() => {
    setProjectIdeas(mockProjectIdeas)
  }, [])

  const filteredIdeas = projectIdeas.filter((idea) => {
    const matchesSearch =
      idea.remark.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGroup = !groupFilter || idea.status === groupFilter
    const matchesStatus = !statusFilter || idea.status === statusFilter

    return matchesSearch && matchesGroup && matchesStatus
  })

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
        <IdeaSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions}
          placeholder='All Statuses'
        />
        <div className='text-yellow-500 font-semibold'>Available Slots: {availableSlots}</div>
      </div>

      <IdeaTable ideas={currentIdeas} startIndex={startIndex} />
      <IdeaPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </div>
  )
}

export default ReviewIdeas
