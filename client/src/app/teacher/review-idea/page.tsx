'use client'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useState, useEffect } from 'react'
import axios from 'axios'

interface RequestIdea {
  _id: string
  remark: string
  type: string
  status: string
  from_user: { name: string }
  to_user: { name: string }
}

const ReviewRequests = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [groupFilter, setGroupFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [requests, setRequests] = useState<RequestIdea[]>([])
  const itemsPerPage = 10
  const availableSlots = 10 // You can replace with actual logic

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/requests', {
          withCredentials: true // Important for sending cookies
        })
        setRequests(response.data.data || [])
      } catch (error) {
        console.error('Error fetching requests:', error)
        // Handle authentication error
        window.location.href = '/login' // Redirect to login
      }
    }

    fetchRequests()
  }, [])

  const handleApprove = async (id: string) => {
    try {
      await axios.post(`http://localhost:8080/api/approve/${id}`, {}, {
        withCredentials: true
      })
      const response = await axios.get('http://localhost:8080/api/requests', {
        withCredentials: true
      })
      setRequests(response.data.data || [])
    } catch (error) {
      console.error('Error approving request:', error)
    }
  }

  const handleReject = async (id: string) => {
    try {
      await axios.post(`http://localhost:8080/api/deny/${id}`, {}, {
        withCredentials: true
      })
      const response = await axios.get('http://localhost:8080/api/requests', {
        withCredentials: true
      })
      setRequests(response.data.data || [])
    } catch (error) {
      console.error('Error rejecting request:', error)
    }
  }

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.remark.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          request.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGroup = !groupFilter || request.status === groupFilter
    const matchesStatus = !statusFilter || request.status === statusFilter
    
    return matchesSearch && matchesGroup && matchesStatus
  })

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage)

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
        <input
          type="text"
          placeholder="Search projects..."
          className="w-full p-2 border rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <select 
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Groups</option>
          {groupOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Statuses</option>
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="text-red-500">
          Available Slots: {availableSlots}
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>From</TableHead>
            <TableHead>Project Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentRequests.map((request) => (
            <TableRow key={request._id}>
              <TableCell>{request.from_user?.name || 'Unknown'}</TableCell>
              <TableCell>{request.remark}</TableCell>
              <TableCell>{request.status}</TableCell>
              <TableCell>
                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="bg-green-500 text-white hover:bg-green-600"
                      onClick={() => handleApprove(request._id)}
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      className="bg-red-500 text-white hover:bg-red-600"
                      onClick={() => handleReject(request._id)}
                    >
                      Reject
                    </Button>
                  </div>
                )}
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
        {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}
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

export default ReviewRequests