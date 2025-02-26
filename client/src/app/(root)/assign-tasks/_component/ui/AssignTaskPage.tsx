'use client'

import React, { useState } from 'react'
import FilterBar from './FilterBar'
import TaskTable from './TaskTable'
import Pagination from './Pagination'

// Dữ liệu mẫu cho tasks
const sampleTasks = [
  {
    id: 1,
    status: 'Pending',
    amount: 550,
    customer: 'John Doe',
    site: '123 Main Street',
    date: '2023-02-01',
    scheduled: '2023-02-03 10:00',
    assignedTo: 'Technician A'
  },
  {
    id: 2,
    status: 'Scheduled',
    amount: 850,
    customer: 'Jane Doe',
    site: '456 Second Street',
    date: '2023-02-05',
    scheduled: '2023-02-07 14:00',
    assignedTo: 'Technician B'
  },
  {
    id: 3,
    status: 'Scheduled',
    amount: 850,
    customer: 'Jane Doe',
    site: '456 Second Street',
    date: '2023-02-05',
    scheduled: '2023-02-07 14:00',
    assignedTo: 'Technician B'
  },
  {
    id: 4,
    status: 'Scheduled',
    amount: 850,
    customer: 'Jane Doe',
    site: '456 Second Street',
    date: '2023-02-05',
    scheduled: '2023-02-07 14:00',
    assignedTo: 'Technician B'
  },
  {
    id: 5,
    status: 'Scheduled',
    amount: 850,
    customer: 'Jane Doe',
    site: '456 Second Street',
    date: '2023-02-05',
    scheduled: '2023-02-07 14:00',
    assignedTo: 'Technician B'
  },
  {
    id: 6,
    status: 'Scheduled',
    amount: 850,
    customer: 'Jane Doe',
    site: '456 Second Street',
    date: '2023-02-05',
    scheduled: '2023-02-07 14:00',
    assignedTo: 'Technician B'
  },
  {
    id: 7,
    status: 'Scheduled',
    amount: 850,
    customer: 'Jane Doe',
    site: '456 Second Street',
    date: '2023-02-05',
    scheduled: '2023-02-07 14:00',
    assignedTo: 'Technician B'
  }
]

const TasksPage: React.FC = () => {
  const [tasks] = useState(sampleTasks)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(5) // ví dụ cứng, có thể tính toán dựa vào length của tasks

  const handleSearch = (keyword: string) => {
    // Logic tìm kiếm
    console.log('Search keyword:', keyword)
  }

  const handleFilterChange = (filterData: {
    status?: string
    jobType?: string
    dateRange?: { start: string; end: string }
  }) => {
    // Logic filter
    console.log('Filter data:', filterData)
  }

  const handleClearFilter = () => {
    // Logic clear filter
    console.log('Clear filter')
  }

  const handleAddTask = () => {
    // Logic mở modal hoặc form để thêm task
    console.log('Add task clicked')
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Gọi API hoặc xử lý phân trang
    console.log('Page changed:', page)
  }

  return (
    <div className='p-4'>
      <FilterBar
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onClearFilter={handleClearFilter}
        onAddTask={handleAddTask}
      />

      <TaskTable tasks={tasks} />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  )
}

export default TasksPage // Đổi tên component từ JobsPage thành TasksPage
