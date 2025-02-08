'use client'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../_components/ui/table'
import { useState, useEffect } from 'react'
import axios from 'axios'

interface Option {
  value: string
  label: string
}

interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder: string
}

const CustomSelect = ({ value, onChange, options, placeholder }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-[180px] h-10 px-3 py-2 rounded-md border border-input bg-background text-sm flex items-center justify-between"
      >
        {value ? options.find(opt => opt.value === value)?.label : placeholder}
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24"
        >
          <path d="M7 10l5 5 5-5z" fill="currentColor"/>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface ProjectIdea {
  _id: string
  remark: string
  type: string
    status: string
  }
  

const ReviewIdeas = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [groupFilter, setGroupFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>([])
  const itemsPerPage = 10

  useEffect(() => {
    const fetchProjectIdeas = async () => {
      try {
        const response = await axios.get('/api/getAllRequest')
        setProjectIdeas(response.data)
      } catch (error) {
        console.error('Error fetching project ideas:', error)
      }
    }

    fetchProjectIdeas()
  }, [])

  // Filter ideas based on search query, group and status
  const filteredIdeas = projectIdeas.filter(idea => {
    const matchesSearch = idea.remark.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         idea.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGroup = !groupFilter || idea.status === groupFilter
    const matchesStatus = !statusFilter || idea.status === statusFilter
    
    return matchesSearch && matchesGroup && matchesStatus
  })

  const totalPages = Math.ceil(filteredIdeas.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentIdeas = filteredIdeas.slice(startIndex, startIndex + itemsPerPage)

  const groupOptions = [
    { value: "pending", label: "No Group" },
    { value: "assigned", label: "Has Group" }
  ]

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" }
  ]

  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-4 items-center mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full p-2 border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <CustomSelect
          value={groupFilter}
          onChange={setGroupFilter}
          options={groupOptions}
          placeholder="All Groups"
        />

        <CustomSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions}
          placeholder="All Statuses"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Index</TableHead>
            <TableHead>Project Name</TableHead>
            <TableHead>Team Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentIdeas.map((idea, index) => (
            <TableRow key={idea._id}>
              <TableCell>{startIndex + index + 1}</TableCell>
              <TableCell>{idea.remark}</TableCell>
              <TableCell>{idea.type}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" className="bg-blue-500 hover:bg-transparent hover:border-blue-500 hover:text-blue-500">
                    Accept
                  </Button>
                  <Button variant="outline" className="bg-red-500 hover:bg-transparent hover:border-red-500 hover:text-red-500">
                    Reject
                  </Button>
                  <Button variant="outline" className="bg-yellow-500 hover:bg-transparent hover:border-yellow-500 hover:text-yellow-500" onClick={() => window.location.href = '/teacher/detail-idea'}>
                    Detail
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <div className="flex items-center gap-2">
          {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default ReviewIdeas