'use client'

import React, { useEffect, useState } from 'react'
import FilterBar from './FilterBar'
import RequestTable from './RequestTable'
import instance from '@/utils/axios'

interface Request {
  _id: string
  remark: string
  to_user: string
  type: string
  from_user: string
  document: string
  due_date?: Date
  status: string
  created_at?: Date
  updated_at?: Date
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
}

const RequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const response = await instance.get('/request/get-all-requests', {
        withCredentials: true
      })
      console.log(response.data.data)
      if (response.data.success) {
        setRequests(response.data.data || [])
      } else {
        console.error('Error fetching requests:', response.data.message)
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRequests()
  }, [refresh])

  const [filters, setFilters] = useState<{
    search?: string
    status?: string
    requestType?: string
    dateRange?: { start: string; end: string }
  }>({})

  const [filteredRequests, setFilteredRequests] = useState<Request[]>([])

  useEffect(() => {
    if (userId) {
      const fetchRequestsByUser = async () => {
        try {
          const response = await instance.get(`/request/get-requests-by-user/${userId}`, {
            withCredentials: true
          })
          if (response.data.success) {
            setRequests(response.data.data || [])
          } else {
            console.error('Error fetching user-specific requests:', response.data.message)
          }
        } catch (error) {
          console.error('Failed to fetch requests by user:', error)
        }
      }

      fetchRequestsByUser()
    } else {
      fetchRequests()
    }
  }, [userId, refresh])

  useEffect(() => {
    let filtered = requests

    if (filters.search) {
      filtered = filtered.filter((request) => request.remark.toLowerCase().includes(filters.search!.toLowerCase()))
    }

    if (filters.status) {
      filtered = filtered.filter((request) => request.status.toLowerCase() === filters.status!.toLowerCase())
    }

    if (filters.requestType) {
      filtered = filtered.filter((request) => request.type.toLowerCase() === filters.requestType!.toLowerCase())
    }

    if (filters.dateRange && filters.dateRange.start && filters.dateRange.end) {
      const start = new Date(filters.dateRange.start)
      const end = new Date(filters.dateRange.end)
      filtered = filtered.filter((request) => {
        if (request.created_at) {
          const createDate = new Date(request.created_at)
          return createDate >= start && createDate <= end
        }
        return false
      })
    }

    setFilteredRequests(filtered)
  }, [filters, requests])

  const handleFilterChange = (filterData: {
    search?: string
    status?: string
    requestType?: string
    dateRange?: { start: string; end: string }
  }) => {
    setFilters(filterData)
  }

  const handleClearFilter = () => {
    setFilters({})
  }

  return (
    <div className='p-4'>
      <FilterBar onFilterChange={handleFilterChange} onClearFilter={handleClearFilter} setUserId={setUserId} />

      {loading ? (
        <p>Loading requests...</p>
      ) : (
        <>
          <RequestTable requests={filteredRequests} setRefresh={setRefresh} />
        </>
      )}
    </div>
  )
}

export default RequestsPage
