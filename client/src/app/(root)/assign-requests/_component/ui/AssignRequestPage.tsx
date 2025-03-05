'use client'

import intance from '@/utils/axios'
import React, { useEffect, useState } from 'react'
import FilterBar from './FilterBar'
import RequestTable from './RequestTable'

const RequestsPage: React.FC = () => {
  const [requests, setRequests] = useState([]) // Dữ liệu từ API
  // const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  // 🛠️ Hàm fetch dữ liệu từ API
  const fetchRequests = async () => {
    setLoading(true)
    try {
      const response = await intance.get('/request/get-all-requests', {
        withCredentials: true
      }) // ✅ Dùng Axios instance
      console.log(response.data.data)

      if (response.data.success) {
        setRequests(response.data.data || []) // Gán dữ liệu từ API
      } else {
        console.error('Error fetching requests:', response.data.message)
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error)
    }
    setLoading(false)
  }

  // 🎯 Gọi API khi component mount hoặc khi `currentPage` thay đổi
  useEffect(() => {
    fetchRequests()
  }, [])

  // 🔎 Xử lý tìm kiếm
  const handleSearch = async (keyword: string) => {
    console.log('Search keyword:', keyword)
  }

  // 🏷️ Xử lý bộ lọc
  const handleFilterChange = async (filterData: {
    status?: string
    jobType?: string
    dateRange?: { start: string; end: string }
  }) => {
    console.log('Filter data:', filterData)
  }

  // ❌ Xóa bộ lọc
  const handleClearFilter = async () => {
    console.log('Clear filter')
    fetchRequests() // Load lại danh sách request
  }

  // 🔄 Xử lý phân trang

  return (
    <div className='p-4'>
      <FilterBar onSearch={handleSearch} onFilterChange={handleFilterChange} onClearFilter={handleClearFilter} />

      {loading ? (
        <p>Loading requests...</p>
      ) : (
        <>
          <RequestTable requests={requests} />
          {/* <Pagination currentPage={currentPage}  onPageChange={handlePageChange} /> */}
        </>
      )}
    </div>
  )
}

export default RequestsPage
